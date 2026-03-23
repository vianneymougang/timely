import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Alert, AlertSeverityLabels, AlertSeverityColors } from '../../../../core/models/report.model';

@Component({
  selector: 'app-alerts-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-slate-800">Alertes Système</h3>
        @if (unreadCount > 0) {
          <span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600">
            {{ unreadCount }} nouveau{{ unreadCount > 1 ? 'x' : '' }}
          </span>
        }
      </div>

      @if (alerts.length === 0) {
        <div class="text-center py-8 text-slate-500">
          <svg class="w-12 h-12 mx-auto mb-2 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-sm">Aucune alerte</p>
        </div>
      } @else {
        <div class="space-y-3 max-h-96 overflow-y-auto">
          @for (alert of alerts; track alert.id) {
            <div
              [class]="'p-4 rounded-lg border-l-4 ' + getBorderColor(alert.severity) + ' ' + (alert.dismissed ? 'bg-slate-50 opacity-60' : 'bg-slate-50')"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-start space-x-3 flex-1">
                  <div [class]="'p-1.5 rounded-lg ' + getBgColor(alert.severity)">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getIcon(alert.severity)"></path>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-2 mb-1">
                      <h4 class="text-sm font-semibold text-slate-800">{{ alert.title }}</h4>
                      <span [class]="'px-2 py-0.5 text-xs font-medium rounded ' + getTagColor(alert.severity)">
                        {{ getSeverityLabel(alert.severity) }}
                      </span>
                    </div>
                    <p class="text-sm text-slate-600 mb-2">{{ alert.message }}</p>
                    <div class="flex items-center space-x-4 text-xs text-slate-500">
                      <span>{{ formatTimestamp(alert.timestamp) }}</span>
                      @if (alert.actionRequired) {
                        <span class="text-orange-600 font-medium">Action requise</span>
                      }
                    </div>
                  </div>
                </div>
                @if (!alert.dismissed) {
                  <button
                    (click)="dismissAlert(alert.id)"
                    class="text-slate-400 hover:text-slate-600 ml-2"
                    title="Fermer"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class AlertsWidgetComponent {
  @Input() alerts: Alert[] = [];

  protected readonly AlertSeverityLabels = AlertSeverityLabels;

  get unreadCount(): number {
    return this.alerts.filter(a => !a.dismissed).length;
  }

  getSeverityLabel(severity: string): string {
    return AlertSeverityLabels[severity as keyof typeof AlertSeverityLabels] || severity;
  }

  getBorderColor(severity: string): string {
    const colors: Record<string, string> = {
      INFO: 'border-blue-500',
      WARNING: 'border-yellow-500',
      ERROR: 'border-red-500',
      CRITICAL: 'border-purple-500'
    };
    return colors[severity] || 'border-slate-500';
  }

  getBgColor(severity: string): string {
    const colors: Record<string, string> = {
      INFO: 'bg-blue-500',
      WARNING: 'bg-yellow-500',
      ERROR: 'bg-red-500',
      CRITICAL: 'bg-purple-500'
    };
    return colors[severity] || 'bg-slate-500';
  }

  getTagColor(severity: string): string {
    const colors: Record<string, string> = {
      INFO: 'bg-blue-100 text-blue-700',
      WARNING: 'bg-yellow-100 text-yellow-700',
      ERROR: 'bg-red-100 text-red-700',
      CRITICAL: 'bg-purple-100 text-purple-700'
    };
    return colors[severity] || 'bg-slate-100 text-slate-700';
  }

  getIcon(severity: string): string {
    const icons: Record<string, string> = {
      INFO: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      WARNING: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      ERROR: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
      CRITICAL: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    };
    return icons[severity] || icons['INFO'];
  }

  dismissAlert(id: string): void {
    // Émettre un événement pour marquer l'alerte comme lue
    const alert = this.alerts.find(a => a.id === id);
    if (alert) {
      alert.dismissed = true;
    }
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
