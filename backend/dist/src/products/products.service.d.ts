import { PrismaService } from '../database/prisma.service';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllActive(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        isActive: boolean;
        createdBy: string | null;
        updatedBy: string | null;
        description: string;
        price: number;
        category: string | null;
        stock: number;
        imageUrl: string | null;
    }[]>;
    getById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        isActive: boolean;
        createdBy: string | null;
        updatedBy: string | null;
        description: string;
        price: number;
        category: string | null;
        stock: number;
        imageUrl: string | null;
    } | null>;
}
