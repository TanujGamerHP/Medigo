import { Observable } from 'rxjs';
export interface RealtimeEvent {
    event: string;
    data: any;
}
export declare class RealtimeService {
    private eventSubject;
    emit(event: string, data: any): void;
    getEventStream(): Observable<RealtimeEvent>;
}
