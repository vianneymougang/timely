import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PlanningService } from './planning.service';
import {
  GeneratePlanningRequest,
  GeneratePlanningResponse,
  EmploiDuTempsResponse,
  PeriodeEmploi,
  StatutEmploi
} from '../models/planning.model';
import { environment } from '../../../environments/environment';

describe('PlanningService', () => {
  let service: PlanningService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/planning/plannings`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlanningService]
    });
    service = TestBed.inject(PlanningService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('generateSchedule', () => {
    it('should generate a schedule and return response', () => {
      const mockRequest: GeneratePlanningRequest = {
        ecoleId: 'ecole-123',
        dateDebut: '2024-09-01',
        dateFin: '2024-12-31',
        periode: 'SEMESTRE_1' as PeriodeEmploi,
        creneauxParJour: 6,
        heureDebutJournee: '08:00',
        heureFinJournee: '18:00',
        dureeCreneauMinutes: 90,
        pauseEntreCreneauxMinutes: 15
      };

      const mockResponse: GeneratePlanningResponse = {
        emploiDuTempsId: 'emploi-123',
        totalCoursAPlanifier: 50,
        coursPlanifies: 48,
        coursNonPlanifies: [],
        tauxReussite: 96,
        conflitsDetectes: 2,
        dureeGenerationMs: 1500
      };

      service.generateSchedule(mockRequest).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.tauxReussite).toBe(96);
        expect(response.coursPlanifies).toBe(48);
      });

      const req = httpMock.expectOne(`${baseUrl}/generate`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);
      req.flush(mockResponse);
    });
  });

  describe('getEmploiDuTempsById', () => {
    it('should fetch an emploi du temps by id', () => {
      const mockId = 'emploi-123';
      const mockResponse: EmploiDuTempsResponse = {
        id: mockId,
        ecoleId: 'ecole-123',
        dateDebut: '2024-09-01',
        dateFin: '2024-12-31',
        periode: 'SEMESTRE_1' as PeriodeEmploi,
        statut: 'DRAFT' as StatutEmploi,
        dateCreation: '2024-08-01T10:00:00',
        notes: 'Test emploi du temps',
        creneaux: [],
        conflits: []
      };

      service.getEmploiDuTempsById(mockId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.id).toBe(mockId);
        expect(response.statut).toBe('DRAFT');
      });

      const req = httpMock.expectOne(`${baseUrl}/${mockId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getAllEmploisDuTemps', () => {
    it('should fetch all emplois du temps with pagination', () => {
      const mockPage = {
        content: [
          {
            id: 'emploi-1',
            ecoleId: 'ecole-123',
            dateDebut: '2024-09-01',
            dateFin: '2024-12-31',
            periode: 'SEMESTRE_1' as PeriodeEmploi,
            statut: 'DRAFT' as StatutEmploi,
            dateCreation: '2024-08-01T10:00:00',
            creneaux: [],
            conflits: []
          }
        ],
        totalElements: 1,
        totalPages: 1,
        size: 20,
        number: 0,
        first: true,
        last: true,
        empty: false
      };

      service.getAllEmploisDuTemps(0, 20).subscribe(response => {
        expect(response.content.length).toBe(1);
        expect(response.totalElements).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}?page=0&size=20`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPage);
    });
  });

  describe('exportToPDF', () => {
    it('should export emploi du temps to PDF', () => {
      const mockId = 'emploi-123';
      const mockBlob = new Blob(['PDF content'], { type: 'application/pdf' });

      service.exportToPDF(mockId).subscribe(blob => {
        expect(blob).toEqual(mockBlob);
        expect(blob.type).toBe('application/pdf');
      });

      const req = httpMock.expectOne(`${baseUrl}/${mockId}/export/pdf`);
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('blob');
      req.flush(mockBlob);
    });
  });

  describe('validateEmploi', () => {
    it('should validate an emploi du temps', () => {
      const mockId = 'emploi-123';
      const mockResponse: EmploiDuTempsResponse = {
        id: mockId,
        ecoleId: 'ecole-123',
        dateDebut: '2024-09-01',
        dateFin: '2024-12-31',
        periode: 'SEMESTRE_1' as PeriodeEmploi,
        statut: 'VALIDATED' as StatutEmploi,
        dateCreation: '2024-08-01T10:00:00',
        creneaux: [],
        conflits: []
      };

      service.validateEmploi(mockId).subscribe(response => {
        expect(response.statut).toBe('VALIDATED');
      });

      const req = httpMock.expectOne(`${baseUrl}/${mockId}/validate`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockResponse);
    });
  });

  describe('getConflitsByEmploi', () => {
    it('should fetch conflicts for an emploi du temps', () => {
      const mockId = 'emploi-123';
      const mockConflits = [
        {
          id: 'conflit-1',
          emploiDuTempsId: mockId,
          typeConflit: 'ENSEIGNANT' as any,
          description: 'Conflit enseignant',
          severite: 'MOYENNE' as any,
          statutResolution: 'NON_RESOLU' as any,
          dateDetection: '2024-08-01T10:00:00'
        }
      ];

      service.getConflitsByEmploi(mockId).subscribe(conflits => {
        expect(conflits.length).toBe(1);
        expect(conflits[0].typeConflit).toBe('ENSEIGNANT');
      });

      const req = httpMock.expectOne(`${baseUrl}/${mockId}/conflits`);
      expect(req.request.method).toBe('GET');
      req.flush(mockConflits);
    });
  });

  describe('downloadFile', () => {
    it('should trigger file download', () => {
      const mockBlob = new Blob(['test content'], { type: 'application/pdf' });
      const mockFilename = 'test.pdf';

      spyOn(window.URL, 'createObjectURL').and.returnValue('mock-url');
      spyOn(window.URL, 'revokeObjectURL');

      const link = document.createElement('a');
      spyOn(document, 'createElement').and.returnValue(link);
      spyOn(link, 'click');

      service.downloadFile(mockBlob, mockFilename);

      expect(window.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(link.download).toBe(mockFilename);
      expect(link.click).toHaveBeenCalled();
      expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
    });
  });
});
