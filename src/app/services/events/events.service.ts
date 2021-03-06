import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from './event';
import { format } from 'date-fns';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EventsService {
  API = environment.api;
  constructor(private http: HttpClient, private authService: AuthService) { }
  create(event: Event): Observable<Event> {
    return this.http.post<Event>(this.API + '/events', event);
  }

  getUserEvents(userId: string): Observable<Event[]> {
    return this.http.get<Event[]>(this.API + '/events/user/' +

      userId);
  }

  get(id: string): Observable<Event> {
    return this.http.get<Event>(this.API + '/events/' + id).pipe(
      map((res: Event) => this.formatDateTime(res))
    );
  }

  formatDateTime(event: Event): Event {
    event.displayStart = format(event.startTime, 'dddd MMM, Do - h:mm A');
    event.displayEnd = format(event.endTime, 'dddd MMM, Do - h:mm A');
    return event;
  }

  all(): Observable<Event[]> {
    return this.http.get<Event[]>(this.API + '/events');
  }

  isEventCreator(creatorId: string): boolean {
    const user = this.authService.currentUser();
    return user._id === creatorId ? true : false;
  }

  subscribe(eventId: string, user: object): Observable<Event> {
    return this.http.patch<Event>(this.API + '/events/' +
      eventId + '/subscribe', user);
  }

  update(event: Event): Observable<Event> {
    return this.http.patch<Event>(this.API + '/events/' + event._id, event);
  }
}
