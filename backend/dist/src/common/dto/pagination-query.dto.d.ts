export declare class PaginationQueryDto {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: string;
    category?: string;
    date?: string;
    doctorId?: string;
    patientId?: string;
}
