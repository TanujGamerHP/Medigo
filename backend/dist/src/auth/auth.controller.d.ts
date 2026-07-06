import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, ipAddress: string, userAgent: string): Promise<{
        message: string;
        data: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    sendOtp(email: string, ipAddress: string): Promise<{
        message: string;
        data: {
            message: string;
            expiresIn: string;
            simulatedCode: string;
        };
    }>;
    verifyOtp(dto: VerifyOtpDto, ipAddress: string, userAgent: string): Promise<{
        message: string;
        data: {
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
        };
    }>;
    refresh(refreshToken: string, ipAddress: string): Promise<{
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    refreshTokenAlias(refreshToken: string, ipAddress: string): Promise<{
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    listSessions(userId: string): Promise<{
        message: string;
        data: {
            id: string;
            ipAddress: string | null;
            device: string | null;
            browser: string | null;
            loginTime: Date;
            lastActivity: Date;
        }[];
    }>;
    logout(sessionId: string, userId: string, ipAddress: string): Promise<{
        message: string;
        data: {
            message: string;
        };
    }>;
    logoutAll(userId: string, ipAddress: string): Promise<{
        message: string;
        data: {
            message: string;
        };
    }>;
}
