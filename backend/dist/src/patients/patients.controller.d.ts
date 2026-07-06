import { PatientsService } from './patients.service';
import { PatientStatus } from '@prisma/client';
export declare class PatientsController {
    private patientsService;
    constructor(patientsService: PatientsService);
    getAll(): Promise<{
        message: string;
        data: ({
            appointments: {
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
            }[];
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
            prescriptions: {
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
        })[];
    }>;
    getOne(id: string): Promise<{
        message: string;
        data: {
            appointments: {
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
            }[];
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
            prescriptions: {
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
        };
    }>;
    updateStatus(id: string, status: PatientStatus): Promise<{
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
}
