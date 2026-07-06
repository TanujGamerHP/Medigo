import { PrismaService } from '../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    private hashOtpValue;
    private parseUserAgent;
    register(dto: RegisterDto, ipAddress?: string, userAgent?: string): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    sendOtp(email: string, ipAddress?: string): Promise<{
        message: string;
        expiresIn: string;
        simulatedCode: string;
    }>;
    verifyOtp(dto: VerifyOtpDto, ipAddress?: string, userAgentStr?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            patient: {
                id: string;
                status: import("@prisma/client").$Enums.PatientStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                userId: string;
                firstName: string;
                lastName: string;
                dob: Date | null;
                gender: string | null;
                height: number | null;
                weight: number | null;
                bloodGroup: string | null;
                emergencyContact: string | null;
                profileImage: string | null;
                createdBy: string | null;
                updatedBy: string | null;
            } | null;
            doctor: {
                id: string;
                status: import("@prisma/client").$Enums.DoctorStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                specialization: string;
                experience: string;
                qualification: string | null;
                licenseNumber: string | null;
                hospital: string | null;
                bio: string | null;
                userId: string;
                firstName: string;
                lastName: string;
                profileImage: string | null;
                createdBy: string | null;
                updatedBy: string | null;
                consultationFee: number;
                availabilityStatus: string;
            } | null;
        };
    }>;
    refreshToken(refreshToken: string, ipAddress?: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(sessionId: string, userId: string, ipAddress?: string): Promise<{
        message: string;
    }>;
    logoutAll(userId: string, ipAddress?: string): Promise<{
        message: string;
    }>;
    listSessions(userId: string): Promise<{
        id: string;
        ipAddress: string | null;
        device: string | null;
        browser: string | null;
        loginTime: Date;
        lastActivity: Date;
    }[]>;
    private generateTokens;
}
