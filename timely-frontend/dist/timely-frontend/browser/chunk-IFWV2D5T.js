import {
  Router,
  RouterModule
} from "./chunk-SG7N3ZM6.js";
import {
  EcoleService
} from "./chunk-BQGZQQHM.js";
import "./chunk-M2M2Z2ZK.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  MaxValidator,
  MinValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  ReactiveFormsModule,
  SelectControlValueAccessor,
  Validators,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-Y74VR2WI.js";
import {
  environment
} from "./chunk-AL3K22XE.js";
import {
  CommonModule,
  HttpClient,
  HttpParams,
  NgClass
} from "./chunk-GGDRA3L4.js";
import {
  Component,
  Injectable,
  catchError,
  finalize,
  inject,
  of,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-DBHCOGA3.js";
import "./chunk-WDMUDEB6.js";

// src/app/core/services/planning.service.ts
var PlanningService = class _PlanningService {
  http = inject(HttpClient);
  baseUrl = `${environment.apiUrl}/planning/plannings`;
  /**
   * Génère automatiquement un emploi du temps
   */
  generateSchedule(request) {
    return this.http.post(`${this.baseUrl}/generate`, request);
  }
  /**
   * Crée un emploi du temps manuellement
   */
  createEmploiDuTemps(request) {
    return this.http.post(this.baseUrl, request);
  }
  /**
   * Récupère un emploi du temps par son ID
   */
  getEmploiDuTempsById(id) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
  /**
   * Récupère tous les emplois du temps avec pagination
   */
  getAllEmploisDuTemps(page = 0, size = 20) {
    const params = new HttpParams().set("page", page.toString()).set("size", size.toString());
    return this.http.get(this.baseUrl, { params });
  }
  /**
   * Recherche avancée d'emplois du temps
   */
  searchEmploisDuTemps(request) {
    let params = new HttpParams();
    if (request.dateDebut)
      params = params.set("dateDebut", request.dateDebut);
    if (request.dateFin)
      params = params.set("dateFin", request.dateFin);
    if (request.ecoleId)
      params = params.set("ecoleId", request.ecoleId);
    if (request.statut)
      params = params.set("statut", request.statut);
    if (request.periode)
      params = params.set("periode", request.periode);
    if (request.page !== void 0)
      params = params.set("page", request.page.toString());
    if (request.size !== void 0)
      params = params.set("size", request.size.toString());
    return this.http.get(`${this.baseUrl}/search`, { params });
  }
  /**
   * Met à jour un emploi du temps
   */
  updateEmploiDuTemps(id, request) {
    return this.http.put(`${this.baseUrl}/${id}`, request);
  }
  /**
   * Supprime un emploi du temps
   */
  deleteEmploiDuTemps(id) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  /**
   * Valide un emploi du temps
   */
  validateEmploi(id) {
    return this.http.put(`${this.baseUrl}/${id}/validate`, {});
  }
  /**
   * Publie un emploi du temps
   */
  publishEmploi(id) {
    return this.http.put(`${this.baseUrl}/${id}/publish`, {});
  }
  // ==================== CRUD Créneaux ====================
  /**
   * Crée un créneau dans un emploi du temps
   */
  createCreneau(emploiId, request) {
    return this.http.post(`${this.baseUrl}/${emploiId}/creneaux`, request);
  }
  /**
   * Récupère les créneaux d'un emploi du temps
   */
  getCreneauxByEmploi(emploiId, page = 0, size = 20) {
    const params = new HttpParams().set("page", page.toString()).set("size", size.toString());
    return this.http.get(`${this.baseUrl}/${emploiId}/creneaux`, { params });
  }
  /**
   * Récupère un créneau par son ID
   */
  getCreneauById(emploiId, creneauId) {
    return this.http.get(`${this.baseUrl}/${emploiId}/creneaux/${creneauId}`);
  }
  /**
   * Met à jour un créneau
   */
  updateCreneau(emploiId, creneauId, request) {
    return this.http.put(`${this.baseUrl}/${emploiId}/creneaux/${creneauId}`, request);
  }
  /**
   * Supprime un créneau
   */
  deleteCreneau(emploiId, creneauId) {
    return this.http.delete(`${this.baseUrl}/${emploiId}/creneaux/${creneauId}`);
  }
  // ==================== Conflits ====================
  /**
   * Récupère les conflits d'un emploi du temps
   */
  getConflitsByEmploi(emploiId) {
    return this.http.get(`${this.baseUrl}/${emploiId}/conflits`);
  }
  /**
   * Récupère un conflit par son ID
   */
  getConflitById(emploiId, conflitId) {
    return this.http.get(`${this.baseUrl}/${emploiId}/conflits/${conflitId}`);
  }
  /**
   * Compte les conflits non résolus d'un emploi du temps
   */
  countNonResolus(emploiId) {
    return this.http.get(`${this.baseUrl}/${emploiId}/conflits/count-non-resolus`);
  }
  /**
   * Résout un conflit
   */
  resolveConflit(emploiId, conflitId, resolution) {
    return this.http.put(`${this.baseUrl}/${emploiId}/conflits/${conflitId}/resolve`, resolution);
  }
  // ==================== Export ====================
  /**
   * Exporte un emploi du temps en PDF
   */
  exportToPDF(id) {
    return this.http.get(`${this.baseUrl}/${id}/export/pdf`, {
      responseType: "blob"
    });
  }
  /**
   * Exporte un emploi du temps en iCal
   */
  exportToICal(id) {
    return this.http.get(`${this.baseUrl}/${id}/export/ical`, {
      responseType: "blob"
    });
  }
  // ==================== Helpers ====================
  /**
   * Télécharge un fichier blob
   */
  downloadFile(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
  static \u0275fac = function PlanningService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PlanningService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PlanningService, factory: _PlanningService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PlanningService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/features/admin/schedule/generator/schedule-generator.component.ts
var _forTrack0 = ($index, $item) => $item.coursId;
var _forTrack1 = ($index, $item) => $item.id;
var _forTrack2 = ($index, $item) => $item.value;
function ScheduleGeneratorComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5)(1, "div", 8);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(2, "svg", 9);
    \u0275\u0275element(3, "path", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.errorMessage());
  }
}
function ScheduleGeneratorComponent_Conditional_8_Conditional_27_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cours_r3 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", cours_r3.intitule, " - ", cours_r3.raison);
  }
}
function ScheduleGeneratorComponent_Conditional_8_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "h4", 24);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ul", 25);
    \u0275\u0275repeaterCreate(4, ScheduleGeneratorComponent_Conditional_8_Conditional_27_For_5_Template, 2, 2, "li", null, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Cours non planifi\xE9s (", ctx_r0.generationResult().coursNonPlanifies.length, ")");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.generationResult().coursNonPlanifies);
  }
}
function ScheduleGeneratorComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6)(1, "div", 11);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(2, "svg", 12);
    \u0275\u0275element(3, "path", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(4, "h3", 14);
    \u0275\u0275text(5, "G\xE9n\xE9ration termin\xE9e");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 15)(7, "div", 16)(8, "p", 17);
    \u0275\u0275text(9, "Taux de r\xE9ussite");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 18);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 16)(13, "p", 17);
    \u0275\u0275text(14, "Cours planifi\xE9s");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "p", 19);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 16)(18, "p", 17);
    \u0275\u0275text(19, "Conflits d\xE9tect\xE9s");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "p", 19);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 16)(23, "p", 17);
    \u0275\u0275text(24, "Dur\xE9e de g\xE9n\xE9ration");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "p", 19);
    \u0275\u0275text(26);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(27, ScheduleGeneratorComponent_Conditional_8_Conditional_27_Template, 6, 1, "div", 20);
    \u0275\u0275elementStart(28, "div", 21)(29, "button", 22);
    \u0275\u0275listener("click", function ScheduleGeneratorComponent_Conditional_8_Template_button_click_29_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.viewSchedule());
    });
    \u0275\u0275text(30, " Visualiser l'emploi du temps ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "button", 23);
    \u0275\u0275listener("click", function ScheduleGeneratorComponent_Conditional_8_Template_button_click_31_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.resetForm());
    });
    \u0275\u0275text(32, " G\xE9n\xE9rer un nouveau ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(10);
    \u0275\u0275property("ngClass", ctx_r0.getSeverityClass());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.generationResult().tauxReussite.toFixed(1), "% ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2(" ", ctx_r0.generationResult().coursPlanifies, " / ", ctx_r0.generationResult().totalCoursAPlanifier, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r0.generationResult().conflitsDetectes, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", (ctx_r0.generationResult().dureeGenerationMs / 1e3).toFixed(2), "s ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.generationResult().coursNonPlanifies.length > 0 ? 27 : -1);
  }
}
function ScheduleGeneratorComponent_Conditional_9_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 33);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ecole_r5 = ctx.$implicit;
    \u0275\u0275property("value", ecole_r5.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", ecole_r5.nom, " (", ecole_r5.code, ")");
  }
}
function ScheduleGeneratorComponent_Conditional_9_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 34);
    \u0275\u0275text(1, "L'\xE9cole est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function ScheduleGeneratorComponent_Conditional_9_For_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 33);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r6 = ctx.$implicit;
    \u0275\u0275property("value", option_r6.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(option_r6.label);
  }
}
function ScheduleGeneratorComponent_Conditional_9_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 34);
    \u0275\u0275text(1, "La date de d\xE9but est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function ScheduleGeneratorComponent_Conditional_9_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 34);
    \u0275\u0275text(1, "La date de fin est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function ScheduleGeneratorComponent_Conditional_9_Conditional_64_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 54);
    \u0275\u0275element(1, "circle", 55)(2, "path", 56);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " G\xE9n\xE9ration en cours... ");
  }
}
function ScheduleGeneratorComponent_Conditional_9_Conditional_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " G\xE9n\xE9rer l'emploi du temps ");
  }
}
function ScheduleGeneratorComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 26);
    \u0275\u0275listener("ngSubmit", function ScheduleGeneratorComponent_Conditional_9_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSubmit());
    });
    \u0275\u0275elementStart(1, "div", 2)(2, "h3", 27);
    \u0275\u0275text(3, "Informations de base");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 28)(5, "div")(6, "label", 29);
    \u0275\u0275text(7, " \xC9cole ");
    \u0275\u0275elementStart(8, "span", 30);
    \u0275\u0275text(9, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "select", 31)(11, "option", 32);
    \u0275\u0275text(12, "S\xE9lectionner une \xE9cole");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(13, ScheduleGeneratorComponent_Conditional_9_For_14_Template, 2, 3, "option", 33, _forTrack1);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(15, ScheduleGeneratorComponent_Conditional_9_Conditional_15_Template, 2, 0, "p", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div")(17, "label", 35);
    \u0275\u0275text(18, " P\xE9riode ");
    \u0275\u0275elementStart(19, "span", 30);
    \u0275\u0275text(20, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "select", 36);
    \u0275\u0275repeaterCreate(22, ScheduleGeneratorComponent_Conditional_9_For_23_Template, 2, 2, "option", 33, _forTrack2);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div")(25, "label", 37);
    \u0275\u0275text(26, " Date de d\xE9but ");
    \u0275\u0275elementStart(27, "span", 30);
    \u0275\u0275text(28, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(29, "input", 38);
    \u0275\u0275conditionalCreate(30, ScheduleGeneratorComponent_Conditional_9_Conditional_30_Template, 2, 0, "p", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div")(32, "label", 39);
    \u0275\u0275text(33, " Date de fin ");
    \u0275\u0275elementStart(34, "span", 30);
    \u0275\u0275text(35, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(36, "input", 40);
    \u0275\u0275conditionalCreate(37, ScheduleGeneratorComponent_Conditional_9_Conditional_37_Template, 2, 0, "p", 34);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(38, "div", 2)(39, "h3", 27);
    \u0275\u0275text(40, "Configuration avanc\xE9e");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "div", 28)(42, "div")(43, "label", 41);
    \u0275\u0275text(44, " Cr\xE9neaux par jour ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(45, "input", 42);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "div")(47, "label", 43);
    \u0275\u0275text(48, " Dur\xE9e du cr\xE9neau (minutes) ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(49, "input", 44);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "div")(51, "label", 45);
    \u0275\u0275text(52, " Heure de d\xE9but ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(53, "input", 46);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "div")(55, "label", 47);
    \u0275\u0275text(56, " Heure de fin ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(57, "input", 48);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "div")(59, "label", 49);
    \u0275\u0275text(60, " Pause entre cr\xE9neaux (minutes) ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(61, "input", 50);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(62, "div", 51)(63, "button", 52);
    \u0275\u0275conditionalCreate(64, ScheduleGeneratorComponent_Conditional_9_Conditional_64_Template, 4, 0)(65, ScheduleGeneratorComponent_Conditional_9_Conditional_65_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(66, "button", 53);
    \u0275\u0275listener("click", function ScheduleGeneratorComponent_Conditional_9_Template_button_click_66_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.resetForm());
    });
    \u0275\u0275text(67, " R\xE9initialiser ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_5_0;
    let tmp_6_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("formGroup", ctx_r0.generatorForm);
    \u0275\u0275advance(13);
    \u0275\u0275repeater(ctx_r0.ecoles());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_3_0 = ctx_r0.generatorForm.get("ecoleId")) == null ? null : tmp_3_0.touched) && ((tmp_3_0 = ctx_r0.generatorForm.get("ecoleId")) == null ? null : tmp_3_0.errors) ? 15 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r0.periodeOptions);
    \u0275\u0275advance(8);
    \u0275\u0275conditional(((tmp_5_0 = ctx_r0.generatorForm.get("dateDebut")) == null ? null : tmp_5_0.touched) && ((tmp_5_0 = ctx_r0.generatorForm.get("dateDebut")) == null ? null : tmp_5_0.errors) ? 30 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275conditional(((tmp_6_0 = ctx_r0.generatorForm.get("dateFin")) == null ? null : tmp_6_0.touched) && ((tmp_6_0 = ctx_r0.generatorForm.get("dateFin")) == null ? null : tmp_6_0.errors) ? 37 : -1);
    \u0275\u0275advance(26);
    \u0275\u0275property("disabled", ctx_r0.isLoading() || ctx_r0.generatorForm.invalid);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isLoading() ? 64 : 65);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.isLoading());
  }
}
var ScheduleGeneratorComponent = class _ScheduleGeneratorComponent {
  fb = inject(FormBuilder);
  planningService = inject(PlanningService);
  ecoleService = inject(EcoleService);
  router = inject(Router);
  generatorForm;
  isLoading = signal(false, ...ngDevMode ? [{ debugName: "isLoading" }] : []);
  errorMessage = signal(null, ...ngDevMode ? [{ debugName: "errorMessage" }] : []);
  generationResult = signal(null, ...ngDevMode ? [{ debugName: "generationResult" }] : []);
  ecoles = signal([], ...ngDevMode ? [{ debugName: "ecoles" }] : []);
  periodeOptions = [
    { value: "SEMESTRE_1", label: "Semestre 1" },
    { value: "SEMESTRE_2", label: "Semestre 2" },
    { value: "ANNUEL", label: "Annuel" }
  ];
  constructor() {
    this.generatorForm = this.fb.group({
      ecoleId: ["", Validators.required],
      dateDebut: ["", Validators.required],
      dateFin: ["", Validators.required],
      periode: ["SEMESTRE_1", Validators.required],
      creneauxParJour: [6, [Validators.required, Validators.min(1), Validators.max(12)]],
      heureDebutJournee: ["08:00", Validators.required],
      heureFinJournee: ["18:00", Validators.required],
      dureeCreneauMinutes: [90, [Validators.required, Validators.min(30), Validators.max(240)]],
      pauseEntreCreneauxMinutes: [15, [Validators.required, Validators.min(0), Validators.max(60)]]
    });
  }
  ngOnInit() {
    this.ecoleService.fetchEcolesFromApi().pipe(catchError(() => of([]))).subscribe((ecoles) => this.ecoles.set(ecoles));
  }
  onSubmit() {
    if (this.generatorForm.invalid) {
      this.generatorForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.generationResult.set(null);
    const request = this.generatorForm.value;
    this.planningService.generateSchedule(request).pipe(catchError((error) => {
      console.error("Erreur lors de la g\xE9n\xE9ration:", error);
      this.errorMessage.set(error.error?.message || "Une erreur est survenue lors de la g\xE9n\xE9ration de l'emploi du temps");
      return of(null);
    }), finalize(() => this.isLoading.set(false))).subscribe((response) => {
      if (response) {
        this.generationResult.set(response);
      }
    });
  }
  viewSchedule() {
    const result = this.generationResult();
    if (result) {
      this.router.navigate(["/admin/schedule/viewer", result.emploiDuTempsId]);
    }
  }
  resetForm() {
    this.generatorForm.reset({
      periode: "SEMESTRE_1",
      creneauxParJour: 6,
      heureDebutJournee: "08:00",
      heureFinJournee: "18:00",
      dureeCreneauMinutes: 90,
      pauseEntreCreneauxMinutes: 15
    });
    this.errorMessage.set(null);
    this.generationResult.set(null);
  }
  getSeverityClass() {
    const result = this.generationResult();
    if (!result)
      return "";
    if (result.tauxReussite >= 90)
      return "text-green-600";
    if (result.tauxReussite >= 70)
      return "text-yellow-600";
    return "text-red-600";
  }
  static \u0275fac = function ScheduleGeneratorComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ScheduleGeneratorComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ScheduleGeneratorComponent, selectors: [["app-schedule-generator"]], decls: 10, vars: 3, consts: [[1, "container", "mx-auto", "px-4", "py-6"], [1, "max-w-4xl", "mx-auto"], [1, "mb-6"], [1, "text-2xl", "font-bold", "text-gray-800", "mb-2"], [1, "text-gray-600"], [1, "bg-red-50", "border", "border-red-200", "text-red-800", "px-4", "py-3", "rounded-lg", "mb-6"], [1, "bg-white", "shadow-lg", "rounded-lg", "p-6", "mb-6", "border", "border-green-200"], [1, "bg-white", "shadow-lg", "rounded-lg", "p-6", 3, "formGroup"], [1, "flex", "items-start"], ["fill", "currentColor", "viewBox", "0 0 20 20", 1, "w-5", "h-5", "mt-0.5", "mr-3"], ["fill-rule", "evenodd", "d", "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", "clip-rule", "evenodd"], [1, "flex", "items-center", "mb-4"], ["fill", "currentColor", "viewBox", "0 0 20 20", 1, "w-8", "h-8", "text-green-500", "mr-3"], ["fill-rule", "evenodd", "d", "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", "clip-rule", "evenodd"], [1, "text-xl", "font-semibold", "text-gray-800"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4", "mb-4"], [1, "bg-gray-50", "p-4", "rounded-lg"], [1, "text-sm", "text-gray-600", "mb-1"], [1, "text-2xl", "font-bold", 3, "ngClass"], [1, "text-2xl", "font-bold", "text-gray-800"], [1, "bg-yellow-50", "border", "border-yellow-200", "rounded-lg", "p-4", "mb-4"], [1, "flex", "gap-3"], ["type", "button", 1, "flex-1", "bg-blue-600", "hover:bg-blue-700", "text-white", "font-medium", "px-6", "py-2", "rounded-lg", "transition-colors", 3, "click"], ["type", "button", 1, "flex-1", "bg-gray-200", "hover:bg-gray-300", "text-gray-800", "font-medium", "px-6", "py-2", "rounded-lg", "transition-colors", 3, "click"], [1, "font-semibold", "text-yellow-800", "mb-2"], [1, "list-disc", "list-inside", "text-sm", "text-yellow-700", "space-y-1"], [1, "bg-white", "shadow-lg", "rounded-lg", "p-6", 3, "ngSubmit", "formGroup"], [1, "text-lg", "font-semibold", "text-gray-800", "mb-4"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4"], ["for", "ecoleId", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], [1, "text-red-500"], ["id", "ecoleId", "formControlName", "ecoleId", 1, "w-full", "px-4", "py-2", "border", "border-gray-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", "bg-white"], ["value", "", "disabled", ""], [3, "value"], [1, "text-red-500", "text-sm", "mt-1"], ["for", "periode", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], ["id", "periode", "formControlName", "periode", 1, "w-full", "px-4", "py-2", "border", "border-gray-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent"], ["for", "dateDebut", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], ["type", "date", "id", "dateDebut", "formControlName", "dateDebut", 1, "w-full", "px-4", "py-2", "border", "border-gray-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent"], ["for", "dateFin", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], ["type", "date", "id", "dateFin", "formControlName", "dateFin", 1, "w-full", "px-4", "py-2", "border", "border-gray-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent"], ["for", "creneauxParJour", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], ["type", "number", "id", "creneauxParJour", "formControlName", "creneauxParJour", "min", "1", "max", "12", 1, "w-full", "px-4", "py-2", "border", "border-gray-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent"], ["for", "dureeCreneauMinutes", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], ["type", "number", "id", "dureeCreneauMinutes", "formControlName", "dureeCreneauMinutes", "min", "30", "max", "240", "step", "15", 1, "w-full", "px-4", "py-2", "border", "border-gray-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent"], ["for", "heureDebutJournee", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], ["type", "time", "id", "heureDebutJournee", "formControlName", "heureDebutJournee", 1, "w-full", "px-4", "py-2", "border", "border-gray-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent"], ["for", "heureFinJournee", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], ["type", "time", "id", "heureFinJournee", "formControlName", "heureFinJournee", 1, "w-full", "px-4", "py-2", "border", "border-gray-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent"], ["for", "pauseEntreCreneauxMinutes", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], ["type", "number", "id", "pauseEntreCreneauxMinutes", "formControlName", "pauseEntreCreneauxMinutes", "min", "0", "max", "60", "step", "5", 1, "w-full", "px-4", "py-2", "border", "border-gray-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent"], [1, "flex", "gap-3", "pt-4", "border-t"], ["type", "submit", 1, "flex-1", "bg-blue-600", "hover:bg-blue-700", "disabled:bg-gray-300", "disabled:cursor-not-allowed", "text-white", "font-medium", "px-6", "py-3", "rounded-lg", "transition-colors", "flex", "items-center", "justify-center", 3, "disabled"], ["type", "button", 1, "bg-gray-200", "hover:bg-gray-300", "disabled:bg-gray-100", "disabled:cursor-not-allowed", "text-gray-800", "font-medium", "px-6", "py-3", "rounded-lg", "transition-colors", 3, "click", "disabled"], ["fill", "none", "viewBox", "0 0 24 24", 1, "animate-spin", "h-5", "w-5", "mr-2"], ["cx", "12", "cy", "12", "r", "10", "stroke", "currentColor", "stroke-width", "4", 1, "opacity-25"], ["fill", "currentColor", "d", "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z", 1, "opacity-75"]], template: function ScheduleGeneratorComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h2", 3);
      \u0275\u0275text(4, "G\xE9n\xE9rer un emploi du temps");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p", 4);
      \u0275\u0275text(6, "Configurez les param\xE8tres pour g\xE9n\xE9rer automatiquement un emploi du temps");
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(7, ScheduleGeneratorComponent_Conditional_7_Template, 6, 1, "div", 5);
      \u0275\u0275conditionalCreate(8, ScheduleGeneratorComponent_Conditional_8_Template, 33, 7, "div", 6);
      \u0275\u0275conditionalCreate(9, ScheduleGeneratorComponent_Conditional_9_Template, 68, 7, "form", 7);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(7);
      \u0275\u0275conditional(ctx.errorMessage() ? 7 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.generationResult() ? 8 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.generationResult() ? 9 : -1);
    }
  }, dependencies: [CommonModule, NgClass, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, MinValidator, MaxValidator, FormGroupDirective, FormControlName], styles: ["\n\n/*# sourceMappingURL=schedule-generator.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScheduleGeneratorComponent, [{
    type: Component,
    args: [{ selector: "app-schedule-generator", standalone: true, imports: [CommonModule, ReactiveFormsModule], template: `<div class="container mx-auto px-4 py-6">
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">G\xE9n\xE9rer un emploi du temps</h2>
      <p class="text-gray-600">Configurez les param\xE8tres pour g\xE9n\xE9rer automatiquement un emploi du temps</p>
    </div>

    <!-- Error Alert -->
    @if (errorMessage()) {
      <div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
        <div class="flex items-start">
          <svg class="w-5 h-5 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <span>{{ errorMessage() }}</span>
        </div>
      </div>
    }

    <!-- Success Result -->
    @if (generationResult()) {
      <div class="bg-white shadow-lg rounded-lg p-6 mb-6 border border-green-200">
        <div class="flex items-center mb-4">
          <svg class="w-8 h-8 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <h3 class="text-xl font-semibold text-gray-800">G\xE9n\xE9ration termin\xE9e</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">Taux de r\xE9ussite</p>
            <p class="text-2xl font-bold" [ngClass]="getSeverityClass()">
              {{ generationResult()!.tauxReussite.toFixed(1) }}%
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">Cours planifi\xE9s</p>
            <p class="text-2xl font-bold text-gray-800">
              {{ generationResult()!.coursPlanifies }} / {{ generationResult()!.totalCoursAPlanifier }}
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">Conflits d\xE9tect\xE9s</p>
            <p class="text-2xl font-bold text-gray-800">
              {{ generationResult()!.conflitsDetectes }}
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">Dur\xE9e de g\xE9n\xE9ration</p>
            <p class="text-2xl font-bold text-gray-800">
              {{ (generationResult()!.dureeGenerationMs / 1000).toFixed(2) }}s
            </p>
          </div>
        </div>

        @if (generationResult()!.coursNonPlanifies.length > 0) {
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <h4 class="font-semibold text-yellow-800 mb-2">Cours non planifi\xE9s ({{ generationResult()!.coursNonPlanifies.length }})</h4>
            <ul class="list-disc list-inside text-sm text-yellow-700 space-y-1">
              @for (cours of generationResult()!.coursNonPlanifies; track cours.coursId) {
                <li>{{ cours.intitule }} - {{ cours.raison }}</li>
              }
            </ul>
          </div>
        }

        <div class="flex gap-3">
          <button
            type="button"
            (click)="viewSchedule()"
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors">
            Visualiser l'emploi du temps
          </button>
          <button
            type="button"
            (click)="resetForm()"
            class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-lg transition-colors">
            G\xE9n\xE9rer un nouveau
          </button>
        </div>
      </div>
    }

    <!-- Generation Form -->
    @if (!generationResult()) {
      <form [formGroup]="generatorForm" (ngSubmit)="onSubmit()" class="bg-white shadow-lg rounded-lg p-6">
        <!-- Informations de base -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Informations de base</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- \xC9cole -->
            <div>
              <label for="ecoleId" class="block text-sm font-medium text-gray-700 mb-2">
                \xC9cole <span class="text-red-500">*</span>
              </label>
              <select
                id="ecoleId"
                formControlName="ecoleId"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                <option value="" disabled>S\xE9lectionner une \xE9cole</option>
                @for (ecole of ecoles(); track ecole.id) {
                  <option [value]="ecole.id">{{ ecole.nom }} ({{ ecole.code }})</option>
                }
              </select>
              @if (generatorForm.get('ecoleId')?.touched && generatorForm.get('ecoleId')?.errors) {
                <p class="text-red-500 text-sm mt-1">L'\xE9cole est obligatoire</p>
              }
            </div>

            <!-- P\xE9riode -->
            <div>
              <label for="periode" class="block text-sm font-medium text-gray-700 mb-2">
                P\xE9riode <span class="text-red-500">*</span>
              </label>
              <select
                id="periode"
                formControlName="periode"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                @for (option of periodeOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </div>

            <!-- Date d\xE9but -->
            <div>
              <label for="dateDebut" class="block text-sm font-medium text-gray-700 mb-2">
                Date de d\xE9but <span class="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dateDebut"
                formControlName="dateDebut"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              @if (generatorForm.get('dateDebut')?.touched && generatorForm.get('dateDebut')?.errors) {
                <p class="text-red-500 text-sm mt-1">La date de d\xE9but est obligatoire</p>
              }
            </div>

            <!-- Date fin -->
            <div>
              <label for="dateFin" class="block text-sm font-medium text-gray-700 mb-2">
                Date de fin <span class="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dateFin"
                formControlName="dateFin"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              @if (generatorForm.get('dateFin')?.touched && generatorForm.get('dateFin')?.errors) {
                <p class="text-red-500 text-sm mt-1">La date de fin est obligatoire</p>
              }
            </div>
          </div>
        </div>

        <!-- Configuration avanc\xE9e -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Configuration avanc\xE9e</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Cr\xE9neaux par jour -->
            <div>
              <label for="creneauxParJour" class="block text-sm font-medium text-gray-700 mb-2">
                Cr\xE9neaux par jour
              </label>
              <input
                type="number"
                id="creneauxParJour"
                formControlName="creneauxParJour"
                min="1"
                max="12"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <!-- Dur\xE9e cr\xE9neau -->
            <div>
              <label for="dureeCreneauMinutes" class="block text-sm font-medium text-gray-700 mb-2">
                Dur\xE9e du cr\xE9neau (minutes)
              </label>
              <input
                type="number"
                id="dureeCreneauMinutes"
                formControlName="dureeCreneauMinutes"
                min="30"
                max="240"
                step="15"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <!-- Heure d\xE9but -->
            <div>
              <label for="heureDebutJournee" class="block text-sm font-medium text-gray-700 mb-2">
                Heure de d\xE9but
              </label>
              <input
                type="time"
                id="heureDebutJournee"
                formControlName="heureDebutJournee"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <!-- Heure fin -->
            <div>
              <label for="heureFinJournee" class="block text-sm font-medium text-gray-700 mb-2">
                Heure de fin
              </label>
              <input
                type="time"
                id="heureFinJournee"
                formControlName="heureFinJournee"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <!-- Pause -->
            <div>
              <label for="pauseEntreCreneauxMinutes" class="block text-sm font-medium text-gray-700 mb-2">
                Pause entre cr\xE9neaux (minutes)
              </label>
              <input
                type="number"
                id="pauseEntreCreneauxMinutes"
                formControlName="pauseEntreCreneauxMinutes"
                min="0"
                max="60"
                step="5"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4 border-t">
          <button
            type="submit"
            [disabled]="isLoading() || generatorForm.invalid"
            class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center justify-center">
            @if (isLoading()) {
              <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              G\xE9n\xE9ration en cours...
            } @else {
              G\xE9n\xE9rer l'emploi du temps
            }
          </button>

          <button
            type="button"
            (click)="resetForm()"
            [disabled]="isLoading()"
            class="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800 font-medium px-6 py-3 rounded-lg transition-colors">
            R\xE9initialiser
          </button>
        </div>
      </form>
    }
  </div>
</div>
`, styles: ["/* src/app/features/admin/schedule/generator/schedule-generator.component.scss */\n/*# sourceMappingURL=schedule-generator.component.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ScheduleGeneratorComponent, { className: "ScheduleGeneratorComponent", filePath: "src/app/features/admin/schedule/generator/schedule-generator.component.ts", lineNumber: 18 });
})();

// src/app/core/models/planning.model.ts
var StatutEmploiLabels = {
  DRAFT: "Brouillon",
  VALIDATED: "Valid\xE9",
  PUBLISHED: "Publi\xE9",
  ARCHIVED: "Archiv\xE9"
};

// src/app/features/admin/schedule/list/schedule-list.component.ts
var _forTrack02 = ($index, $item) => $item.value;
var _forTrack12 = ($index, $item) => $item.id;
function ScheduleListComponent_For_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r1 = ctx.$implicit;
    \u0275\u0275property("value", option_r1.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(option_r1.label);
  }
}
function ScheduleListComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 16);
    \u0275\u0275element(2, "circle", 17)(3, "path", 18);
    \u0275\u0275elementEnd()();
  }
}
function ScheduleListComponent_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.errorMessage(), " ");
  }
}
function ScheduleListComponent_Conditional_26_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 20);
    \u0275\u0275element(2, "path", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "p", 22);
    \u0275\u0275text(4, "Aucun emploi du temps trouv\xE9");
    \u0275\u0275elementEnd()();
  }
}
function ScheduleListComponent_Conditional_26_Conditional_1_For_2_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 34);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const emploi_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(emploi_r4.notes);
  }
}
function ScheduleListComponent_Conditional_26_Conditional_1_For_2_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 38);
    \u0275\u0275listener("click", function ScheduleListComponent_Conditional_26_Conditional_1_For_2_Conditional_30_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const emploi_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.deleteSchedule(emploi_r4.id, $event));
    });
    \u0275\u0275text(1, " Supprimer ");
    \u0275\u0275elementEnd();
  }
}
function ScheduleListComponent_Conditional_26_Conditional_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275listener("click", function ScheduleListComponent_Conditional_26_Conditional_1_For_2_Template_div_click_0_listener() {
      const emploi_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.viewSchedule(emploi_r4.id));
    });
    \u0275\u0275elementStart(1, "div", 27)(2, "div", 28)(3, "div", 29)(4, "h3", 30);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 31);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 32)(9, "div")(10, "span", 33);
    \u0275\u0275text(11, "D\xE9but:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div")(14, "span", 33);
    \u0275\u0275text(15, "Fin:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div")(18, "span", 33);
    \u0275\u0275text(19, "Cr\xE9neaux:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div")(22, "span", 33);
    \u0275\u0275text(23, "Conflits:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "span");
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(26, ScheduleListComponent_Conditional_26_Conditional_1_For_2_Conditional_26_Template, 2, 1, "p", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "div", 35)(28, "button", 36);
    \u0275\u0275listener("click", function ScheduleListComponent_Conditional_26_Conditional_1_For_2_Template_button_click_28_listener() {
      const emploi_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.viewSchedule(emploi_r4.id));
    });
    \u0275\u0275text(29, " Voir ");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(30, ScheduleListComponent_Conditional_26_Conditional_1_For_2_Conditional_30_Template, 2, 0, "button", 37);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const emploi_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" Emploi du temps - ", emploi_r4.periode, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r1.getStatutColor(emploi_r4.statut));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.statutLabels[emploi_r4.statut], " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", emploi_r4.dateDebut, " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", emploi_r4.dateFin, " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", emploi_r4.creneaux.length, " ");
    \u0275\u0275advance(4);
    \u0275\u0275classProp("text-red-600", emploi_r4.conflits && emploi_r4.conflits.length > 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", emploi_r4.conflits.length, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(emploi_r4.notes ? 26 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(emploi_r4.statut === "DRAFT" ? 30 : -1);
  }
}
function ScheduleListComponent_Conditional_26_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 25)(1, "div", 39);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 40)(4, "button", 41);
    \u0275\u0275listener("click", function ScheduleListComponent_Conditional_26_Conditional_1_Conditional_3_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.goToPage(ctx_r1.currentPage() - 1));
    });
    \u0275\u0275text(5, " Pr\xE9c\xE9dent ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 41);
    \u0275\u0275listener("click", function ScheduleListComponent_Conditional_26_Conditional_1_Conditional_3_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.goToPage(ctx_r1.currentPage() + 1));
    });
    \u0275\u0275text(7, " Suivant ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3(" ", ctx_r1.totalElements(), " r\xE9sultat(s) - Page ", ctx_r1.currentPage() + 1, " sur ", ctx_r1.totalPages(), " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.currentPage() === 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.currentPage() >= ctx_r1.totalPages() - 1);
  }
}
function ScheduleListComponent_Conditional_26_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23);
    \u0275\u0275repeaterCreate(1, ScheduleListComponent_Conditional_26_Conditional_1_For_2_Template, 31, 11, "div", 24, _forTrack12);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, ScheduleListComponent_Conditional_26_Conditional_1_Conditional_3_Template, 8, 5, "div", 25);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.emploisDuTemps());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.totalPages() > 1 ? 3 : -1);
  }
}
function ScheduleListComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, ScheduleListComponent_Conditional_26_Conditional_0_Template, 5, 0, "div", 19)(1, ScheduleListComponent_Conditional_26_Conditional_1_Template, 4, 1);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.emploisDuTemps().length === 0 ? 0 : 1);
  }
}
var ScheduleListComponent = class _ScheduleListComponent {
  planningService = inject(PlanningService);
  router = inject(Router);
  emploisDuTemps = signal([], ...ngDevMode ? [{ debugName: "emploisDuTemps" }] : []);
  isLoading = signal(false, ...ngDevMode ? [{ debugName: "isLoading" }] : []);
  errorMessage = signal(null, ...ngDevMode ? [{ debugName: "errorMessage" }] : []);
  currentPage = signal(0, ...ngDevMode ? [{ debugName: "currentPage" }] : []);
  pageSize = signal(20, ...ngDevMode ? [{ debugName: "pageSize" }] : []);
  totalPages = signal(0, ...ngDevMode ? [{ debugName: "totalPages" }] : []);
  totalElements = signal(0, ...ngDevMode ? [{ debugName: "totalElements" }] : []);
  searchRequest = {
    page: 0,
    size: 20
  };
  statutOptions = [
    { value: "", label: "Tous les statuts" },
    { value: "DRAFT", label: "Brouillon" },
    { value: "VALIDATED", label: "Valid\xE9" },
    { value: "PUBLISHED", label: "Publi\xE9" },
    { value: "ARCHIVED", label: "Archiv\xE9" }
  ];
  statutLabels = StatutEmploiLabels;
  ngOnInit() {
    this.loadEmploisDuTemps();
  }
  loadEmploisDuTemps() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.searchRequest.page = this.currentPage();
    this.searchRequest.size = this.pageSize();
    const observable = this.searchRequest.dateDebut || this.searchRequest.statut ? this.planningService.searchEmploisDuTemps(this.searchRequest) : this.planningService.getAllEmploisDuTemps(this.currentPage(), this.pageSize());
    observable.pipe(catchError((error) => {
      console.error("Erreur lors du chargement:", error);
      this.errorMessage.set("Impossible de charger les emplois du temps");
      return of({ content: [], totalElements: 0, totalPages: 0, size: 20, number: 0, first: true, last: true, empty: true });
    }), finalize(() => this.isLoading.set(false))).subscribe((page) => {
      this.emploisDuTemps.set(page.content);
      this.totalPages.set(page.totalPages);
      this.totalElements.set(page.totalElements);
      this.currentPage.set(page.number);
    });
  }
  onSearch() {
    this.currentPage.set(0);
    this.loadEmploisDuTemps();
  }
  onReset() {
    this.searchRequest = { page: 0, size: 20 };
    this.currentPage.set(0);
    this.loadEmploisDuTemps();
  }
  goToPage(page) {
    this.currentPage.set(page);
    this.loadEmploisDuTemps();
  }
  viewSchedule(id) {
    this.router.navigate(["/admin/schedule/viewer", id]);
  }
  deleteSchedule(id, event) {
    event.stopPropagation();
    if (!confirm("Voulez-vous vraiment supprimer cet emploi du temps ?")) {
      return;
    }
    this.planningService.deleteEmploiDuTemps(id).pipe(catchError((error) => {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression");
      return of(null);
    })).subscribe(() => {
      this.loadEmploisDuTemps();
    });
  }
  getStatutColor(statut) {
    switch (statut) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "VALIDATED":
        return "bg-blue-100 text-blue-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
  static \u0275fac = function ScheduleListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ScheduleListComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ScheduleListComponent, selectors: [["app-schedule-list"]], decls: 27, vars: 8, consts: [[1, "space-y-6"], [1, "bg-gray-50", "rounded-lg", "p-4"], [1, "text-lg", "font-semibold", "text-gray-800", "mb-4"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-4"], ["for", "dateDebut", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], ["type", "date", "id", "dateDebut", 1, "w-full", "px-4", "py-2", "border", "border-gray-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", 3, "ngModelChange", "ngModel"], ["for", "dateFin", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], ["type", "date", "id", "dateFin", 1, "w-full", "px-4", "py-2", "border", "border-gray-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", 3, "ngModelChange", "ngModel"], ["for", "statut", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], ["id", "statut", 1, "w-full", "px-4", "py-2", "border", "border-gray-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", 3, "ngModelChange", "ngModel"], [3, "value"], [1, "flex", "gap-3", "mt-4"], [1, "bg-blue-600", "hover:bg-blue-700", "disabled:bg-gray-300", "text-white", "font-medium", "px-6", "py-2", "rounded-lg", "transition-colors", 3, "click", "disabled"], [1, "bg-gray-200", "hover:bg-gray-300", "disabled:bg-gray-100", "text-gray-800", "font-medium", "px-6", "py-2", "rounded-lg", "transition-colors", 3, "click", "disabled"], [1, "flex", "items-center", "justify-center", "py-12"], [1, "bg-red-50", "border", "border-red-200", "text-red-800", "px-4", "py-3", "rounded-lg"], ["fill", "none", "viewBox", "0 0 24 24", 1, "animate-spin", "h-8", "w-8", "text-blue-600"], ["cx", "12", "cy", "12", "r", "10", "stroke", "currentColor", "stroke-width", "4", 1, "opacity-25"], ["fill", "currentColor", "d", "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z", 1, "opacity-75"], [1, "text-center", "py-12", "text-gray-500"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-16", "h-16", "mx-auto", "mb-4", "text-gray-400"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"], [1, "text-lg"], [1, "space-y-4"], [1, "bg-white", "border", "border-gray-200", "rounded-lg", "p-4", "hover:shadow-lg", "transition-shadow", "cursor-pointer"], [1, "flex", "items-center", "justify-between", "border-t", "pt-4"], [1, "bg-white", "border", "border-gray-200", "rounded-lg", "p-4", "hover:shadow-lg", "transition-shadow", "cursor-pointer", 3, "click"], [1, "flex", "items-start", "justify-between", "mb-3"], [1, "flex-1"], [1, "flex", "items-center", "gap-3", "mb-2"], [1, "text-lg", "font-semibold", "text-gray-800"], [1, "px-2", "py-1", "rounded-full", "text-xs", "font-medium", 3, "ngClass"], [1, "grid", "grid-cols-2", "md:grid-cols-4", "gap-3", "text-sm", "text-gray-600"], [1, "font-medium"], [1, "text-sm", "text-gray-600", "mt-2"], [1, "flex", "items-center", "gap-2"], [1, "bg-blue-600", "hover:bg-blue-700", "text-white", "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors", 3, "click"], [1, "bg-red-600", "hover:bg-red-700", "text-white", "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors"], [1, "bg-red-600", "hover:bg-red-700", "text-white", "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors", 3, "click"], [1, "text-sm", "text-gray-600"], [1, "flex", "gap-2"], [1, "bg-gray-200", "hover:bg-gray-300", "disabled:bg-gray-100", "disabled:cursor-not-allowed", "text-gray-800", "px-4", "py-2", "rounded-lg", "font-medium", "transition-colors", 3, "click", "disabled"]], template: function ScheduleListComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h3", 2);
      \u0275\u0275text(3, "Filtres de recherche");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div", 3)(5, "div")(6, "label", 4);
      \u0275\u0275text(7, " Date d\xE9but ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "input", 5);
      \u0275\u0275twoWayListener("ngModelChange", function ScheduleListComponent_Template_input_ngModelChange_8_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.searchRequest.dateDebut, $event) || (ctx.searchRequest.dateDebut = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(9, "div")(10, "label", 6);
      \u0275\u0275text(11, " Date fin ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "input", 7);
      \u0275\u0275twoWayListener("ngModelChange", function ScheduleListComponent_Template_input_ngModelChange_12_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.searchRequest.dateFin, $event) || (ctx.searchRequest.dateFin = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "div")(14, "label", 8);
      \u0275\u0275text(15, " Statut ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "select", 9);
      \u0275\u0275twoWayListener("ngModelChange", function ScheduleListComponent_Template_select_ngModelChange_16_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.searchRequest.statut, $event) || (ctx.searchRequest.statut = $event);
        return $event;
      });
      \u0275\u0275repeaterCreate(17, ScheduleListComponent_For_18_Template, 2, 2, "option", 10, _forTrack02);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(19, "div", 11)(20, "button", 12);
      \u0275\u0275listener("click", function ScheduleListComponent_Template_button_click_20_listener() {
        return ctx.onSearch();
      });
      \u0275\u0275text(21, " Rechercher ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "button", 13);
      \u0275\u0275listener("click", function ScheduleListComponent_Template_button_click_22_listener() {
        return ctx.onReset();
      });
      \u0275\u0275text(23, " R\xE9initialiser ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(24, ScheduleListComponent_Conditional_24_Template, 4, 0, "div", 14);
      \u0275\u0275conditionalCreate(25, ScheduleListComponent_Conditional_25_Template, 2, 1, "div", 15);
      \u0275\u0275conditionalCreate(26, ScheduleListComponent_Conditional_26_Template, 2, 1);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275twoWayProperty("ngModel", ctx.searchRequest.dateDebut);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.searchRequest.dateFin);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.searchRequest.statut);
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.statutOptions);
      \u0275\u0275advance(3);
      \u0275\u0275property("disabled", ctx.isLoading());
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.isLoading());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.isLoading() ? 24 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.errorMessage() && !ctx.isLoading() ? 25 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.isLoading() && !ctx.errorMessage() ? 26 : -1);
    }
  }, dependencies: [CommonModule, NgClass, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel], styles: ["\n\n/*# sourceMappingURL=schedule-list.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScheduleListComponent, [{
    type: Component,
    args: [{ selector: "app-schedule-list", standalone: true, imports: [CommonModule, FormsModule], template: `<div class="space-y-6">
  <!-- Filtres de recherche -->
  <div class="bg-gray-50 rounded-lg p-4">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Filtres de recherche</h3>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label for="dateDebut" class="block text-sm font-medium text-gray-700 mb-2">
          Date d\xE9but
        </label>
        <input
          type="date"
          id="dateDebut"
          [(ngModel)]="searchRequest.dateDebut"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>

      <div>
        <label for="dateFin" class="block text-sm font-medium text-gray-700 mb-2">
          Date fin
        </label>
        <input
          type="date"
          id="dateFin"
          [(ngModel)]="searchRequest.dateFin"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>

      <div>
        <label for="statut" class="block text-sm font-medium text-gray-700 mb-2">
          Statut
        </label>
        <select
          id="statut"
          [(ngModel)]="searchRequest.statut"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          @for (option of statutOptions; track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
      </div>
    </div>

    <div class="flex gap-3 mt-4">
      <button
        (click)="onSearch()"
        [disabled]="isLoading()"
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium px-6 py-2 rounded-lg transition-colors">
        Rechercher
      </button>
      <button
        (click)="onReset()"
        [disabled]="isLoading()"
        class="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 font-medium px-6 py-2 rounded-lg transition-colors">
        R\xE9initialiser
      </button>
    </div>
  </div>

  <!-- Loading State -->
  @if (isLoading()) {
    <div class="flex items-center justify-center py-12">
      <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  }

  <!-- Error State -->
  @if (errorMessage() && !isLoading()) {
    <div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
      {{ errorMessage() }}
    </div>
  }

  <!-- Liste des emplois du temps -->
  @if (!isLoading() && !errorMessage()) {
    @if (emploisDuTemps().length === 0) {
      <div class="text-center py-12 text-gray-500">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p class="text-lg">Aucun emploi du temps trouv\xE9</p>
      </div>
    } @else {
      <div class="space-y-4">
        @for (emploi of emploisDuTemps(); track emploi.id) {
          <div
            (click)="viewSchedule(emploi.id)"
            class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-semibold text-gray-800">
                    Emploi du temps - {{ emploi.periode }}
                  </h3>
                  <span class="px-2 py-1 rounded-full text-xs font-medium" [ngClass]="getStatutColor(emploi.statut)">
                    {{ statutLabels[emploi.statut] }}
                  </span>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                  <div>
                    <span class="font-medium">D\xE9but:</span> {{ emploi.dateDebut }}
                  </div>
                  <div>
                    <span class="font-medium">Fin:</span> {{ emploi.dateFin }}
                  </div>
                  <div>
                    <span class="font-medium">Cr\xE9neaux:</span> {{ emploi.creneaux.length }}
                  </div>
                  <div>
                    <span class="font-medium">Conflits:</span>
                    <span [class.text-red-600]="emploi.conflits && emploi.conflits.length > 0">
                      {{ emploi.conflits.length }}
                    </span>
                  </div>
                </div>

                @if (emploi.notes) {
                  <p class="text-sm text-gray-600 mt-2">{{ emploi.notes }}</p>
                }
              </div>

              <div class="flex items-center gap-2">
                <button
                  (click)="viewSchedule(emploi.id)"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Voir
                </button>
                @if (emploi.statut === 'DRAFT') {
                  <button
                    (click)="deleteSchedule(emploi.id, $event)"
                    class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Supprimer
                  </button>
                }
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Pagination -->
      @if (totalPages() > 1) {
        <div class="flex items-center justify-between border-t pt-4">
          <div class="text-sm text-gray-600">
            {{ totalElements() }} r\xE9sultat(s) - Page {{ currentPage() + 1 }} sur {{ totalPages() }}
          </div>

          <div class="flex gap-2">
            <button
              (click)="goToPage(currentPage() - 1)"
              [disabled]="currentPage() === 0"
              class="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors">
              Pr\xE9c\xE9dent
            </button>

            <button
              (click)="goToPage(currentPage() + 1)"
              [disabled]="currentPage() >= totalPages() - 1"
              class="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors">
              Suivant
            </button>
          </div>
        </div>
      }
    }
  }
</div>
`, styles: ["/* src/app/features/admin/schedule/list/schedule-list.component.scss */\n/*# sourceMappingURL=schedule-list.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ScheduleListComponent, { className: "ScheduleListComponent", filePath: "src/app/features/admin/schedule/list/schedule-list.component.ts", lineNumber: 22 });
})();

// src/app/features/admin/schedule/schedule.component.ts
function ScheduleComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-schedule-generator");
  }
}
function ScheduleComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-schedule-list");
  }
}
var ScheduleComponent = class _ScheduleComponent {
  activeTab = signal("generate", ...ngDevMode ? [{ debugName: "activeTab" }] : []);
  selectTab(tab) {
    this.activeTab.set(tab);
  }
  static \u0275fac = function ScheduleComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ScheduleComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ScheduleComponent, selectors: [["app-schedule"]], decls: 20, vars: 14, consts: [[1, "container", "mx-auto", "px-4", "py-6"], [1, "mb-6"], [1, "text-3xl", "font-bold", "text-gray-800", "mb-2"], [1, "text-gray-600"], [1, "bg-white", "shadow-lg", "rounded-lg", "overflow-hidden"], [1, "border-b"], [1, "flex"], [1, "px-6", "py-3", "font-medium", "transition-colors", "hover:text-blue-600", "flex", "items-center", "gap-2", 3, "click"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M12 4v16m8-8H4"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M4 6h16M4 10h16M4 14h16M4 18h16"], [1, "p-6"]], template: function ScheduleComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
      \u0275\u0275text(3, "Gestion des emplois du temps");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "G\xE9n\xE9rez et g\xE9rez les emplois du temps de l'\xE9tablissement");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "div", 6)(9, "button", 7);
      \u0275\u0275listener("click", function ScheduleComponent_Template_button_click_9_listener() {
        return ctx.selectTab("generate");
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(10, "svg", 8);
      \u0275\u0275element(11, "path", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275text(12, " G\xE9n\xE9rer ");
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(13, "button", 7);
      \u0275\u0275listener("click", function ScheduleComponent_Template_button_click_13_listener() {
        return ctx.selectTab("list");
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(14, "svg", 8);
      \u0275\u0275element(15, "path", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275text(16, " Liste ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(17, "div", 11);
      \u0275\u0275conditionalCreate(18, ScheduleComponent_Conditional_18_Template, 1, 0, "app-schedule-generator");
      \u0275\u0275conditionalCreate(19, ScheduleComponent_Conditional_19_Template, 1, 0, "app-schedule-list");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(9);
      \u0275\u0275classProp("border-b-2", ctx.activeTab() === "generate")("border-blue-600", ctx.activeTab() === "generate")("text-blue-600", ctx.activeTab() === "generate");
      \u0275\u0275advance(4);
      \u0275\u0275classProp("border-b-2", ctx.activeTab() === "list")("border-blue-600", ctx.activeTab() === "list")("text-blue-600", ctx.activeTab() === "list");
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.activeTab() === "generate" ? 18 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.activeTab() === "list" ? 19 : -1);
    }
  }, dependencies: [
    CommonModule,
    RouterModule,
    ScheduleGeneratorComponent,
    ScheduleListComponent
  ], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScheduleComponent, [{
    type: Component,
    args: [{ selector: "app-schedule", standalone: true, imports: [
      CommonModule,
      RouterModule,
      ScheduleGeneratorComponent,
      ScheduleListComponent
    ], template: `<div class="container mx-auto px-4 py-6">
  <!-- Header -->
  <div class="mb-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-2">Gestion des emplois du temps</h1>
    <p class="text-gray-600">G\xE9n\xE9rez et g\xE9rez les emplois du temps de l'\xE9tablissement</p>
  </div>

  <!-- Tabs -->
  <div class="bg-white shadow-lg rounded-lg overflow-hidden">
    <div class="border-b">
      <div class="flex">
        <button
          (click)="selectTab('generate')"
          [class.border-b-2]="activeTab() === 'generate'"
          [class.border-blue-600]="activeTab() === 'generate'"
          [class.text-blue-600]="activeTab() === 'generate'"
          class="px-6 py-3 font-medium transition-colors hover:text-blue-600 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          G\xE9n\xE9rer
        </button>
        <button
          (click)="selectTab('list')"
          [class.border-b-2]="activeTab() === 'list'"
          [class.border-blue-600]="activeTab() === 'list'"
          [class.text-blue-600]="activeTab() === 'list'"
          class="px-6 py-3 font-medium transition-colors hover:text-blue-600 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
          </svg>
          Liste
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="p-6">
      @if (activeTab() === 'generate') {
        <app-schedule-generator />
      }

      @if (activeTab() === 'list') {
        <app-schedule-list />
      }
    </div>
  </div>
</div>

` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ScheduleComponent, { className: "ScheduleComponent", filePath: "src/app/features/admin/schedule/schedule.component.ts", lineNumber: 21 });
})();
export {
  ScheduleComponent
};
//# sourceMappingURL=chunk-IFWV2D5T.js.map
