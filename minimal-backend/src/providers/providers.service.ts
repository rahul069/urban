import { Injectable } from '@nestjs/common';

@Injectable()
export class ProvidersService {
  private providers = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      businessName: 'John Doe Plumbing',
      email: 'john@example.com',
      phone: '+49123456789',
      address: '123 Main St',
      city: 'Berlin',
      postalCode: '10115',
      trade: 'Plumber',
      isVerified: true,
      verificationStatus: 'approved',
      serviceRadius: 50,
      profileImageUrl: '',
      ratingAvg: 4.5,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      businessName: 'Jane Smith Electric',
      email: 'jane@example.com',
      phone: '+49987654321',
      address: '456 Side St',
      city: 'Berlin',
      postalCode: '10117',
      trade: 'Electrician',
      isVerified: true,
      verificationStatus: 'approved',
      serviceRadius: 50,
      profileImageUrl: '',
      ratingAvg: 4.2,
      createdAt: new Date().toISOString(),
    },
  ];

  async getProviders(params: any = {}) {
    // Filter by location if provided
    if (params.latitude && params.longitude) {
      return this.providers.filter(provider => {
        // Simple distance calculation (in a real app, use PostGIS)
        const distance = this.calculateDistance(
          parseFloat(params.latitude),
          parseFloat(params.longitude),
          52.5200, // Berlin latitude
          13.4050  // Berlin longitude
        );
        return distance <= (params.radius || 50);
      });
    }
    
    // Filter by service type if provided
    if (params.serviceType) {
      return this.providers.filter(provider =>
        provider.trade.toLowerCase().includes(params.serviceType.toLowerCase())
      );
    }
    
    return this.providers;
  }

  async getProviderById(id: string) {
    return this.providers.find(provider => provider.id === id);
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}