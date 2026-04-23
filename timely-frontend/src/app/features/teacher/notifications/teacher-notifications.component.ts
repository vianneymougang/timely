import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorBell, phosphorCheckCircle, phosphorInfo,
  phosphorWarningCircle, phosphorCalendarCheck, phosphorX,
  phosphorChecks, phosphorArrowClockwise,
} from '@ng-icons/phosphor-icons/regular';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { FADE_UP, SPRING_DEFAULT, SPRING_SNAPPY } from '../../../core/animations/motion.variants';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AppNotification, TypeNotification } from '../../../core/models/notification.model';
import { Subscription } from 'rxjs';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-teacher-notifications',
  standalone: true,
  imports: [CommonModule, NgIcon, NgmMotionDirective],
  providers: [
    provideIcons({
      phosphorBell, phosphorCheckCircle, phosphorInfo,
      phosphorWarningCircle, phosphorCalendarCheck, phosphorX,
      phosphorChecks, phosphorArrowClockwise,
    }),
  ],
  templateUrl: './teacher-notifications.component.html',
  styleUrl: './teacher-notifications.component.scss',
})
export class TeacherNotificationsComponent implements OnInit, OnDestroy {
  readonly FADE_UP = FADE_UP;
  readonly SPRING_DEFAULT = SPRING_DEFAULT;
  readonly SPRING_SNAPPY = SPRING_SNAPPY;

  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  private subs: Subscription[] = [];

  loading = signal(true);
  error = signal(false);
  dismissed = signal<Set<string>>(new Set());

  private allNotifs = signal<AppNotification[]>([]);

  visibleNotifs = computed(() => {
    const dismissed = this.dismissed();
    return this.allNotifs().filter(n => !dismissed.has(n.id));
  });

  todayNotifs = computed(() => {
    const today = new Date().toDateString();
    return this.visibleNotifs().filter(n => new Date(n.dateCreation).toDateString() === today);
  });

  yesterdayNotifs = computed(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toDateString();
    return this.visibleNotifs().filter(n => new Date(n.dateCreation).toDateString() === yStr);
  });

  olderNotifs = computed(() => {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toDateString();
    return this.visibleNotifs().filter(n => {
      const d = new Date(n.dateCreation).toDateString();
      return d !== today && d !== yStr;
    });
  });

  unreadCount = computed(() =>
    this.visibleNotifs().filter(n => n.dateLecture === null).length
  );

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  load(): void {
    const user = this.authService.currentUser();
    if (!user?.id) { this.loading.set(false); return; }

    this.loading.set(true);
    this.error.set(false);

    const sub = this.notificationService.getByUser(user.id)
      .pipe(catchError(() => { this.error.set(true); return of(null); }))
      .subscribe(page => {
        if (page) this.allNotifs.set(page.content ?? []);
        this.loading.set(false);
      });
    this.subs.push(sub);
  }

  dismiss(id: string): void {
    this.dismissed.update(s => { s.add(id); return new Set(s); });
  }

  formatTime(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  getTypeIcon(type: TypeNotification): string {
    const map: Record<TypeNotification, string> = {
      CONFLIT_HORAIRE:         'phosphorWarningCircle',
      CHANGEMENT_EMPLOI_TEMPS: 'phosphorCalendarCheck',
      NOUVEL_EMPLOI_TEMPS:     'phosphorCalendarCheck',
      RAPPEL_COURS:            'phosphorBell',
      ANNULATION_COURS:        'phosphorWarningCircle',
      EVENEMENT_A_VENIR:       'phosphorInfo',
    };
    return map[type] ?? 'phosphorInfo';
  }

  getTypeColor(type: TypeNotification): string {
    const map: Record<TypeNotification, string> = {
      CONFLIT_HORAIRE:         'text-red-500',
      CHANGEMENT_EMPLOI_TEMPS: 'text-teal-500',
      NOUVEL_EMPLOI_TEMPS:     'text-teal-500',
      RAPPEL_COURS:            'text-amber-500',
      ANNULATION_COURS:        'text-red-500',
      EVENEMENT_A_VENIR:       'text-blue-500',
    };
    return map[type] ?? 'text-gray-400';
  }

  getTypeBg(type: TypeNotification): string {
    const map: Record<TypeNotification, string> = {
      CONFLIT_HORAIRE:         'bg-red-50',
      CHANGEMENT_EMPLOI_TEMPS: 'bg-teal-50',
      NOUVEL_EMPLOI_TEMPS:     'bg-teal-50',
      RAPPEL_COURS:            'bg-amber-50',
      ANNULATION_COURS:        'bg-red-50',
      EVENEMENT_A_VENIR:       'bg-blue-50',
    };
    return map[type] ?? 'bg-gray-50';
  }
}
