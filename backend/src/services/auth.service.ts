import { getRepository } from 'typeorm';
import { User } from '../models/User';
import { RegisterDto, LoginDto, AuthResponse } from '../types/auth';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class AuthService {
  private userRepository = getRepository(User);

  async register(userData: RegisterDto): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ 
      where: { email: userData.email } 
    });
    
    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Create new user
    const user = new User();
    user.email = userData.email;
    user.password = userData.password;
    user.role = 'user'; // Default role

    // Validate user input
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.toString()}`);
    }

    // Hash password and save user
    await user.hashPassword();
    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const token = user.generateAuthToken();

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
      },
      token,
    };
  }

  async login(loginData: LoginDto): Promise<AuthResponse> {
    // Find user by email
    const user = await this.userRepository.findOne({ 
      where: { email: loginData.email } 
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(loginData.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}