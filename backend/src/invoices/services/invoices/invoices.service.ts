import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Invoice, InvoiceStatus } from '../../entities/invoice.entity';
import { InvoiceSequence } from '../../entities/invoice-sequence.entity';
import { CreateInvoiceDto } from '../../dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../../dto/update-invoice.dto';
import { BookingsService } from '../../../bookings/bookings.service';
import { ProvidersService } from '../../../providers/providers.service';
import { CustomersService } from '../../../customers/customers/customers.service';
import { StorageService } from '../../../providers/storage.service';
import { ConfigService } from '@nestjs/config';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { format, addDays } from 'date-fns';
import { de } from 'date-fns/locale';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly bookingsService: BookingsService,
    private readonly providersService: ProvidersService,
    private readonly customersService: CustomersService,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
  ) {}

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const booking = await this.bookingsService.getBookingById(createInvoiceDto.bookingId);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const provider = await this.providersService.findOne(booking.providerId);
    const customer = await this.customersService.findOne(booking.customerId);

    return this.invoiceRepository.manager.transaction(async (manager) => {
      const issueDate = createInvoiceDto.issueDate ? new Date(createInvoiceDto.issueDate) : new Date();
      const dueDate = createInvoiceDto.dueDate ? new Date(createInvoiceDto.dueDate) : addDays(issueDate, 14);
      // Invoice numbers are generated server-side only (§14 UStG requires
      // gapless sequential numbering) — never accept one from the client.
      const invoiceNumber = await this.generateInvoiceNumber(manager, issueDate);

      const invoiceRepo = manager.getRepository(Invoice);
      const invoice = invoiceRepo.create({
        ...createInvoiceDto,
        bookingId: booking.id,
        providerId: provider.id,
        customerId: customer.id,
        status: createInvoiceDto.status || InvoiceStatus.DRAFT,
        taxRate: createInvoiceDto.taxRate ?? 19.0,
        invoiceNumber,
        issueDate,
        dueDate,
      });

      return invoiceRepo.save(invoice);
    });
  }

  /**
   * Locks the current year's counter row and returns the next gapless
   * invoice number. Must run inside the same transaction as the invoice
   * insert so a failed invoice creation doesn't burn a number.
   */
  private async generateInvoiceNumber(manager: EntityManager, issueDate: Date): Promise<string> {
    const year = issueDate.getFullYear();
    const sequenceRepo = manager.getRepository(InvoiceSequence);

    await manager.query(
      `INSERT INTO invoice_sequence (year, "lastNumber") VALUES ($1, 0) ON CONFLICT (year) DO NOTHING`,
      [year],
    );
    const sequence = await sequenceRepo.findOne({
      where: { year },
      lock: { mode: 'pessimistic_write' },
    });
    if (!sequence) {
      throw new Error(`Failed to acquire invoice sequence for year ${year}`);
    }

    sequence.lastNumber += 1;
    await sequenceRepo.save(sequence);

    return `RE-${year}-${String(sequence.lastNumber).padStart(6, '0')}`;
  }

  async generateInvoicePdf(invoiceId: string): Promise<string> {
    const invoice = await this.getInvoiceById(invoiceId);
    const booking = await this.bookingsService.getBookingById(invoice.bookingId);
    const provider = await this.providersService.findOne(invoice.providerId);
    const customer = await this.customersService.findOne(invoice.customerId);
    
    // Create PDF document
    const pdfDoc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });
    
    // Generate a temporary file path
    const tempDir = path.join(__dirname, '..', '..', '..', '..', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const tempFilePath = path.join(tempDir, `invoice-${invoiceId}.pdf`);
    const writeStream = fs.createWriteStream(tempFilePath);
    pdfDoc.pipe(writeStream);
    
    // Add content to PDF
    this.addInvoiceHeader(pdfDoc, provider);
    this.addInvoiceDetails(pdfDoc, invoice, booking, provider, customer);
    this.addInvoiceItems(pdfDoc, booking, invoice);
    this.addInvoiceFooter(pdfDoc, invoice);
    
    // Finalize PDF
    pdfDoc.end();
    
    // Wait for PDF to be written
    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', () => resolve());
      writeStream.on('error', reject);
    });
    
    // Upload to storage
    const file = {
      fieldname: 'invoice',
      originalname: `invoice-${invoice.invoiceNumber || invoiceId}.pdf`,
      encoding: '7bit',
      mimetype: 'application/pdf',
      buffer: fs.readFileSync(tempFilePath),
      size: fs.statSync(tempFilePath).size,
    } as Express.Multer.File;
    
    const fileUrl = await this.storageService.uploadFile(
      file,
      `invoices/${provider.id}`,
    );
    
    // Update invoice with PDF URL
    invoice.pdfUrl = fileUrl;
    invoice.status = InvoiceStatus.SENT;
    await this.invoiceRepository.save(invoice);
    
    // Clean up temporary file
    fs.unlinkSync(tempFilePath);
    
    return fileUrl;
  }

  async generateZugferdXml(invoiceId: string): Promise<string> {
    const invoice = await this.getInvoiceById(invoiceId);
    const booking = await this.bookingsService.getBookingById(invoice.bookingId);
    const provider = await this.providersService.findOne(invoice.providerId);
    const customer = await this.customersService.findOne(invoice.customerId);
    
    // Generate ZUGFeRD XML content
    const xmlContent = this.generateZugferdXmlContent(invoice, booking, provider, customer);
    
    // Generate a temporary file path
    const tempDir = path.join(__dirname, '..', '..', '..', '..', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const tempFilePath = path.join(tempDir, `invoice-${invoiceId}.xml`);
    fs.writeFileSync(tempFilePath, xmlContent);
    
    // Upload to storage
    const file = {
      fieldname: 'invoice',
      originalname: `invoice-${invoice.invoiceNumber || invoiceId}.xml`,
      encoding: '7bit',
      mimetype: 'application/xml',
      buffer: fs.readFileSync(tempFilePath),
      size: fs.statSync(tempFilePath).size,
    } as Express.Multer.File;
    
    const fileUrl = await this.storageService.uploadFile(
      file,
      `invoices/${provider.id}`,
    );
    
    // Update invoice with XML URL
    invoice.xmlUrl = fileUrl;
    await this.invoiceRepository.save(invoice);
    
    // Clean up temporary file
    fs.unlinkSync(tempFilePath);
    
    return fileUrl;
  }

  private addInvoiceHeader(pdfDoc: PDFKit.PDFDocument, provider: any) {
    // Add provider logo if available
    if (provider.profileImageUrl) {
      try {
        // In a real implementation, you would download the image
        // pdfDoc.image(provider.profileImageUrl, 50, 50, { width: 100 });
      } catch (error) {
        console.error('Error adding logo:', error);
      }
    }
    
    // Add provider details
    pdfDoc.fontSize(12).text(`${provider.firstName} ${provider.lastName}`, 50, 100);
    pdfDoc.text(provider.address || '', 50, 120);
    pdfDoc.text(`${provider.city || ''} ${provider.postalCode || ''}`, 50, 140);
    pdfDoc.text(`Steuernummer: ${provider.taxId || 'Nicht angegeben'}`, 50, 160);
    pdfDoc.text(`Telefon: ${provider.phone || ''}`, 50, 180);
    pdfDoc.text(`Email: ${provider.email || ''}`, 50, 200);
    
    // Add invoice title
    pdfDoc.fontSize(20).text('RECHNUNG', 400, 100, { align: 'right' });
  }

  private addInvoiceDetails(
    pdfDoc: PDFKit.PDFDocument,
    invoice: Invoice,
    booking: any,
    provider: any,
    customer: any,
  ) {
    // Add invoice details table
    const startY = 250;
    let currentY = startY;
    
    pdfDoc.fontSize(10);
    
    // Invoice number and dates
    pdfDoc.text(`Rechnungsnummer: ${invoice.invoiceNumber || invoice.id}`, 50, currentY);
    pdfDoc.text(`Rechnungsdatum: ${format(invoice.issueDate || new Date(), 'dd.MM.yyyy', { locale: de })}`, 400, currentY, { align: 'right' });
    currentY += 20;
    
    pdfDoc.text(`Fälligkeitsdatum: ${format(invoice.dueDate || new Date(), 'dd.MM.yyyy', { locale: de })}`, 400, currentY, { align: 'right' });
    currentY += 30;
    
    // Customer details
    pdfDoc.text('Rechnungsempfänger:', 50, currentY);
    currentY += 20;
    
    pdfDoc.text(`${customer.firstName} ${customer.lastName}`, 50, currentY);
    currentY += 20;
    
    if (customer.address) {
      pdfDoc.text(customer.address, 50, currentY);
      currentY += 20;
    }
    
    if (customer.city || customer.postalCode) {
      pdfDoc.text(`${customer.city || ''} ${customer.postalCode || ''}`, 50, currentY);
      currentY += 20;
    }
    
    // Service details
    currentY += 20;
    pdfDoc.text(`Leistung: ${booking.serviceType}`, 50, currentY);
    pdfDoc.text(`Beschreibung: ${booking.description || 'Keine Beschreibung'}`, 50, currentY + 20);
    pdfDoc.text(`Leistungsdatum: ${format(booking.scheduledAt, 'dd.MM.yyyy', { locale: de })}`, 50, currentY + 40);
  }

  private addInvoiceItems(pdfDoc: PDFKit.PDFDocument, booking: any, invoice: Invoice) {
    // Add items table
    const startY = 400;
    let currentY = startY;
    
    pdfDoc.fontSize(10);
    
    // Table header
    pdfDoc.text('Pos.', 50, currentY);
    pdfDoc.text('Beschreibung', 100, currentY);
    pdfDoc.text('Menge', 300, currentY);
    pdfDoc.text('Einzelpreis', 350, currentY);
    pdfDoc.text('Gesamtpreis', 450, currentY, { align: 'right' });
    currentY += 20;
    
    // Table line
    pdfDoc.moveTo(50, currentY).lineTo(550, currentY).stroke();
    currentY += 10;
    
    // Table content
    pdfDoc.text('1', 50, currentY);
    pdfDoc.text(booking.serviceType, 100, currentY);
    pdfDoc.text('1', 300, currentY);
    pdfDoc.text(`${booking.totalAmount.toFixed(2)} €`, 350, currentY);
    pdfDoc.text(`${booking.totalAmount.toFixed(2)} €`, 450, currentY, { align: 'right' });
    currentY += 20;
    
    // Table footer
    pdfDoc.moveTo(50, currentY).lineTo(550, currentY).stroke();
    currentY += 10;
    
    // Totals
    pdfDoc.text(`Zwischensumme: ${booking.totalAmount.toFixed(2)} €`, 400, currentY, { align: 'right' });
    currentY += 20;
    
    if (invoice.taxAmount) {
      const rate = Number(invoice.taxRate ?? 19);
      pdfDoc.text(`Mehrwertsteuer (${rate.toFixed(0)}%): ${invoice.taxAmount.toFixed(2)} €`, 400, currentY, { align: 'right' });
      currentY += 20;
    }
    
    pdfDoc.fontSize(12).text(`Gesamtbetrag: ${booking.totalAmount.toFixed(2)} €`, 400, currentY, { align: 'right' });
  }

  private addInvoiceFooter(pdfDoc: PDFKit.PDFDocument, invoice: Invoice) {
    const pageHeight = pdfDoc.page.height - 100;
    
    pdfDoc.fontSize(8);
    pdfDoc.text(`Zahlungsbedingungen: ${invoice.paymentTerms || '14 Tage netto'}`, 50, pageHeight);
    pdfDoc.text(`Hinweise: ${invoice.notes || 'Vielen Dank für Ihren Auftrag!'}`, 50, pageHeight + 20);
    
    // Add bank details if available
    pdfDoc.text('Bankverbindung:', 50, pageHeight + 40);
    pdfDoc.text('Kontoinhaber: Urban Services GmbH', 50, pageHeight + 55);
    pdfDoc.text('IBAN: DE89 3704 0044 0532 0130 00', 50, pageHeight + 70);
    pdfDoc.text('BIC: COBADEFFXXX', 50, pageHeight + 85);
  }

  private generateZugferdXmlContent(
    invoice: Invoice,
    booking: any,
    provider: any,
    customer: any,
  ): string {
    // This is a simplified ZUGFeRD XML generation
    // In a real implementation, you would use a proper ZUGFeRD library
    const issueDate = invoice.issueDate || new Date();
    const dueDate = invoice.dueDate || new Date();
    const taxRate = Number(invoice.taxRate ?? 19).toFixed(2);

    return `<?xml version="1.0" encoding="UTF-8"?>
<rsm:CrossIndustryInvoice xmlns:rsm="urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100"
                          xmlns:udt="urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100">
  <rsm:ExchangedDocumentContext>
    <rsm:GuidelineSpecifiedDocumentContextParameter>
      <rsm:ID>urn:cen.eu:en16931:2017#compliant#urn:zugferd.de:2p0:extended</rsm:ID>
    </rsm:GuidelineSpecifiedDocumentContextParameter>
  </rsm:ExchangedDocumentContext>
  <rsm:ExchangedDocument>
    <rsm:ID>${invoice.invoiceNumber || invoice.id}</rsm:ID>
    <rsm:TypeCode>380</rsm:TypeCode>
    <rsm:IssueDateTime>
      <udt:DateTimeString format="102">${format(issueDate, 'yyyyMMdd')}</udt:DateTimeString>
    </rsm:IssueDateTime>
  </rsm:ExchangedDocument>
  <rsm:SupplyChainTradeTransaction>
    <rsm:ApplicableHeaderTradeAgreement>
      <rsm:SellerTradeParty>
        <rsm:Name>${provider.firstName} ${provider.lastName}</rsm:Name>
        <rsm:PostalTradeAddress>
          <rsm:PostcodeCode>${provider.postalCode || ''}</rsm:PostcodeCode>
          <rsm:LineOne>${provider.address || ''}</rsm:LineOne>
          <rsm:CityName>${provider.city || ''}</rsm:CityName>
          <rsm:CountryID>DE</rsm:CountryID>
        </rsm:PostalTradeAddress>
      </rsm:SellerTradeParty>
      <rsm:BuyerTradeParty>
        <rsm:Name>${customer.firstName} ${customer.lastName}</rsm:Name>
        <rsm:PostalTradeAddress>
          <rsm:PostcodeCode>${customer.postalCode || ''}</rsm:PostcodeCode>
          <rsm:LineOne>${customer.address || ''}</rsm:LineOne>
          <rsm:CityName>${customer.city || ''}</rsm:CityName>
          <rsm:CountryID>DE</rsm:CountryID>
        </rsm:PostalTradeAddress>
      </rsm:BuyerTradeParty>
    </rsm:ApplicableHeaderTradeAgreement>
    <rsm:ApplicableHeaderTradeDelivery>
      <rsm:ActualDeliverySupplyChainEvent>
        <rsm:OccurrenceDateTime>
          <udt:DateTimeString format="102">${format(booking.scheduledAt, 'yyyyMMdd')}</udt:DateTimeString>
        </rsm:OccurrenceDateTime>
      </rsm:ActualDeliverySupplyChainEvent>
    </rsm:ApplicableHeaderTradeDelivery>
    <rsm:ApplicableHeaderTradeSettlement>
      <rsm:PaymentReference>${invoice.invoiceNumber || invoice.id}</rsm:PaymentReference>
      <rsm:InvoiceCurrencyCode>EUR</rsm:InvoiceCurrencyCode>
      <rsm:SpecifiedTradeSettlementPaymentMeans>
        <rsm:TypeCode>30</rsm:TypeCode>
        <rsm:Information>Banküberweisung</rsm:Information>
      </rsm:SpecifiedTradeSettlementPaymentMeans>
      <rsm:ApplicableTradeTax>
        <rsm:CalculatedAmount>${invoice.taxAmount || 0}</rsm:CalculatedAmount>
        <rsm:TypeCode>VAT</rsm:TypeCode>
        <rsm:BasisAmount>${invoice.amount}</rsm:BasisAmount>
        <rsm:ApplicablePercent>${taxRate}</rsm:ApplicablePercent>
      </rsm:ApplicableTradeTax>
      <rsm:SpecifiedTradePaymentTerms>
        <rsm:Description>${invoice.paymentTerms || 'Zahlbar innerhalb von 14 Tagen'}</rsm:Description>
        <rsm:DueDateDateTime>
          <udt:DateTimeString format="102">${format(dueDate, 'yyyyMMdd')}</udt:DateTimeString>
        </rsm:DueDateDateTime>
      </rsm:SpecifiedTradePaymentTerms>
      <rsm:SpecifiedTradeSettlementHeaderMonetarySummation>
        <rsm:LineTotalAmount>${invoice.amount}</rsm:LineTotalAmount>
        <rsm:ChargeTotalAmount>0.00</rsm:ChargeTotalAmount>
        <rsm:AllowanceTotalAmount>${invoice.discountAmount || 0}</rsm:AllowanceTotalAmount>
        <rsm:TaxBasisTotalAmount>${invoice.amount}</rsm:TaxBasisTotalAmount>
        <rsm:TaxTotalAmount currencyID="EUR">${invoice.taxAmount || 0}</rsm:TaxTotalAmount>
        <rsm:GrandTotalAmount>${invoice.totalAmount}</rsm:GrandTotalAmount>
        <rsm:TotalPrepaidAmount>0.00</rsm:TotalPrepaidAmount>
        <rsm:DuePayableAmount>${invoice.totalAmount}</rsm:DuePayableAmount>
      </rsm:SpecifiedTradeSettlementHeaderMonetarySummation>
    </rsm:ApplicableHeaderTradeSettlement>
    <rsm:IncludedSupplyChainTradeLineItem>
      <rsm:AssociatedDocumentLineDocument>
        <rsm:LineID>1</rsm:LineID>
      </rsm:AssociatedDocumentLineDocument>
      <rsm:SpecifiedTradeProduct>
        <rsm:Name>${booking.serviceType}</rsm:Name>
        <rsm:Description>${booking.description || ''}</rsm:Description>
      </rsm:SpecifiedTradeProduct>
      <rsm:SpecifiedLineTradeAgreement>
        <rsm:GrossPrice>
          <rsm:ChargeAmount>${invoice.amount}</rsm:ChargeAmount>
        </rsm:GrossPrice>
        <rsm:NetPrice>
          <rsm:ChargeAmount>${invoice.amount}</rsm:ChargeAmount>
        </rsm:NetPrice>
      </rsm:SpecifiedLineTradeAgreement>
      <rsm:SpecifiedLineTradeDelivery>
        <rsm:BilledQuantity unitCode="C62">1.0000</rsm:BilledQuantity>
      </rsm:SpecifiedLineTradeDelivery>
      <rsm:SpecifiedLineTradeSettlement>
        <rsm:ApplicableTradeTax>
          <rsm:TypeCode>VAT</rsm:TypeCode>
          <rsm:ApplicablePercent>${taxRate}</rsm:ApplicablePercent>
        </rsm:ApplicableTradeTax>
        <rsm:SpecifiedTradeSettlementMonetarySummation>
          <rsm:LineTotalAmount>${invoice.amount}</rsm:LineTotalAmount>
        </rsm:SpecifiedTradeSettlementMonetarySummation>
      </rsm:SpecifiedLineTradeSettlement>
    </rsm:IncludedSupplyChainTradeLineItem>
  </rsm:SupplyChainTradeTransaction>
</rsm:CrossIndustryInvoice>`;
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return invoice;
  }

  async getInvoicesByBookingId(bookingId: string): Promise<Invoice[]> {
    return this.invoiceRepository.find({ where: { bookingId } });
  }

  async getInvoicesByProviderId(providerId: string): Promise<Invoice[]> {
    return this.invoiceRepository.find({ where: { providerId } });
  }

  async getInvoicesByCustomerId(customerId: string): Promise<Invoice[]> {
    return this.invoiceRepository.find({ where: { customerId } });
  }

  async updateInvoice(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.getInvoiceById(id);
    Object.assign(invoice, updateInvoiceDto);
    return this.invoiceRepository.save(invoice);
  }

  async deleteInvoice(id: string): Promise<void> {
    const invoice = await this.getInvoiceById(id);
    await this.invoiceRepository.remove(invoice);
  }
}
