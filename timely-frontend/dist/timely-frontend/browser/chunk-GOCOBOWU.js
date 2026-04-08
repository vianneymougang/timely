import {
  FiliereService
} from "./chunk-GCDGGT2I.js";
import {
  ClasseService
} from "./chunk-37GUWSLG.js";
import {
  ApiService
} from "./chunk-M2M2Z2ZK.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  MaxValidator,
  MinValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgSelectOption,
  NumberValueAccessor,
  ReactiveFormsModule,
  SelectControlValueAccessor,
  Validators,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-Y74VR2WI.js";
import "./chunk-AL3K22XE.js";
import {
  CommonModule
} from "./chunk-GGDRA3L4.js";
import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  inject,
  map,
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
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-DBHCOGA3.js";
import {
  __objRest,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/core/services/cours.service.ts
var CoursService = class _CoursService {
  apiService = inject(ApiService);
  getCours() {
    return this.apiService.get("/bookings/cours", { page: 0, size: 100 }).pipe(map((page) => page.content.map(this.toCours)));
  }
  getCoursById(id) {
    return this.apiService.get(`/bookings/cours/${id}`).pipe(map(this.toCours));
  }
  getCoursByUE(ueId) {
    return this.apiService.get(`/bookings/ues/${ueId}/cours`, { page: 0, size: 100 }).pipe(map((page) => page.content.map(this.toCours)));
  }
  getCoursByClasse(classeId) {
    return this.apiService.get(`/bookings/classes/${classeId}/cours`, { page: 0, size: 100 }).pipe(map((page) => page.content.map(this.toCours)));
  }
  createCours(cours) {
    const body = {
      ueId: cours.ueId,
      classeId: cours.classeId ?? null,
      intitule: cours.intitule,
      typeCours: cours.typeCours,
      volumeHoraire: cours.volumeHoraire
    };
    return this.apiService.post("/bookings/cours", body).pipe(map(this.toCours));
  }
  updateCours(cours) {
    const _a = cours, { id } = _a, rest = __objRest(_a, ["id"]);
    const body = {
      ueId: rest.ueId,
      classeId: rest.classeId ?? null,
      intitule: rest.intitule,
      typeCours: rest.typeCours,
      volumeHoraire: rest.volumeHoraire
    };
    return this.apiService.put(`/bookings/cours/${id}`, body).pipe(map(this.toCours));
  }
  deleteCours(id) {
    return this.apiService.delete(`/bookings/cours/${id}`);
  }
  toCours(r) {
    return {
      id: r.id,
      intitule: r.intitule,
      volumeHoraire: r.volumeHoraire,
      typeCours: r.typeCours,
      coefficient: 0,
      ueId: r.ueId
    };
  }
  static \u0275fac = function CoursService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CoursService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CoursService, factory: _CoursService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CoursService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/core/services/ue.service.ts
var UEService = class _UEService {
  apiService = inject(ApiService);
  getUE() {
    return this.apiService.get("/bookings/ues").pipe(map((items) => items.map(this.toUE)));
  }
  getUEById(id) {
    return this.apiService.get(`/bookings/ues/${id}`).pipe(map(this.toUE));
  }
  getUEByFiliere(filiereId) {
    return this.apiService.get(`/bookings/filieres/${filiereId}/ues`).pipe(map((items) => items.map(this.toUE)));
  }
  createUE(ue) {
    const body = {
      filiereId: ue.filiereId,
      code: `UE-${ue.intituleUE.substring(0, 6).toUpperCase().replace(/\s/g, "")}`,
      intitule: ue.intituleUE,
      creditEcts: ue.credit,
      volumeHoraireTotal: ue.semestre,
      description: ue.description
    };
    return this.apiService.post("/bookings/ues", body).pipe(map(this.toUE));
  }
  updateUE(ue) {
    const _a = ue, { id } = _a, rest = __objRest(_a, ["id"]);
    const body = {
      filiereId: rest.filiereId,
      code: `UE-${(rest.intituleUE ?? "").substring(0, 6).toUpperCase().replace(/\s/g, "")}`,
      intitule: rest.intituleUE,
      creditEcts: rest.credit,
      volumeHoraireTotal: rest.semestre,
      description: rest.description
    };
    return this.apiService.put(`/bookings/ues/${id}`, body).pipe(map(this.toUE));
  }
  deleteUE(id) {
    return this.apiService.delete(`/bookings/ues/${id}`);
  }
  toUE(r) {
    return {
      id: r.id,
      intituleUE: r.intitule,
      credit: r.creditEcts,
      semestre: r.volumeHoraireTotal,
      description: r.description ?? "",
      filiereId: r.filiereId
    };
  }
  static \u0275fac = function UEService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UEService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _UEService, factory: _UEService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UEService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/features/admin/courses/courses.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function CoursesComponent_Conditional_17_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 14)(1, "div", 16)(2, "div", 17)(3, "h3", 18);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 19);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "span", 20);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 21)(10, "div", 22)(11, "span", 23);
    \u0275\u0275text(12, "schedule");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 22)(16, "span", 23);
    \u0275\u0275text(17, "star");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "div", 24)(21, "button", 25);
    \u0275\u0275listener("click", function CoursesComponent_Conditional_17_For_12_Template_button_click_21_listener() {
      const c_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openCoursModal(c_r5));
    });
    \u0275\u0275elementStart(22, "span", 26);
    \u0275\u0275text(23, "edit");
    \u0275\u0275elementEnd();
    \u0275\u0275text(24, " Modifier ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "button", 27);
    \u0275\u0275listener("click", function CoursesComponent_Conditional_17_For_12_Template_button_click_25_listener() {
      const c_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteCours(c_r5.id));
    });
    \u0275\u0275elementStart(26, "span", 26);
    \u0275\u0275text(27, "delete");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const c_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(c_r5.intitule);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getUEName(c_r5.ueId));
    \u0275\u0275advance();
    \u0275\u0275classProp("bg-blue-100", c_r5.typeCours === "CM")("text-blue-700", c_r5.typeCours === "CM")("bg-green-100", c_r5.typeCours === "TD")("text-green-700", c_r5.typeCours === "TD")("bg-purple-100", c_r5.typeCours === "TP")("text-purple-700", c_r5.typeCours === "TP");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", c_r5.typeCours, " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", c_r5.volumeHoraire, "h");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("Coefficient: ", c_r5.coefficient);
  }
}
function CoursesComponent_Conditional_17_ForEmpty_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "span", 28);
    \u0275\u0275text(2, "menu_book");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 29);
    \u0275\u0275text(4, "Aucun cours pour le moment");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 30);
    \u0275\u0275listener("click", function CoursesComponent_Conditional_17_ForEmpty_13_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openCoursModal());
    });
    \u0275\u0275text(6, " Cr\xE9er votre premier cours ");
    \u0275\u0275elementEnd()();
  }
}
function CoursesComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 9)(2, "div", 3)(3, "span", 10);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " cours au total ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 11);
    \u0275\u0275listener("click", function CoursesComponent_Conditional_17_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openCoursModal());
    });
    \u0275\u0275elementStart(7, "span", 12);
    \u0275\u0275text(8, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(9, " Nouveau cours ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 13);
    \u0275\u0275repeaterCreate(11, CoursesComponent_Conditional_17_For_12_Template, 28, 17, "div", 14, _forTrack0, false, CoursesComponent_Conditional_17_ForEmpty_13_Template, 7, 0, "div", 15);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.cours().length);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r1.cours());
  }
}
function CoursesComponent_Conditional_18_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 14)(1, "div", 31)(2, "h3", 18);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 19);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "p", 32);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 33)(9, "div", 34)(10, "div", 35);
    \u0275\u0275text(11, "Cr\xE9dits");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 36);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 37)(15, "div", 38);
    \u0275\u0275text(16, "Semestre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 39);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "div", 24)(20, "button", 25);
    \u0275\u0275listener("click", function CoursesComponent_Conditional_18_For_12_Template_button_click_20_listener() {
      const ue_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openUEModal(ue_r9));
    });
    \u0275\u0275elementStart(21, "span", 26);
    \u0275\u0275text(22, "edit");
    \u0275\u0275elementEnd();
    \u0275\u0275text(23, " Modifier ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "button", 27);
    \u0275\u0275listener("click", function CoursesComponent_Conditional_18_For_12_Template_button_click_24_listener() {
      const ue_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteUE(ue_r9.id));
    });
    \u0275\u0275elementStart(25, "span", 26);
    \u0275\u0275text(26, "delete");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ue_r9 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ue_r9.intituleUE);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getFiliereName(ue_r9.filiereId));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ue_r9.description);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ue_r9.credit);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("S", ue_r9.semestre);
  }
}
function CoursesComponent_Conditional_18_ForEmpty_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "span", 28);
    \u0275\u0275text(2, "category");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 29);
    \u0275\u0275text(4, "Aucune UE pour le moment");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 30);
    \u0275\u0275listener("click", function CoursesComponent_Conditional_18_ForEmpty_13_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openUEModal());
    });
    \u0275\u0275text(6, " Cr\xE9er votre premi\xE8re UE ");
    \u0275\u0275elementEnd()();
  }
}
function CoursesComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 9)(2, "div", 3)(3, "span", 10);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " UE au total ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 11);
    \u0275\u0275listener("click", function CoursesComponent_Conditional_18_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openUEModal());
    });
    \u0275\u0275elementStart(7, "span", 12);
    \u0275\u0275text(8, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(9, " Nouvelle UE ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 13);
    \u0275\u0275repeaterCreate(11, CoursesComponent_Conditional_18_For_12_Template, 27, 5, "div", 14, _forTrack0, false, CoursesComponent_Conditional_18_ForEmpty_13_Template, 7, 0, "div", 15);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.ues().length);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r1.ues());
  }
}
function CoursesComponent_Conditional_19_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 48);
    \u0275\u0275text(1, "L'intitul\xE9 est requis (min. 3 caract\xE8res)");
    \u0275\u0275elementEnd();
  }
}
function CoursesComponent_Conditional_19_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 48);
    \u0275\u0275text(1, "Requis (min. 1h)");
    \u0275\u0275elementEnd();
  }
}
function CoursesComponent_Conditional_19_For_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 56);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const classe_r11 = ctx.$implicit;
    \u0275\u0275property("value", classe_r11.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", classe_r11.nom, " \u2014 ", classe_r11.niveau);
  }
}
function CoursesComponent_Conditional_19_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 48);
    \u0275\u0275text(1, "Veuillez s\xE9lectionner une classe");
    \u0275\u0275elementEnd();
  }
}
function CoursesComponent_Conditional_19_For_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 56);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ue_r12 = ctx.$implicit;
    \u0275\u0275property("value", ue_r12.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", ue_r12.intituleUE, " - S", ue_r12.semestre);
  }
}
function CoursesComponent_Conditional_19_Conditional_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 48);
    \u0275\u0275text(1, "Veuillez s\xE9lectionner une UE");
    \u0275\u0275elementEnd();
  }
}
function CoursesComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 40)(2, "div", 41)(3, "h2", 42);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 43);
    \u0275\u0275listener("click", function CoursesComponent_Conditional_19_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeCoursModal());
    });
    \u0275\u0275elementStart(6, "span", 12);
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "form", 44);
    \u0275\u0275listener("ngSubmit", function CoursesComponent_Conditional_19_Template_form_ngSubmit_8_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveCours());
    });
    \u0275\u0275elementStart(9, "div", 45)(10, "div")(11, "label", 46);
    \u0275\u0275text(12, " Intitul\xE9 du cours * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "input", 47);
    \u0275\u0275conditionalCreate(14, CoursesComponent_Conditional_19_Conditional_14_Template, 2, 0, "p", 48);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div")(16, "label", 46);
    \u0275\u0275text(17, " Type de cours * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "select", 49)(19, "option", 50);
    \u0275\u0275text(20, "Cours Magistral (CM)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "option", 51);
    \u0275\u0275text(22, "Travaux Dirig\xE9s (TD)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "option", 52);
    \u0275\u0275text(24, "Travaux Pratiques (TP)");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(25, "div")(26, "label", 46);
    \u0275\u0275text(27, " Volume horaire (h) * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(28, "input", 53);
    \u0275\u0275conditionalCreate(29, CoursesComponent_Conditional_19_Conditional_29_Template, 2, 0, "p", 48);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "div")(31, "label", 46);
    \u0275\u0275text(32, " Classe * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "select", 54)(34, "option", 55);
    \u0275\u0275text(35, "S\xE9lectionnez une classe");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(36, CoursesComponent_Conditional_19_For_37_Template, 2, 3, "option", 56, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(38, CoursesComponent_Conditional_19_Conditional_38_Template, 2, 0, "p", 48);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "div")(40, "label", 46);
    \u0275\u0275text(41, " Unit\xE9 d'Enseignement * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "select", 57)(43, "option", 55);
    \u0275\u0275text(44, "S\xE9lectionnez une UE");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(45, CoursesComponent_Conditional_19_For_46_Template, 2, 3, "option", 56, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(47, CoursesComponent_Conditional_19_Conditional_47_Template, 2, 0, "p", 48);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(48, "div", 58)(49, "button", 59);
    \u0275\u0275listener("click", function CoursesComponent_Conditional_19_Template_button_click_49_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeCoursModal());
    });
    \u0275\u0275text(50, " Annuler ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "button", 60);
    \u0275\u0275text(52);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    let tmp_6_0;
    let tmp_8_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.editingCours() ? "Modifier le cours" : "Nouveau cours", " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("formGroup", ctx_r1.coursForm);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(((tmp_3_0 = ctx_r1.coursForm.get("intitule")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx_r1.coursForm.get("intitule")) == null ? null : tmp_3_0.touched) ? 14 : -1);
    \u0275\u0275advance(15);
    \u0275\u0275conditional(((tmp_4_0 = ctx_r1.coursForm.get("volumeHoraire")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx_r1.coursForm.get("volumeHoraire")) == null ? null : tmp_4_0.touched) ? 29 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r1.classes());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_6_0 = ctx_r1.coursForm.get("classeId")) == null ? null : tmp_6_0.invalid) && ((tmp_6_0 = ctx_r1.coursForm.get("classeId")) == null ? null : tmp_6_0.touched) ? 38 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r1.ues());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_8_0 = ctx_r1.coursForm.get("ueId")) == null ? null : tmp_8_0.invalid) && ((tmp_8_0 = ctx_r1.coursForm.get("ueId")) == null ? null : tmp_8_0.touched) ? 47 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("opacity-50", ctx_r1.coursForm.invalid)("cursor-not-allowed", ctx_r1.coursForm.invalid);
    \u0275\u0275property("disabled", ctx_r1.coursForm.invalid);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.editingCours() ? "Enregistrer" : "Cr\xE9er", " ");
  }
}
function CoursesComponent_Conditional_20_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 48);
    \u0275\u0275text(1, "L'intitul\xE9 est requis (min. 3 caract\xE8res)");
    \u0275\u0275elementEnd();
  }
}
function CoursesComponent_Conditional_20_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 56);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const filiere_r14 = ctx.$implicit;
    \u0275\u0275property("value", filiere_r14.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", filiere_r14.nom, " (", filiere_r14.code, ")");
  }
}
function CoursesComponent_Conditional_20_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 48);
    \u0275\u0275text(1, "Veuillez s\xE9lectionner une fili\xE8re");
    \u0275\u0275elementEnd();
  }
}
function CoursesComponent_Conditional_20_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 48);
    \u0275\u0275text(1, "Entre 1 et 10");
    \u0275\u0275elementEnd();
  }
}
function CoursesComponent_Conditional_20_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 48);
    \u0275\u0275text(1, "Entre 1 et 10");
    \u0275\u0275elementEnd();
  }
}
function CoursesComponent_Conditional_20_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 48);
    \u0275\u0275text(1, "La description est requise (min. 10 caract\xE8res)");
    \u0275\u0275elementEnd();
  }
}
function CoursesComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 40)(2, "div", 41)(3, "h2", 42);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 43);
    \u0275\u0275listener("click", function CoursesComponent_Conditional_20_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeUEModal());
    });
    \u0275\u0275elementStart(6, "span", 12);
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "form", 44);
    \u0275\u0275listener("ngSubmit", function CoursesComponent_Conditional_20_Template_form_ngSubmit_8_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveUE());
    });
    \u0275\u0275elementStart(9, "div", 45)(10, "div")(11, "label", 46);
    \u0275\u0275text(12, " Intitul\xE9 de l'UE * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "input", 61);
    \u0275\u0275conditionalCreate(14, CoursesComponent_Conditional_20_Conditional_14_Template, 2, 0, "p", 48);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div")(16, "label", 46);
    \u0275\u0275text(17, " Fili\xE8re * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "select", 62)(19, "option", 55);
    \u0275\u0275text(20, "S\xE9lectionnez une fili\xE8re");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(21, CoursesComponent_Conditional_20_For_22_Template, 2, 3, "option", 56, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(23, CoursesComponent_Conditional_20_Conditional_23_Template, 2, 0, "p", 48);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 63)(25, "div")(26, "label", 46);
    \u0275\u0275text(27, " Cr\xE9dits * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(28, "input", 64);
    \u0275\u0275conditionalCreate(29, CoursesComponent_Conditional_20_Conditional_29_Template, 2, 0, "p", 48);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "div")(31, "label", 46);
    \u0275\u0275text(32, " Semestre * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(33, "input", 65);
    \u0275\u0275conditionalCreate(34, CoursesComponent_Conditional_20_Conditional_34_Template, 2, 0, "p", 48);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div")(36, "label", 46);
    \u0275\u0275text(37, " Description * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(38, "textarea", 66);
    \u0275\u0275conditionalCreate(39, CoursesComponent_Conditional_20_Conditional_39_Template, 2, 0, "p", 48);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(40, "div", 58)(41, "button", 59);
    \u0275\u0275listener("click", function CoursesComponent_Conditional_20_Template_button_click_41_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeUEModal());
    });
    \u0275\u0275text(42, " Annuler ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "button", 60);
    \u0275\u0275text(44);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.editingUE() ? "Modifier l'UE" : "Nouvelle UE", " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("formGroup", ctx_r1.ueForm);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(((tmp_3_0 = ctx_r1.ueForm.get("intituleUE")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx_r1.ueForm.get("intituleUE")) == null ? null : tmp_3_0.touched) ? 14 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r1.filieres());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_5_0 = ctx_r1.ueForm.get("filiereId")) == null ? null : tmp_5_0.invalid) && ((tmp_5_0 = ctx_r1.ueForm.get("filiereId")) == null ? null : tmp_5_0.touched) ? 23 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(((tmp_6_0 = ctx_r1.ueForm.get("credit")) == null ? null : tmp_6_0.invalid) && ((tmp_6_0 = ctx_r1.ueForm.get("credit")) == null ? null : tmp_6_0.touched) ? 29 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(((tmp_7_0 = ctx_r1.ueForm.get("semestre")) == null ? null : tmp_7_0.invalid) && ((tmp_7_0 = ctx_r1.ueForm.get("semestre")) == null ? null : tmp_7_0.touched) ? 34 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(((tmp_8_0 = ctx_r1.ueForm.get("description")) == null ? null : tmp_8_0.invalid) && ((tmp_8_0 = ctx_r1.ueForm.get("description")) == null ? null : tmp_8_0.touched) ? 39 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("opacity-50", ctx_r1.ueForm.invalid)("cursor-not-allowed", ctx_r1.ueForm.invalid);
    \u0275\u0275property("disabled", ctx_r1.ueForm.invalid);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.editingUE() ? "Enregistrer" : "Cr\xE9er", " ");
  }
}
var CoursesComponent = class _CoursesComponent {
  coursService = inject(CoursService);
  ueService = inject(UEService);
  filiereService = inject(FiliereService);
  classeService = inject(ClasseService);
  fb = inject(FormBuilder);
  cours = signal([], ...ngDevMode ? [{ debugName: "cours" }] : []);
  ues = signal([], ...ngDevMode ? [{ debugName: "ues" }] : []);
  filieres = signal([], ...ngDevMode ? [{ debugName: "filieres" }] : []);
  classes = signal([], ...ngDevMode ? [{ debugName: "classes" }] : []);
  // Section active (cours ou ue)
  activeSection = signal("cours", ...ngDevMode ? [{ debugName: "activeSection" }] : []);
  // Modals
  showCoursModal = signal(false, ...ngDevMode ? [{ debugName: "showCoursModal" }] : []);
  showUEModal = signal(false, ...ngDevMode ? [{ debugName: "showUEModal" }] : []);
  // Mode édition
  editingCours = signal(null, ...ngDevMode ? [{ debugName: "editingCours" }] : []);
  editingUE = signal(null, ...ngDevMode ? [{ debugName: "editingUE" }] : []);
  // Formulaires
  coursForm;
  ueForm;
  ngOnInit() {
    this.initForms();
    this.loadData();
  }
  initForms() {
    this.coursForm = this.fb.group({
      intitule: ["", [Validators.required, Validators.minLength(3)]],
      volumeHoraire: [0, [Validators.required, Validators.min(1)]],
      typeCours: ["CM", Validators.required],
      classeId: ["", Validators.required],
      ueId: ["", Validators.required]
    });
    this.ueForm = this.fb.group({
      intituleUE: ["", [Validators.required, Validators.minLength(3)]],
      credit: [0, [Validators.required, Validators.min(1), Validators.max(10)]],
      semestre: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      description: ["", [Validators.required, Validators.minLength(10)]],
      filiereId: ["", Validators.required]
    });
  }
  loadData() {
    this.coursService.getCours().subscribe((data) => this.cours.set(data));
    this.ueService.getUE().subscribe((data) => this.ues.set(data));
    this.filiereService.getFilieres().subscribe((data) => this.filieres.set(data));
    this.classeService.getClasses().subscribe((data) => this.classes.set(data));
  }
  // Gestion des sections
  setActiveSection(section) {
    this.activeSection.set(section);
  }
  // Gestion des cours
  openCoursModal(cours) {
    if (cours) {
      this.editingCours.set(cours);
      this.coursForm.patchValue(cours);
    } else {
      this.editingCours.set(null);
      this.coursForm.reset({ typeCours: "CM" });
    }
    this.showCoursModal.set(true);
  }
  closeCoursModal() {
    this.showCoursModal.set(false);
    this.editingCours.set(null);
    this.coursForm.reset();
  }
  saveCours() {
    if (this.coursForm.invalid)
      return;
    const coursData = this.coursForm.value;
    if (this.editingCours()) {
      this.coursService.updateCours(__spreadValues({
        id: this.editingCours().id
      }, coursData)).subscribe(() => {
        this.closeCoursModal();
        this.loadData();
      });
    } else {
      this.coursService.createCours(coursData).subscribe(() => {
        this.closeCoursModal();
        this.loadData();
      });
    }
  }
  deleteCours(id) {
    if (confirm("\xCAtes-vous s\xFBr de vouloir supprimer ce cours ?")) {
      this.coursService.deleteCours(id).subscribe(() => {
        this.loadData();
      });
    }
  }
  // Gestion des UE
  openUEModal(ue) {
    if (ue) {
      this.editingUE.set(ue);
      this.ueForm.patchValue(ue);
    } else {
      this.editingUE.set(null);
      this.ueForm.reset({ semestre: 1, credit: 0 });
    }
    this.showUEModal.set(true);
  }
  closeUEModal() {
    this.showUEModal.set(false);
    this.editingUE.set(null);
    this.ueForm.reset();
  }
  saveUE() {
    if (this.ueForm.invalid)
      return;
    const ueData = this.ueForm.value;
    if (this.editingUE()) {
      this.ueService.updateUE(__spreadValues({
        id: this.editingUE().id
      }, ueData)).subscribe(() => {
        this.closeUEModal();
        this.loadData();
      });
    } else {
      this.ueService.createUE(ueData).subscribe(() => {
        this.closeUEModal();
        this.loadData();
      });
    }
  }
  deleteUE(id) {
    if (confirm("\xCAtes-vous s\xFBr de vouloir supprimer cette UE ?")) {
      this.ueService.deleteUE(id).subscribe(() => {
        this.loadData();
      });
    }
  }
  // Helpers
  getUEName(ueId) {
    const ue = this.ues().find((u) => u.id === ueId);
    return ue ? ue.intituleUE : "UE inconnue";
  }
  getFiliereName(filiereId) {
    const filiere = this.filieres().find((f) => f.id === filiereId);
    return filiere ? filiere.nom : "Fili\xE8re inconnue";
  }
  // TrackBy functions for *ngFor
  trackById(index, item) {
    return item.id;
  }
  trackByIndex(index) {
    return index;
  }
  static \u0275fac = function CoursesComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CoursesComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CoursesComponent, selectors: [["app-courses-management"]], decls: 21, vars: 18, consts: [[1, "p-8", "max-w-7xl", "mx-auto"], [1, "mb-8"], [1, "text-3xl", "font-bold", "text-slate-800", "mb-2"], [1, "text-slate-600"], [1, "flex", "gap-4", "mb-6", "border-b", "border-slate-200"], [1, "pb-3", "px-4", "font-medium", "border-b-2", "transition-colors", "hover:text-teal-600", 3, "click"], [1, "flex", "items-center", "gap-2"], [1, "material-icons", "text-xl"], [1, "fixed", "inset-0", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center", "z-50"], [1, "mb-6", "flex", "justify-between", "items-center"], [1, "font-medium"], [1, "bg-teal-600", "hover:bg-teal-700", "text-white", "px-4", "py-2", "rounded-lg", "flex", "items-center", "gap-2", "transition-colors", 3, "click"], [1, "material-icons"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-6"], [1, "bg-white", "rounded-lg", "shadow-md", "hover:shadow-lg", "transition-shadow", "p-6", "border", "border-slate-200"], [1, "col-span-3", "text-center", "py-12"], [1, "flex", "justify-between", "items-start", "mb-4"], [1, "flex-1"], [1, "text-lg", "font-semibold", "text-slate-800", "mb-1"], [1, "text-sm", "text-slate-500"], [1, "px-2", "py-1", "rounded", "text-xs", "font-semibold"], [1, "space-y-2", "mb-4"], [1, "flex", "items-center", "gap-2", "text-sm", "text-slate-600"], [1, "material-icons", "text-lg"], [1, "flex", "gap-2", "pt-4", "border-t", "border-slate-200"], [1, "flex-1", "bg-slate-100", "hover:bg-slate-200", "text-slate-700", "px-3", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors", "flex", "items-center", "justify-center", "gap-1", 3, "click"], [1, "material-icons", "text-sm"], [1, "bg-red-50", "hover:bg-red-100", "text-red-600", "px-3", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors", "flex", "items-center", "justify-center", 3, "click"], [1, "material-icons", "text-6xl", "text-slate-300", "mb-4"], [1, "text-slate-500"], [1, "mt-4", "text-teal-600", "hover:text-teal-700", "font-medium", 3, "click"], [1, "mb-4"], [1, "text-sm", "text-slate-600", "mb-4", "line-clamp-2"], [1, "grid", "grid-cols-2", "gap-3", "mb-4"], [1, "bg-teal-50", "rounded-lg", "p-3"], [1, "text-xs", "text-teal-600", "font-medium", "mb-1"], [1, "text-lg", "font-bold", "text-teal-700"], [1, "bg-blue-50", "rounded-lg", "p-3"], [1, "text-xs", "text-blue-600", "font-medium", "mb-1"], [1, "text-lg", "font-bold", "text-blue-700"], [1, "bg-white", "rounded-lg", "shadow-xl", "max-w-2xl", "w-full", "mx-4", "max-h-[90vh]", "overflow-y-auto"], [1, "flex", "justify-between", "items-center", "p-6", "border-b", "border-slate-200"], [1, "text-2xl", "font-bold", "text-slate-800"], [1, "text-slate-400", "hover:text-slate-600", "transition-colors", 3, "click"], [1, "p-6", 3, "ngSubmit", "formGroup"], [1, "space-y-4"], [1, "block", "text-sm", "font-medium", "text-slate-700", "mb-1"], ["type", "text", "formControlName", "intitule", "placeholder", "Ex: Programmation Web", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], [1, "text-red-600", "text-sm", "mt-1"], ["formControlName", "typeCours", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["value", "CM"], ["value", "TD"], ["value", "TP"], ["type", "number", "formControlName", "volumeHoraire", "placeholder", "Ex: 40", "min", "1", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["formControlName", "classeId", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["value", ""], [3, "value"], ["formControlName", "ueId", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], [1, "flex", "gap-3", "mt-6", "pt-6", "border-t", "border-slate-200"], ["type", "button", 1, "flex-1", "px-4", "py-2", "border", "border-slate-300", "text-slate-700", "rounded-lg", "hover:bg-slate-50", "transition-colors", 3, "click"], ["type", "submit", 1, "flex-1", "px-4", "py-2", "bg-teal-600", "text-white", "rounded-lg", "hover:bg-teal-700", "transition-colors", "disabled:hover:bg-teal-600", 3, "disabled"], ["type", "text", "formControlName", "intituleUE", "placeholder", "Ex: Technologies Web", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["formControlName", "filiereId", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], [1, "grid", "grid-cols-2", "gap-4"], ["type", "number", "formControlName", "credit", "placeholder", "Ex: 6", "min", "1", "max", "10", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["type", "number", "formControlName", "semestre", "placeholder", "Ex: 5", "min", "1", "max", "10", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["formControlName", "description", "rows", "4", "placeholder", "D\xE9crivez l'unit\xE9 d'enseignement...", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent", "resize-none"]], template: function CoursesComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
      \u0275\u0275text(3, "Gestion des Cours & UE");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "G\xE9rez les cours et les unit\xE9s d'enseignement");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "button", 5);
      \u0275\u0275listener("click", function CoursesComponent_Template_button_click_7_listener() {
        return ctx.setActiveSection("cours");
      });
      \u0275\u0275elementStart(8, "span", 6)(9, "span", 7);
      \u0275\u0275text(10, "menu_book");
      \u0275\u0275elementEnd();
      \u0275\u0275text(11);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(12, "button", 5);
      \u0275\u0275listener("click", function CoursesComponent_Template_button_click_12_listener() {
        return ctx.setActiveSection("ue");
      });
      \u0275\u0275elementStart(13, "span", 6)(14, "span", 7);
      \u0275\u0275text(15, "category");
      \u0275\u0275elementEnd();
      \u0275\u0275text(16);
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(17, CoursesComponent_Conditional_17_Template, 14, 2, "div");
      \u0275\u0275conditionalCreate(18, CoursesComponent_Conditional_18_Template, 14, 2, "div");
      \u0275\u0275conditionalCreate(19, CoursesComponent_Conditional_19_Template, 53, 12, "div", 8);
      \u0275\u0275conditionalCreate(20, CoursesComponent_Conditional_20_Template, 45, 13, "div", 8);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(7);
      \u0275\u0275classProp("border-teal-600", ctx.activeSection() === "cours")("text-teal-600", ctx.activeSection() === "cours")("text-slate-600", ctx.activeSection() !== "cours");
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1(" Cours (", ctx.cours().length, ") ");
      \u0275\u0275advance();
      \u0275\u0275classProp("border-teal-600", ctx.activeSection() === "ue")("text-teal-600", ctx.activeSection() === "ue")("text-slate-600", ctx.activeSection() !== "ue");
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1(" Unit\xE9s d'Enseignement (", ctx.ues().length, ") ");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.activeSection() === "cours" ? 17 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.activeSection() === "ue" ? 18 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showCoursModal() ? 19 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showUEModal() ? 20 : -1);
    }
  }, dependencies: [CommonModule, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, MinValidator, MaxValidator, FormGroupDirective, FormControlName], styles: ["\n\n.line-clamp-2[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n.modal-overlay[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeIn 0.2s ease-in-out;\n}\n.modal-content[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideUp 0.3s ease-out;\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_slideUp {\n  from {\n    transform: translateY(20px);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0);\n    opacity: 1;\n  }\n}\n.course-card[_ngcontent-%COMP%], \n.ue-card[_ngcontent-%COMP%] {\n  transition: all 0.3s ease;\n}\n.course-card[_ngcontent-%COMP%]:hover, \n.ue-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n}\n/*# sourceMappingURL=courses.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CoursesComponent, [{
    type: Component,
    args: [{ selector: "app-courses-management", standalone: true, imports: [CommonModule, ReactiveFormsModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `<div class="p-8 max-w-7xl mx-auto">
  <!-- En-t\xEAte -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-slate-800 mb-2">Gestion des Cours & UE</h1>
    <p class="text-slate-600">G\xE9rez les cours et les unit\xE9s d'enseignement</p>
  </div>

  <!-- Tabs de navigation -->
  <div class="flex gap-4 mb-6 border-b border-slate-200">
    <button
      (click)="setActiveSection('cours')"
      [class.border-teal-600]="activeSection() === 'cours'"
      [class.text-teal-600]="activeSection() === 'cours'"
      [class.text-slate-600]="activeSection() !== 'cours'"
      class="pb-3 px-4 font-medium border-b-2 transition-colors hover:text-teal-600"
    >
      <span class="flex items-center gap-2">
        <span class="material-icons text-xl">menu_book</span>
        Cours ({{ cours().length }})
      </span>
    </button>
    <button
      (click)="setActiveSection('ue')"
      [class.border-teal-600]="activeSection() === 'ue'"
      [class.text-teal-600]="activeSection() === 'ue'"
      [class.text-slate-600]="activeSection() !== 'ue'"
      class="pb-3 px-4 font-medium border-b-2 transition-colors hover:text-teal-600"
    >
      <span class="flex items-center gap-2">
        <span class="material-icons text-xl">category</span>
        Unit\xE9s d'Enseignement ({{ ues().length }})
      </span>
    </button>
  </div>

  <!-- Section Cours -->
  @if (activeSection() === 'cours') {
    <div>
      <!-- Bouton d'ajout -->
      <div class="mb-6 flex justify-between items-center">
        <div class="text-slate-600">
          <span class="font-medium">{{ cours().length }}</span> cours au total
        </div>
        <button
          (click)="openCoursModal()"
          class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <span class="material-icons">add</span>
          Nouveau cours
        </button>
      </div>

      <!-- Grille de cartes de cours -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (c of cours(); track c.id; let i = $index) {
          <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-slate-200">
            <!-- En-t\xEAte de la carte -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-slate-800 mb-1">{{ c.intitule }}</h3>
                <p class="text-sm text-slate-500">{{ getUEName(c.ueId) }}</p>
              </div>
              <span
                [class.bg-blue-100]="c.typeCours === 'CM'"
                [class.text-blue-700]="c.typeCours === 'CM'"
                [class.bg-green-100]="c.typeCours === 'TD'"
                [class.text-green-700]="c.typeCours === 'TD'"
                [class.bg-purple-100]="c.typeCours === 'TP'"
                [class.text-purple-700]="c.typeCours === 'TP'"
                class="px-2 py-1 rounded text-xs font-semibold"
              >
                {{ c.typeCours }}
              </span>
            </div>

            <!-- Informations -->
            <div class="space-y-2 mb-4">
              <div class="flex items-center gap-2 text-sm text-slate-600">
                <span class="material-icons text-lg">schedule</span>
                <span>{{ c.volumeHoraire }}h</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-slate-600">
                <span class="material-icons text-lg">star</span>
                <span>Coefficient: {{ c.coefficient }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 pt-4 border-t border-slate-200">
              <button
                (click)="openCoursModal(c)"
                class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
              >
                <span class="material-icons text-sm">edit</span>
                Modifier
              </button>
              <button
                (click)="deleteCours(c.id!)"
                class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                <span class="material-icons text-sm">delete</span>
              </button>
            </div>
          </div>
        } @empty {
          <div class="col-span-3 text-center py-12">
            <span class="material-icons text-6xl text-slate-300 mb-4">menu_book</span>
            <p class="text-slate-500">Aucun cours pour le moment</p>
            <button
              (click)="openCoursModal()"
              class="mt-4 text-teal-600 hover:text-teal-700 font-medium"
            >
              Cr\xE9er votre premier cours
            </button>
          </div>
        }
      </div>
    </div>
  }

  <!-- Section UE -->
  @if (activeSection() === 'ue') {
    <div>
      <!-- Bouton d'ajout -->
      <div class="mb-6 flex justify-between items-center">
        <div class="text-slate-600">
          <span class="font-medium">{{ ues().length }}</span> UE au total
        </div>
        <button
          (click)="openUEModal()"
          class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <span class="material-icons">add</span>
          Nouvelle UE
        </button>
      </div>

      <!-- Grille de cartes d'UE -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (ue of ues(); track ue.id; let i = $index) {
          <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-slate-200">
            <!-- En-t\xEAte de la carte -->
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-slate-800 mb-1">{{ ue.intituleUE }}</h3>
              <p class="text-sm text-slate-500">{{ getFiliereName(ue.filiereId) }}</p>
            </div>

            <!-- Description -->
            <p class="text-sm text-slate-600 mb-4 line-clamp-2">{{ ue.description }}</p>

            <!-- Informations -->
            <div class="grid grid-cols-2 gap-3 mb-4">
              <div class="bg-teal-50 rounded-lg p-3">
                <div class="text-xs text-teal-600 font-medium mb-1">Cr\xE9dits</div>
                <div class="text-lg font-bold text-teal-700">{{ ue.credit }}</div>
              </div>
              <div class="bg-blue-50 rounded-lg p-3">
                <div class="text-xs text-blue-600 font-medium mb-1">Semestre</div>
                <div class="text-lg font-bold text-blue-700">S{{ ue.semestre }}</div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 pt-4 border-t border-slate-200">
              <button
                (click)="openUEModal(ue)"
                class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
              >
                <span class="material-icons text-sm">edit</span>
                Modifier
              </button>
              <button
                (click)="deleteUE(ue.id!)"
                class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                <span class="material-icons text-sm">delete</span>
              </button>
            </div>
          </div>
        } @empty {
          <div class="col-span-3 text-center py-12">
            <span class="material-icons text-6xl text-slate-300 mb-4">category</span>
            <p class="text-slate-500">Aucune UE pour le moment</p>
            <button
              (click)="openUEModal()"
              class="mt-4 text-teal-600 hover:text-teal-700 font-medium"
            >
              Cr\xE9er votre premi\xE8re UE
            </button>
          </div>
        }
      </div>
    </div>
  }

  <!-- Modal Cours -->
  @if (showCoursModal()) {
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- En-t\xEAte du modal -->
        <div class="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 class="text-2xl font-bold text-slate-800">
            {{ editingCours() ? 'Modifier le cours' : 'Nouveau cours' }}
          </h2>
          <button
            (click)="closeCoursModal()"
            class="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Formulaire -->
        <form [formGroup]="coursForm" (ngSubmit)="saveCours()" class="p-6">
          <div class="space-y-4">
            <!-- Intitul\xE9 -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Intitul\xE9 du cours *
              </label>
              <input
                type="text"
                formControlName="intitule"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ex: Programmation Web"
              />
              @if (coursForm.get('intitule')?.invalid && coursForm.get('intitule')?.touched) {
                <p class="text-red-600 text-sm mt-1">L'intitul\xE9 est requis (min. 3 caract\xE8res)</p>
              }
            </div>

            <!-- Type de cours -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Type de cours *
              </label>
              <select
                formControlName="typeCours"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="CM">Cours Magistral (CM)</option>
                <option value="TD">Travaux Dirig\xE9s (TD)</option>
                <option value="TP">Travaux Pratiques (TP)</option>
              </select>
            </div>

            <!-- Volume horaire -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Volume horaire (h) *
              </label>
              <input
                type="number"
                formControlName="volumeHoraire"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ex: 40"
                min="1"
              />
              @if (coursForm.get('volumeHoraire')?.invalid && coursForm.get('volumeHoraire')?.touched) {
                <p class="text-red-600 text-sm mt-1">Requis (min. 1h)</p>
              }
            </div>

            <!-- Classe -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Classe *
              </label>
              <select
                formControlName="classeId"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">S\xE9lectionnez une classe</option>
                @for (classe of classes(); track classe.id) {
                  <option [value]="classe.id">{{ classe.nom }} \u2014 {{ classe.niveau }}</option>
                }
              </select>
              @if (coursForm.get('classeId')?.invalid && coursForm.get('classeId')?.touched) {
                <p class="text-red-600 text-sm mt-1">Veuillez s\xE9lectionner une classe</p>
              }
            </div>

            <!-- UE -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Unit\xE9 d'Enseignement *
              </label>
              <select
                formControlName="ueId"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">S\xE9lectionnez une UE</option>
                @for (ue of ues(); track ue.id; let i = $index) {
                  <option [value]="ue.id">{{ ue.intituleUE }} - S{{ ue.semestre }}</option>
                }
              </select>
              @if (coursForm.get('ueId')?.invalid && coursForm.get('ueId')?.touched) {
                <p class="text-red-600 text-sm mt-1">Veuillez s\xE9lectionner une UE</p>
              }
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mt-6 pt-6 border-t border-slate-200">
            <button
              type="button"
              (click)="closeCoursModal()"
              class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              [disabled]="coursForm.invalid"
              [class.opacity-50]="coursForm.invalid"
              [class.cursor-not-allowed]="coursForm.invalid"
              class="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:hover:bg-teal-600"
            >
              {{ editingCours() ? 'Enregistrer' : 'Cr\xE9er' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  }

  <!-- Modal UE -->
  @if (showUEModal()) {
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- En-t\xEAte du modal -->
        <div class="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 class="text-2xl font-bold text-slate-800">
            {{ editingUE() ? 'Modifier l\\'UE' : 'Nouvelle UE' }}
          </h2>
          <button
            (click)="closeUEModal()"
            class="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Formulaire -->
        <form [formGroup]="ueForm" (ngSubmit)="saveUE()" class="p-6">
          <div class="space-y-4">
            <!-- Intitul\xE9 -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Intitul\xE9 de l'UE *
              </label>
              <input
                type="text"
                formControlName="intituleUE"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ex: Technologies Web"
              />
              @if (ueForm.get('intituleUE')?.invalid && ueForm.get('intituleUE')?.touched) {
                <p class="text-red-600 text-sm mt-1">L'intitul\xE9 est requis (min. 3 caract\xE8res)</p>
              }
            </div>

            <!-- Fili\xE8re -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Fili\xE8re *
              </label>
              <select
                formControlName="filiereId"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">S\xE9lectionnez une fili\xE8re</option>
                @for (filiere of filieres(); track filiere.id; let i = $index) {
                  <option [value]="filiere.id">{{ filiere.nom }} ({{ filiere.code }})</option>
                }
              </select>
              @if (ueForm.get('filiereId')?.invalid && ueForm.get('filiereId')?.touched) {
                <p class="text-red-600 text-sm mt-1">Veuillez s\xE9lectionner une fili\xE8re</p>
              }
            </div>

            <!-- Cr\xE9dits et Semestre -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  Cr\xE9dits *
                </label>
                <input
                  type="number"
                  formControlName="credit"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Ex: 6"
                  min="1"
                  max="10"
                />
                @if (ueForm.get('credit')?.invalid && ueForm.get('credit')?.touched) {
                  <p class="text-red-600 text-sm mt-1">Entre 1 et 10</p>
                }
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  Semestre *
                </label>
                <input
                  type="number"
                  formControlName="semestre"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Ex: 5"
                  min="1"
                  max="10"
                />
                @if (ueForm.get('semestre')?.invalid && ueForm.get('semestre')?.touched) {
                  <p class="text-red-600 text-sm mt-1">Entre 1 et 10</p>
                }
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Description *
              </label>
              <textarea
                formControlName="description"
                rows="4"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                placeholder="D\xE9crivez l'unit\xE9 d'enseignement..."
              ></textarea>
              @if (ueForm.get('description')?.invalid && ueForm.get('description')?.touched) {
                <p class="text-red-600 text-sm mt-1">La description est requise (min. 10 caract\xE8res)</p>
              }
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mt-6 pt-6 border-t border-slate-200">
            <button
              type="button"
              (click)="closeUEModal()"
              class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              [disabled]="ueForm.invalid"
              [class.opacity-50]="ueForm.invalid"
              [class.cursor-not-allowed]="ueForm.invalid"
              class="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:hover:bg-teal-600"
            >
              {{ editingUE() ? 'Enregistrer' : 'Cr\xE9er' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  }
</div>
`, styles: ["/* src/app/features/admin/courses/courses.component.scss */\n.line-clamp-2 {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n.modal-overlay {\n  animation: fadeIn 0.2s ease-in-out;\n}\n.modal-content {\n  animation: slideUp 0.3s ease-out;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes slideUp {\n  from {\n    transform: translateY(20px);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0);\n    opacity: 1;\n  }\n}\n.course-card,\n.ue-card {\n  transition: all 0.3s ease;\n}\n.course-card:hover,\n.ue-card:hover {\n  transform: translateY(-2px);\n}\n/*# sourceMappingURL=courses.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CoursesComponent, { className: "CoursesComponent", filePath: "src/app/features/admin/courses/courses.component.ts", lineNumber: 19 });
})();
export {
  CoursesComponent
};
//# sourceMappingURL=chunk-GOCOBOWU.js.map
