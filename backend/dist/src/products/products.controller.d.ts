import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getAllActive(): Promise<{
        message: string;
        data: {
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
        }[];
    }>;
}
