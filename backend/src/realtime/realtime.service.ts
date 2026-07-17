import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

export interface RealtimeEvent {
  event: string;
  data: any;
}

@Injectable()
export class RealtimeService {
  private eventSubject = new Subject<RealtimeEvent>();

  // Emit a real-time event
  emit(event: string, data: any) {
    this.eventSubject.next({ event, data });
  }

  // Emit a real-time event to a specific user
  emitToUser(userId: string, event: string, data: any) {
    this.emit(event, { ...data, targetUserId: userId });
  }

  // Subscribe to the stream of real-time events
  getEventStream(): Observable<RealtimeEvent> {
    return this.eventSubject.asObservable();
  }
}
