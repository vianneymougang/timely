import {
  ActivatedRoute,
  Router
} from "./chunk-SG7N3ZM6.js";
import {
  AuditActionLabels,
  EntityTypeLabels,
  ReportService,
  WorkloadStatusLabels
} from "./chunk-ZNSQ77LR.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgModel,
  NgSelectOption,
  ReactiveFormsModule,
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-Y74VR2WI.js";
import "./chunk-AL3K22XE.js";
import {
  CommonModule,
  DatePipe
} from "./chunk-GGDRA3L4.js";
import {
  Component,
  Input,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-DBHCOGA3.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/features/admin/reports/availability/availability-report.component.ts
var _forTrack0 = ($index, $item) => $item.jour;
var _forTrack1 = ($index, $item) => $item.id;
function AvailabilityReportComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 1);
    \u0275\u0275domElement(1, "div", 3);
    \u0275\u0275domElementStart(2, "p", 4);
    \u0275\u0275text(3, "Chargement du rapport...");
    \u0275\u0275domElementEnd()();
  }
}
function AvailabilityReportComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 2)(1, "span", 5);
    \u0275\u0275text(2, "error_outline");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(3, "p", 6);
    \u0275\u0275text(4);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function AvailabilityReportComponent_Conditional_3_For_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 21)(1, "div", 22);
    \u0275\u0275text(2);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(3, "div", 23)(4, "div", 24)(5, "span", 25);
    \u0275\u0275text(6);
    \u0275\u0275domElementEnd()()()();
  }
  if (rf & 2) {
    const entry_r2 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(entry_r2.jour);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", entry_r2.count / ctx_r0.report().totalEnseignants * 100, "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(entry_r2.count);
  }
}
function AvailabilityReportComponent_Conditional_3_Conditional_41_For_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "tr", 33)(1, "td", 34);
    \u0275\u0275text(2);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(3, "td", 35);
    \u0275\u0275text(4);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(5, "td", 35);
    \u0275\u0275text(6);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const enseignant_r3 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", enseignant_r3.prenom, " ", enseignant_r3.nom, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", enseignant_r3.email, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", enseignant_r3.specialite || "-", " ");
  }
}
function AvailabilityReportComponent_Conditional_3_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 18)(1, "h3", 26)(2, "span", 27);
    \u0275\u0275text(3, "warning");
    \u0275\u0275domElementEnd();
    \u0275\u0275text(4);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(5, "div", 28)(6, "table", 29)(7, "thead", 30)(8, "tr")(9, "th", 31);
    \u0275\u0275text(10, "Nom");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(11, "th", 31);
    \u0275\u0275text(12, "Email");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(13, "th", 31);
    \u0275\u0275text(14, "Sp\xE9cialit\xE9");
    \u0275\u0275domElementEnd()()();
    \u0275\u0275domElementStart(15, "tbody", 32);
    \u0275\u0275repeaterCreate(16, AvailabilityReportComponent_Conditional_3_Conditional_41_For_17_Template, 7, 4, "tr", 33, _forTrack1);
    \u0275\u0275domElementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" Enseignants Sans Disponibilit\xE9s (", ctx_r0.report().enseignantsSansDisponibilites.length, ") ");
    \u0275\u0275advance(12);
    \u0275\u0275repeater(ctx_r0.report().enseignantsSansDisponibilites);
  }
}
function AvailabilityReportComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 7)(1, "div", 8)(2, "div", 9)(3, "div")(4, "p", 10);
    \u0275\u0275text(5, "Total Enseignants");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(6, "p", 11);
    \u0275\u0275text(7);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(8, "span", 12);
    \u0275\u0275text(9, "groups");
    \u0275\u0275domElementEnd()()();
    \u0275\u0275domElementStart(10, "div", 13)(11, "div", 9)(12, "div")(13, "p", 10);
    \u0275\u0275text(14, "Avec Disponibilit\xE9s");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(15, "p", 11);
    \u0275\u0275text(16);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(17, "span", 12);
    \u0275\u0275text(18, "event_available");
    \u0275\u0275domElementEnd()()();
    \u0275\u0275domElementStart(19, "div", 14)(20, "div", 9)(21, "div")(22, "p", 10);
    \u0275\u0275text(23, "Taux de Couverture");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(24, "p", 11);
    \u0275\u0275text(25);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(26, "span", 12);
    \u0275\u0275text(27, "show_chart");
    \u0275\u0275domElementEnd()()()();
    \u0275\u0275domElementStart(28, "div", 15)(29, "p", 16)(30, "span", 17);
    \u0275\u0275text(31, "P\xE9riode analys\xE9e :");
    \u0275\u0275domElementEnd();
    \u0275\u0275text(32);
    \u0275\u0275pipe(33, "date");
    \u0275\u0275pipe(34, "date");
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(35, "div", 18)(36, "h3", 19);
    \u0275\u0275text(37, " Disponibilit\xE9s par Jour de la Semaine ");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(38, "div", 20);
    \u0275\u0275repeaterCreate(39, AvailabilityReportComponent_Conditional_3_For_40_Template, 7, 4, "div", 21, _forTrack0);
    \u0275\u0275domElementEnd()();
    \u0275\u0275conditionalCreate(41, AvailabilityReportComponent_Conditional_3_Conditional_41_Template, 18, 1, "div", 18);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r0.report().totalEnseignants);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r0.report().enseignantsAvecDisponibilites);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate1("", ctx_r0.report().tauxCouverture, "%");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate2(" Du ", \u0275\u0275pipeBind2(33, 6, ctx_r0.report().periodeAnalyse.dateDebut, "dd/MM/yyyy"), " au ", \u0275\u0275pipeBind2(34, 9, ctx_r0.report().periodeAnalyse.dateFin, "dd/MM/yyyy"), " ");
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r0.getDisponibilitesParJour());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.report().enseignantsSansDisponibilites.length > 0 ? 41 : -1);
  }
}
var AvailabilityReportComponent = class _AvailabilityReportComponent {
  filters = {};
  reportService = inject(ReportService);
  report = signal(null, ...ngDevMode ? [{ debugName: "report" }] : []);
  isLoading = signal(false, ...ngDevMode ? [{ debugName: "isLoading" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  ngOnInit() {
    this.loadReport();
  }
  ngOnChanges() {
    this.loadReport();
  }
  loadReport() {
    this.isLoading.set(true);
    this.error.set(null);
    this.reportService.getAvailabilityReport(this.filters).subscribe({
      next: (data) => {
        this.report.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set("Erreur lors du chargement du rapport");
        console.error("Availability report error:", err);
        this.isLoading.set(false);
      }
    });
  }
  getDisponibilitesParJour() {
    if (!this.report())
      return [];
    const jours = {
      "MONDAY": "Lundi",
      "TUESDAY": "Mardi",
      "WEDNESDAY": "Mercredi",
      "THURSDAY": "Jeudi",
      "FRIDAY": "Vendredi",
      "SATURDAY": "Samedi",
      "SUNDAY": "Dimanche"
    };
    return Object.entries(this.report().disponibilitesParJour).map(([key, value]) => ({
      jour: jours[key] || key,
      count: value
    }));
  }
  static \u0275fac = function AvailabilityReportComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AvailabilityReportComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AvailabilityReportComponent, selectors: [["app-availability-report"]], inputs: { filters: "filters" }, features: [\u0275\u0275NgOnChangesFeature], decls: 4, vars: 1, consts: [[1, "space-y-6"], [1, "text-center", "py-12"], [1, "bg-red-50", "border", "border-red-200", "rounded-lg", "p-6", "text-center"], [1, "inline-block", "animate-spin", "rounded-full", "h-12", "w-12", "border-b-2", "border-blue-600"], [1, "mt-4", "text-slate-600"], [1, "material-icons", "text-red-500", "text-4xl", "mb-2"], [1, "text-red-700"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-4"], [1, "bg-gradient-to-br", "from-blue-500", "to-blue-600", "rounded-xl", "p-6", "text-white"], [1, "flex", "items-center", "justify-between"], [1, "text-sm", "opacity-90", "mb-1"], [1, "text-3xl", "font-bold"], [1, "material-icons", "text-5xl", "opacity-20"], [1, "bg-gradient-to-br", "from-green-500", "to-green-600", "rounded-xl", "p-6", "text-white"], [1, "bg-gradient-to-br", "from-purple-500", "to-purple-600", "rounded-xl", "p-6", "text-white"], [1, "bg-slate-50", "border", "border-slate-200", "rounded-lg", "p-4"], [1, "text-sm", "text-slate-600"], [1, "font-semibold"], [1, "bg-white", "rounded-xl", "border", "border-slate-200", "p-6"], [1, "text-lg", "font-semibold", "text-slate-800", "mb-4"], [1, "space-y-3"], [1, "flex", "items-center"], [1, "w-24", "text-sm", "font-medium", "text-slate-700"], [1, "flex-1", "bg-slate-100", "rounded-full", "h-8", "relative", "overflow-hidden"], [1, "h-full", "bg-gradient-to-r", "from-blue-500", "to-blue-600", "rounded-full", "flex", "items-center", "justify-end", "px-3"], [1, "text-white", "text-sm", "font-semibold"], [1, "text-lg", "font-semibold", "text-slate-800", "mb-4", "flex", "items-center"], [1, "material-icons", "text-orange-500", "mr-2"], [1, "overflow-x-auto"], [1, "min-w-full", "divide-y", "divide-slate-200"], [1, "bg-slate-50"], [1, "px-6", "py-3", "text-left", "text-xs", "font-medium", "text-slate-500", "uppercase", "tracking-wider"], [1, "bg-white", "divide-y", "divide-slate-200"], [1, "hover:bg-slate-50"], [1, "px-6", "py-4", "whitespace-nowrap", "text-sm", "font-medium", "text-slate-900"], [1, "px-6", "py-4", "whitespace-nowrap", "text-sm", "text-slate-600"]], template: function AvailabilityReportComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0);
      \u0275\u0275conditionalCreate(1, AvailabilityReportComponent_Conditional_1_Template, 4, 0, "div", 1)(2, AvailabilityReportComponent_Conditional_2_Template, 5, 1, "div", 2)(3, AvailabilityReportComponent_Conditional_3_Template, 42, 12);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isLoading() ? 1 : ctx.error() ? 2 : ctx.report() ? 3 : -1);
    }
  }, dependencies: [CommonModule, DatePipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AvailabilityReportComponent, [{
    type: Component,
    args: [{
      selector: "app-availability-report",
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
        <!-- R\xC9SUM\xC9 -->
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
                <p class="text-sm opacity-90 mb-1">Avec Disponibilit\xE9s</p>
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

        <!-- P\xC9RIODE D'ANALYSE -->
        <div class="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <p class="text-sm text-slate-600">
            <span class="font-semibold">P\xE9riode analys\xE9e :</span>
            Du {{ report()!.periodeAnalyse.dateDebut | date:'dd/MM/yyyy' }}
            au {{ report()!.periodeAnalyse.dateFin | date:'dd/MM/yyyy' }}
          </p>
        </div>

        <!-- DISPONIBILIT\xC9S PAR JOUR -->
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">
            Disponibilit\xE9s par Jour de la Semaine
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

        <!-- ENSEIGNANTS SANS DISPONIBILIT\xC9S -->
        @if (report()!.enseignantsSansDisponibilites.length > 0) {
          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <span class="material-icons text-orange-500 mr-2">warning</span>
              Enseignants Sans Disponibilit\xE9s ({{ report()!.enseignantsSansDisponibilites.length }})
            </h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nom</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Sp\xE9cialit\xE9</th>
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
    }]
  }], null, { filters: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AvailabilityReportComponent, { className: "AvailabilityReportComponent", filePath: "src/app/features/admin/reports/availability/availability-report.component.ts", lineNumber: 126 });
})();

// src/app/features/admin/reports/workload/workload-report.component.ts
var _forTrack02 = ($index, $item) => $item.enseignantId;
var _forTrack12 = ($index, $item) => $item.coursId;
function WorkloadReportComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 1);
    \u0275\u0275domElement(1, "div", 4);
    \u0275\u0275domElementStart(2, "p", 5);
    \u0275\u0275text(3, "Chargement du rapport...");
    \u0275\u0275domElementEnd()();
  }
}
function WorkloadReportComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 2)(1, "span", 6);
    \u0275\u0275text(2, "error_outline");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(3, "p", 7);
    \u0275\u0275text(4);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function WorkloadReportComponent_Conditional_3_For_43_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "tr", 24);
    \u0275\u0275domListener("click", function WorkloadReportComponent_Conditional_3_For_43_Template_tr_click_0_listener() {
      const report_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.selectEnseignant(report_r3));
    });
    \u0275\u0275domElementStart(1, "td", 25)(2, "div", 26)(3, "div", 27)(4, "span", 28);
    \u0275\u0275text(5);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(6, "div", 29)(7, "div", 30);
    \u0275\u0275text(8);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(9, "div", 31);
    \u0275\u0275text(10);
    \u0275\u0275domElementEnd()()()();
    \u0275\u0275domElementStart(11, "td", 32);
    \u0275\u0275text(12);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(13, "td", 33);
    \u0275\u0275text(14);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(15, "td", 33);
    \u0275\u0275text(16);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(17, "td", 25)(18, "div", 26)(19, "div", 34)(20, "div")(21, "span", 35);
    \u0275\u0275text(22);
    \u0275\u0275domElementEnd()()()()();
    \u0275\u0275domElementStart(23, "td", 25)(24, "span");
    \u0275\u0275text(25);
    \u0275\u0275domElementEnd()()();
  }
  if (rf & 2) {
    const report_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2(" ", report_r3.prenom.charAt(0), "", report_r3.nom.charAt(0), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", report_r3.prenom, " ", report_r3.nom, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(report_r3.email);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", report_r3.totalHeures, "h ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3(" ", report_r3.heuresCM, "h / ", report_r3.heuresTD, "h / ", report_r3.heuresTP, "h ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", report_r3.heuresParSemaine, "h ");
    \u0275\u0275advance(4);
    \u0275\u0275classMap("h-full rounded-full flex items-center justify-center text-xs font-semibold text-white " + ctx_r0.getStatusBgClass(report_r3.status));
    \u0275\u0275styleProp("width", ctx_r0.Math.min(report_r3.tauxCharge, 100), "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", report_r3.tauxCharge, "%");
    \u0275\u0275advance(2);
    \u0275\u0275classMap("px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full " + ctx_r0.getStatusClass(report_r3.status));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getStatusLabel(report_r3.status), " ");
  }
}
function WorkloadReportComponent_Conditional_3_Conditional_44_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p", 39);
    \u0275\u0275text(1, "Aucun cours assign\xE9");
    \u0275\u0275domElementEnd();
  }
}
function WorkloadReportComponent_Conditional_3_Conditional_44_Conditional_8_For_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "tr", 41)(1, "td", 42);
    \u0275\u0275text(2);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(3, "td", 43);
    \u0275\u0275text(4);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(5, "td", 44)(6, "span", 45);
    \u0275\u0275text(7);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(8, "td", 43);
    \u0275\u0275text(9);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(10, "td", 46);
    \u0275\u0275text(11);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(12, "td", 43);
    \u0275\u0275text(13);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const cours_r5 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(cours_r5.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(cours_r5.intitule);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", cours_r5.typeCours, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(cours_r5.filiereNom);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", cours_r5.heuresTotal, "h");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(cours_r5.nombreGroupes);
  }
}
function WorkloadReportComponent_Conditional_3_Conditional_44_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 18)(1, "table", 19)(2, "thead", 20)(3, "tr")(4, "th", 40);
    \u0275\u0275text(5, "Code");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(6, "th", 40);
    \u0275\u0275text(7, "Intitul\xE9");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(8, "th", 40);
    \u0275\u0275text(9, "Type");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(10, "th", 40);
    \u0275\u0275text(11, "Fili\xE8re");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(12, "th", 40);
    \u0275\u0275text(13, "Heures");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(14, "th", 40);
    \u0275\u0275text(15, "Groupes");
    \u0275\u0275domElementEnd()()();
    \u0275\u0275domElementStart(16, "tbody", 22);
    \u0275\u0275repeaterCreate(17, WorkloadReportComponent_Conditional_3_Conditional_44_Conditional_8_For_18_Template, 14, 6, "tr", 41, _forTrack12);
    \u0275\u0275domElementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(17);
    \u0275\u0275repeater(ctx_r0.selectedEnseignant().coursAssignes);
  }
}
function WorkloadReportComponent_Conditional_3_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "div", 9)(1, "div", 36)(2, "h3", 17);
    \u0275\u0275text(3);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(4, "button", 37);
    \u0275\u0275domListener("click", function WorkloadReportComponent_Conditional_3_Conditional_44_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.closeDetails());
    });
    \u0275\u0275domElementStart(5, "span", 38);
    \u0275\u0275text(6, "close");
    \u0275\u0275domElementEnd()()();
    \u0275\u0275conditionalCreate(7, WorkloadReportComponent_Conditional_3_Conditional_44_Conditional_7_Template, 2, 0, "p", 39)(8, WorkloadReportComponent_Conditional_3_Conditional_44_Conditional_8_Template, 19, 0, "div", 18);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" Cours assign\xE9s - ", ctx_r0.selectedEnseignant().prenom, " ", ctx_r0.selectedEnseignant().nom, " ");
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r0.selectedEnseignant().coursAssignes.length === 0 ? 7 : 8);
  }
}
function WorkloadReportComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 8)(1, "div", 9)(2, "p", 10);
    \u0275\u0275text(3, "Total Enseignants");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(4, "p", 11);
    \u0275\u0275text(5);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(6, "div", 9)(7, "p", 10);
    \u0275\u0275text(8, "Charge Moyenne");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(9, "p", 12);
    \u0275\u0275text(10);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(11, "div", 9)(12, "p", 10);
    \u0275\u0275text(13, "Sous-charg\xE9s");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(14, "p", 13);
    \u0275\u0275text(15);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(16, "div", 9)(17, "p", 10);
    \u0275\u0275text(18, "Surcharg\xE9s");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(19, "p", 14);
    \u0275\u0275text(20);
    \u0275\u0275domElementEnd()()();
    \u0275\u0275domElementStart(21, "div", 15)(22, "div", 16)(23, "h3", 17);
    \u0275\u0275text(24, "Charge Horaire par Enseignant");
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(25, "div", 18)(26, "table", 19)(27, "thead", 20)(28, "tr")(29, "th", 21);
    \u0275\u0275text(30, " Enseignant ");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(31, "th", 21);
    \u0275\u0275text(32, " Total Heures ");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(33, "th", 21);
    \u0275\u0275text(34, " CM / TD / TP ");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(35, "th", 21);
    \u0275\u0275text(36, " Heures/Semaine ");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(37, "th", 21);
    \u0275\u0275text(38, " Taux de Charge ");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(39, "th", 21);
    \u0275\u0275text(40, " Statut ");
    \u0275\u0275domElementEnd()()();
    \u0275\u0275domElementStart(41, "tbody", 22);
    \u0275\u0275repeaterCreate(42, WorkloadReportComponent_Conditional_3_For_43_Template, 26, 18, "tr", 23, _forTrack02);
    \u0275\u0275domElementEnd()()()();
    \u0275\u0275conditionalCreate(44, WorkloadReportComponent_Conditional_3_Conditional_44_Template, 9, 3, "div", 9);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.reports().length);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", ctx_r0.getAverageWorkload(), "%");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.getCountByStatus("SOUS_CHARGE"));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.getCountByStatus("SURCHARGE"));
    \u0275\u0275advance(22);
    \u0275\u0275repeater(ctx_r0.reports());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.selectedEnseignant() ? 44 : -1);
  }
}
function WorkloadReportComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 3)(1, "span", 47);
    \u0275\u0275text(2, "assignment");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(3, "p", 48);
    \u0275\u0275text(4, "Aucun rapport de charge horaire disponible");
    \u0275\u0275domElementEnd()();
  }
}
var WorkloadReportComponent = class _WorkloadReportComponent {
  filters = {};
  reportService = inject(ReportService);
  reports = signal([], ...ngDevMode ? [{ debugName: "reports" }] : []);
  selectedEnseignant = signal(null, ...ngDevMode ? [{ debugName: "selectedEnseignant" }] : []);
  isLoading = signal(false, ...ngDevMode ? [{ debugName: "isLoading" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  Math = Math;
  ngOnInit() {
    this.loadReport();
  }
  ngOnChanges() {
    this.loadReport();
  }
  loadReport() {
    this.isLoading.set(true);
    this.error.set(null);
    this.reportService.getAllWorkloadReports(this.filters).subscribe({
      next: (data) => {
        this.reports.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set("Erreur lors du chargement du rapport");
        console.error("Workload report error:", err);
        this.isLoading.set(false);
      }
    });
  }
  selectEnseignant(report) {
    this.selectedEnseignant.set(report);
  }
  closeDetails() {
    this.selectedEnseignant.set(null);
  }
  getAverageWorkload() {
    const reports = this.reports();
    if (reports.length === 0)
      return 0;
    const sum = reports.reduce((acc, r) => acc + r.tauxCharge, 0);
    return Math.round(sum / reports.length);
  }
  getCountByStatus(status) {
    return this.reports().filter((r) => r.status === status).length;
  }
  getStatusLabel(status) {
    return WorkloadStatusLabels[status] || status;
  }
  getStatusClass(status) {
    const classes = {
      "SOUS_CHARGE": "bg-cyan-100 text-cyan-800",
      "NORMAL": "bg-green-100 text-green-800",
      "SURCHARGE": "bg-red-100 text-red-800"
    };
    return classes[status] || "bg-slate-100 text-slate-800";
  }
  getStatusBgClass(status) {
    const classes = {
      "SOUS_CHARGE": "bg-cyan-500",
      "NORMAL": "bg-green-500",
      "SURCHARGE": "bg-red-500"
    };
    return classes[status] || "bg-slate-500";
  }
  static \u0275fac = function WorkloadReportComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _WorkloadReportComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _WorkloadReportComponent, selectors: [["app-workload-report"]], inputs: { filters: "filters" }, features: [\u0275\u0275NgOnChangesFeature], decls: 5, vars: 1, consts: [[1, "space-y-6"], [1, "text-center", "py-12"], [1, "bg-red-50", "border", "border-red-200", "rounded-lg", "p-6", "text-center"], [1, "bg-slate-50", "border", "border-slate-200", "rounded-lg", "p-12", "text-center"], [1, "inline-block", "animate-spin", "rounded-full", "h-12", "w-12", "border-b-2", "border-blue-600"], [1, "mt-4", "text-slate-600"], [1, "material-icons", "text-red-500", "text-4xl", "mb-2"], [1, "text-red-700"], [1, "grid", "grid-cols-1", "md:grid-cols-4", "gap-4"], [1, "bg-white", "rounded-xl", "border", "border-slate-200", "p-6"], [1, "text-sm", "text-slate-600", "mb-1"], [1, "text-3xl", "font-bold", "text-slate-800"], [1, "text-3xl", "font-bold", "text-blue-600"], [1, "text-3xl", "font-bold", "text-cyan-600"], [1, "text-3xl", "font-bold", "text-red-600"], [1, "bg-white", "rounded-xl", "border", "border-slate-200", "overflow-hidden"], [1, "px-6", "py-4", "border-b", "border-slate-200"], [1, "text-lg", "font-semibold", "text-slate-800"], [1, "overflow-x-auto"], [1, "min-w-full", "divide-y", "divide-slate-200"], [1, "bg-slate-50"], [1, "px-6", "py-3", "text-left", "text-xs", "font-medium", "text-slate-500", "uppercase", "tracking-wider"], [1, "bg-white", "divide-y", "divide-slate-200"], [1, "hover:bg-slate-50", "cursor-pointer"], [1, "hover:bg-slate-50", "cursor-pointer", 3, "click"], [1, "px-6", "py-4", "whitespace-nowrap"], [1, "flex", "items-center"], [1, "flex-shrink-0", "h-10", "w-10", "bg-blue-100", "rounded-full", "flex", "items-center", "justify-center"], [1, "text-blue-600", "font-semibold", "text-sm"], [1, "ml-4"], [1, "text-sm", "font-medium", "text-slate-900"], [1, "text-sm", "text-slate-500"], [1, "px-6", "py-4", "whitespace-nowrap", "text-sm", "font-semibold", "text-slate-900"], [1, "px-6", "py-4", "whitespace-nowrap", "text-sm", "text-slate-600"], [1, "w-32", "bg-slate-100", "rounded-full", "h-6", "mr-2", "overflow-hidden"], [1, "px-2"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "text-slate-400", "hover:text-slate-600", 3, "click"], [1, "material-icons"], [1, "text-slate-500", "text-center", "py-8"], [1, "px-4", "py-3", "text-left", "text-xs", "font-medium", "text-slate-500", "uppercase"], [1, "hover:bg-slate-50"], [1, "px-4", "py-3", "text-sm", "font-medium", "text-slate-900"], [1, "px-4", "py-3", "text-sm", "text-slate-600"], [1, "px-4", "py-3", "text-sm"], [1, "px-2", "py-1", "bg-blue-100", "text-blue-700", "rounded", "text-xs", "font-medium"], [1, "px-4", "py-3", "text-sm", "font-semibold", "text-slate-900"], [1, "material-icons", "text-slate-300", "text-6xl", "mb-4"], [1, "text-slate-600"]], template: function WorkloadReportComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0);
      \u0275\u0275conditionalCreate(1, WorkloadReportComponent_Conditional_1_Template, 4, 0, "div", 1)(2, WorkloadReportComponent_Conditional_2_Template, 5, 1, "div", 2)(3, WorkloadReportComponent_Conditional_3_Template, 45, 5)(4, WorkloadReportComponent_Conditional_4_Template, 5, 0, "div", 3);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isLoading() ? 1 : ctx.error() ? 2 : ctx.reports().length > 0 ? 3 : 4);
    }
  }, dependencies: [CommonModule], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WorkloadReportComponent, [{
    type: Component,
    args: [{
      selector: "app-workload-report",
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
            <p class="text-sm text-slate-600 mb-1">Sous-charg\xE9s</p>
            <p class="text-3xl font-bold text-cyan-600">{{ getCountByStatus('SOUS_CHARGE') }}</p>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <p class="text-sm text-slate-600 mb-1">Surcharg\xE9s</p>
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

        <!-- D\xC9TAILS ENSEIGNANT S\xC9LECTIONN\xC9 -->
        @if (selectedEnseignant()) {
          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-slate-800">
                Cours assign\xE9s - {{ selectedEnseignant()!.prenom }} {{ selectedEnseignant()!.nom }}
              </h3>
              <button
                (click)="closeDetails()"
                class="text-slate-400 hover:text-slate-600"
              >
                <span class="material-icons">close</span>
              </button>
            </div>

            @if (selectedEnseignant()!.coursAssignes.length === 0) {
              <p class="text-slate-500 text-center py-8">Aucun cours assign\xE9</p>
            } @else {
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-200">
                  <thead class="bg-slate-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Code</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Intitul\xE9</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Fili\xE8re</th>
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
    }]
  }], null, { filters: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(WorkloadReportComponent, { className: "WorkloadReportComponent", filePath: "src/app/features/admin/reports/workload/workload-report.component.ts", lineNumber: 187 });
})();

// src/app/features/admin/reports/rooms/room-utilization-report.component.ts
var _forTrack03 = ($index, $item) => $item.type;
var _forTrack13 = ($index, $item) => $item.salleId;
var _forTrack2 = ($index, $item) => $item.jour;
function RoomUtilizationReportComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 1);
    \u0275\u0275domElement(1, "div", 3);
    \u0275\u0275domElementStart(2, "p", 4);
    \u0275\u0275text(3, "Chargement du rapport...");
    \u0275\u0275domElementEnd()();
  }
}
function RoomUtilizationReportComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 2)(1, "span", 5);
    \u0275\u0275text(2, "error_outline");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(3, "p", 6);
    \u0275\u0275text(4);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function RoomUtilizationReportComponent_Conditional_3_For_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 20)(1, "p", 31);
    \u0275\u0275text(2);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(3, "p", 32);
    \u0275\u0275text(4);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const entry_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(entry_r2.count);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(entry_r2.type);
  }
}
function RoomUtilizationReportComponent_Conditional_3_For_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "tr", 28)(1, "td", 33)(2, "div", 30)(3, "span", 34);
    \u0275\u0275text(4, "door_front");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(5, "div")(6, "div", 35);
    \u0275\u0275text(7);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(8, "div", 36);
    \u0275\u0275text(9);
    \u0275\u0275domElementEnd()()()();
    \u0275\u0275domElementStart(10, "td", 37);
    \u0275\u0275text(11);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(12, "td", 37);
    \u0275\u0275text(13);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(14, "td", 33)(15, "div", 30)(16, "div", 38)(17, "div", 39)(18, "span", 40);
    \u0275\u0275text(19);
    \u0275\u0275domElementEnd()()()();
    \u0275\u0275domElementStart(20, "p", 41);
    \u0275\u0275text(21);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(22, "td", 42);
    \u0275\u0275text(23);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const salle_r3 = ctx.$implicit;
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(salle_r3.nomSalle);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(salle_r3.batiment);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", salle_r3.typeSalle, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", salle_r3.capacite, " places ");
    \u0275\u0275advance(4);
    \u0275\u0275styleProp("width", salle_r3.tauxOccupation, "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", salle_r3.tauxOccupation, "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", salle_r3.heuresOccupees, "h / ", salle_r3.heuresDisponibles, "h ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", salle_r3.nombreReservations, " ");
  }
}
function RoomUtilizationReportComponent_Conditional_3_Conditional_54_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "tr", 28)(1, "td", 33)(2, "div", 30)(3, "span", 43);
    \u0275\u0275text(4, "door_front");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(5, "div")(6, "div", 35);
    \u0275\u0275text(7);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(8, "div", 36);
    \u0275\u0275text(9);
    \u0275\u0275domElementEnd()()()();
    \u0275\u0275domElementStart(10, "td", 37);
    \u0275\u0275text(11);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(12, "td", 37);
    \u0275\u0275text(13);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(14, "td", 33)(15, "div", 30)(16, "div", 38)(17, "div", 44)(18, "span", 40);
    \u0275\u0275text(19);
    \u0275\u0275domElementEnd()()()()()();
  }
  if (rf & 2) {
    const salle_r4 = ctx.$implicit;
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(salle_r4.nomSalle);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(salle_r4.batiment);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", salle_r4.typeSalle, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", salle_r4.capacite, " places ");
    \u0275\u0275advance(4);
    \u0275\u0275styleProp("width", salle_r4.tauxOccupation, "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", salle_r4.tauxOccupation, "%");
  }
}
function RoomUtilizationReportComponent_Conditional_3_Conditional_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 17)(1, "h3", 21)(2, "span", 43);
    \u0275\u0275text(3, "trending_down");
    \u0275\u0275domElementEnd();
    \u0275\u0275text(4, " Salles Sous-Utilis\xE9es ");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(5, "div", 23)(6, "table", 24)(7, "thead", 25)(8, "tr")(9, "th", 26);
    \u0275\u0275text(10, "Salle");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(11, "th", 26);
    \u0275\u0275text(12, "Type");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(13, "th", 26);
    \u0275\u0275text(14, "Capacit\xE9");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(15, "th", 26);
    \u0275\u0275text(16, "Occupation");
    \u0275\u0275domElementEnd()()();
    \u0275\u0275domElementStart(17, "tbody", 27);
    \u0275\u0275repeaterCreate(18, RoomUtilizationReportComponent_Conditional_3_Conditional_54_For_19_Template, 20, 7, "tr", 28, _forTrack13);
    \u0275\u0275domElementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(18);
    \u0275\u0275repeater(ctx_r0.report().sallesSousUtilisees);
  }
}
function RoomUtilizationReportComponent_Conditional_3_For_60_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 30)(1, "div", 45);
    \u0275\u0275text(2);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(3, "div", 46)(4, "div", 47)(5, "span", 48);
    \u0275\u0275text(6);
    \u0275\u0275domElementEnd()()()();
  }
  if (rf & 2) {
    const entry_r5 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(entry_r5.jour);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", entry_r5.taux, "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", entry_r5.taux, "%");
  }
}
function RoomUtilizationReportComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 7)(1, "div", 8)(2, "div", 9)(3, "div")(4, "p", 10);
    \u0275\u0275text(5, "Total Salles");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(6, "p", 11);
    \u0275\u0275text(7);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(8, "span", 12);
    \u0275\u0275text(9, "meeting_room");
    \u0275\u0275domElementEnd()()();
    \u0275\u0275domElementStart(10, "div", 13)(11, "div", 9)(12, "div")(13, "p", 10);
    \u0275\u0275text(14, "Taux d'Occupation Moyen");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(15, "p", 11);
    \u0275\u0275text(16);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(17, "span", 12);
    \u0275\u0275text(18, "bar_chart");
    \u0275\u0275domElementEnd()()()();
    \u0275\u0275domElementStart(19, "div", 14)(20, "p", 15)(21, "span", 16);
    \u0275\u0275text(22, "P\xE9riode analys\xE9e :");
    \u0275\u0275domElementEnd();
    \u0275\u0275text(23);
    \u0275\u0275pipe(24, "date");
    \u0275\u0275pipe(25, "date");
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(26, "div", 17)(27, "h3", 18);
    \u0275\u0275text(28, "R\xE9partition par Type de Salle");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(29, "div", 19);
    \u0275\u0275repeaterCreate(30, RoomUtilizationReportComponent_Conditional_3_For_31_Template, 5, 2, "div", 20, _forTrack03);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(32, "div", 17)(33, "h3", 21)(34, "span", 22);
    \u0275\u0275text(35, "trending_up");
    \u0275\u0275domElementEnd();
    \u0275\u0275text(36, " Salles les Plus Utilis\xE9es ");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(37, "div", 23)(38, "table", 24)(39, "thead", 25)(40, "tr")(41, "th", 26);
    \u0275\u0275text(42, "Salle");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(43, "th", 26);
    \u0275\u0275text(44, "Type");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(45, "th", 26);
    \u0275\u0275text(46, "Capacit\xE9");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(47, "th", 26);
    \u0275\u0275text(48, "Occupation");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(49, "th", 26);
    \u0275\u0275text(50, "R\xE9servations");
    \u0275\u0275domElementEnd()()();
    \u0275\u0275domElementStart(51, "tbody", 27);
    \u0275\u0275repeaterCreate(52, RoomUtilizationReportComponent_Conditional_3_For_53_Template, 24, 10, "tr", 28, _forTrack13);
    \u0275\u0275domElementEnd()()()();
    \u0275\u0275conditionalCreate(54, RoomUtilizationReportComponent_Conditional_3_Conditional_54_Template, 20, 0, "div", 17);
    \u0275\u0275domElementStart(55, "div", 17)(56, "h3", 18);
    \u0275\u0275text(57, "Occupation Moyenne par Jour");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(58, "div", 29);
    \u0275\u0275repeaterCreate(59, RoomUtilizationReportComponent_Conditional_3_For_60_Template, 7, 4, "div", 30, _forTrack2);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r0.report().totalSalles);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate1("", ctx_r0.report().tauxOccupationMoyen, "%");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate2(" Du ", \u0275\u0275pipeBind2(24, 5, ctx_r0.report().periodeAnalyse.dateDebut, "dd/MM/yyyy"), " au ", \u0275\u0275pipeBind2(25, 8, ctx_r0.report().periodeAnalyse.dateFin, "dd/MM/yyyy"), " ");
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r0.getSallesParType());
    \u0275\u0275advance(22);
    \u0275\u0275repeater(ctx_r0.report().topSallesUtilisees);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.report().sallesSousUtilisees.length > 0 ? 54 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r0.getOccupationParJour());
  }
}
var RoomUtilizationReportComponent = class _RoomUtilizationReportComponent {
  filters = {};
  reportService = inject(ReportService);
  report = signal(null, ...ngDevMode ? [{ debugName: "report" }] : []);
  isLoading = signal(false, ...ngDevMode ? [{ debugName: "isLoading" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  ngOnInit() {
    this.loadReport();
  }
  ngOnChanges() {
    this.loadReport();
  }
  loadReport() {
    this.isLoading.set(true);
    this.error.set(null);
    this.reportService.getRoomUtilizationReport(this.filters).subscribe({
      next: (data) => {
        this.report.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set("Erreur lors du chargement du rapport");
        console.error("Room utilization report error:", err);
        this.isLoading.set(false);
      }
    });
  }
  getSallesParType() {
    if (!this.report())
      return [];
    return Object.entries(this.report().sallesParType).map(([type, count]) => ({
      type,
      count
    }));
  }
  getOccupationParJour() {
    if (!this.report())
      return [];
    const jours = {
      "MONDAY": "Lundi",
      "TUESDAY": "Mardi",
      "WEDNESDAY": "Mercredi",
      "THURSDAY": "Jeudi",
      "FRIDAY": "Vendredi",
      "SATURDAY": "Samedi",
      "SUNDAY": "Dimanche"
    };
    return Object.entries(this.report().occupationParJour).map(([key, taux]) => ({
      jour: jours[key] || key,
      taux
    }));
  }
  static \u0275fac = function RoomUtilizationReportComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RoomUtilizationReportComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RoomUtilizationReportComponent, selectors: [["app-room-utilization-report"]], inputs: { filters: "filters" }, features: [\u0275\u0275NgOnChangesFeature], decls: 4, vars: 1, consts: [[1, "space-y-6"], [1, "text-center", "py-12"], [1, "bg-red-50", "border", "border-red-200", "rounded-lg", "p-6", "text-center"], [1, "inline-block", "animate-spin", "rounded-full", "h-12", "w-12", "border-b-2", "border-blue-600"], [1, "mt-4", "text-slate-600"], [1, "material-icons", "text-red-500", "text-4xl", "mb-2"], [1, "text-red-700"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4"], [1, "bg-gradient-to-br", "from-indigo-500", "to-indigo-600", "rounded-xl", "p-6", "text-white"], [1, "flex", "items-center", "justify-between"], [1, "text-sm", "opacity-90", "mb-1"], [1, "text-3xl", "font-bold"], [1, "material-icons", "text-5xl", "opacity-20"], [1, "bg-gradient-to-br", "from-emerald-500", "to-emerald-600", "rounded-xl", "p-6", "text-white"], [1, "bg-slate-50", "border", "border-slate-200", "rounded-lg", "p-4"], [1, "text-sm", "text-slate-600"], [1, "font-semibold"], [1, "bg-white", "rounded-xl", "border", "border-slate-200", "p-6"], [1, "text-lg", "font-semibold", "text-slate-800", "mb-4"], [1, "grid", "grid-cols-2", "md:grid-cols-4", "gap-4"], [1, "text-center", "p-4", "bg-slate-50", "rounded-lg"], [1, "text-lg", "font-semibold", "text-slate-800", "mb-4", "flex", "items-center"], [1, "material-icons", "text-green-500", "mr-2"], [1, "overflow-x-auto"], [1, "min-w-full", "divide-y", "divide-slate-200"], [1, "bg-slate-50"], [1, "px-6", "py-3", "text-left", "text-xs", "font-medium", "text-slate-500", "uppercase"], [1, "bg-white", "divide-y", "divide-slate-200"], [1, "hover:bg-slate-50"], [1, "space-y-3"], [1, "flex", "items-center"], [1, "text-2xl", "font-bold", "text-blue-600"], [1, "text-sm", "text-slate-600", "mt-1"], [1, "px-6", "py-4", "whitespace-nowrap"], [1, "material-icons", "text-blue-500", "mr-2"], [1, "text-sm", "font-medium", "text-slate-900"], [1, "text-xs", "text-slate-500"], [1, "px-6", "py-4", "whitespace-nowrap", "text-sm", "text-slate-600"], [1, "w-32", "bg-slate-100", "rounded-full", "h-6", "mr-2", "overflow-hidden"], [1, "h-full", "bg-gradient-to-r", "from-green-500", "to-green-600", "rounded-full", "flex", "items-center", "justify-center", "text-xs", "font-semibold", "text-white"], [1, "px-2"], [1, "text-xs", "text-slate-500", "mt-1"], [1, "px-6", "py-4", "whitespace-nowrap", "text-sm", "font-semibold", "text-slate-900"], [1, "material-icons", "text-orange-500", "mr-2"], [1, "h-full", "bg-gradient-to-r", "from-orange-500", "to-orange-600", "rounded-full", "flex", "items-center", "justify-center", "text-xs", "font-semibold", "text-white"], [1, "w-24", "text-sm", "font-medium", "text-slate-700"], [1, "flex-1", "bg-slate-100", "rounded-full", "h-8", "relative", "overflow-hidden"], [1, "h-full", "bg-gradient-to-r", "from-indigo-500", "to-indigo-600", "rounded-full", "flex", "items-center", "justify-end", "px-3"], [1, "text-white", "text-sm", "font-semibold"]], template: function RoomUtilizationReportComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0);
      \u0275\u0275conditionalCreate(1, RoomUtilizationReportComponent_Conditional_1_Template, 4, 0, "div", 1)(2, RoomUtilizationReportComponent_Conditional_2_Template, 5, 1, "div", 2)(3, RoomUtilizationReportComponent_Conditional_3_Template, 61, 11);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isLoading() ? 1 : ctx.error() ? 2 : ctx.report() ? 3 : -1);
    }
  }, dependencies: [CommonModule, DatePipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RoomUtilizationReportComponent, [{
    type: Component,
    args: [{
      selector: "app-room-utilization-report",
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
        <!-- R\xC9SUM\xC9 -->
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

        <!-- P\xC9RIODE D'ANALYSE -->
        <div class="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <p class="text-sm text-slate-600">
            <span class="font-semibold">P\xE9riode analys\xE9e :</span>
            Du {{ report()!.periodeAnalyse.dateDebut | date:'dd/MM/yyyy' }}
            au {{ report()!.periodeAnalyse.dateFin | date:'dd/MM/yyyy' }}
          </p>
        </div>

        <!-- SALLES PAR TYPE -->
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">R\xE9partition par Type de Salle</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            @for (entry of getSallesParType(); track entry.type) {
              <div class="text-center p-4 bg-slate-50 rounded-lg">
                <p class="text-2xl font-bold text-blue-600">{{ entry.count }}</p>
                <p class="text-sm text-slate-600 mt-1">{{ entry.type }}</p>
              </div>
            }
          </div>
        </div>

        <!-- TOP SALLES UTILIS\xC9ES -->
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <span class="material-icons text-green-500 mr-2">trending_up</span>
            Salles les Plus Utilis\xE9es
          </h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Salle</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Capacit\xE9</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Occupation</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">R\xE9servations</th>
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

        <!-- SALLES SOUS-UTILIS\xC9ES -->
        @if (report()!.sallesSousUtilisees.length > 0) {
          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <span class="material-icons text-orange-500 mr-2">trending_down</span>
              Salles Sous-Utilis\xE9es
            </h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Salle</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Capacit\xE9</th>
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
    }]
  }], null, { filters: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RoomUtilizationReportComponent, { className: "RoomUtilizationReportComponent", filePath: "src/app/features/admin/reports/rooms/room-utilization-report.component.ts", lineNumber: 206 });
})();

// src/app/features/admin/reports/audit/audit-trail.component.ts
var _forTrack04 = ($index, $item) => $item.id;
function AuditTrailComponent_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const action_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("value", action_r1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.getActionLabel(action_r1));
  }
}
function AuditTrailComponent_For_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const entity_r3 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("value", entity_r3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.getEntityLabel(entity_r3));
  }
}
function AuditTrailComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "div", 11);
    \u0275\u0275elementStart(2, "p", 12);
    \u0275\u0275text(3, "Chargement du journal d'audit...");
    \u0275\u0275elementEnd()();
  }
}
function AuditTrailComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "span", 13);
    \u0275\u0275text(2, "error_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 14);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
function AuditTrailComponent_Conditional_25_For_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 27)(1, "td", 32);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td", 33)(5, "div", 34)(6, "div", 35)(7, "span", 36);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 37)(10, "div", 38);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(12, "td", 33)(13, "span");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "td", 33)(16, "div", 39)(17, "span", 40);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "td", 41);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const entry_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(3, 9, entry_r5.timestamp, "dd/MM/yyyy HH:mm:ss"), " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", ctx_r1.getUserInitials(entry_r5.userName), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(entry_r5.userName);
    \u0275\u0275advance(2);
    \u0275\u0275classMap("px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full " + ctx_r1.getActionClass(entry_r5.action));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getActionLabel(entry_r5.action), " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.getEntityIcon(entry_r5.entity));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getEntityLabel(entry_r5.entity), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", entry_r5.details, " ");
  }
}
function AuditTrailComponent_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 15)(2, "p", 16);
    \u0275\u0275text(3, "Total Entr\xE9es");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 17);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 15)(7, "p", 16);
    \u0275\u0275text(8, "Page Actuelle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 18);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 15)(12, "p", 16);
    \u0275\u0275text(13, "Entr\xE9es par Page");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "p", 17);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "div", 19)(17, "div", 20)(18, "h3", 21);
    \u0275\u0275text(19, "Journal d'Audit");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div", 22)(21, "table", 23)(22, "thead", 24)(23, "tr")(24, "th", 25);
    \u0275\u0275text(25, "Date/Heure");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "th", 25);
    \u0275\u0275text(27, "Utilisateur");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "th", 25);
    \u0275\u0275text(29, "Action");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "th", 25);
    \u0275\u0275text(31, "Entit\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "th", 25);
    \u0275\u0275text(33, "D\xE9tails");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(34, "tbody", 26);
    \u0275\u0275repeaterCreate(35, AuditTrailComponent_Conditional_25_For_36_Template, 22, 12, "tr", 27, _forTrack04);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(37, "div", 28)(38, "div", 29);
    \u0275\u0275text(39);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "div", 30)(41, "button", 31);
    \u0275\u0275listener("click", function AuditTrailComponent_Conditional_25_Template_button_click_41_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.previousPage());
    });
    \u0275\u0275text(42, " Pr\xE9c\xE9dent ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "span", 29);
    \u0275\u0275text(44);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "button", 31);
    \u0275\u0275listener("click", function AuditTrailComponent_Conditional_25_Template_button_click_45_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.nextPage());
    });
    \u0275\u0275text(46, " Suivant ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.auditPage().totalElements);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2(" ", ctx_r1.auditPage().number + 1, " / ", ctx_r1.auditPage().totalPages, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.auditPage().size);
    \u0275\u0275advance(20);
    \u0275\u0275repeater(ctx_r1.auditPage().content);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate3(" Affichage de ", ctx_r1.auditPage().number * ctx_r1.auditPage().size + 1, " \xE0 ", ctx_r1.Math.min((ctx_r1.auditPage().number + 1) * ctx_r1.auditPage().size, ctx_r1.auditPage().totalElements), " sur ", ctx_r1.auditPage().totalElements, " entr\xE9es ");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.auditPage().first);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" Page ", ctx_r1.auditPage().number + 1, " / ", ctx_r1.auditPage().totalPages, " ");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.auditPage().last);
  }
}
function AuditTrailComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10)(1, "span", 42);
    \u0275\u0275text(2, "history");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 43);
    \u0275\u0275text(4, "Aucune entr\xE9e d'audit trouv\xE9e");
    \u0275\u0275elementEnd()();
  }
}
var AuditTrailComponent = class _AuditTrailComponent {
  filters = {};
  reportService = inject(ReportService);
  auditPage = signal(null, ...ngDevMode ? [{ debugName: "auditPage" }] : []);
  isLoading = signal(false, ...ngDevMode ? [{ debugName: "isLoading" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  auditFilters = {
    page: 0,
    size: 20
  };
  searchQuery = "";
  auditActions = ["CREATE", "UPDATE", "DELETE", "VALIDATE", "PUBLISH", "GENERATE", "EXPORT"];
  entityTypes = ["EMPLOI_DU_TEMPS", "CRENEAU", "RESERVATION", "COURS", "ENSEIGNANT", "SALLE", "GROUPE"];
  Math = Math;
  ngOnInit() {
    this.loadAuditTrail();
  }
  ngOnChanges() {
    this.loadAuditTrail();
  }
  loadAuditTrail() {
    this.isLoading.set(true);
    this.error.set(null);
    const combinedFilters = __spreadProps(__spreadValues({}, this.auditFilters), {
      startDate: this.filters.startDate,
      endDate: this.filters.endDate
    });
    this.reportService.getAuditTrail(combinedFilters).subscribe({
      next: (data) => {
        this.auditPage.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set("Erreur lors du chargement du journal d'audit");
        console.error("Audit trail error:", err);
        this.isLoading.set(false);
      }
    });
  }
  nextPage() {
    if (!this.auditPage()?.last) {
      this.auditFilters.page = (this.auditFilters.page || 0) + 1;
      this.loadAuditTrail();
    }
  }
  previousPage() {
    if (!this.auditPage()?.first && (this.auditFilters.page || 0) > 0) {
      this.auditFilters.page = (this.auditFilters.page || 0) - 1;
      this.loadAuditTrail();
    }
  }
  getActionLabel(action) {
    return AuditActionLabels[action] || action;
  }
  getEntityLabel(entity) {
    return EntityTypeLabels[entity] || entity;
  }
  getActionClass(action) {
    const classes = {
      CREATE: "bg-green-100 text-green-800",
      UPDATE: "bg-blue-100 text-blue-800",
      DELETE: "bg-red-100 text-red-800",
      VALIDATE: "bg-purple-100 text-purple-800",
      PUBLISH: "bg-indigo-100 text-indigo-800",
      GENERATE: "bg-yellow-100 text-yellow-800",
      EXPORT: "bg-cyan-100 text-cyan-800"
    };
    return classes[action] || "bg-slate-100 text-slate-800";
  }
  getEntityIcon(entity) {
    const icons = {
      EMPLOI_DU_TEMPS: "calendar_today",
      CRENEAU: "schedule",
      RESERVATION: "event",
      COURS: "school",
      ENSEIGNANT: "person",
      SALLE: "meeting_room",
      GROUPE: "groups"
    };
    return icons[entity] || "description";
  }
  getUserInitials(userName) {
    const parts = userName.split(" ");
    if (parts.length >= 2) {
      return parts[0].charAt(0) + parts[1].charAt(0);
    }
    return userName.substring(0, 2).toUpperCase();
  }
  static \u0275fac = function AuditTrailComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuditTrailComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AuditTrailComponent, selectors: [["app-audit-trail"]], inputs: { filters: "filters" }, features: [\u0275\u0275NgOnChangesFeature], decls: 27, vars: 4, consts: [[1, "space-y-6"], [1, "bg-slate-50", "rounded-lg", "p-4", "border", "border-slate-200"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-4"], [1, "block", "text-sm", "font-medium", "text-slate-700", "mb-1"], [1, "w-full", "px-3", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", 3, "ngModelChange", "change", "ngModel"], ["value", ""], [3, "value"], ["type", "text", "placeholder", "Rechercher...", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", 3, "ngModelChange", "input", "ngModel"], [1, "text-center", "py-12"], [1, "bg-red-50", "border", "border-red-200", "rounded-lg", "p-6", "text-center"], [1, "bg-slate-50", "border", "border-slate-200", "rounded-lg", "p-12", "text-center"], [1, "inline-block", "animate-spin", "rounded-full", "h-12", "w-12", "border-b-2", "border-blue-600"], [1, "mt-4", "text-slate-600"], [1, "material-icons", "text-red-500", "text-4xl", "mb-2"], [1, "text-red-700"], [1, "bg-white", "rounded-xl", "border", "border-slate-200", "p-6"], [1, "text-sm", "text-slate-600", "mb-1"], [1, "text-3xl", "font-bold", "text-slate-800"], [1, "text-3xl", "font-bold", "text-blue-600"], [1, "bg-white", "rounded-xl", "border", "border-slate-200", "overflow-hidden"], [1, "px-6", "py-4", "border-b", "border-slate-200"], [1, "text-lg", "font-semibold", "text-slate-800"], [1, "overflow-x-auto"], [1, "min-w-full", "divide-y", "divide-slate-200"], [1, "bg-slate-50"], [1, "px-6", "py-3", "text-left", "text-xs", "font-medium", "text-slate-500", "uppercase"], [1, "bg-white", "divide-y", "divide-slate-200"], [1, "hover:bg-slate-50"], [1, "px-6", "py-4", "bg-slate-50", "border-t", "border-slate-200", "flex", "items-center", "justify-between"], [1, "text-sm", "text-slate-600"], [1, "flex", "items-center", "gap-2"], [1, "px-4", "py-2", "text-sm", "font-medium", "text-slate-700", "bg-white", "border", "border-slate-300", "rounded-lg", "hover:bg-slate-50", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "px-6", "py-4", "whitespace-nowrap", "text-sm", "text-slate-600"], [1, "px-6", "py-4", "whitespace-nowrap"], [1, "flex", "items-center"], [1, "flex-shrink-0", "h-8", "w-8", "bg-blue-100", "rounded-full", "flex", "items-center", "justify-center"], [1, "text-blue-600", "font-semibold", "text-xs"], [1, "ml-3"], [1, "text-sm", "font-medium", "text-slate-900"], [1, "flex", "items-center", "text-sm", "text-slate-600"], [1, "material-icons", "text-sm", "mr-1"], [1, "px-6", "py-4", "text-sm", "text-slate-600", "max-w-md", "truncate"], [1, "material-icons", "text-slate-300", "text-6xl", "mb-4"], [1, "text-slate-600"]], template: function AuditTrailComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div")(4, "label", 3);
      \u0275\u0275text(5, "Action");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "select", 4);
      \u0275\u0275twoWayListener("ngModelChange", function AuditTrailComponent_Template_select_ngModelChange_6_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.auditFilters.action, $event) || (ctx.auditFilters.action = $event);
        return $event;
      });
      \u0275\u0275listener("change", function AuditTrailComponent_Template_select_change_6_listener() {
        return ctx.loadAuditTrail();
      });
      \u0275\u0275elementStart(7, "option", 5);
      \u0275\u0275text(8, "Toutes");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(9, AuditTrailComponent_For_10_Template, 2, 2, "option", 6, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "div")(12, "label", 3);
      \u0275\u0275text(13, "Type d'Entit\xE9");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "select", 4);
      \u0275\u0275twoWayListener("ngModelChange", function AuditTrailComponent_Template_select_ngModelChange_14_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.auditFilters.entity, $event) || (ctx.auditFilters.entity = $event);
        return $event;
      });
      \u0275\u0275listener("change", function AuditTrailComponent_Template_select_change_14_listener() {
        return ctx.loadAuditTrail();
      });
      \u0275\u0275elementStart(15, "option", 5);
      \u0275\u0275text(16, "Tous");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(17, AuditTrailComponent_For_18_Template, 2, 2, "option", 6, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(19, "div")(20, "label", 3);
      \u0275\u0275text(21, "Recherche");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "input", 7);
      \u0275\u0275twoWayListener("ngModelChange", function AuditTrailComponent_Template_input_ngModelChange_22_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.searchQuery, $event) || (ctx.searchQuery = $event);
        return $event;
      });
      \u0275\u0275listener("input", function AuditTrailComponent_Template_input_input_22_listener() {
        return ctx.loadAuditTrail();
      });
      \u0275\u0275elementEnd()()()();
      \u0275\u0275conditionalCreate(23, AuditTrailComponent_Conditional_23_Template, 4, 0, "div", 8)(24, AuditTrailComponent_Conditional_24_Template, 5, 1, "div", 9)(25, AuditTrailComponent_Conditional_25_Template, 47, 11)(26, AuditTrailComponent_Conditional_26_Template, 5, 0, "div", 10);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.auditFilters.action);
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.auditActions);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.auditFilters.entity);
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.entityTypes);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.searchQuery);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isLoading() ? 23 : ctx.error() ? 24 : ctx.auditPage() && ctx.auditPage().content.length > 0 ? 25 : 26);
    }
  }, dependencies: [CommonModule, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, DatePipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuditTrailComponent, [{
    type: Component,
    args: [{
      selector: "app-audit-trail",
      standalone: true,
      imports: [CommonModule, FormsModule],
      template: `
    <div class="space-y-6">
      <!-- FILTRES SUPPL\xC9MENTAIRES POUR AUDIT -->
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
            <label class="block text-sm font-medium text-slate-700 mb-1">Type d'Entit\xE9</label>
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
            <p class="text-sm text-slate-600 mb-1">Total Entr\xE9es</p>
            <p class="text-3xl font-bold text-slate-800">{{ auditPage()!.totalElements }}</p>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <p class="text-sm text-slate-600 mb-1">Page Actuelle</p>
            <p class="text-3xl font-bold text-blue-600">
              {{ auditPage()!.number + 1 }} / {{ auditPage()!.totalPages }}
            </p>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <p class="text-sm text-slate-600 mb-1">Entr\xE9es par Page</p>
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
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Entit\xE9</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">D\xE9tails</th>
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
              \xE0 {{ Math.min((auditPage()!.number + 1) * auditPage()!.size, auditPage()!.totalElements) }}
              sur {{ auditPage()!.totalElements }} entr\xE9es
            </div>
            <div class="flex items-center gap-2">
              <button
                [disabled]="auditPage()!.first"
                (click)="previousPage()"
                class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pr\xE9c\xE9dent
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
          <p class="text-slate-600">Aucune entr\xE9e d'audit trouv\xE9e</p>
        </div>
      }
    </div>
  `
    }]
  }], null, { filters: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AuditTrailComponent, { className: "AuditTrailComponent", filePath: "src/app/features/admin/reports/audit/audit-trail.component.ts", lineNumber: 189 });
})();

