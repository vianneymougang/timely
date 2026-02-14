import { Component, OnInit, OnChanges, Input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../../../core/services/report.service';
import { AvailabilityReport, ReportFilterRequest } from '../../../../core/models/report.model';

@Component({
  selector: 'app-availability-report',
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
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm opacity-90 mb-1">Total Enseignants</p>
                <p class="text-3xl font-bold">{{ report()!.totalEnseignants }}</p>
              </div>
              <span class="material-icons text-5xl opacity-20">groups</span>
            </div>
          </div>

          <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm opacity-90 mb-1">Avec Disponibilités</p>
                <p class="text-3xl font-bold">{{ report()!.enseignantsAvecDisponibilites }}</p>
              </div>
              <span class="material-icons text-5xl opacity-20">event_available</span>
            </div>
          </div>

          <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm opacity-90 mb-1">Taux de Couverture</p>
                <p class="text-3xl font-bold">{{ report()!.tauxCouverture }}%</p>
              </div>
              <span class="material-icons text-5xl opacity-20">show_chart</span>
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

        <!-- DISPONIBILITÉS PAR JOUR -->
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">
            Disponibilités par Jour de la Semaine
          </h3>
          <div class="space-y-3">
            @for (entry of getDisponibilitesParJour(); track entry.jour) {
              <div class="flex items-center">
                <div class="w-24 text-sm font-medium text-slate-700">{{ entry.jour }}</div>
                <div class="flex-1 bg-slate-100 rounded-full h-8 relative overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-end px-3"
                    [style.width.%]="(entry.count / report()!.totalEnseignants) * 100"
                  >
                    <span class="text-white text-sm font-semibold">{{ entry.count }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- ENSEIGNANTS SANS DISPONIBILITÉS -->
        @if (report()!.enseignantsSansDisponibilites.length > 0) {
          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <span class="material-icons text-orange-500 mr-2">warning</span>
              Enseignants Sans Disponibilités ({{ report()!.enseignantsSansDisponibilites.length }})
            </h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nom</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Spécialité</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-slate-200">
                  @for (enseignant of report()!.enseignantsSansDisponibilites; track enseignant.id) {
                    <tr class="hover:bg-slate-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {{ enseignant.prenom }} {{ enseignant.nom }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {{ enseignant.email }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {{ enseignant.specialite || '-' }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      }
    </div>
  `
})
export class AvailabilityReportComponent implements OnInit, OnChanges {
  @Input() filters: ReportFilterRequest = {};

  private reportService = inject(ReportService);

  report = signal<AvailabilityReport | null>(null);
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

    this.reportService.getAvailabilityReport(this.filters).subscribe({
      next: (data) => {
        this.report.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement du rapport');
        console.error('Availability report error:', err);
        this.isLoading.set(false);
      }
    });
  }

  getDisponibilitesParJour(): Array<{ jour: string; count: number }> {
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

    return Object.entries(this.report()!.disponibilitesParJour).map(([key, value]) => ({
      jour: jours[key] || key,
      count: value
    }));
  }
}
