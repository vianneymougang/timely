import { Component, OnInit, OnChanges, Input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../../core/services/report.service';
import {
  AuditEntry,
  Page,
  AuditFilterRequest,
  ReportFilterRequest,
  AuditActionLabels,
  EntityTypeLabels,
  AuditAction,
  EntityType
} from '../../../../core/models/report.model';

@Component({
  selector: 'app-audit-trail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- FILTRES SUPPLÉMENTAIRES POUR AUDIT -->
      <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Action</label>
            <select
              [(ngModel)]="auditFilters.action"
              (change)="loadAuditTrail()"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes</option>
              @for (action of auditActions; track action) {
                <option [value]="action">{{ getActionLabel(action) }}</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Type d'Entité</label>
            <select
              [(ngModel)]="auditFilters.entity"
              (change)="loadAuditTrail()"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous</option>
              @for (entity of entityTypes; track entity) {
                <option [value]="entity">{{ getEntityLabel(entity) }}</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Recherche</label>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="loadAuditTrail()"
              placeholder="Rechercher..."
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      @if (isLoading()) {
        <div class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-slate-600">Chargement du journal d'audit...</p>
        </div>
      } @else if (error()) {
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <span class="material-icons text-red-500 text-4xl mb-2">error_outline</span>
          <p class="text-red-700">{{ error() }}</p>
        </div>
      } @else if (auditPage() && auditPage()!.content.length > 0) {
        <!-- STATISTIQUES -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <p class="text-sm text-slate-600 mb-1">Total Entrées</p>
            <p class="text-3xl font-bold text-slate-800">{{ auditPage()!.totalElements }}</p>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <p class="text-sm text-slate-600 mb-1">Page Actuelle</p>
            <p class="text-3xl font-bold text-blue-600">
              {{ auditPage()!.number + 1 }} / {{ auditPage()!.totalPages }}
            </p>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <p class="text-sm text-slate-600 mb-1">Entrées par Page</p>
            <p class="text-3xl font-bold text-slate-800">{{ auditPage()!.size }}</p>
          </div>
        </div>

        <!-- TABLEAU D'AUDIT -->
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-200">
            <h3 class="text-lg font-semibold text-slate-800">Journal d'Audit</h3>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date/Heure</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Utilisateur</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Action</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Entité</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Détails</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-slate-200">
                @for (entry of auditPage()!.content; track entry.id) {
                  <tr class="hover:bg-slate-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {{ entry.timestamp | date:'dd/MM/yyyy HH:mm:ss' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span class="text-blue-600 font-semibold text-xs">
                            {{ getUserInitials(entry.userName) }}
                          </span>
                        </div>
                        <div class="ml-3">
                          <div class="text-sm font-medium text-slate-900">{{ entry.userName }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span [class]="'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ' + getActionClass(entry.action)">
                        {{ getActionLabel(entry.action) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center text-sm text-slate-600">
                        <span class="material-icons text-sm mr-1">{{ getEntityIcon(entry.entity) }}</span>
                        {{ getEntityLabel(entry.entity) }}
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                      {{ entry.details }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- PAGINATION -->
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div class="text-sm text-slate-600">
              Affichage de {{ (auditPage()!.number * auditPage()!.size) + 1 }}
              à {{ Math.min((auditPage()!.number + 1) * auditPage()!.size, auditPage()!.totalElements) }}
              sur {{ auditPage()!.totalElements }} entrées
            </div>
            <div class="flex items-center gap-2">
              <button
                [disabled]="auditPage()!.first"
                (click)="previousPage()"
                class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <span class="text-sm text-slate-600">
                Page {{ auditPage()!.number + 1 }} / {{ auditPage()!.totalPages }}
              </span>
              <button
                [disabled]="auditPage()!.last"
                (click)="nextPage()"
                class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      } @else {
        <div class="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center">
          <span class="material-icons text-slate-300 text-6xl mb-4">history</span>
          <p class="text-slate-600">Aucune entrée d'audit trouvée</p>
        </div>
      }
    </div>
  `
})
export class AuditTrailComponent implements OnInit, OnChanges {
  @Input() filters: ReportFilterRequest = {};

  private reportService = inject(ReportService);

  auditPage = signal<Page<AuditEntry> | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  auditFilters: AuditFilterRequest = {
    page: 0,
    size: 20
  };

  searchQuery = '';

  auditActions: AuditAction[] = ['CREATE', 'UPDATE', 'DELETE', 'VALIDATE', 'PUBLISH', 'GENERATE', 'EXPORT'];
  entityTypes: EntityType[] = ['EMPLOI_DU_TEMPS', 'CRENEAU', 'RESERVATION', 'COURS', 'ENSEIGNANT', 'SALLE', 'GROUPE'];

  protected readonly Math = Math;

  ngOnInit(): void {
    this.loadAuditTrail();
  }

  ngOnChanges(): void {
    this.loadAuditTrail();
  }

  loadAuditTrail(): void {
    this.isLoading.set(true);
    this.error.set(null);

    const combinedFilters: AuditFilterRequest = {
      ...this.auditFilters,
      startDate: this.filters.startDate,
      endDate: this.filters.endDate
    };

    this.reportService.getAuditTrail(combinedFilters).subscribe({
      next: (data) => {
        this.auditPage.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement du journal d\'audit');
        console.error('Audit trail error:', err);
        this.isLoading.set(false);
      }
    });
  }

  nextPage(): void {
    if (!this.auditPage()?.last) {
      this.auditFilters.page = (this.auditFilters.page || 0) + 1;
      this.loadAuditTrail();
    }
  }

  previousPage(): void {
    if (!this.auditPage()?.first && (this.auditFilters.page || 0) > 0) {
      this.auditFilters.page = (this.auditFilters.page || 0) - 1;
      this.loadAuditTrail();
    }
  }

  getActionLabel(action: string): string {
    return AuditActionLabels[action as keyof typeof AuditActionLabels] || action;
  }

  getEntityLabel(entity: string): string {
    return EntityTypeLabels[entity as keyof typeof EntityTypeLabels] || entity;
  }

  getActionClass(action: string): string {
    const classes: Record<string, string> = {
      CREATE: 'bg-green-100 text-green-800',
      UPDATE: 'bg-blue-100 text-blue-800',
      DELETE: 'bg-red-100 text-red-800',
      VALIDATE: 'bg-purple-100 text-purple-800',
      PUBLISH: 'bg-indigo-100 text-indigo-800',
      GENERATE: 'bg-yellow-100 text-yellow-800',
      EXPORT: 'bg-cyan-100 text-cyan-800'
    };
    return classes[action] || 'bg-slate-100 text-slate-800';
  }

  getEntityIcon(entity: string): string {
    const icons: Record<string, string> = {
      EMPLOI_DU_TEMPS: 'calendar_today',
      CRENEAU: 'schedule',
      RESERVATION: 'event',
      COURS: 'school',
      ENSEIGNANT: 'person',
      SALLE: 'meeting_room',
      GROUPE: 'groups'
    };
    return icons[entity] || 'description';
  }

  getUserInitials(userName: string): string {
    const parts = userName.split(' ');
    if (parts.length >= 2) {
      return parts[0].charAt(0) + parts[1].charAt(0);
    }
    return userName.substring(0, 2).toUpperCase();
  }
}
