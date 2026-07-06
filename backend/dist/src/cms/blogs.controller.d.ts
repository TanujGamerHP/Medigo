import { CMSService } from './cms.service';
import { CreateBlogDto } from './dto/create-blog.dto';
export declare class BlogsController {
    private cmsService;
    constructor(cmsService: CMSService);
    getAllBlogs(): Promise<{
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
            featuredImage: string | null;
            category: string;
            author: string;
            publishedAt: Date | null;
        }[];
    }>;
    getBlogBySlug(slug: string): Promise<{
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
            featuredImage: string | null;
            category: string;
            author: string;
            publishedAt: Date | null;
        };
    }>;
    createBlog(dto: CreateBlogDto, userId: string): Promise<{
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
            featuredImage: string | null;
            category: string;
            author: string;
            publishedAt: Date | null;
        };
    }>;
    updateBlog(id: string, dto: CreateBlogDto, userId: string): Promise<{
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
            featuredImage: string | null;
            category: string;
            author: string;
            publishedAt: Date | null;
        };
    }>;
    deleteBlog(id: string, userId: string): Promise<{
        message: string;
        data: null;
    }>;
}
