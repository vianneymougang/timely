import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AppNotification, NotificationPage } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiService = inject(ApiService);

  getByUser(userId: string, page = 0, size = 50): Observable<NotificationPage> {
    return this.apiService.get<NotificationPage>(`/notifications/user/${userId}`, { page, size });
  }
}
