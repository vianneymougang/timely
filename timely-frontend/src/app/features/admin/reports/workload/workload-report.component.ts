import { Component, OnInit, OnChanges, Input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../../../core/services/report.service';
import { WorkloadReport, ReportFilterRequest, WorkloadStatusLabels, WorkloadStatusColors } from '../../../../core/models/report.model';

@Component({
  selector: 'app-workload-report',
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
      } @else if (reports().length > 0) {
        <!-- STATISTIQUES GLOBALES -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <p class="text-sm text-slate-600 mb-1">Total Enseignants</p>
            <p class="text-3xl font-bold text-slate-800">{{ reports().length }}</p>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <p class="text-sm text-slate-600 mb-1">Charge Moyenne</p>
            <p class="text-3xl font-bold text-blue-600">{{ getAverageWorkload() }}%</p>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <p class="text-sm text-slate-600 mb-1">Sous-chargés</p>
            <p class="text-3xl font-bold text-cyan-600">{{ getCountByStatus('SOUS_CHARGE') }}</p>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <p class="text-sm text-slate-600 mb-1">Surchargés</p>
            <p class="text-3xl font-bold text-red-600">{{ getCountByStatus('SURCHARGE') }}</p>
          </div>
        </div>

        <!-- TABLEAU DES CHARGES -->
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-200">
            <h3 class="text-lg font-semibold text-slate-800">Charge Horaire par Enseignant</h3>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Enseignant
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Total Heures
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    CM / TD / TP
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Heures/Semaine
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Taux de Charge
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-slate-200">
                @for (report of reports(); track report.enseignantId) {
                  <tr class="hover:bg-slate-50 cursor-pointer" (click)="selectEnseignant(report)">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span class="text-blue-600 font-semibold text-sm">
                            {{ report.prenom.charAt(0) }}{{ report.nom.charAt(0) }}
                          </span>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-slate-900">
                            {{ report.prenom }} {{ report.nom }}
                          </div>
                          <div class="text-sm text-slate-500">{{ report.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                      {{ report.totalHeures }}h
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {{ report.heuresCM }}h / {{ report.heuresTD }}h / {{ report.heuresTP }}h
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {{ report.heuresParSemaine }}h
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="w-32 bg-slate-100 rounded-full h-6 mr-2 overflow-hidden">
                          <div
                            [class]="'h-full rounded-full flex items-center justify-center text-xs font-semibold text-white ' + getStatusBgClass(report.status)"
                            [style.width.%]="Math.min(report.tauxCharge, 100)"
                          >
                            <span class="px-2">{{ report.tauxCharge }}%</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span [class]="'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ' + getStatusClass(report.status)">
                        {{ getStatusLabel(report.status) }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- DÉTAILS ENSEIGNANT SÉLECTIONNÉ -->
        @if (selectedEnseignant()) {
          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-slate-800">
                Cours assignés - {{ selectedEnseignant()!.prenom }} {{ selectedEnseignant()!.nom }}
              </h3>
              <button
                (click)="closeDetails()"
                class="text-slate-400 hover:text-slate-600"
              >
                <span class="material-icons">close</span>
              </button>
            </div>

            @if (selectedEnseignant()!.coursAssignes.length === 0) {
              <p class="text-slate-500 text-center py-8">Aucun cours assigné</p>
            } @else {
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-200">
                  <thead class="bg-slate-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Code</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Intitulé</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Filière</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Heures</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Groupes</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-slate-200">
                    @for (cours of selectedEnseignant()!.coursAssignes; track cours.coursId) {
                      <tr class="hover:bg-slate-50">
                        <td class="px-4 py-3 text-sm font-medium text-slate-900">{{ cours.code }}</td>
                        <td class="px-4 py-3 text-sm text-slate-600">{{ cours.intitule }}</td>
                        <td class="px-4 py-3 text-sm">
                          <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {{ cours.typeCours }}
                          </span>
                        </td>
                        <td class="px-4 py-3 text-sm text-slate-600">{{ cours.filiereNom }}</td>
                        <td class="px-4 py-3 text-sm font-semibold text-slate-900">{{ cours.heuresTotal }}h</td>
                        <td class="px-4 py-3 text-sm text-slate-600">{{ cours.nombreGroupes }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        }
      } @else {
        <div class="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center">
          <span class="material-icons text-slate-300 text-6xl mb-4">assignment</span>
          <p class="text-slate-600">Aucun rapport de charge horaire disponible</p>
        </div>
      }
    </div>
  `
})
export class WorkloadReportComponent implements OnInit, OnChanges {
  @Input() filters: ReportFilterRequest = {};

  private reportService = inject(ReportService);

  reports = signal<WorkloadReport[]>([]);
  selectedEnseignant = signal<WorkloadReport | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  protected readonly Math = Math;

  ngOnInit(): void {
    this.loadReport();
  }

  ngOnChanges(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.reportService.getAllWorkloadReports(this.filters).subscribe({
      next: (data) => {
        this.reports.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement du rapport');
        console.error('Workload report error:', err);
        this.isLoading.set(false);
      }
    });
  }

  selectEnseignant(report: WorkloadReport): void {
    this.selectedEnseignant.set(report);
  }

  closeDetails(): void {
    this.selectedEnseignant.set(null);
  }

  getAverageWorkload(): number {
    const reports = this.reports();
    if (reports.length === 0) return 0;
    const sum = reports.reduce((acc, r) => acc + r.tauxCharge, 0);
    return Math.round(sum / reports.length);
  }

  getCountByStatus(status: string): number {
    return this.reports().filter(r => r.status === status).length;
  }

  getStatusLabel(status: string): string {
    return WorkloadStatusLabels[status as keyof typeof WorkloadStatusLabels] || status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'SOUS_CHARGE': 'bg-cyan-100 text-cyan-800',
      'NORMAL': 'bg-green-100 text-green-800',
      'SURCHARGE': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-slate-100 text-slate-800';
  }

  getStatusBgClass(status: string): string {
    const classes: Record<string, string> = {
      'SOUS_CHARGE': 'bg-cyan-500',
      'NORMAL': 'bg-green-500',
      'SURCHARGE': 'bg-red-500'
    };
    return classes[status] || 'bg-slate-500';
  }
}
