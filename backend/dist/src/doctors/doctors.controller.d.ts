import { DoctorsService } from './doctors.service';
import { DoctorStatus } from '@prisma/client';
export declare class DoctorsController {
    private doctorsService;
    constructor(doctorsService: DoctorsService);
    getAvailability(): Promise<{
        message: string;
        data: {
            doctorId: string;
            name: string;
            specialization: string;
            availabilityStatus: string;
            weeklyHours: {
                day: string;
                slots: string[];
            }[];
        }[];
    }>;
    getAll(): Promise<{
        message: string;
        data: ({
            user: {
                id: string;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                role: import("@prisma/client").$Enums.UserRole;
                email: string;
                phone: string | null;
                isVerified: boolean;
                lastLogin: Date | null;
                passwordHash: string | null;
                failedOtpAttempts: number;
                lockedUntil: Date | null;
                repeatedAbuseCount: number;
            };
        } & {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            specialization: string;
            qualification: string | null;
            experience: string;
            licenseNumber: string | null;
            hospital: string | null;
            bio: string | null;
            profileImage: string | null;
            consultationFee: number;
            availabilityStatus: string;
            status: import("@prisma/client").$Enums.DoctorStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
        })[];
    }>;
    getOne(id: string): Promise<{
        message: string;
        data: {
            user: {
                id: string;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                role: import("@prisma/client").$Enums.UserRole;
                email: string;
                phone: string | null;
                isVerified: boolean;
                lastLogin: Date | null;
                passwordHash: string | null;
                failedOtpAttempts: number;
                lockedUntil: Date | null;
                repeatedAbuseCount: number;
            };
        } & {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            specialization: string;
            qualification: string | null;
            experience: string;
            licenseNumber: string | null;
            hospital: string | null;
            bio: string | null;
            profileImage: string | null;
            consultationFee: number;
            availabilityStatus: string;
            status: import("@prisma/client").$Enums.DoctorStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
        };
    }>;
    updateStatus(id: string, status: DoctorStatus): Promise<{
        message: string;
        data: {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            specialization: string;
            qualification: string | null;
            experience: string;
            licenseNumber: string | null;
            hospital: string | null;
            bio: string | null;
            profileImage: string | null;
            consultationFee: number;
            availabilityStatus: string;
            status: import("@prisma/client").$Enums.DoctorStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
        };
    }>;
}
