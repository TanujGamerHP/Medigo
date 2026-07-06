import { MessageEvent } from '@nestjs/common';
import { RealtimeService } from './realtime.service';
import { Observable } from 'rxjs';
export declare class RealtimeController {
    private realtimeService;
    constructor(realtimeService: RealtimeService);
    streamEvents(userId?: string, role?: string): Observable<MessageEvent>;
}
