import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(email: string, password: string) {
    // In a real app, you would validate credentials against a database
    const user = { id: 'test-user-id', email, firstName: 'Test', lastName: 'User', userType: 'customer' };
    
    return {
      accessToken: this.jwtService.sign(user),
      user,
    };
  }

  async register(registerDto: any) {
    // In a real app, you would create a user in the database
    const user = {
      id: 'test-user-id',
      email: registerDto.email,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      userType: registerDto.userType,
    };
    
    return {
      accessToken: this.jwtService.sign(user),
      user,
    };
  }
}