import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditEntry, AuditActionLabels, EntityTypeLabels } from '../../../../core/models/report.model';

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-slate-800">Activités Récentes</h3>
        <button
          (click)="onViewAll()"
          class="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Voir tout
        </button>
      </div>

      @if (activities.length === 0) {
        <div class="text-center py-8 text-slate-500">
          <svg class="w-12 h-12 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p class="text-sm">Aucune activité récente</p>
        </div>
      } @else {
        <div class="space-y-3 max-h-96 overflow-y-auto">
          @for (activity of activities; track activity.id) {
            <div class="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-150">
              <div [class]="'p-2 rounded-lg flex-shrink-0 ' + getActionColor(activity.action)">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getActionIcon(activity.action)"></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-slate-800 font-medium">
                  {{ activity.userName }}
                  <span class="text-slate-600 font-normal">
                    a {{ getActionLabel(activity.action).toLowerCase() }}
                  </span>
                  {{ getEntityLabel(activity.entity).toLowerCase() }}
                </p>
                <p class="text-xs text-slate-500 mt-1">{{ activity.details }}</p>
                <p class="text-xs text-slate-400 mt-1">{{ formatTimestamp(activity.timestamp) }}</p>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class RecentActivityComponent {
  @Input() activities: AuditEntry[] = [];

  protected readonly AuditActionLabels = AuditActionLabels;
  protected readonly EntityTypeLabels = EntityTypeLabels;

  onViewAll(): void {
    // Navigation vers la page complète d'audit
    window.location.href = '/admin/reports?tab=audit';
  }

  getActionLabel(action: string): string {
    return AuditActionLabels[action as keyof typeof AuditActionLabels] || action;
  }

  getEntityLabel(entity: string): string {
    return EntityTypeLabels[entity as keyof typeof EntityTypeLabels] || entity;
  }

  getActionColor(action: string): string {
    const colors: Record<string, string> = {
      CREATE: 'bg-green-500',
      UPDATE: 'bg-blue-500',
      DELETE: 'bg-red-500',
      VALIDATE: 'bg-purple-500',
      PUBLISH: 'bg-indigo-500',
      GENERATE: 'bg-yellow-500',
      EXPORT: 'bg-cyan-500'
    };
    return colors[action] || 'bg-slate-500';
  }

  getActionIcon(action: string): string {
    const icons: Record<string, string> = {
      CREATE: 'M12 4v16m8-8H4',
      UPDATE: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      DELETE: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
      VALIDATE: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      PUBLISH: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
      GENERATE: 'M13 10V3L4 14h7v7l9-11h-7z',
      EXPORT: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
    };
    return icons[action] || 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
