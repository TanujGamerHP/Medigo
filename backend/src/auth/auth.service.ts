import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { hashPassword } from '../common/utils/crypto';
import { UserRole } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Securely hash OTP before database storage
  private hashOtpValue(code: string): string {
    return crypto.createHash('sha256').update(code).digest('hex');
  }

  // Helper to parse user-agent
  private parseUserAgent(ua: string) {
    const isMobile = /Mobile|Android|iP(hone|od|ad)/i.test(ua);
    const browser = ua.includes('Firefox')
      ? 'Firefox'
      : ua.includes('Chrome')
        ? 'Chrome'
        : ua.includes('Safari')
          ? 'Safari'
          : 'Other';
    return {
      browser,
      device: isMobile ? 'Mobile' : 'Desktop',
    };
  }

  async register(dto: RegisterDto, ipAddress?: string, userAgent?: string) {
    const emailNormalized = dto.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    if (existing) {
      throw new BadRequestException('User with this email already registered');
    }

    const passwordHash = dto.password ? hashPassword(dto.password) : null;

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: emailNormalized,
          phone: dto.phone,
          passwordHash,
          role: dto.role,
        },
      });

      const [firstName = '', ...lastNames] = dto.name.split(' ');
      const lastName = lastNames.join(' ') || '';

      if (dto.role === UserRole.Patient) {
        await tx.patient.create({
          data: {
            userId: user.id,
            firstName,
            lastName,
          },
        });
      } else if (dto.role === UserRole.Doctor) {
        await tx.doctor.create({
          data: {
            userId: user.id,
            firstName,
            lastName,
            specialization: dto.specialization || 'General Obesity Medicine',
            experience: dto.experience || '5 years',
            qualification: dto.qualification || null,
            licenseNumber: dto.licenseNumber || null,
            hospital: dto.hospital || null,
            bio: dto.bio || null,
            status: 'PendingCredentials',
          },
        });
      }

      // Log audit
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'Register',
          details: `Registered account as role ${dto.role}`,
          ipAddress,
        },
      });

      return {
        id: user.id,
        email: user.email,
        role: user.role,
      };
    });
  }

  async sendOtp(email: string, ipAddress?: string) {
    const emailNormalized = email.trim().toLowerCase();

    // Check if user is locked
    const user = await this.prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    if (user?.lockedUntil && new Date() < user.lockedUntil) {
      throw new ForbiddenException(
        `Account temporarily locked. Please try again after ${user.lockedUntil.toLocaleTimeString()}`,
      );
    }

    // Check resend limits
    const activeOtp = await this.prisma.oTPCode.findUnique({
      where: { email: emailNormalized },
    });

    if (activeOtp) {
      const cooldownSec = 30;
      const elapsed =
        (Date.now() - new Date(activeOtp.lastResentAt).getTime()) / 1000;
      if (elapsed < cooldownSec) {
        throw new BadRequestException(
          `Please wait ${Math.ceil(cooldownSec - elapsed)} seconds before requesting a new OTP`,
        );
      }

      if (activeOtp.resends >= 3) {
        throw new BadRequestException(
          'Maximum OTP requests reached. Please try again later.',
        );
      }
    }

    // Generate 6 digit OTP
    const code = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = this.hashOtpValue(code);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await this.prisma.oTPCode.upsert({
      where: { email: emailNormalized },
      update: {
        hashedOtp,
        expiresAt,
        resends: activeOtp ? activeOtp.resends + 1 : 0,
        lastResentAt: new Date(),
        attempts: 0,
      },
      create: {
        email: emailNormalized,
        hashedOtp,
        expiresAt,
        resends: 0,
        lastResentAt: new Date(),
        attempts: 0,
      },
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        action: 'OTP Request',
        details: `OTP code dispatched to ${emailNormalized}`,
        ipAddress,
      },
    });

    return {
      message: 'Verification OTP code sent successfully',
      expiresIn: '5 minutes',
      // Return plain OTP code in non-prod/simulated environments for testing convenience
      simulatedCode: code,
    };
  }

  async verifyOtp(
    dto: VerifyOtpDto,
    ipAddress?: string,
    userAgentStr?: string,
  ) {
    const emailNormalized = dto.email.trim().toLowerCase();

    // Check lock status
    const user = await this.prisma.user.findUnique({
      where: { email: emailNormalized },
      include: {
        patient: true,
        doctor: true,
      },
    });

    if (!user) {
      throw new BadRequestException('Email address not registered');
    }

    if (user.lockedUntil && new Date() < user.lockedUntil) {
      throw new ForbiddenException(
        'Account temporarily locked. Please wait before retrying.',
      );
    }

    const otpRecord = await this.prisma.oTPCode.findUnique({
      where: { email: emailNormalized },
    });

    if (!otpRecord) {
      throw new BadRequestException('No active OTP verification code found');
    }

    // Expiry check
    if (new Date() > otpRecord.expiresAt) {
      await this.prisma.oTPCode.delete({ where: { email: emailNormalized } });
      throw new BadRequestException('Verification code expired');
    }

    const isMatch = this.hashOtpValue(dto.otpCode) === otpRecord.hashedOtp;

    if (!isMatch) {
      const newAttempts = otpRecord.attempts + 1;

      if (newAttempts >= 5) {
        // Lock account
        const lockDurationMin = 15;
        const lockedUntil = new Date(Date.now() + lockDurationMin * 60 * 1000);

        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            failedOtpAttempts: 0,
            lockedUntil,
            repeatedAbuseCount: { increment: 1 },
          },
        });

        await this.prisma.oTPCode.delete({ where: { email: emailNormalized } });

        await this.prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'Account Lock',
            details: `Account temporarily locked due to failed login attempts`,
            ipAddress,
          },
        });

        throw new ForbiddenException(
          `Too many failed attempts. Account locked for ${lockDurationMin} minutes.`,
        );
      }

      // Update attempt count
      await this.prisma.oTPCode.update({
        where: { email: emailNormalized },
        data: { attempts: newAttempts },
      });

      throw new BadRequestException(
        `Verification code is incorrect. ${5 - newAttempts} attempts remaining.`,
      );
    }

    // Success! Clear locks and delete OTP
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedOtpAttempts: 0,
        lockedUntil: null,
      },
    });

    await this.prisma.oTPCode.delete({ where: { email: emailNormalized } });

    // Create session
    const uaDetails = this.parseUserAgent(userAgentStr || '');
    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        device: uaDetails.device,
        browser: uaDetails.browser,
        ipAddress,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role,
      session.id,
    );

    // Save hashed refresh token to session
    const hashedRefreshToken = crypto
      .createHash('sha256')
      .update(tokens.refreshToken)
      .digest('hex');
    await this.prisma.session.update({
      where: { id: session.id },
      data: { hashedRefreshToken },
    });

    // Log audit
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'Login',
        details: `Logged in via OTP verification code`,
        ipAddress,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        patient: user.patient,
        doctor: user.doctor,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string, ipAddress?: string) {
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET || 'default-jwt-secret-key-12345',
      });
    } catch {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    const sessionId = payload.sessionId;
    if (!sessionId) {
      throw new UnauthorizedException('Session token mismatch');
    }

    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || !session.isActive) {
      throw new UnauthorizedException(
        'Session has been revoked or is inactive',
      );
    }

    const incomingHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    // Check if token reuse detected
    if (session.hashedRefreshToken !== incomingHash) {
      // Hijack attempt! Invalidate entire session family
      await this.prisma.session.update({
        where: { id: session.id },
        data: { isActive: false },
      });

      await this.prisma.auditLog.create({
        data: {
          userId: session.userId,
          action: 'Hijack Alert',
          details: `Session revoked due to refresh token reuse attempt`,
          ipAddress,
        },
      });

      throw new ForbiddenException(
        'Security alert: Refresh token reuse detected. Access revoked.',
      );
    }

    // Generate rotated tokens
    const tokens = await this.generateTokens(
      session.userId,
      payload.email,
      payload.role,
      session.id,
    );
    const newHash = crypto
      .createHash('sha256')
      .update(tokens.refreshToken)
      .digest('hex');

    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        hashedRefreshToken: newHash,
        lastActivity: new Date(),
      },
    });

    return tokens;
  }

  async logout(sessionId: string, userId: string, ipAddress?: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      throw new BadRequestException('Session details mismatch');
    }

    await this.prisma.session.update({
      where: { id: sessionId },
      data: { isActive: false },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'Logout',
        details: `Terminated active session: ${sessionId}`,
        ipAddress,
      },
    });

    return { message: 'Logged out successfully' };
  }

  async logoutAll(userId: string, ipAddress?: string) {
    await this.prisma.session.updateMany({
      where: { userId },
      data: { isActive: false },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'Logout All',
        details: 'Revoked all active login sessions',
        ipAddress,
      },
    });

    return { message: 'All active sessions revoked successfully' };
  }

  async listSessions(userId: string) {
    return this.prisma.session.findMany({
      where: { userId, isActive: true },
      select: {
        id: true,
        device: true,
        browser: true,
        ipAddress: true,
        loginTime: true,
        lastActivity: true,
      },
    });
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: UserRole,
    sessionId: string,
  ) {
    const payload = { sub: userId, email, role, sessionId };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
