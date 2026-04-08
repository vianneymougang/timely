import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CampusGenerationRequest,
  CampusGenerationResponse,
  ConflitResponse,
  CreneauRequest,
  CreneauResponse,
  EmploiDuTempsRequest,
  EmploiDuTempsResponse,
  GeneratePlanningRequest,
  GeneratePlanningResponse,
  Page,
  SearchPlanningRequest,
} from '../models/planning.model';

@Injectable({
  providedIn: 'root',
})
export class PlanningService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/planning/plannings`;

  /**
   * Génère automatiquement un emploi du temps
   */
  generateSchedule(request: GeneratePlanningRequest): Observable<GeneratePlanningResponse> {
    return this.http.post<GeneratePlanningResponse>(`${this.baseUrl}/generate`, request);
  }

  /**
   * Génère les emplois du temps pour tout le campus
   */
  generateCampusSchedule(request: CampusGenerationRequest): Observable<CampusGenerationResponse> {
    return this.http.post<CampusGenerationResponse>(`${this.baseUrl}/generate/campus`, request);
  }

  /**
   * Récupère les créneaux d'un enseignant pour une semaine donnée (toutes écoles)
   */
  getCreneauxByEnseignant(enseignantId: string, weekStart: string): Observable<CreneauResponse[]> {
    const params = new HttpParams().set('weekStart', weekStart);
    return this.http.get<CreneauResponse[]>(`${this.baseUrl}/enseignant/${enseignantId}`, {
      params,
    });
  }

  /**
   * Crée un emploi du temps manuellement
   */
  createEmploiDuTemps(request: EmploiDuTempsRequest): Observable<EmploiDuTempsResponse> {
    return this.http.post<EmploiDuTempsResponse>(this.baseUrl, request);
  }

  /**
   * Récupère un emploi du temps par son ID
   */
  getEmploiDuTempsById(id: string): Observable<EmploiDuTempsResponse> {
    return this.http.get<EmploiDuTempsResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Récupère tous les emplois du temps avec pagination
   */
  getAllEmploisDuTemps(
    page: number = 0,
    size: number = 20,
  ): Observable<Page<EmploiDuTempsResponse>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<Page<EmploiDuTempsResponse>>(this.baseUrl, { params });
  }

  /**
   * Recherche avancée d'emplois du temps
   */
  searchEmploisDuTemps(request: SearchPlanningRequest): Observable<Page<EmploiDuTempsResponse>> {
    let params = new HttpParams();

    if (request.dateDebut) params = params.set('dateDebut', request.dateDebut);
    if (request.dateFin) params = params.set('dateFin', request.dateFin);
    if (request.ecoleId) params = params.set('ecoleId', request.ecoleId);
    if (request.statut) params = params.set('statut', request.statut);
    if (request.periode) params = params.set('periode', request.periode);
    if (request.page !== undefined) params = params.set('page', request.page.toString());
    if (request.size !== undefined) params = params.set('size', request.size.toString());

    return this.http.get<Page<EmploiDuTempsResponse>>(`${this.baseUrl}/search`, { params });
  }

  /**
   * Met à jour un emploi du temps
   */
  updateEmploiDuTemps(
    id: string,
    request: EmploiDuTempsRequest,
  ): Observable<EmploiDuTempsResponse> {
    return this.http.put<EmploiDuTempsResponse>(`${this.baseUrl}/${id}`, request);
  }

  /**
   * Supprime un emploi du temps
   */
  deleteEmploiDuTemps(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Valide un emploi du temps
   */
  validateEmploi(id: string): Observable<EmploiDuTempsResponse> {
    return this.http.put<EmploiDuTempsResponse>(`${this.baseUrl}/${id}/validate`, {});
  }

  /**
   * Publie un emploi du temps
   */
  publishEmploi(id: string): Observable<EmploiDuTempsResponse> {
    return this.http.put<EmploiDuTempsResponse>(`${this.baseUrl}/${id}/publish`, {});
  }

  // ==================== CRUD Créneaux ====================

  /**
   * Crée un créneau dans un emploi du temps
   */
  createCreneau(emploiId: string, request: CreneauRequest): Observable<CreneauResponse> {
    return this.http.post<CreneauResponse>(`${this.baseUrl}/${emploiId}/creneaux`, request);
  }

  /**
   * Récupère les créneaux d'un emploi du temps
   */
  getCreneauxByEmploi(
    emploiId: string,
    page: number = 0,
    size: number = 20,
  ): Observable<Page<CreneauResponse>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<Page<CreneauResponse>>(`${this.baseUrl}/${emploiId}/creneaux`, { params });
  }

  /**
   * Récupère un créneau par son ID
   */
  getCreneauById(emploiId: string, creneauId: string): Observable<CreneauResponse> {
    return this.http.get<CreneauResponse>(`${this.baseUrl}/${emploiId}/creneaux/${creneauId}`);
  }

  /**
   * Met à jour un créneau
   */
  updateCreneau(
    emploiId: string,
    creneauId: string,
    request: CreneauRequest,
  ): Observable<CreneauResponse> {
    return this.http.put<CreneauResponse>(
      `${this.baseUrl}/${emploiId}/creneaux/${creneauId}`,
      request,
    );
  }

  /**
   * Supprime un créneau
   */
  deleteCreneau(emploiId: string, creneauId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${emploiId}/creneaux/${creneauId}`);
  }

  // ==================== Conflits ====================

  /**
   * Récupère les conflits d'un emploi du temps
   */
  getConflitsByEmploi(emploiId: string): Observable<ConflitResponse[]> {
    return this.http.get<ConflitResponse[]>(`${this.baseUrl}/${emploiId}/conflits`);
  }

  /**
   * Récupère un conflit par son ID
   */
  getConflitById(emploiId: string, conflitId: string): Observable<ConflitResponse> {
    return this.http.get<ConflitResponse>(`${this.baseUrl}/${emploiId}/conflits/${conflitId}`);
  }

  /**
   * Compte les conflits non résolus d'un emploi du temps
   */
  countNonResolus(emploiId: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${emploiId}/conflits/count-non-resolus`);
  }

  /**
   * Résout un conflit
   */
  resolveConflit(
    emploiId: string,
    conflitId: string,
    resolution: string,
  ): Observable<ConflitResponse> {
    return this.http.put<ConflitResponse>(
      `${this.baseUrl}/${emploiId}/conflits/${conflitId}/resolve`,
      resolution,
    );
  }

  // ==================== Export ====================

  /**
   * Exporte un emploi du temps en PDF
   */
  exportToPDF(id: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/export/pdf`, {
      responseType: 'blob',
    });
  }

  /**
   * Exporte un emploi du temps en iCal
   */
  exportToICal(id: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/export/ical`, {
      responseType: 'blob',
    });
  }

  // ==================== Helpers ====================

  /**
   * Télécharge un fichier blob
   */
  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
