import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RequestUser } from '../common/decorators/user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Notifications Module')
@ApiBearerAuth()
@Controller('api/v1/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get user notifications',
    description: 'Lists all unread and read notification history.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of alerts successfully returned.',
  })
  async getMyNotifications(@RequestUser('sub') userId: string) {
    const data = await this.notificationsService.findForUser(userId);
    return {
      message: 'Notifications fetched successfully',
      data,
    };
  }

  @Patch('read-all')
  @ApiOperation({
    summary: 'Mark all notifications as read',
    description: 'Updates status of all unread notifications to read.',
  })
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read.',
  })
  async markAllAsRead(@RequestUser('sub') userId: string) {
    const data = await this.notificationsService.markAllAsRead(userId);
    return {
      message: 'All notifications marked as read',
      data,
    };
  }

  @Patch(':id/read')
  @ApiOperation({
    summary: 'Mark specific notification alert as read',
    description: 'Sets read status by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read successfully.',
  })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  async markAsRead(
    @Param('id') id: string,
    @RequestUser('sub') userId: string,
  ) {
    const data = await this.notificationsService.markAsRead(id, userId);
    return {
      message: 'Notification marked as read',
      data,
    };
  }
}
