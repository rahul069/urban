import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  private payments = [
    {
      id: '1',
      bookingId: '1',
      amount: 150,
      paymentMethod: 'credit_card',
      status: 'completed',
      transactionId: 'txn_123456789',
      invoiceUrl: 'https://example.com/invoices/1',
      createdAt: new Date().toISOString(),
    },
  ];

  async createPayment(paymentData: any) {
    const newPayment = {
      id: Math.random().toString(36).substring(2, 9),
      ...paymentData,
      status: 'completed',
      transactionId: `txn_${Math.random().toString(36).substring(2, 10)}`,
      createdAt: new Date().toISOString(),
    };
    this.payments.push(newPayment);
    return newPayment;
  }

  async getPaymentById(id: string) {
    return this.payments.find(payment => payment.id === id);
  }

  async getPaymentsByBooking(bookingId: string) {
    return this.payments.filter(payment => payment.bookingId === bookingId);
  }
}