export declare class UploadController {
    uploadFile(file: Express.Multer.File): Promise<{
        message: string;
        data: {
            originalName: string;
            mimeType: string;
            sizeBytes: number;
            url: string;
        };
    }>;
}
