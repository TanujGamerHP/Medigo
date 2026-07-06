import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(userId: string): Promise<{
        message: string;
        data: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            phone: string | null;
            createdAt: Date;
            patient: ({
                memberships: {
                    id: string;
                    status: import("@prisma/client").$Enums.MembershipStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    createdBy: string | null;
                    updatedBy: string | null;
                    planName: string;
                    startDate: Date;
                    expiryDate: Date;
                    price: number;
                    patientId: string;
                }[];
            } & {
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
            }) | null;
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
    updateProfile(userId: string, updateData: any): Promise<{
        message: string;
        data: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            phone: string | null;
            createdAt: Date;
            patient: ({
                memberships: {
                    id: string;
                    status: import("@prisma/client").$Enums.MembershipStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    createdBy: string | null;
                    updatedBy: string | null;
                    planName: string;
                    startDate: Date;
                    expiryDate: Date;
                    price: number;
                    patientId: string;
                }[];
            } & {
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
            }) | null;
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
    purchaseMembership(userId: string, planName: string, price: number): Promise<{
        message: string;
        data: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            phone: string | null;
            createdAt: Date;
            patient: ({
                memberships: {
                    id: string;
                    status: import("@prisma/client").$Enums.MembershipStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    createdBy: string | null;
                    updatedBy: string | null;
                    planName: string;
                    startDate: Date;
                    expiryDate: Date;
                    price: number;
                    patientId: string;
                }[];
            } & {
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
            }) | null;
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
}
