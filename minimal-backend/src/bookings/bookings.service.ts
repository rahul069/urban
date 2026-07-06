import { Injectable } from '@nestjs/common';

@Injectable()
export class BookingsService {
  private bookings = [
    {
      id: '1',
      customerId: 'customer-1',
      providerId: '1',
      serviceType: 'plumbing',
      description: 'Leaky faucet repair',
      status: 'completed',
      scheduledAt: '2026-07-10T14:00:00Z',
      customerAddress: '123 Main St, Berlin',
      estimatedPrice: 150,
      finalPrice: 150,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      customerId: 'customer-1',
      providerId: '2',
      serviceType: 'electrical',
      description: 'Light fixture installation',
      status: 'requested',
      scheduledAt: '2026-07-15T10:00:00Z',
      customerAddress: '123 Main St, Berlin',
      estimatedPrice: 200,
      finalPrice: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  async createBooking(bookingData: any) {
    const newBooking = {
      id: Math.random().toString(36).substring(2, 9),
      ...bookingData,
      status: 'requested',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.bookings.push(newBooking);
    return newBooking;
  }

  async getBookingById(id: string) {
    return this.bookings.find(booking => booking.id === id);
  }

  async updateBookingStatus(id: string, status: string) {
    const booking = this.bookings.find(b => b.id === id);
    if (booking) {
      booking.status = status;
      booking.updatedAt = new Date().toISOString();
    }
    return booking;
  }

  async getBookingsByCustomer(customerId: string) {
    return this.bookings.filter(booking => booking.customerId === customerId);
  }

  async getBookingsByProvider(providerId: string) {
    return this.bookings.filter(booking => booking.providerId === providerId);
  }
}