import { CMSService } from './cms.service';
export declare class CMSController {
    private cmsService;
    constructor(cmsService: CMSService);
    getAllPages(): Promise<{
        message: string;
        data: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            content: string;
            title: string;
            slug: string;
            seoTitle: string | null;
            metaDescription: string | null;
        }[];
    }>;
    getPageBySlug(slug: string): Promise<{
        message: string;
        data: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            content: string;
            title: string;
            slug: string;
            seoTitle: string | null;
            metaDescription: string | null;
        };
    }>;
    createPage(title: string, slug: string, content: string, seoTitle: string, metaDescription: string, userId: string): Promise<{
        message: string;
        data: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            content: string;
            title: string;
            slug: string;
            seoTitle: string | null;
            metaDescription: string | null;
        };
    }>;
    updatePage(id: string, title: string, slug: string, content: string, seoTitle: string, metaDescription: string, userId: string): Promise<{
        message: string;
        data: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            content: string;
            title: string;
            slug: string;
            seoTitle: string | null;
            metaDescription: string | null;
        };
    }>;
    deletePage(id: string, userId: string): Promise<{
        message: string;
        data: null;
    }>;
}
