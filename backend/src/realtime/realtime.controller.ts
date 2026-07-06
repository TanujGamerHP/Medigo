import { Controller, Get, Sse, MessageEvent, Query, UseGuards } from '@nestjs/common';
import { RealtimeService } from './realtime.service';
import { Observable, filter, map } from 'rxjs';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Realtime SSE Events')
@Controller('api/v1/realtime')
export class RealtimeController {
  constructor(private realtimeService: RealtimeService) {}

  @Sse('events')
  @ApiOperation({ summary: 'Stream server-sent realtime events', description: 'Clients connect via EventSource to listen to dashboard update streams.' })
  streamEvents(@Query('userId') userId?: string, @Query('role') role?: string): Observable<MessageEvent> {
    return this.realtimeService.getEventStream().pipe(
      // Filter events to only relevant users/roles if specified
      filter((eventData) => {
        const payload = eventData.data;
        if (!payload) return true;

        // If target userId or role is specified in the event, verify matching
        if (payload.targetUserId && payload.targetUserId !== userId) {
          return false;
        }
        if (payload.targetRole && payload.targetRole !== role) {
          return false;
        }
        return true;
      }),
      map((eventData) => ({
        data: eventData,
      })),
    );
  }
}