// src/app/features/admin/reports/reports.component.ts
var _forTrack05 = ($index, $item) => $item.id;
function ReportsComponent_For_62_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 28);
    \u0275\u0275listener("click", function ReportsComponent_For_62_Template_button_click_0_listener() {
      const tab_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.selectTab(tab_r2.id));
    });
    \u0275\u0275elementStart(1, "span", 29);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tab_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("border-blue-500", ctx_r2.activeTab() === tab_r2.id)("text-blue-600", ctx_r2.activeTab() === tab_r2.id)("border-transparent", ctx_r2.activeTab() !== tab_r2.id)("text-slate-600", ctx_r2.activeTab() !== tab_r2.id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(tab_r2.icon);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", tab_r2.label, " ");
  }
}
function ReportsComponent_Conditional_64_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-availability-report", 27);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("filters", ctx_r2.filterForm.value);
  }
}
function ReportsComponent_Conditional_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-room-utilization-report", 27);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("filters", ctx_r2.filterForm.value);
  }
}
function ReportsComponent_Conditional_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-workload-report", 27);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("filters", ctx_r2.filterForm.value);
  }
}
function ReportsComponent_Conditional_67_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-audit-trail", 27);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("filters", ctx_r2.filterForm.value);
  }
}
var ReportsComponent = class _ReportsComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);
  reportService = inject(ReportService);
  tabs = [
    { id: "availability", label: "Disponibilit\xE9s", icon: "event_available" },
    { id: "rooms", label: "Salles", icon: "meeting_room" },
    { id: "workload", label: "Charge Horaire", icon: "schedule" },
    { id: "audit", label: "Audit", icon: "history" }
  ];
  activeTab = signal("availability", ...ngDevMode ? [{ debugName: "activeTab" }] : []);
  filterForm;
  constructor() {
    this.filterForm = this.fb.group({
      startDate: [""],
      endDate: [""],
      ecoleId: [""],
      filiereId: [""],
      enseignantId: [""],
      salleId: [""]
    });
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const tab = params["tab"];
      if (tab && this.tabs.some((t) => t.id === tab)) {
        this.activeTab.set(tab);
      }
    });
  }
  /**
   * Change l'onglet actif
   */
  selectTab(tabId) {
    this.activeTab.set(tabId);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabId },
      queryParamsHandling: "merge"
    });
  }
  /**
   * Applique les filtres
   */
  applyFilters() {
  }
  /**
   * Réinitialise les filtres
   */
  resetFilters() {
    this.filterForm.reset();
  }
  /**
   * Exporte le rapport actif
   */
  exportReport(format) {
    const filters = this.filterForm.value;
    const reportType = this.getReportType(this.activeTab());
    if (!reportType)
      return;
    const exportMethod = format === "pdf" ? this.reportService.exportReportPDF(reportType, filters) : this.reportService.exportReportExcel(reportType, filters);
    exportMethod.subscribe({
      next: (blob) => {
        const filename = this.reportService.generateExportFilename(reportType, format);
        this.reportService.downloadFile(blob, filename);
      },
      error: (err) => {
        console.error("Export error:", err);
        alert("Erreur lors de l'export du rapport");
      }
    });
  }
  /**
   * Convertit le type d'onglet en ReportType
   */
  getReportType(tab) {
    const mapping = {
      availability: "AVAILABILITY",
      rooms: "ROOM_UTILIZATION",
      workload: "WORKLOAD",
      audit: "AUDIT"
    };
    return mapping[tab];
  }
  static \u0275fac = function ReportsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ReportsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ReportsComponent, selectors: [["app-reports"]], decls: 68, vars: 2, consts: [[1, "flex-1", "p-6"], [1, "mb-6"], [1, "text-2xl", "font-bold", "text-slate-800", "flex", "items-center", "gap-2", "mb-2"], [1, "material-icons", "text-slate-700"], [1, "text-sm", "text-slate-600"], [1, "bg-white", "rounded-xl", "shadow-sm", "p-6", "mb-6"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "text-lg", "font-semibold", "text-slate-800"], [1, "flex", "items-center", "gap-2"], [1, "px-4", "py-2", "text-sm", "font-medium", "text-slate-600", "hover:text-slate-800", "hover:bg-slate-100", "rounded-lg", "transition", 3, "click"], [1, "material-icons", "text-sm", "mr-1"], [1, "px-4", "py-2", "text-sm", "font-medium", "text-white", "bg-red-600", "hover:bg-red-700", "rounded-lg", "transition", "flex", "items-center", 3, "click"], [1, "px-4", "py-2", "text-sm", "font-medium", "text-white", "bg-green-600", "hover:bg-green-700", "rounded-lg", "transition", "flex", "items-center", 3, "click"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "lg:grid-cols-6", "gap-4", 3, "formGroup"], [1, "block", "text-sm", "font-medium", "text-slate-700", "mb-1"], ["type", "date", "formControlName", "startDate", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent"], ["type", "date", "formControlName", "endDate", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent"], ["formControlName", "ecoleId", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent"], ["value", ""], ["formControlName", "filiereId", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent"], ["formControlName", "enseignantId", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent"], ["formControlName", "salleId", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent"], [1, "bg-white", "rounded-xl", "shadow-sm", "mb-6"], [1, "border-b", "border-slate-200"], [1, "flex", "-mb-px"], [1, "flex", "items-center", "gap-2", "px-6", "py-4", "border-b-2", "font-medium", "text-sm", "hover:text-blue-600", "transition", 3, "border-blue-500", "text-blue-600", "border-transparent", "text-slate-600"], [1, "p-6"], [3, "filters"], [1, "flex", "items-center", "gap-2", "px-6", "py-4", "border-b-2", "font-medium", "text-sm", "hover:text-blue-600", "transition", 3, "click"], [1, "material-icons", "text-sm"]], template: function ReportsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2)(3, "span", 3);
      \u0275\u0275text(4, "assessment");
      \u0275\u0275elementEnd();
      \u0275\u0275text(5, " Rapports & Statistiques ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "p", 4);
      \u0275\u0275text(7, " Consultez et exportez les rapports du syst\xE8me ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 5)(9, "div", 6)(10, "h2", 7);
      \u0275\u0275text(11, "Filtres");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "div", 8)(13, "button", 9);
      \u0275\u0275listener("click", function ReportsComponent_Template_button_click_13_listener() {
        return ctx.resetFilters();
      });
      \u0275\u0275elementStart(14, "span", 10);
      \u0275\u0275text(15, "refresh");
      \u0275\u0275elementEnd();
      \u0275\u0275text(16, " R\xE9initialiser ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "button", 11);
      \u0275\u0275listener("click", function ReportsComponent_Template_button_click_17_listener() {
        return ctx.exportReport("pdf");
      });
      \u0275\u0275elementStart(18, "span", 10);
      \u0275\u0275text(19, "picture_as_pdf");
      \u0275\u0275elementEnd();
      \u0275\u0275text(20, " Export PDF ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "button", 12);
      \u0275\u0275listener("click", function ReportsComponent_Template_button_click_21_listener() {
        return ctx.exportReport("excel");
      });
      \u0275\u0275elementStart(22, "span", 10);
      \u0275\u0275text(23, "description");
      \u0275\u0275elementEnd();
      \u0275\u0275text(24, " Export Excel ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(25, "form", 13)(26, "div")(27, "label", 14);
      \u0275\u0275text(28, "Date D\xE9but");
      \u0275\u0275elementEnd();
      \u0275\u0275element(29, "input", 15);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "div")(31, "label", 14);
      \u0275\u0275text(32, "Date Fin");
      \u0275\u0275elementEnd();
      \u0275\u0275element(33, "input", 16);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "div")(35, "label", 14);
      \u0275\u0275text(36, "\xC9cole");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "select", 17)(38, "option", 18);
      \u0275\u0275text(39, "Toutes");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(40, "div")(41, "label", 14);
      \u0275\u0275text(42, "Fili\xE8re");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "select", 19)(44, "option", 18);
      \u0275\u0275text(45, "Toutes");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(46, "div")(47, "label", 14);
      \u0275\u0275text(48, "Enseignant");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "select", 20)(50, "option", 18);
      \u0275\u0275text(51, "Tous");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(52, "div")(53, "label", 14);
      \u0275\u0275text(54, "Salle");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "select", 21)(56, "option", 18);
      \u0275\u0275text(57, "Toutes");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(58, "div", 22)(59, "div", 23)(60, "nav", 24);
      \u0275\u0275repeaterCreate(61, ReportsComponent_For_62_Template, 4, 10, "button", 25, _forTrack05);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(63, "div", 26);
      \u0275\u0275conditionalCreate(64, ReportsComponent_Conditional_64_Template, 1, 1, "app-availability-report", 27)(65, ReportsComponent_Conditional_65_Template, 1, 1, "app-room-utilization-report", 27)(66, ReportsComponent_Conditional_66_Template, 1, 1, "app-workload-report", 27)(67, ReportsComponent_Conditional_67_Template, 1, 1, "app-audit-trail", 27);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(25);
      \u0275\u0275property("formGroup", ctx.filterForm);
      \u0275\u0275advance(36);
      \u0275\u0275repeater(ctx.tabs);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.activeTab() === "availability" ? 64 : ctx.activeTab() === "rooms" ? 65 : ctx.activeTab() === "workload" ? 66 : ctx.activeTab() === "audit" ? 67 : -1);
    }
  }, dependencies: [
    CommonModule,
    FormsModule,
    \u0275NgNoValidate,
    NgSelectOption,
    \u0275NgSelectMultipleOption,
    DefaultValueAccessor,
    SelectControlValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    ReactiveFormsModule,
    FormGroupDirective,
    FormControlName,
    AvailabilityReportComponent,
    WorkloadReportComponent,
    RoomUtilizationReportComponent,
    AuditTrailComponent
  ], styles: ["\n\n/*# sourceMappingURL=reports.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ReportsComponent, [{
    type: Component,
    args: [{ selector: "app-reports", standalone: true, imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      AvailabilityReportComponent,
      WorkloadReportComponent,
      RoomUtilizationReportComponent,
      AuditTrailComponent
    ], template: `<div class="flex-1 p-6">
  <!-- HEADER -->
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-2">
      <span class="material-icons text-slate-700">assessment</span>
      Rapports & Statistiques
    </h1>
    <p class="text-sm text-slate-600">
      Consultez et exportez les rapports du syst\xE8me
    </p>
  </div>

  <!-- FILTRES GLOBAUX -->
  <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-slate-800">Filtres</h2>
      <div class="flex items-center gap-2">
        <button
          (click)="resetFilters()"
          class="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
        >
          <span class="material-icons text-sm mr-1">refresh</span>
          R\xE9initialiser
        </button>
        <button
          (click)="exportReport('pdf')"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center"
        >
          <span class="material-icons text-sm mr-1">picture_as_pdf</span>
          Export PDF
        </button>
        <button
          (click)="exportReport('excel')"
          class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition flex items-center"
        >
          <span class="material-icons text-sm mr-1">description</span>
          Export Excel
        </button>
      </div>
    </div>

    <form [formGroup]="filterForm" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Date D\xE9but</label>
        <input
          type="date"
          formControlName="startDate"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Date Fin</label>
        <input
          type="date"
          formControlName="endDate"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">\xC9cole</label>
        <select
          formControlName="ecoleId"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Toutes</option>
          <!-- Options dynamiques -->
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Fili\xE8re</label>
        <select
          formControlName="filiereId"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Toutes</option>
          <!-- Options dynamiques -->
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Enseignant</label>
        <select
          formControlName="enseignantId"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tous</option>
          <!-- Options dynamiques -->
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Salle</label>
        <select
          formControlName="salleId"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Toutes</option>
          <!-- Options dynamiques -->
        </select>
      </div>
    </form>
  </div>

  <!-- ONGLETS -->
  <div class="bg-white rounded-xl shadow-sm mb-6">
    <div class="border-b border-slate-200">
      <nav class="flex -mb-px">
        @for (tab of tabs; track tab.id) {
          <button
            (click)="selectTab(tab.id)"
            [class.border-blue-500]="activeTab() === tab.id"
            [class.text-blue-600]="activeTab() === tab.id"
            [class.border-transparent]="activeTab() !== tab.id"
            [class.text-slate-600]="activeTab() !== tab.id"
            class="flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm hover:text-blue-600 transition"
          >
            <span class="material-icons text-sm">{{ tab.icon }}</span>
            {{ tab.label }}
          </button>
        }
      </nav>
    </div>

    <!-- CONTENU DES ONGLETS -->
    <div class="p-6">
      @if (activeTab() === 'availability') {
        <app-availability-report [filters]="filterForm.value"></app-availability-report>
      } @else if (activeTab() === 'rooms') {
        <app-room-utilization-report [filters]="filterForm.value"></app-room-utilization-report>
      } @else if (activeTab() === 'workload') {
        <app-workload-report [filters]="filterForm.value"></app-workload-report>
      } @else if (activeTab() === 'audit') {
        <app-audit-trail [filters]="filterForm.value"></app-audit-trail>
      }
    </div>
  </div>
</div>
`, styles: ["/* src/app/features/admin/reports/reports.component.scss */\n/*# sourceMappingURL=reports.component.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ReportsComponent, { className: "ReportsComponent", filePath: "src/app/features/admin/reports/reports.component.ts", lineNumber: 35 });
})();
export {
  ReportsComponent
};
//# sourceMappingURL=chunk-DO4VCF57.js.map
