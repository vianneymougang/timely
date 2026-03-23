import { Component, OnInit, OnChanges, Input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../../../core/services/report.service';
import { RoomUtilizationReport, ReportFilterRequest } from '../../../../core/models/report.model';

@Component({
  selector: 'app-room-utilization-report',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      @if (isLoading()) {
        <div class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-slate-600">Chargement du rapport...</p>
        </div>
      } @else if (error()) {
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <span class="material-icons text-red-500 text-4xl mb-2">error_outline</span>
          <p class="text-red-700">{{ error() }}</p>
        </div>
      } @else if (report()) {
        <!-- RÉSUMÉ -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm opacity-90 mb-1">Total Salles</p>
                <p class="text-3xl font-bold">{{ report()!.totalSalles }}</p>
              </div>
              <span class="material-icons text-5xl opacity-20">meeting_room</span>
            </div>
          </div>

          <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm opacity-90 mb-1">Taux d'Occupation Moyen</p>
                <p class="text-3xl font-bold">{{ report()!.tauxOccupationMoyen }}%</p>
              </div>
              <span class="material-icons text-5xl opacity-20">bar_chart</span>
            </div>
          </div>
        </div>

        <!-- PÉRIODE D'ANALYSE -->
        <div class="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <p class="text-sm text-slate-600">
            <span class="font-semibold">Période analysée :</span>
            Du {{ report()!.periodeAnalyse.dateDebut | date:'dd/MM/yyyy' }}
            au {{ report()!.periodeAnalyse.dateFin | date:'dd/MM/yyyy' }}
          </p>
        </div>

        <!-- SALLES PAR TYPE -->
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Répartition par Type de Salle</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            @for (entry of getSallesParType(); track entry.type) {
              <div class="text-center p-4 bg-slate-50 rounded-lg">
                <p class="text-2xl font-bold text-blue-600">{{ entry.count }}</p>
                <p class="text-sm text-slate-600 mt-1">{{ entry.type }}</p>
              </div>
            }
          </div>
        </div>

        <!-- TOP SALLES UTILISÉES -->
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <span class="material-icons text-green-500 mr-2">trending_up</span>
            Salles les Plus Utilisées
          </h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Salle</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Capacité</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Occupation</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Réservations</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-slate-200">
                @for (salle of report()!.topSallesUtilisees; track salle.salleId) {
                  <tr class="hover:bg-slate-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <span class="material-icons text-blue-500 mr-2">door_front</span>
                        <div>
                          <div class="text-sm font-medium text-slate-900">{{ salle.nomSalle }}</div>
                          <div class="text-xs text-slate-500">{{ salle.batiment }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {{ salle.typeSalle }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {{ salle.capacite }} places
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="w-32 bg-slate-100 rounded-full h-6 mr-2 overflow-hidden">
                          <div
                            class="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                            [style.width.%]="salle.tauxOccupation"
                          >
                            <span class="px-2">{{ salle.tauxOccupation }}%</span>
                          </div>
                        </div>
                      </div>
                      <p class="text-xs text-slate-500 mt-1">
                        {{ salle.heuresOccupees }}h / {{ salle.heuresDisponibles }}h
                      </p>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                      {{ salle.nombreReservations }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- SALLES SOUS-UTILISÉES -->
        @if (report()!.sallesSousUtilisees.length > 0) {
          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <span class="material-icons text-orange-500 mr-2">trending_down</span>
              Salles Sous-Utilisées
            </h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Salle</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Capacité</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Occupation</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-slate-200">
                  @for (salle of report()!.sallesSousUtilisees; track salle.salleId) {
                    <tr class="hover:bg-slate-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <span class="material-icons text-orange-500 mr-2">door_front</span>
                          <div>
                            <div class="text-sm font-medium text-slate-900">{{ salle.nomSalle }}</div>
                            <div class="text-xs text-slate-500">{{ salle.batiment }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {{ salle.typeSalle }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {{ salle.capacite }} places
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="w-32 bg-slate-100 rounded-full h-6 mr-2 overflow-hidden">
                            <div
                              class="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                              [style.width.%]="salle.tauxOccupation"
                            >
                              <span class="px-2">{{ salle.tauxOccupation }}%</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- OCCUPATION PAR JOUR -->
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Occupation Moyenne par Jour</h3>
          <div class="space-y-3">
            @for (entry of getOccupationParJour(); track entry.jour) {
              <div class="flex items-center">
                <div class="w-24 text-sm font-medium text-slate-700">{{ entry.jour }}</div>
                <div class="flex-1 bg-slate-100 rounded-full h-8 relative overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-end px-3"
                    [style.width.%]="entry.taux"
                  >
                    <span class="text-white text-sm font-semibold">{{ entry.taux }}%</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class RoomUtilizationReportComponent implements OnInit, OnChanges {
  @Input() filters: ReportFilterRequest = {};

  private reportService = inject(ReportService);

  report = signal<RoomUtilizationReport | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadReport();
  }

  ngOnChanges(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.reportService.getRoomUtilizationReport(this.filters).subscribe({
      next: (data) => {
        this.report.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement du rapport');
        console.error('Room utilization report error:', err);
        this.isLoading.set(false);
      }
    });
  }

  getSallesParType(): Array<{ type: string; count: number }> {
    if (!this.report()) return [];
    return Object.entries(this.report()!.sallesParType).map(([type, count]) => ({
      type,
      count
    }));
  }

  getOccupationParJour(): Array<{ jour: string; taux: number }> {
    if (!this.report()) return [];

    const jours: Record<string, string> = {
      'MONDAY': 'Lundi',
      'TUESDAY': 'Mardi',
      'WEDNESDAY': 'Mercredi',
      'THURSDAY': 'Jeudi',
      'FRIDAY': 'Vendredi',
      'SATURDAY': 'Samedi',
      'SUNDAY': 'Dimanche'
    };

    return Object.entries(this.report()!.occupationParJour).map(([key, taux]) => ({
      jour: jours[key] || key,
      taux
    }));
  }
}
