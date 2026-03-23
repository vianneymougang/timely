import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../../../core/services/report.service';
import { ReportType } from '../../../core/models/report.model';
import { AvailabilityReportComponent } from './availability/availability-report.component';
import { WorkloadReportComponent } from './workload/workload-report.component';
import { RoomUtilizationReportComponent } from './rooms/room-utilization-report.component';
import { AuditTrailComponent } from './audit/audit-trail.component';

type TabType = 'availability' | 'rooms' | 'workload' | 'audit';

interface Tab {
  id: TabType;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AvailabilityReportComponent,
    WorkloadReportComponent,
    RoomUtilizationReportComponent,
    AuditTrailComponent
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private reportService = inject(ReportService);

  tabs: Tab[] = [
    { id: 'availability', label: 'Disponibilités', icon: 'event_available' },
    { id: 'rooms', label: 'Salles', icon: 'meeting_room' },
    { id: 'workload', label: 'Charge Horaire', icon: 'schedule' },
    { id: 'audit', label: 'Audit', icon: 'history' }
  ];

  activeTab = signal<TabType>('availability');
  filterForm: FormGroup;

  constructor() {
    // Initialiser le formulaire de filtres
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      ecoleId: [''],
      filiereId: [''],
      enseignantId: [''],
      salleId: ['']
    });
  }

  ngOnInit(): void {
    // Récupérer l'onglet depuis l'URL
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'] as TabType;
      if (tab && this.tabs.some(t => t.id === tab)) {
        this.activeTab.set(tab);
      }
    });
  }

  /**
   * Change l'onglet actif
   */
  selectTab(tabId: TabType): void {
    this.activeTab.set(tabId);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabId },
      queryParamsHandling: 'merge'
    });
  }

  /**
   * Applique les filtres
   */
  applyFilters(): void {
    // Les composants enfants réagiront aux changements
  }

  /**
   * Réinitialise les filtres
   */
  resetFilters(): void {
    this.filterForm.reset();
  }

  /**
   * Exporte le rapport actif
   */
  exportReport(format: 'pdf' | 'excel'): void {
    const filters = this.filterForm.value;
    const reportType = this.getReportType(this.activeTab());

    if (!reportType) return;

    const exportMethod = format === 'pdf'
      ? this.reportService.exportReportPDF(reportType, filters)
      : this.reportService.exportReportExcel(reportType, filters);

    exportMethod.subscribe({
      next: (blob: Blob) => {
        const filename = this.reportService.generateExportFilename(reportType, format);
        this.reportService.downloadFile(blob, filename);
      },
      error: (err) => {
        console.error('Export error:', err);
        alert('Erreur lors de l\'export du rapport');
      }
    });
  }

  /**
   * Convertit le type d'onglet en ReportType
   */
  private getReportType(tab: TabType): ReportType | null {
    const mapping: Record<TabType, ReportType | null> = {
      availability: 'AVAILABILITY',
      rooms: 'ROOM_UTILIZATION',
      workload: 'WORKLOAD',
      audit: 'AUDIT'
    };
    return mapping[tab];
  }
}
