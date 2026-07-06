import { UserRole } from '@prisma/client';
export declare class RegisterDto {
    email: string;
    phone?: string;
    password: string;
    role: UserRole;
    name: string;
    specialization?: string;
    experience?: string;
    qualification?: string;
    licenseNumber?: string;
    hospital?: string;
    bio?: string;
}
