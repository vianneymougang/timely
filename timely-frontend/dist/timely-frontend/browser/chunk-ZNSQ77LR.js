import {
  environment
} from "./chunk-AL3K22XE.js";
import {
  HttpClient,
  HttpParams
} from "./chunk-GGDRA3L4.js";
import {
  Injectable,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-DBHCOGA3.js";

// src/app/core/services/report.service.ts
var ReportService = class _ReportService {
  http = inject(HttpClient);
  baseUrl = `${environment.apiUrl}/reports`;
  // ==================== Rapports Principaux ====================
  /**
   * Récupère le rapport de disponibilités des enseignants
   */
  getAvailabilityReport(filters = {}) {
    const params = this.buildHttpParams(filters);
    return this.http.get(`${this.baseUrl}/availability`, { params });
  }
  /**
   * Récupère le rapport d'utilisation des salles
   */
  getRoomUtilizationReport(filters = {}) {
    const params = this.buildHttpParams(filters);
    return this.http.get(`${this.baseUrl}/room-utilization`, { params });
  }
  /**
   * Récupère le rapport de charge horaire pour un enseignant
   */
  getTeacherWorkloadReport(enseignantId, filters = {}) {
    const params = this.buildHttpParams(filters);
    return this.http.get(`${this.baseUrl}/workload/${enseignantId}`, { params });
  }
  /**
   * Récupère le rapport de charge horaire pour tous les enseignants
   */
  getAllWorkloadReports(filters = {}) {
    const params = this.buildHttpParams(filters);
    return this.http.get(`${this.baseUrl}/workload`, { params });
  }
  // ==================== KPIs & Dashboard ====================
  /**
   * Récupère les KPIs globaux du système
   */
  getGlobalKPIs() {
    return this.http.get(`${this.baseUrl}/kpis`);
  }
  /**
   * Récupère les statistiques du tableau de bord
   * Inclut KPIs, activités récentes, alertes et données de graphiques
   */
  getDashboardStats() {
    return this.http.get(`${this.baseUrl}/dashboard`);
  }
  // ==================== Export PDF/Excel ====================
  /**
   * Exporte un rapport en PDF
   */
  exportReportPDF(reportType, filters = {}) {
    const params = this.buildHttpParams(filters);
    return this.http.get(`${this.baseUrl}/export/pdf/${reportType}`, {
      params,
      responseType: "blob"
    });
  }
  /**
   * Exporte un rapport en Excel
   */
  exportReportExcel(reportType, filters = {}) {
    const params = this.buildHttpParams(filters);
    return this.http.get(`${this.baseUrl}/export/excel/${reportType}`, {
      params,
      responseType: "blob"
    });
  }
  /**
   * Exporte le rapport de disponibilités en PDF
   */
  exportAvailabilityPDF(filters = {}) {
    return this.exportReportPDF("AVAILABILITY", filters);
  }
  /**
   * Exporte le rapport d'utilisation des salles en PDF
   */
  exportRoomUtilizationPDF(filters = {}) {
    return this.exportReportPDF("ROOM_UTILIZATION", filters);
  }
  /**
   * Exporte le rapport de charge horaire en Excel
   */
  exportWorkloadExcel(filters = {}) {
    return this.exportReportExcel("WORKLOAD", filters);
  }
  // ==================== Audit Trail ====================
  /**
   * Récupère le journal d'audit avec pagination et filtres
   */
  getAuditTrail(filters = {}) {
    let params = new HttpParams();
    if (filters.startDate)
      params = params.set("startDate", filters.startDate);
    if (filters.endDate)
      params = params.set("endDate", filters.endDate);
    if (filters.userId)
      params = params.set("userId", filters.userId);
    if (filters.action)
      params = params.set("action", filters.action);
    if (filters.entity)
      params = params.set("entity", filters.entity);
    if (filters.entityId)
      params = params.set("entityId", filters.entityId);
    if (filters.page !== void 0)
      params = params.set("page", filters.page.toString());
    if (filters.size !== void 0)
      params = params.set("size", filters.size.toString());
    return this.http.get(`${this.baseUrl}/audit`, { params });
  }
  /**
   * Récupère une entrée d'audit par son ID
   */
  getAuditEntryById(id) {
    return this.http.get(`${this.baseUrl}/audit/${id}`);
  }
  // ==================== Statistiques Spécifiques ====================
  /**
   * Récupère le taux d'occupation global des salles
   */
  getGlobalRoomOccupancyRate() {
    return this.http.get(`${this.baseUrl}/stats/room-occupancy-rate`);
  }
  /**
   * Récupère le nombre de cours non planifiés
   */
  getUnplannedCoursesCount() {
    return this.http.get(`${this.baseUrl}/stats/unplanned-courses`);
  }
  /**
   * Récupère le nombre de conflits actifs
   */
  getActiveConflictsCount() {
    return this.http.get(`${this.baseUrl}/stats/active-conflicts`);
  }
  // ==================== Helpers ====================
  /**
   * Construit les HttpParams à partir d'un objet de filtres
   */
  buildHttpParams(filters) {
    let params = new HttpParams();
    if (filters.startDate)
      params = params.set("startDate", filters.startDate);
    if (filters.endDate)
      params = params.set("endDate", filters.endDate);
    if (filters.ecoleId)
      params = params.set("ecoleId", filters.ecoleId);
    if (filters.filiereId)
      params = params.set("filiereId", filters.filiereId);
    if (filters.enseignantId)
      params = params.set("enseignantId", filters.enseignantId);
    if (filters.salleId)
      params = params.set("salleId", filters.salleId);
    if (filters.page !== void 0)
      params = params.set("page", filters.page.toString());
    if (filters.size !== void 0)
      params = params.set("size", filters.size.toString());
    return params;
  }
  /**
   * Télécharge un fichier blob avec un nom spécifié
   */
  downloadFile(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
  /**
   * Génère un nom de fichier pour un export
   */
  generateExportFilename(reportType, format) {
    const date = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const extension = format === "pdf" ? "pdf" : "xlsx";
    const reportName = reportType.toLowerCase().replace(/_/g, "-");
    return `rapport-${reportName}-${date}.${extension}`;
  }
  static \u0275fac = function ReportService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ReportService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ReportService, factory: _ReportService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ReportService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/core/models/report.model.ts
var WorkloadStatusLabels = {
  SOUS_CHARGE: "Sous-charg\xE9",
  NORMAL: "Normal",
  SURCHARGE: "Surcharg\xE9"
};
var AlertSeverityLabels = {
  INFO: "Information",
  WARNING: "Avertissement",
  ERROR: "Erreur",
  CRITICAL: "Critique"
};
var AuditActionLabels = {
  CREATE: "Cr\xE9ation",
  UPDATE: "Modification",
  DELETE: "Suppression",
  VALIDATE: "Validation",
  PUBLISH: "Publication",
  GENERATE: "G\xE9n\xE9ration",
  EXPORT: "Export"
};
var EntityTypeLabels = {
  EMPLOI_DU_TEMPS: "Emploi du temps",
  CRENEAU: "Cr\xE9neau",
  RESERVATION: "R\xE9servation",
  COURS: "Cours",
  ENSEIGNANT: "Enseignant",
  SALLE: "Salle",
  GROUPE: "Groupe"
};
var ChartColors = {
  primary: "#3b82f6",
  // blue-500
  success: "#10b981",
  // green-500
  warning: "#f59e0b",
  // amber-500
  danger: "#ef4444",
  // red-500
  info: "#06b6d4",
  // cyan-500
  purple: "#8b5cf6",
  // violet-500
  pink: "#ec4899",
  // pink-500
  gray: "#6b7280"
  // gray-500
};
var WorkloadStatusColors = {
  SOUS_CHARGE: ChartColors.info,
  NORMAL: ChartColors.success,
  SURCHARGE: ChartColors.danger
};
var AlertSeverityColors = {
  INFO: ChartColors.info,
  WARNING: ChartColors.warning,
  ERROR: ChartColors.danger,
  CRITICAL: ChartColors.purple
};

export {
  WorkloadStatusLabels,
  AlertSeverityLabels,
  AuditActionLabels,
  EntityTypeLabels,
  ReportService
};
//# sourceMappingURL=chunk-ZNSQ77LR.js.map
