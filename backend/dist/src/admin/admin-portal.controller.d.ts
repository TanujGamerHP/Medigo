import { AdminService } from './admin.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
export declare class AdminPortalController {
    private adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<{
        message: string;
        data: {
            totalUsers: number;
            totalPatients: number;
            totalDoctors: number;
            pendingDoctors: number;
            totalAppointments: number;
            completedConsultations: number;
            prescriptionsIssued: number;
            approvedTreatments: number;
            earnings: {
                totalCollected: number;
                currency: string;
                activeSubscribers: number;
            };
        };
    }>;
    getUsers(query: PaginationQueryDto): Promise<{
        message: string;
        data: {
            items: {
                deletedAt: Date | null;
                status: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                role: import("@prisma/client").$Enums.UserRole;
                email: string;
                phone: string | null;
                isVerified: boolean;
                lastLogin: Date | null;
                passwordHash: string | null;
                failedOtpAttempts: number;
                lockedUntil: Date | null;
                repeatedAbuseCount: number;
            }[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getDoctors(): Promise<{
        message: string;
        data: ({
            user: {
                deletedAt: Date | null;
                status: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.DoctorStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            updatedBy: string | null;
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
        })[];
    }>;
    getPatients(): Promise<{
        message: string;
        data: ({
            user: {
                deletedAt: Date | null;
                status: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.PatientStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            updatedBy: string | null;
            userId: string;
            firstName: string;
            lastName: string;
            profileImage: string | null;
            dob: Date | null;
            gender: string | null;
            height: number | null;
            weight: number | null;
            bloodGroup: string | null;
            emergencyContact: string | null;
        })[];
    }>;
    getReports(): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            userId: string | null;
            action: string;
            details: string | null;
            ipAddress: string | null;
        }[];
    }>;
    updateUser(id: string, dto: UpdateUserDto): Promise<{
        message: string;
        data: {
            deletedAt: Date | null;
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
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
    }>;
    removeUser(id: string): Promise<{
        message: string;
        data: null;
    }>;
}
