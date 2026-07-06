import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Twilio } from 'twilio';

@Injectable()
export class NotificationsService {
  private emailTransporter: nodemailer.Transporter;
  private twilioClient: Twilio;

  constructor(private readonly configService: ConfigService) {
    // Set up email transporter
    this.emailTransporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: +this.configService.get('SMTP_PORT'),
      secure: this.configService.get('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
    
    // Set up Twilio client
    const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
    
    if (accountSid && authToken) {
      this.twilioClient = new Twilio(accountSid, authToken);
    }
  }

  async sendReverificationReminder(
    email: string,
    name: string,
    nextReverificationDate: Date,
  ): Promise<void> {
    const subject = 'Erinnerung: Überprüfung Ihrer Unterlagen erforderlich';
    const html = `
      <p>Hallo ${name},</p>
      <p>Ihre Überprüfungsunterlagen müssen bis zum ${nextReverificationDate.toLocaleDateString('de-DE')} erneuert werden.</p>
      <p>Bitte laden Sie aktualisierte Dokumente in Ihrem Konto hoch, um weiterhin Dienstleistungen anbieten zu können.</p>
      <p>Mit freundlichen Grüßen,<br/>Das Urban Team</p>
    `;
    
    await this.sendEmail(email, subject, html);
  }

  async sendInsuranceExpiryReminder(
    email: string,
    name: string,
    insuranceExpiry: Date,
  ): Promise<void> {
    const subject = 'Erinnerung: Ihre Versicherung läuft bald ab';
    const html = `
      <p>Hallo ${name},</p>
      <p>Ihre Haftpflichtversicherung läuft am ${insuranceExpiry.toLocaleDateString('de-DE')} ab.</p>
      <p>Bitte laden Sie eine aktualisierte Versicherungsbescheinigung in Ihrem Konto hoch.</p>
      <p>Mit freundlichen Grüßen,<br/>Das Urban Team</p>
    `;
    
    await this.sendEmail(email, subject, html);
  }

  async sendVerificationExpiredNotification(
    email: string,
    name: string,
  ): Promise<void> {
    const subject = 'Wichtig: Ihr Konto wurde deaktiviert';
    const html = `
      <p>Hallo ${name},</p>
      <p>Ihr Konto wurde deaktiviert, da Ihre Überprüfungsunterlagen abgelaufen sind.</p>
      <p>Bitte laden Sie aktualisierte Dokumente hoch, um Ihr Konto wieder zu aktivieren.</p>
      <p>Mit freundlichen Grüßen,<br/>Das Urban Team</p>
    `;
    
    await this.sendEmail(email, subject, html);
  }

  async sendBookingConfirmation(
    email: string,
    name: string,
    bookingDetails: {
      serviceType: string;
      date: string;
      time: string;
      providerName: string;
    },
  ): Promise<void> {
    const subject = 'Buchungsbestätigung';
    const html = `
      <p>Hallo ${name},</p>
      <p>Ihre Buchung für ${bookingDetails.serviceType} wurde bestätigt.</p>
      <p>
        <strong>Datum:</strong> ${bookingDetails.date}<br/>
        <strong>Uhrzeit:</strong> ${bookingDetails.time}<br/>
        <strong>Handwerker:</strong> ${bookingDetails.providerName}
      </p>
      <p>Sie erhalten eine weitere Benachrichtigung, wenn der Handwerker unterwegs ist.</p>
      <p>Mit freundlichen Grüßen,<br/>Das Urban Team</p>
    `;
    
    await this.sendEmail(email, subject, html);
  }

  async sendProviderJobRequest(
    email: string,
    name: string,
    jobDetails: {
      serviceType: string;
      date: string;
      time: string;
      customerName: string;
      address: string;
    },
  ): Promise<void> {
    const subject = 'Neue Job-Anfrage';
    const html = `
      <p>Hallo ${name},</p>
      <p>Sie haben eine neue Job-Anfrage für ${jobDetails.serviceType}.</p>
      <p>
        <strong>Datum:</strong> ${jobDetails.date}<br/>
        <strong>Uhrzeit:</strong> ${jobDetails.time}<br/>
        <strong>Kunde:</strong> ${jobDetails.customerName}<br/>
        <strong>Adresse:</strong> ${jobDetails.address}
      </p>
      <p>Bitte bestätigen Sie die Anfrage in Ihrer App.</p>
      <p>Mit freundlichen Grüßen,<br/>Das Urban Team</p>
    `;
    
    await this.sendEmail(email, subject, html);
  }

  async sendSms(phoneNumber: string, message: string): Promise<void> {
    if (!this.twilioClient) {
      console.warn('Twilio client not configured, SMS not sent');
      return;
    }
    
    try {
      await this.twilioClient.messages.create({
        body: message,
        from: this.configService.get('TWILIO_PHONE_NUMBER'),
        to: phoneNumber,
      });
    } catch (error) {
      console.error('Failed to send SMS:', error);
    }
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.emailTransporter.sendMail({
        from: this.configService.get('SMTP_FROM'),
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }
}