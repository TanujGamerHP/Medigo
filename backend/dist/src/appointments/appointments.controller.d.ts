import { AppointmentsService } from './appointments.service';
import { AppointmentStatus } from '@prisma/client';
export declare class AppointmentsController {
    private appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    getAll(user: any): Promise<{
        message: string;
        data: ({
            patient: {
                id: string;
                status: import("@prisma/client").$Enums.PatientStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
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
            };
            doctor: {
                id: string;
                status: import("@prisma/client").$Enums.DoctorStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                userId: string;
                firstName: string;
                lastName: string;
                profileImage: string | null;
                specialization: string;
                qualification: string | null;
                experience: string;
                licenseNumber: string | null;
                hospital: string | null;
                bio: string | null;
                consultationFee: number;
                availabilityStatus: string;
            };
        } & {
            id: string;
            patientId: string;
            doctorId: string;
            appointmentDate: string;
            appointmentTime: string;
            consultationType: string;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            notes: string | null;
            meetingLink: string | null;
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
            patient: {
                id: string;
                status: import("@prisma/client").$Enums.PatientStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
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
            };
            doctor: {
                id: string;
                status: import("@prisma/client").$Enums.DoctorStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                userId: string;
                firstName: string;
                lastName: string;
                profileImage: string | null;
                specialization: string;
                qualification: string | null;
                experience: string;
                licenseNumber: string | null;
                hospital: string | null;
                bio: string | null;
                consultationFee: number;
                availabilityStatus: string;
            };
            prescription: {
                id: string;
                patientId: string;
                doctorId: string;
                status: import("@prisma/client").$Enums.PrescriptionStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                appointmentId: string | null;
                diagnosis: string | null;
                medications: string | null;
                instructions: string | null;
                followUpDate: Date | null;
            } | null;
            consultation: {
                id: string;
                patientId: string;
                doctorId: string;
                createdAt: Date;
                updatedAt: Date;
                appointmentId: string;
                diagnosis: string;
                followUpDate: Date | null;
                chiefComplaint: string;
                clinicalFindings: string;
                treatmentRecommendation: string;
                lifestyleAdvice: string | null;
                dietRecommendation: string | null;
                exerciseRecommendation: string | null;
                additionalNotes: string | null;
            } | null;
        } & {
            id: string;
            patientId: string;
            doctorId: string;
            appointmentDate: string;
            appointmentTime: string;
            consultationType: string;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            notes: string | null;
            meetingLink: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
        };
    }>;
    updateMeetingLink(id: string, meetingLink: string): Promise<{
        message: string;
        data: {
            id: string;
            patientId: string;
            doctorId: string;
            appointmentDate: string;
            appointmentTime: string;
            consultationType: string;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            notes: string | null;
            meetingLink: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
        };
    }>;
    getMessages(id: string): Promise<{
        message: string;
        data: ({
            sender: {
                id: string;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            appointmentId: string;
            senderId: string;
            text: string;
        })[];
    }>;
    sendMessage(id: string, text: string, userId: string): Promise<{
        message: string;
        data: {
            sender: {
                id: string;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            appointmentId: string;
            senderId: string;
            text: string;
        };
    }>;
    create(doctorId: string, appointmentDate: string, appointmentTime: string, consultationType: string, userId: string): Promise<{
        message: string;
        data: {
            id: string;
            patientId: string;
            doctorId: string;
            appointmentDate: string;
            appointmentTime: string;
            consultationType: string;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            notes: string | null;
            meetingLink: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
        };
    }>;
    reschedule(id: string, appointmentDate: string, appointmentTime: string, userId: string): Promise<{
        message: string;
        data: {
            id: string;
            patientId: string;
            doctorId: string;
            appointmentDate: string;
            appointmentTime: string;
            consultationType: string;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            notes: string | null;
            meetingLink: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
        };
    }>;
    updateStatus(id: string, status: AppointmentStatus, userId: string): Promise<{
        message: string;
        data: {
            id: string;
            patientId: string;
            doctorId: string;
            appointmentDate: string;
            appointmentTime: string;
            consultationType: string;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            notes: string | null;
            meetingLink: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
        };
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
        data: {
            id: string;
            patientId: string;
            doctorId: string;
            appointmentDate: string;
            appointmentTime: string;
            consultationType: string;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            notes: string | null;
            meetingLink: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
        };
    }>;
    complete(id: string, data: any, userId: string): Promise<{
        message: string;
        data: {
            appointment: {
                id: string;
                patientId: string;
                doctorId: string;
                appointmentDate: string;
                appointmentTime: string;
                consultationType: string;
                status: import("@prisma/client").$Enums.AppointmentStatus;
                notes: string | null;
                meetingLink: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
            };
            consultation: {
                id: string;
                patientId: string;
                doctorId: string;
                createdAt: Date;
                updatedAt: Date;
                appointmentId: string;
                diagnosis: string;
                followUpDate: Date | null;
                chiefComplaint: string;
                clinicalFindings: string;
                treatmentRecommendation: string;
                lifestyleAdvice: string | null;
                dietRecommendation: string | null;
                exerciseRecommendation: string | null;
                additionalNotes: string | null;
            };
            prescription: {
                id: string;
                patientId: string;
                doctorId: string;
                status: import("@prisma/client").$Enums.PrescriptionStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                appointmentId: string | null;
                diagnosis: string | null;
                medications: string | null;
                instructions: string | null;
                followUpDate: Date | null;
            };
        };
    }>;
}
