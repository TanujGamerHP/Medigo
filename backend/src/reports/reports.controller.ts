import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Reports Module')
@ApiBearerAuth()
@Controller('api/v1/reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('revenue')
  @ApiOperation({ summary: 'Get aggregated revenue data for charts' })
  async getRevenue(@Query('interval') interval: 'daily' | 'weekly' | 'monthly' = 'monthly') {
    // Validate interval to prevent weird queries
    const validInterval = ['daily', 'weekly', 'monthly'].includes(interval) ? interval : 'monthly';
    const data = await this.reportsService.getRevenueData(validInterval as any);
    return {
      message: 'Revenue data fetched successfully',
      data,
    };
  }
}
