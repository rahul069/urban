import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { InvoicesService } from '../../services/invoices/invoices.service';
import { CreateInvoiceDto } from '../../dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../../dto/update-invoice.dto';
import { Invoice } from '../../entities/invoice.entity';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    return this.invoicesService.createInvoice(createInvoiceDto);
  }

  @Post(':id/generate-pdf')
  async generateInvoicePdf(@Param('id') id: string): Promise<{ pdfUrl: string }> {
    const pdfUrl = await this.invoicesService.generateInvoicePdf(id);
    return { pdfUrl };
  }

  @Post(':id/generate-xml')
  async generateZugferdXml(@Param('id') id: string): Promise<{ xmlUrl: string }> {
    const xmlUrl = await this.invoicesService.generateZugferdXml(id);
    return { xmlUrl };
  }

  @Get(':id')
  async getInvoiceById(@Param('id') id: string): Promise<Invoice> {
    return this.invoicesService.getInvoiceById(id);
  }

  @Get('booking/:bookingId')
  async getInvoicesByBookingId(@Param('bookingId') bookingId: string): Promise<Invoice[]> {
    return this.invoicesService.getInvoicesByBookingId(bookingId);
  }

  @Get('provider/:providerId')
  async getInvoicesByProviderId(@Param('providerId') providerId: string): Promise<Invoice[]> {
    return this.invoicesService.getInvoicesByProviderId(providerId);
  }

  @Get('customer/:customerId')
  async getInvoicesByCustomerId(@Param('customerId') customerId: string): Promise<Invoice[]> {
    return this.invoicesService.getInvoicesByCustomerId(customerId);
  }

  @Put(':id')
  async updateInvoice(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    return this.invoicesService.updateInvoice(id, updateInvoiceDto);
  }

  @Delete(':id')
  async deleteInvoice(@Param('id') id: string): Promise<void> {
    return this.invoicesService.deleteInvoice(id);
  }
}
