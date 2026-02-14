import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReportService } from './report.service';
import { environment } from '../../../environments/environment';
import {
  AvailabilityReport,
  RoomUtilizationReport,
  WorkloadReport,
  GlobalKPIs,
  DashboardStats,
  AuditEntry,
  Page
} from '../models/report.model';

describe('ReportService', () => {
  let service: ReportService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/reports`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReportService]
    });
    service = TestBed.inject(ReportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAvailabilityReport', () => {
    it('should fetch availability report', () => {
      const mockReport: AvailabilityReport = {
        totalEnseignants: 50,
        enseignantsAvecDisponibilites: 45,
        tauxCouverture: 90,
        disponibilitesParJour: { MONDAY: 40, TUESDAY: 42 },
        enseignantsSansDisponibilites: [],
        periodeAnalyse: {
          dateDebut: '2026-01-01',
          dateFin: '2026-01-31'
        }
      };

      service.getAvailabilityReport().subscribe(report => {
        expect(report).toEqual(mockReport);
        expect(report.totalEnseignants).toBe(50);
        expect(report.tauxCouverture).toBe(90);
      });

      const req = httpMock.expectOne(`${baseUrl}/availability`);
      expect(req.request.method).toBe('GET');
      req.flush(mockReport);
    });

    it('should include filters in query params', () => {
      const filters = {
        startDate: '2026-01-01',
        endDate: '2026-01-31',
        ecoleId: 'school-123'
      };

      service.getAvailabilityReport(filters).subscribe();

      const req = httpMock.expectOne(request =>
        request.url === `${baseUrl}/availability` &&
        request.params.get('startDate') === '2026-01-01' &&
        request.params.get('endDate') === '2026-01-31' &&
        request.params.get('ecoleId') === 'school-123'
      );
      expect(req.request.method).toBe('GET');
      req.flush({});
    });
  });

  describe('getRoomUtilizationReport', () => {
    it('should fetch room utilization report', () => {
      const mockReport: RoomUtilizationReport = {
        totalSalles: 30,
        tauxOccupationMoyen: 75,
        sallesParType: { 'CM': 10, 'TD': 15, 'TP': 5 },
        topSallesUtilisees: [],
        sallesSousUtilisees: [],
        occupationParJour: {},
        occupationParHoraire: {},
        periodeAnalyse: {
          dateDebut: '2026-01-01',
          dateFin: '2026-01-31'
        }
      };

      service.getRoomUtilizationReport().subscribe(report => {
        expect(report).toEqual(mockReport);
        expect(report.totalSalles).toBe(30);
        expect(report.tauxOccupationMoyen).toBe(75);
      });

      const req = httpMock.expectOne(`${baseUrl}/room-utilization`);
      expect(req.request.method).toBe('GET');
      req.flush(mockReport);
    });
  });

  describe('getGlobalKPIs', () => {
    it('should fetch global KPIs', () => {
      const mockKPIs: GlobalKPIs = {
        totalEnseignants: 50,
        totalSalles: 30,
        totalCours: 120,
        totalReservations: 450,
        tauxOccupationGlobal: 75,
        tauxDisponibilite: 90,
        coursNonPlanifies: 5,
        conflitsActifs: 2,
        tauxUtilisationEnseignants: 85,
        derniereMiseAJour: '2026-02-14T10:00:00Z'
      };

      service.getGlobalKPIs().subscribe(kpis => {
        expect(kpis).toEqual(mockKPIs);
        expect(kpis.totalEnseignants).toBe(50);
        expect(kpis.conflitsActifs).toBe(2);
      });

      const req = httpMock.expectOne(`${baseUrl}/kpis`);
      expect(req.request.method).toBe('GET');
      req.flush(mockKPIs);
    });
  });

  describe('getDashboardStats', () => {
    it('should fetch dashboard stats', () => {
      const mockStats: DashboardStats = {
        kpis: {
          totalEnseignants: 50,
          totalSalles: 30,
          totalCours: 120,
          totalReservations: 450,
          tauxOccupationGlobal: 75,
          tauxDisponibilite: 90,
          coursNonPlanifies: 5,
          conflitsActifs: 2,
          tauxUtilisationEnseignants: 85,
          derniereMiseAJour: '2026-02-14T10:00:00Z'
        },
        recentActivities: [],
        alerts: [],
        chartsData: {
          occupationParJour: { labels: [], datasets: [] },
          chargeParEnseignant: { labels: [], datasets: [] },
          utilisationSalles: { labels: [], datasets: [] },
          tendancesHebdomadaires: { labels: [], datasets: [] }
        }
      };

      service.getDashboardStats().subscribe(stats => {
        expect(stats).toEqual(mockStats);
        expect(stats.kpis.totalEnseignants).toBe(50);
      });

      const req = httpMock.expectOne(`${baseUrl}/dashboard`);
      expect(req.request.method).toBe('GET');
      req.flush(mockStats);
    });
  });

  describe('getAuditTrail', () => {
    it('should fetch audit trail with pagination', () => {
      const mockPage: Page<AuditEntry> = {
        content: [
          {
            id: '1',
            timestamp: '2026-02-14T10:00:00Z',
            userId: 'user-1',
            userName: 'John Doe',
            action: 'CREATE',
            entity: 'EMPLOI_DU_TEMPS',
            entityId: 'edt-1',
            details: 'Création emploi du temps'
          }
        ],
        totalElements: 100,
        totalPages: 5,
        size: 20,
        number: 0,
        first: true,
        last: false,
        empty: false
      };

      const filters = { page: 0, size: 20, action: 'CREATE' as const };

      service.getAuditTrail(filters).subscribe(page => {
        expect(page).toEqual(mockPage);
        expect(page.content.length).toBe(1);
        expect(page.totalElements).toBe(100);
      });

      const req = httpMock.expectOne(request =>
        request.url === `${baseUrl}/audit` &&
        request.params.get('page') === '0' &&
        request.params.get('size') === '20' &&
        request.params.get('action') === 'CREATE'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPage);
    });
  });

  describe('export methods', () => {
    it('should export report as PDF', () => {
      const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' });

      service.exportReportPDF('AVAILABILITY').subscribe(blob => {
        expect(blob).toEqual(mockBlob);
      });

      const req = httpMock.expectOne(`${baseUrl}/export/pdf/AVAILABILITY`);
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('blob');
      req.flush(mockBlob);
    });

    it('should export report as Excel', () => {
      const mockBlob = new Blob(['excel content'], { type: 'application/vnd.ms-excel' });

      service.exportReportExcel('WORKLOAD').subscribe(blob => {
        expect(blob).toEqual(mockBlob);
      });

      const req = httpMock.expectOne(`${baseUrl}/export/excel/WORKLOAD`);
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('blob');
      req.flush(mockBlob);
    });
  });

  describe('helper methods', () => {
    it('should generate correct export filename', () => {
      const filenamePdf = service.generateExportFilename('AVAILABILITY', 'pdf');
      expect(filenamePdf).toMatch(/^rapport-availability-\d{4}-\d{2}-\d{2}\.pdf$/);

      const filenameExcel = service.generateExportFilename('WORKLOAD', 'excel');
      expect(filenameExcel).toMatch(/^rapport-workload-\d{4}-\d{2}-\d{2}\.xlsx$/);
    });
  });
});
