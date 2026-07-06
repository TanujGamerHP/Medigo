import { DoctorsService } from './doctors.service';
import { PrescriptionsService } from '../prescriptions/prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
export declare class DoctorDashboardController {
    private doctorsService;
    private prescriptionsService;
    constructor(doctorsService: DoctorsService, prescriptionsService: PrescriptionsService);
    getDashboard(userId: string): Promise<{
        message: string;
        data: {
            profile: {
                name: string;
                specialization: string;
                availabilityStatus: string;
                status: import("@prisma/client").$Enums.DoctorStatus;
            };
            metrics: {
                totalAppointments: number;
                pendingApprovals: number;
                allTimeRevenue: number;
                monthlyRevenue: number;
            };
            upcomingConsultations: {
                id: string;
                patientName: string;
                date: string;
                time: string;
                status: import("@prisma/client").$Enums.AppointmentStatus;
            }[];
        };
    }>;
    getAppointments(userId: string): Promise<{
        message: string;
        data: ({
            patient: {
                id: string;
                userId: string;
                firstName: string;
                lastName: string;
                profileImage: string | null;
                status: import("@prisma/client").$Enums.PatientStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                dob: Date | null;
                gender: string | null;
                height: number | null;
                weight: number | null;
                bloodGroup: string | null;
                emergencyContact: string | null;
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            doctorId: string;
            patientId: string;
            appointmentDate: string;
            appointmentTime: string;
            consultationType: string;
            notes: string | null;
            meetingLink: string | null;
        })[];
    }>;
    getPatients(userId: string): Promise<{
        message: string;
        data: {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            profileImage: string | null;
            status: import("@prisma/client").$Enums.PatientStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            dob: Date | null;
            gender: string | null;
            height: number | null;
            weight: number | null;
            bloodGroup: string | null;
            emergencyContact: string | null;
        }[];
    }>;
    getPatientDetails(userId: string, patientId: string): Promise<{
        message: string;
        data: {
            appointments: ({
                prescription: {
                    id: string;
                    status: import("@prisma/client").$Enums.PrescriptionStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    createdBy: string | null;
                    updatedBy: string | null;
                    doctorId: string;
                    patientId: string;
                    appointmentId: string | null;
                    diagnosis: string | null;
                    medications: string | null;
                    instructions: string | null;
                    followUpDate: Date | null;
                } | null;
                consultation: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    doctorId: string;
                    patientId: string;
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
                status: import("@prisma/client").$Enums.AppointmentStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                doctorId: string;
                patientId: string;
                appointmentDate: string;
                appointmentTime: string;
                consultationType: string;
                notes: string | null;
                meetingLink: string | null;
            })[];
            prescriptions: {
                id: string;
                status: import("@prisma/client").$Enums.PrescriptionStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                doctorId: string;
                patientId: string;
                appointmentId: string | null;
                diagnosis: string | null;
                medications: string | null;
                instructions: string | null;
                followUpDate: Date | null;
            }[];
            assessments: {
                result: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                patientId: string;
                submittedAt: Date;
                assessmentScore: number;
                bmi: number;
                recommendation: string;
            }[];
        } & {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            profileImage: string | null;
            status: import("@prisma/client").$Enums.PatientStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            dob: Date | null;
            gender: string | null;
            height: number | null;
            weight: number | null;
            bloodGroup: string | null;
            emergencyContact: string | null;
        };
    }>;
    createPrescription(userId: string, dto: CreatePrescriptionDto): Promise<{
        message: string;
        data: {
            id: string;
            status: import("@prisma/client").$Enums.PrescriptionStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            doctorId: string;
            patientId: string;
            appointmentId: string | null;
            diagnosis: string | null;
            medications: string | null;
            instructions: string | null;
            followUpDate: Date | null;
        };
    }>;
    updatePrescription(userId: string, id: string, dto: CreatePrescriptionDto): Promise<{
        message: string;
        data: {
            id: string;
            status: import("@prisma/client").$Enums.PrescriptionStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            doctorId: string;
            patientId: string;
            appointmentId: string | null;
            diagnosis: string | null;
            medications: string | null;
            instructions: string | null;
            followUpDate: Date | null;
        };
    }>;
    getAvailability(userId: string): Promise<{
        message: string;
        data: {
            availabilityStatus: string;
        };
    }>;
    updateAvailability(userId: string, dto: UpdateAvailabilityDto): Promise<{
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
    updateProfile(userId: string, dto: any): Promise<{
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
