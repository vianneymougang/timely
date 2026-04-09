import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AvailabilityReport,
  RoomUtilizationReport,
  WorkloadReport,
  GlobalKPIs,
  DashboardStats,
  AuditEntry,
  ReportFilterRequest,
  AuditFilterRequest,
  Page,
  ReportType
} from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/reports`;

  // ==================== Rapports Principaux ====================

  /**
   * Récupère le rapport de disponibilités des enseignants
   */
  getAvailabilityReport(filters: ReportFilterRequest = {}): Observable<AvailabilityReport> {
    const params = this.buildHttpParams(filters);
    return this.http.get<AvailabilityReport>(`${this.baseUrl}/availability`, { params });
  }

  /**
   * Récupère le rapport d'utilisation des salles
   */
  getRoomUtilizationReport(filters: ReportFilterRequest = {}): Observable<RoomUtilizationReport> {
    const params = this.buildHttpParams(filters);
    return this.http.get<RoomUtilizationReport>(`${this.baseUrl}/room-utilization`, { params });
  }

  /**
   * Récupère le rapport de charge horaire pour un enseignant
   */
  getTeacherWorkloadReport(enseignantId: string, filters: ReportFilterRequest = {}): Observable<WorkloadReport> {
    const params = this.buildHttpParams(filters);
    return this.http.get<WorkloadReport>(`${this.baseUrl}/workload/${enseignantId}`, { params });
  }

  /**
   * Récupère le rapport de charge horaire pour tous les enseignants
   */
  getAllWorkloadReports(filters: ReportFilterRequest = {}): Observable<WorkloadReport[]> {
    const params = this.buildHttpParams(filters);
    return this.http.get<WorkloadReport[]>(`${this.baseUrl}/workload`, { params });
  }

  // ==================== KPIs & Dashboard ====================

  /**
   * Récupère les KPIs globaux du système
   */
  getGlobalKPIs(): Observable<GlobalKPIs> {
    return this.http.get<GlobalKPIs>(`${this.baseUrl}/kpis`);
  }

  /**
   * Récupère les statistiques du tableau de bord
   * Inclut KPIs, activités récentes, alertes et données de graphiques
   */
  getDashboardStats(ecoleId?: string): Observable<DashboardStats> {
    let params = new HttpParams();
    if (ecoleId) {
      params = params.set('ecoleId', ecoleId);
    }
    return this.http.get<DashboardStats>(`${this.baseUrl}/dashboard`, { params });
  }

  // ==================== Export PDF/Excel ====================

  /**
   * Exporte un rapport en PDF
   */
  exportReportPDF(reportType: ReportType, filters: ReportFilterRequest = {}): Observable<Blob> {
    const params = this.buildHttpParams(filters);
    return this.http.get(`${this.baseUrl}/export/pdf/${reportType}`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Exporte un rapport en Excel
   */
  exportReportExcel(reportType: ReportType, filters: ReportFilterRequest = {}): Observable<Blob> {
    const params = this.buildHttpParams(filters);
    return this.http.get(`${this.baseUrl}/export/excel/${reportType}`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Exporte le rapport de disponibilités en PDF
   */
  exportAvailabilityPDF(filters: ReportFilterRequest = {}): Observable<Blob> {
    return this.exportReportPDF('AVAILABILITY', filters);
  }

  /**
   * Exporte le rapport d'utilisation des salles en PDF
   */
  exportRoomUtilizationPDF(filters: ReportFilterRequest = {}): Observable<Blob> {
    return this.exportReportPDF('ROOM_UTILIZATION', filters);
  }

  /**
   * Exporte le rapport de charge horaire en Excel
   */
  exportWorkloadExcel(filters: ReportFilterRequest = {}): Observable<Blob> {
    return this.exportReportExcel('WORKLOAD', filters);
  }

  // ==================== Audit Trail ====================

  /**
   * Récupère le journal d'audit avec pagination et filtres
   */
  getAuditTrail(filters: AuditFilterRequest = {}): Observable<Page<AuditEntry>> {
    let params = new HttpParams();

    if (filters.startDate) params = params.set('startDate', filters.startDate);
    if (filters.endDate) params = params.set('endDate', filters.endDate);
    if (filters.userId) params = params.set('userId', filters.userId);
    if (filters.action) params = params.set('action', filters.action);
    if (filters.entity) params = params.set('entity', filters.entity);
    if (filters.entityId) params = params.set('entityId', filters.entityId);
    if (filters.page !== undefined) params = params.set('page', filters.page.toString());
    if (filters.size !== undefined) params = params.set('size', filters.size.toString());

    return this.http.get<Page<AuditEntry>>(`${this.baseUrl}/audit`, { params });
  }

  /**
   * Récupère une entrée d'audit par son ID
   */
  getAuditEntryById(id: string): Observable<AuditEntry> {
    return this.http.get<AuditEntry>(`${this.baseUrl}/audit/${id}`);
  }

  // ==================== Statistiques Spécifiques ====================

  /**
   * Récupère le taux d'occupation global des salles
   */
  getGlobalRoomOccupancyRate(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/stats/room-occupancy-rate`);
  }

  /**
   * Récupère le nombre de cours non planifiés
   */
  getUnplannedCoursesCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/stats/unplanned-courses`);
  }

  /**
   * Récupère le nombre de conflits actifs
   */
  getActiveConflictsCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/stats/active-conflicts`);
  }

  // ==================== Helpers ====================

  /**
   * Construit les HttpParams à partir d'un objet de filtres
   */
  private buildHttpParams(filters: ReportFilterRequest): HttpParams {
    let params = new HttpParams();

    if (filters.startDate) params = params.set('startDate', filters.startDate);
    if (filters.endDate) params = params.set('endDate', filters.endDate);
    if (filters.ecoleId) params = params.set('ecoleId', filters.ecoleId);
    if (filters.filiereId) params = params.set('filiereId', filters.filiereId);
    if (filters.enseignantId) params = params.set('enseignantId', filters.enseignantId);
    if (filters.salleId) params = params.set('salleId', filters.salleId);
    if (filters.page !== undefined) params = params.set('page', filters.page.toString());
    if (filters.size !== undefined) params = params.set('size', filters.size.toString());

    return params;
  }

  /**
   * Télécharge un fichier blob avec un nom spécifié
   */
  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Génère un nom de fichier pour un export
   */
  generateExportFilename(reportType: ReportType, format: 'pdf' | 'excel'): string {
    const date = new Date().toISOString().split('T')[0];
    const extension = format === 'pdf' ? 'pdf' : 'xlsx';
    const reportName = reportType.toLowerCase().replace(/_/g, '-');
    return `rapport-${reportName}-${date}.${extension}`;
  }
}
