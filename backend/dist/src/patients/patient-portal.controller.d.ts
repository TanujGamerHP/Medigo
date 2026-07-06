import { PatientsService } from './patients.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class PatientPortalController {
    private patientsService;
    constructor(patientsService: PatientsService);
    getProfile(userId: string): Promise<{
        message: string;
        data: {
            user: {
                id: string;
                email: string;
                role: import("@prisma/client").$Enums.UserRole;
                phone: string | null;
                isVerified: boolean;
                status: string;
                lastLogin: Date | null;
                passwordHash: string | null;
                failedOtpAttempts: number;
                lockedUntil: Date | null;
                repeatedAbuseCount: number;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
            };
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
        };
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        message: string;
        data: {
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
        };
    }>;
    getDashboard(userId: string): Promise<{
        message: string;
        data: {
            profile: {
                firstName: string;
                lastName: string;
                bmi: number | null;
                status: import("@prisma/client").$Enums.PatientStatus;
            };
            nextAppointment: {
                id: string;
                doctor: string;
                date: string;
                time: string;
                type: string;
            } | null;
            activePrescriptions: {
                id: string;
                doctor: string;
                medications: string | null;
                instructions: string | null;
            }[];
            activeMembership: {
                planName: string;
                expiryDate: Date;
            } | null;
        };
    }>;
    getAppointments(userId: string): Promise<{
        message: string;
        data: ({
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
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            patientId: string;
            doctorId: string;
            appointmentDate: string;
            appointmentTime: string;
            consultationType: string;
            notes: string | null;
            meetingLink: string | null;
        })[];
    }>;
    getPrescriptions(userId: string): Promise<{
        message: string;
        data: ({
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
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.PrescriptionStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            patientId: string;
            doctorId: string;
            appointmentId: string | null;
            diagnosis: string | null;
            medications: string | null;
            instructions: string | null;
            followUpDate: Date | null;
        })[];
    }>;
    getMembership(userId: string): Promise<{
        message: string;
        data: {
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
    }>;
    getNotifications(userId: string): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            message: string;
            userId: string;
            type: string;
            title: string;
            isRead: boolean;
        }[];
    }>;
}
