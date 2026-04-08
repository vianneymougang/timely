import {
  ClasseService
} from "./chunk-37GUWSLG.js";
import {
  ApiService
} from "./chunk-M2M2Z2ZK.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  MinValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgSelectOption,
  NumberValueAccessor,
  RadioControlValueAccessor,
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
  Observable,
  computed,
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
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-DBHCOGA3.js";
import {
  __objRest,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/core/services/etudiant.service.ts
var EtudiantService = class _EtudiantService {
  apiService = inject(ApiService);
  getEtudiants() {
    return this.apiService.get("/bookings/etudiants", { page: 0, size: 200 }).pipe(map((page) => page.content.map(this.toEtudiant)));
  }
  getEtudiantById(id) {
    return this.apiService.get(`/bookings/etudiants/${id}`).pipe(map(this.toEtudiant));
  }
  getEtudiantsByClasse(classeId) {
    return this.apiService.get(`/bookings/classes/${classeId}/etudiants`, { page: 0, size: 200 }).pipe(map((page) => page.content.map(this.toEtudiant)));
  }
  getEtudiantsByGroupe(groupeId) {
    return this.getEtudiants().pipe(map((etudiants) => etudiants.filter((e) => e.groupeId === groupeId)));
  }
  createEtudiant(etudiant) {
    const body = {
      classeId: etudiant.classeId,
      matricule: etudiant.matricule,
      nom: etudiant.nom,
      prenom: etudiant.prenom,
      email: etudiant.email,
      telephone: etudiant.telephone,
      dateInscription: etudiant.dateNaissance
    };
    return this.apiService.post("/bookings/etudiants", body).pipe(map(this.toEtudiant));
  }
  updateEtudiant(etudiant) {
    const _a = etudiant, { id } = _a, rest = __objRest(_a, ["id"]);
    const body = {
      classeId: rest.classeId,
      matricule: rest.matricule,
      nom: rest.nom,
      prenom: rest.prenom,
      email: rest.email,
      telephone: rest.telephone,
      dateInscription: rest.dateNaissance
    };
    return this.apiService.put(`/bookings/etudiants/${id}`, body).pipe(map(this.toEtudiant));
  }
  deleteEtudiant(id) {
    return this.apiService.delete(`/bookings/etudiants/${id}`);
  }
  affecterGroupe(etudiantId, groupeId) {
    return this.apiService.post(`/bookings/groupes/${groupeId}/etudiants/${etudiantId}`, {}).pipe(map(this.toEtudiant));
  }
  retirerGroupe(etudiantId, groupeId) {
    return this.apiService.delete(`/bookings/groupes/${groupeId}/etudiants/${etudiantId}`).pipe(map(this.toEtudiant));
  }
  toEtudiant(r) {
    return {
      id: r.id,
      matricule: r.matricule,
      nom: r.nom,
      prenom: r.prenom,
      email: r.email,
      telephone: r.telephone ?? "",
      dateNaissance: r.dateInscription,
      classeId: r.classeId
    };
  }
  static \u0275fac = function EtudiantService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EtudiantService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _EtudiantService, factory: _EtudiantService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EtudiantService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/core/services/groupe.service.ts
var GroupeService = class _GroupeService {
  apiService = inject(ApiService);
  getGroupes() {
    return this.apiService.get("/bookings/groupes").pipe(map((items) => items.map(this.toGroupe)));
  }
  getGroupeById(id) {
    return this.apiService.get(`/bookings/groupes/${id}`).pipe(map(this.toGroupe));
  }
  getGroupesByClasse(classeId) {
    return this.getGroupes();
  }
  getGroupesByCours(coursId) {
    return this.apiService.get(`/bookings/cours/${coursId}/groupes`).pipe(map((items) => items.map(this.toGroupe)));
  }
  updateGroupe(groupe) {
    const _a = groupe, { id } = _a, rest = __objRest(_a, ["id"]);
    const body = {
      coursId: rest.coursId ?? "",
      numeroGroupe: parseInt(rest.nom ?? "1", 10) || 1,
      effectif: rest.capaciteMax ?? 0,
      typeGroupe: "TD"
    };
    return this.apiService.put(`/bookings/groupes/${id}`, body).pipe(map(this.toGroupe));
  }
  deleteGroupe(id) {
    return this.apiService.delete(`/bookings/groupes/${id}`);
  }
  ajouterEtudiant(groupeId, etudiantId) {
    return this.apiService.post(`/bookings/groupes/${groupeId}/etudiants/${etudiantId}`, {});
  }
  retirerEtudiant(groupeId, etudiantId) {
    return this.apiService.delete(`/bookings/groupes/${groupeId}/etudiants/${etudiantId}`);
  }
  genererGroupes(options, etudiants) {
    const coursId = options.coursId;
    if (coursId) {
      return this.apiService.post(`/bookings/cours/${coursId}/groupes/generate`, {}).pipe(map((response) => (response.groupes ?? []).map(this.toGroupe)));
    }
    return new Observable((observer) => {
      const etudiantsClasse = etudiants.filter((e) => e.classeId === options.classeId);
      const groupesGeneres = [];
      if (etudiantsClasse.length === 0) {
        observer.next([]);
        observer.complete();
        return;
      }
      let etudiantsARepartir = [...etudiantsClasse];
      if (options.repartitionAleatoire) {
        for (let i = etudiantsARepartir.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [etudiantsARepartir[i], etudiantsARepartir[j]] = [etudiantsARepartir[j], etudiantsARepartir[i]];
        }
      }
      let nombreGroupes;
      let tailleParGroupe;
      if (options.nombreGroupes) {
        nombreGroupes = options.nombreGroupes;
        tailleParGroupe = Math.ceil(etudiantsARepartir.length / nombreGroupes);
      } else if (options.tailleGroupe) {
        tailleParGroupe = options.tailleGroupe;
        nombreGroupes = Math.ceil(etudiantsARepartir.length / tailleParGroupe);
      } else {
        tailleParGroupe = 5;
        nombreGroupes = Math.ceil(etudiantsARepartir.length / tailleParGroupe);
      }
      for (let i = 0; i < nombreGroupes; i++) {
        const debut = i * tailleParGroupe;
        const fin = Math.min(debut + tailleParGroupe, etudiantsARepartir.length);
        const etudiantsDuGroupe = etudiantsARepartir.slice(debut, fin);
        groupesGeneres.push({
          id: `local_${Date.now()}_${i}`,
          nom: `${options.prefixeNom} ${i + 1}`,
          classeId: options.classeId,
          etudiantsIds: etudiantsDuGroupe.map((e) => e.id),
          capaciteMax: tailleParGroupe
        });
      }
      observer.next(groupesGeneres);
      observer.complete();
    });
  }
  toGroupe(r) {
    return {
      id: r.id,
      nom: `${r.coursIntitule ?? "Groupe"} - G${r.numeroGroupe}`,
      classeId: r.coursId,
      etudiantsIds: [],
      capaciteMax: r.effectif
    };
  }
  static \u0275fac = function GroupeService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GroupeService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _GroupeService, factory: _GroupeService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GroupeService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/features/admin/etudiants/etudiants.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function EtudiantsComponent_For_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const classe_r1 = ctx.$implicit;
    \u0275\u0275property("value", classe_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(classe_r1.nom);
  }
}
function EtudiantsComponent_Conditional_25_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const groupe_r4 = ctx.$implicit;
    \u0275\u0275property("value", groupe_r4.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(groupe_r4.nom);
  }
}
function EtudiantsComponent_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "select", 11);
    \u0275\u0275listener("change", function EtudiantsComponent_Conditional_25_Template_select_change_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.groupeFilter.set($event.target.value));
    });
    \u0275\u0275elementStart(1, "option", 12);
    \u0275\u0275text(2, "Tous les groupes");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, EtudiantsComponent_Conditional_25_For_4_Template, 2, 2, "option", 13, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("value", ctx_r2.groupeFilter());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.groupes());
  }
}
function EtudiantsComponent_Conditional_26_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 21)(1, "div", 23)(2, "div", 24)(3, "span", 25);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 26)(6, "h3", 27);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 28);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 29)(11, "div", 30)(12, "span", 31);
    \u0275\u0275text(13, "email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span", 32);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 30)(17, "span", 31);
    \u0275\u0275text(18, "phone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span");
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 30)(22, "span", 31);
    \u0275\u0275text(23, "class");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "span");
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div", 33)(27, "span", 31);
    \u0275\u0275text(28, " groups ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "span");
    \u0275\u0275text(30);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(31, "div", 34)(32, "button", 35);
    \u0275\u0275listener("click", function EtudiantsComponent_Conditional_26_For_12_Template_button_click_32_listener() {
      const etudiant_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.openEtudiantModal(etudiant_r8));
    });
    \u0275\u0275elementStart(33, "span", 36);
    \u0275\u0275text(34, "edit");
    \u0275\u0275elementEnd();
    \u0275\u0275text(35, " Modifier ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "button", 37);
    \u0275\u0275listener("click", function EtudiantsComponent_Conditional_26_For_12_Template_button_click_36_listener() {
      const etudiant_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.deleteEtudiant(etudiant_r8.id));
    });
    \u0275\u0275elementStart(37, "span", 36);
    \u0275\u0275text(38, "delete");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const etudiant_r8 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2(" ", etudiant_r8.nom.charAt(0), "", etudiant_r8.prenom.charAt(0), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", etudiant_r8.nom, " ", etudiant_r8.prenom, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(etudiant_r8.matricule);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(etudiant_r8.email);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(etudiant_r8.telephone);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.getClasseName(etudiant_r8.classeId));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("text-teal-600", etudiant_r8.groupeId)("text-slate-400", !etudiant_r8.groupeId);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("text-teal-600", etudiant_r8.groupeId)("font-medium", etudiant_r8.groupeId)("text-slate-400", !etudiant_r8.groupeId);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.getGroupeName(etudiant_r8.groupeId), " ");
  }
}
function EtudiantsComponent_Conditional_26_ForEmpty_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22)(1, "span", 38);
    \u0275\u0275text(2, "school");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 39);
    \u0275\u0275text(4, "Aucun \xE9tudiant pour le moment");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 40);
    \u0275\u0275listener("click", function EtudiantsComponent_Conditional_26_ForEmpty_13_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.openEtudiantModal());
    });
    \u0275\u0275text(6, " Ajouter votre premier \xE9tudiant ");
    \u0275\u0275elementEnd()();
  }
}
function EtudiantsComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 16)(2, "div", 3)(3, "span", 17);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " \xE9tudiant(s) ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 18);
    \u0275\u0275listener("click", function EtudiantsComponent_Conditional_26_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openEtudiantModal());
    });
    \u0275\u0275elementStart(7, "span", 19);
    \u0275\u0275text(8, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(9, " Nouvel \xE9tudiant ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 20);
    \u0275\u0275repeaterCreate(11, EtudiantsComponent_Conditional_26_For_12_Template, 39, 19, "div", 21, _forTrack0, false, EtudiantsComponent_Conditional_26_ForEmpty_13_Template, 7, 0, "div", 22);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.etudiantsFiltered().length);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r2.etudiantsFiltered());
  }
}
function EtudiantsComponent_Conditional_27_For_13_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 50);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const groupe_r12 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(groupe_r12.description);
  }
}
function EtudiantsComponent_Conditional_27_For_13_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 56)(1, "div", 59);
    \u0275\u0275text(2, "Capacit\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 60);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const groupe_r12 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(groupe_r12.capaciteMax);
  }
}
function EtudiantsComponent_Conditional_27_For_13_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 57)(1, "div", 61)(2, "span");
    \u0275\u0275text(3, "Remplissage");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 62);
    \u0275\u0275element(7, "div", 63);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const groupe_r12 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", ctx_r2.Math.round(ctx_r2.getEtudiantsInGroupe(groupe_r12.id).length / groupe_r12.capaciteMax * 100), "%");
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", ctx_r2.getEtudiantsInGroupe(groupe_r12.id).length / groupe_r12.capaciteMax * 100, "%");
  }
}
function EtudiantsComponent_Conditional_27_For_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 43)(1, "div", 45)(2, "div", 46)(3, "div", 47)(4, "span", 48);
    \u0275\u0275text(5, "groups");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 26)(7, "h3", 49);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 28);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(11, EtudiantsComponent_Conditional_27_For_13_Conditional_11_Template, 2, 1, "p", 50);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 51)(13, "div", 52)(14, "div", 53)(15, "div", 54);
    \u0275\u0275text(16, "\xC9tudiants");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 55);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(19, EtudiantsComponent_Conditional_27_For_13_Conditional_19_Template, 5, 1, "div", 56);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(20, EtudiantsComponent_Conditional_27_For_13_Conditional_20_Template, 8, 3, "div", 57);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div", 58)(22, "button", 35);
    \u0275\u0275listener("click", function EtudiantsComponent_Conditional_27_For_13_Template_button_click_22_listener() {
      const groupe_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.openGroupeModal(groupe_r12));
    });
    \u0275\u0275elementStart(23, "span", 36);
    \u0275\u0275text(24, "edit");
    \u0275\u0275elementEnd();
    \u0275\u0275text(25, " G\xE9rer les membres ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "button", 37);
    \u0275\u0275listener("click", function EtudiantsComponent_Conditional_27_For_13_Template_button_click_26_listener() {
      const groupe_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.deleteGroupe(groupe_r12.id));
    });
    \u0275\u0275elementStart(27, "span", 36);
    \u0275\u0275text(28, "delete");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const groupe_r12 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(groupe_r12.nom);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.getClasseName(groupe_r12.classeId));
    \u0275\u0275advance();
    \u0275\u0275conditional(groupe_r12.description ? 11 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", ctx_r2.getEtudiantsInGroupe(groupe_r12.id).length, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(groupe_r12.capaciteMax ? 19 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(groupe_r12.capaciteMax ? 20 : -1);
  }
}
function EtudiantsComponent_Conditional_27_ForEmpty_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 44)(1, "div", 64)(2, "span", 65);
    \u0275\u0275text(3, "groups");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 66);
    \u0275\u0275text(5, "Aucun groupe pour le moment");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 67);
    \u0275\u0275text(7, "Commencez par g\xE9n\xE9rer des groupes automatiquement");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 41);
    \u0275\u0275listener("click", function EtudiantsComponent_Conditional_27_ForEmpty_14_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.openGenerationModal());
    });
    \u0275\u0275elementStart(9, "span", 19);
    \u0275\u0275text(10, "auto_awesome");
    \u0275\u0275elementEnd();
    \u0275\u0275text(11, " G\xE9n\xE9rer automatiquement ");
    \u0275\u0275elementEnd()()();
  }
}
function EtudiantsComponent_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 16)(2, "div", 3)(3, "span", 17);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " groupe(s) ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 41);
    \u0275\u0275listener("click", function EtudiantsComponent_Conditional_27_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openGenerationModal());
    });
    \u0275\u0275elementStart(7, "span", 19);
    \u0275\u0275text(8, "auto_awesome");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 42);
    \u0275\u0275text(10, "G\xE9n\xE9rer des groupes");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "div", 20);
    \u0275\u0275repeaterCreate(12, EtudiantsComponent_Conditional_27_For_13_Template, 29, 6, "div", 43, _forTrack0, false, EtudiantsComponent_Conditional_27_ForEmpty_14_Template, 12, 0, "div", 44);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.groupesFiltered().length);
    \u0275\u0275advance(8);
    \u0275\u0275repeater(ctx_r2.groupesFiltered());
  }
}
function EtudiantsComponent_Conditional_28_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 76);
    \u0275\u0275text(1, "Le matricule est requis (min. 4 caract\xE8res)");
    \u0275\u0275elementEnd();
  }
}
function EtudiantsComponent_Conditional_28_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 76);
    \u0275\u0275text(1, "Le nom est requis");
    \u0275\u0275elementEnd();
  }
}
function EtudiantsComponent_Conditional_28_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 76);
    \u0275\u0275text(1, "Le pr\xE9nom est requis");
    \u0275\u0275elementEnd();
  }
}
function EtudiantsComponent_Conditional_28_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 76);
    \u0275\u0275text(1, "Email valide requis");
    \u0275\u0275elementEnd();
  }
}
function EtudiantsComponent_Conditional_28_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 76);
    \u0275\u0275text(1, "T\xE9l\xE9phone requis");
    \u0275\u0275elementEnd();
  }
}
function EtudiantsComponent_Conditional_28_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 76);
    \u0275\u0275text(1, "La date de naissance est requise");
    \u0275\u0275elementEnd();
  }
}
function EtudiantsComponent_Conditional_28_For_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const classe_r14 = ctx.$implicit;
    \u0275\u0275property("value", classe_r14.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(classe_r14.nom);
  }
}
function EtudiantsComponent_Conditional_28_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 76);
    \u0275\u0275text(1, "Veuillez s\xE9lectionner une classe");
    \u0275\u0275elementEnd();
  }
}
function EtudiantsComponent_Conditional_28_For_59_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const groupe_r15 = ctx.$implicit;
    \u0275\u0275property("value", groupe_r15.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(groupe_r15.nom);
  }
}
function EtudiantsComponent_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "div", 68)(2, "div", 69)(3, "h2", 70);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 71);
    \u0275\u0275listener("click", function EtudiantsComponent_Conditional_28_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeEtudiantModal());
    });
    \u0275\u0275elementStart(6, "span", 19);
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "form", 72);
    \u0275\u0275listener("ngSubmit", function EtudiantsComponent_Conditional_28_Template_form_ngSubmit_8_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.saveEtudiant());
    });
    \u0275\u0275elementStart(9, "div", 73)(10, "div")(11, "label", 74);
    \u0275\u0275text(12, " Matricule * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "input", 75);
    \u0275\u0275conditionalCreate(14, EtudiantsComponent_Conditional_28_Conditional_14_Template, 2, 0, "p", 76);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 77)(16, "div")(17, "label", 74);
    \u0275\u0275text(18, " Nom * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(19, "input", 78);
    \u0275\u0275conditionalCreate(20, EtudiantsComponent_Conditional_28_Conditional_20_Template, 2, 0, "p", 76);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div")(22, "label", 74);
    \u0275\u0275text(23, " Pr\xE9nom * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(24, "input", 79);
    \u0275\u0275conditionalCreate(25, EtudiantsComponent_Conditional_28_Conditional_25_Template, 2, 0, "p", 76);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div", 77)(27, "div")(28, "label", 74);
    \u0275\u0275text(29, " Email * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(30, "input", 80);
    \u0275\u0275conditionalCreate(31, EtudiantsComponent_Conditional_28_Conditional_31_Template, 2, 0, "p", 76);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "div")(33, "label", 74);
    \u0275\u0275text(34, " T\xE9l\xE9phone * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(35, "input", 81);
    \u0275\u0275conditionalCreate(36, EtudiantsComponent_Conditional_28_Conditional_36_Template, 2, 0, "p", 76);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(37, "div")(38, "label", 74);
    \u0275\u0275text(39, " Date de naissance * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(40, "input", 82);
    \u0275\u0275conditionalCreate(41, EtudiantsComponent_Conditional_28_Conditional_41_Template, 2, 0, "p", 76);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "div", 77)(43, "div")(44, "label", 74);
    \u0275\u0275text(45, " Classe * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "select", 83)(47, "option", 12);
    \u0275\u0275text(48, "S\xE9lectionnez une classe");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(49, EtudiantsComponent_Conditional_28_For_50_Template, 2, 2, "option", 13, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(51, EtudiantsComponent_Conditional_28_Conditional_51_Template, 2, 0, "p", 76);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "div")(53, "label", 74);
    \u0275\u0275text(54, " Groupe (optionnel) ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "select", 84)(56, "option", 12);
    \u0275\u0275text(57, "Aucun groupe");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(58, EtudiantsComponent_Conditional_28_For_59_Template, 2, 2, "option", 13, _forTrack0);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(60, "div", 85)(61, "button", 86);
    \u0275\u0275listener("click", function EtudiantsComponent_Conditional_28_Template_button_click_61_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeEtudiantModal());
    });
    \u0275\u0275text(62, " Annuler ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(63, "button", 87);
    \u0275\u0275text(64);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_10_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r2.editingEtudiant() ? "Modifier l'\xE9tudiant" : "Nouvel \xE9tudiant", " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("formGroup", ctx_r2.etudiantForm);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(((tmp_3_0 = ctx_r2.etudiantForm.get("matricule")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx_r2.etudiantForm.get("matricule")) == null ? null : tmp_3_0.touched) ? 14 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(((tmp_4_0 = ctx_r2.etudiantForm.get("nom")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx_r2.etudiantForm.get("nom")) == null ? null : tmp_4_0.touched) ? 20 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(((tmp_5_0 = ctx_r2.etudiantForm.get("prenom")) == null ? null : tmp_5_0.invalid) && ((tmp_5_0 = ctx_r2.etudiantForm.get("prenom")) == null ? null : tmp_5_0.touched) ? 25 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(((tmp_6_0 = ctx_r2.etudiantForm.get("email")) == null ? null : tmp_6_0.invalid) && ((tmp_6_0 = ctx_r2.etudiantForm.get("email")) == null ? null : tmp_6_0.touched) ? 31 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(((tmp_7_0 = ctx_r2.etudiantForm.get("telephone")) == null ? null : tmp_7_0.invalid) && ((tmp_7_0 = ctx_r2.etudiantForm.get("telephone")) == null ? null : tmp_7_0.touched) ? 36 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(((tmp_8_0 = ctx_r2.etudiantForm.get("dateNaissance")) == null ? null : tmp_8_0.invalid) && ((tmp_8_0 = ctx_r2.etudiantForm.get("dateNaissance")) == null ? null : tmp_8_0.touched) ? 41 : -1);
    \u0275\u0275advance(8);
    \u0275\u0275repeater(ctx_r2.classes());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_10_0 = ctx_r2.etudiantForm.get("classeId")) == null ? null : tmp_10_0.invalid) && ((tmp_10_0 = ctx_r2.etudiantForm.get("classeId")) == null ? null : tmp_10_0.touched) ? 51 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r2.groupes());
    \u0275\u0275advance(5);
    \u0275\u0275classProp("opacity-50", ctx_r2.etudiantForm.invalid)("cursor-not-allowed", ctx_r2.etudiantForm.invalid);
    \u0275\u0275property("disabled", ctx_r2.etudiantForm.invalid);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.editingEtudiant() ? "Enregistrer" : "Cr\xE9er", " ");
  }
}
function EtudiantsComponent_Conditional_29_Conditional_33_For_5_For_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 105)(1, "div", 6)(2, "div", 106)(3, "span", 107);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div")(6, "div", 108);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 109);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "button", 110);
    \u0275\u0275listener("click", function EtudiantsComponent_Conditional_29_Conditional_33_For_5_For_1_Conditional_0_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r17);
      const etudiantId_r18 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.toggleEtudiant(etudiantId_r18));
    });
    \u0275\u0275elementStart(11, "span", 36);
    \u0275\u0275text(12, "remove_circle");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const etudiant_r19 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2(" ", etudiant_r19.prenom.charAt(0), "", etudiant_r19.nom.charAt(0), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", etudiant_r19.prenom, " ", etudiant_r19.nom, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(etudiant_r19.matricule);
  }
}
function EtudiantsComponent_Conditional_29_Conditional_33_For_5_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EtudiantsComponent_Conditional_29_Conditional_33_For_5_For_1_Conditional_0_Template, 13, 5, "div", 105);
  }
  if (rf & 2) {
    const etudiant_r19 = ctx.$implicit;
    const etudiantId_r18 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275conditional(etudiant_r19.id === etudiantId_r18 ? 0 : -1);
  }
}
function EtudiantsComponent_Conditional_29_Conditional_33_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, EtudiantsComponent_Conditional_29_Conditional_33_For_5_For_1_Template, 1, 1, null, null, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275repeater(ctx_r2.etudiants());
  }
}
function EtudiantsComponent_Conditional_29_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 99)(1, "div", 101);
    \u0275\u0275text(2, "\xC9tudiants actuels");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 104);
    \u0275\u0275repeaterCreate(4, EtudiantsComponent_Conditional_29_Conditional_33_For_5_Template, 2, 0, null, null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r2.etudiantsIdsArray.value);
  }
}
function EtudiantsComponent_Conditional_29_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 100)(1, "span", 111);
    \u0275\u0275text(2, "group_off");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 28);
    \u0275\u0275text(4, "Aucun membre dans ce groupe");
    \u0275\u0275elementEnd()();
  }
}
function EtudiantsComponent_Conditional_29_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 102);
    \u0275\u0275text(1, "(Tous les \xE9tudiants sont d\xE9j\xE0 affect\xE9s)");
    \u0275\u0275elementEnd();
  }
}
function EtudiantsComponent_Conditional_29_Conditional_39_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 114);
    \u0275\u0275listener("click", function EtudiantsComponent_Conditional_29_Conditional_39_For_3_Template_button_click_0_listener() {
      const etudiant_r21 = \u0275\u0275restoreView(_r20).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.toggleEtudiant(etudiant_r21.id));
    });
    \u0275\u0275elementStart(1, "div", 115)(2, "span", 116);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 26)(5, "div", 108);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 109);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "span", 117);
    \u0275\u0275text(10, "add_circle");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const etudiant_r21 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", etudiant_r21.prenom.charAt(0), "", etudiant_r21.nom.charAt(0), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", etudiant_r21.prenom, " ", etudiant_r21.nom, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(etudiant_r21.matricule);
  }
}
function EtudiantsComponent_Conditional_29_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 103)(1, "div", 112);
    \u0275\u0275repeaterCreate(2, EtudiantsComponent_Conditional_29_Conditional_39_For_3_Template, 11, 5, "button", 113, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.getEtudiantsOfClasseNotInGroup(ctx_r2.editingGroupe().classeId));
  }
}
function EtudiantsComponent_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "div", 88)(2, "div", 89)(3, "div")(4, "h2", 70);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 90);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "button", 71);
    \u0275\u0275listener("click", function EtudiantsComponent_Conditional_29_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeGroupeModal());
    });
    \u0275\u0275elementStart(9, "span", 19);
    \u0275\u0275text(10, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "form", 72);
    \u0275\u0275listener("ngSubmit", function EtudiantsComponent_Conditional_29_Template_form_ngSubmit_11_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.saveGroupe());
    });
    \u0275\u0275elementStart(12, "div", 91)(13, "div", 77)(14, "div")(15, "label", 74);
    \u0275\u0275text(16, " Nom du groupe * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(17, "input", 92);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div")(19, "label", 74);
    \u0275\u0275text(20, " Capacit\xE9 max ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(21, "input", 93);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div")(23, "label", 74);
    \u0275\u0275text(24, " Description ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(25, "textarea", 94);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div", 95)(27, "h3", 96)(28, "span", 97);
    \u0275\u0275text(29, "people");
    \u0275\u0275elementEnd();
    \u0275\u0275text(30, " Membres du groupe ");
    \u0275\u0275elementStart(31, "span", 98);
    \u0275\u0275text(32);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(33, EtudiantsComponent_Conditional_29_Conditional_33_Template, 6, 0, "div", 99)(34, EtudiantsComponent_Conditional_29_Conditional_34_Template, 5, 0, "div", 100);
    \u0275\u0275elementStart(35, "div")(36, "div", 101);
    \u0275\u0275text(37, " Ajouter des \xE9tudiants ");
    \u0275\u0275conditionalCreate(38, EtudiantsComponent_Conditional_29_Conditional_38_Template, 2, 0, "span", 102);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(39, EtudiantsComponent_Conditional_29_Conditional_39_Template, 4, 0, "div", 103);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(40, "div", 85)(41, "button", 86);
    \u0275\u0275listener("click", function EtudiantsComponent_Conditional_29_Template_button_click_41_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeGroupeModal());
    });
    \u0275\u0275text(42, " Annuler ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "button", 87);
    \u0275\u0275text(44, " Enregistrer les modifications ");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.editingGroupe().nom);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.getClasseName(ctx_r2.editingGroupe().classeId));
    \u0275\u0275advance(4);
    \u0275\u0275property("formGroup", ctx_r2.groupeForm);
    \u0275\u0275advance(21);
    \u0275\u0275textInterpolate2(" (", ctx_r2.etudiantsIdsArray.length, " / ", ((tmp_4_0 = ctx_r2.groupeForm.get("capaciteMax")) == null ? null : tmp_4_0.value) || "\u221E", ") ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.etudiantsIdsArray.length > 0 ? 33 : 34);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r2.editingGroupe() && ctx_r2.getEtudiantsOfClasseNotInGroup(ctx_r2.editingGroupe().classeId).length === 0 ? 38 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.editingGroupe() && ctx_r2.getEtudiantsOfClasseNotInGroup(ctx_r2.editingGroupe().classeId).length > 0 ? 39 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("opacity-50", ctx_r2.groupeForm.invalid)("cursor-not-allowed", ctx_r2.groupeForm.invalid);
    \u0275\u0275property("disabled", ctx_r2.groupeForm.invalid);
  }
}
function EtudiantsComponent_Conditional_30_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const classe_r23 = ctx.$implicit;
    \u0275\u0275property("value", classe_r23.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(classe_r23.nom);
  }
}
function EtudiantsComponent_Conditional_30_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 76);
    \u0275\u0275text(1, "Veuillez s\xE9lectionner une classe");
    \u0275\u0275elementEnd();
  }
}
function EtudiantsComponent_Conditional_30_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "label", 74);
    \u0275\u0275text(2, " Nombre de groupes \xE0 cr\xE9er * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "input", 138);
    \u0275\u0275elementStart(4, "p", 129);
    \u0275\u0275text(5, " Les \xE9tudiants seront r\xE9partis \xE9quitablement ");
    \u0275\u0275elementEnd()();
  }
}
function EtudiantsComponent_Conditional_30_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "label", 74);
    \u0275\u0275text(2, " Nombre d'\xE9tudiants par groupe * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "input", 139);
    \u0275\u0275elementStart(4, "p", 129);
    \u0275\u0275text(5, " Le nombre de groupes sera calcul\xE9 automatiquement ");
    \u0275\u0275elementEnd()();
  }
}
function EtudiantsComponent_Conditional_30_Conditional_59_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275textInterpolate1(" ", (tmp_3_0 = ctx_r2.generationForm.get("nombreGroupes")) == null ? null : tmp_3_0.value, " groupe(s) seront cr\xE9\xE9s ");
  }
}
function EtudiantsComponent_Conditional_30_Conditional_59_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275textInterpolate1(" Groupes de ", (tmp_3_0 = ctx_r2.generationForm.get("tailleGroupe")) == null ? null : tmp_3_0.value, " \xE9tudiant(s) ");
  }
}
function EtudiantsComponent_Conditional_30_Conditional_59_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 137)(1, "div", 140)(2, "span", 141);
    \u0275\u0275text(3, "info");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 142)(5, "p", 143);
    \u0275\u0275text(6, "Aper\xE7u de la g\xE9n\xE9ration");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 144);
    \u0275\u0275conditionalCreate(8, EtudiantsComponent_Conditional_30_Conditional_59_Conditional_8_Template, 1, 1);
    \u0275\u0275conditionalCreate(9, EtudiantsComponent_Conditional_30_Conditional_59_Conditional_9_Template, 1, 1);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(8);
    \u0275\u0275conditional(((tmp_2_0 = ctx_r2.generationForm.get("modeRepartition")) == null ? null : tmp_2_0.value) === "nombre" ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_3_0 = ctx_r2.generationForm.get("modeRepartition")) == null ? null : tmp_3_0.value) === "taille" ? 9 : -1);
  }
}
function EtudiantsComponent_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "div", 68)(2, "div", 118)(3, "div")(4, "h2", 119)(5, "span", 120);
    \u0275\u0275text(6, "auto_awesome");
    \u0275\u0275elementEnd();
    \u0275\u0275text(7, " G\xE9n\xE9rer des groupes ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 90);
    \u0275\u0275text(9, "Cr\xE9ez automatiquement des groupes d'\xE9tudiants");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "button", 71);
    \u0275\u0275listener("click", function EtudiantsComponent_Conditional_30_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r22);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeGenerationModal());
    });
    \u0275\u0275elementStart(11, "span", 19);
    \u0275\u0275text(12, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "form", 72);
    \u0275\u0275listener("ngSubmit", function EtudiantsComponent_Conditional_30_Template_form_ngSubmit_13_listener() {
      \u0275\u0275restoreView(_r22);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.genererGroupes());
    });
    \u0275\u0275elementStart(14, "div", 73)(15, "div", 121)(16, "label", 122);
    \u0275\u0275text(17, " Classe concern\xE9e * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "select", 123)(19, "option", 12);
    \u0275\u0275text(20, "S\xE9lectionnez une classe");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(21, EtudiantsComponent_Conditional_30_For_22_Template, 2, 2, "option", 13, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(23, EtudiantsComponent_Conditional_30_Conditional_23_Template, 2, 0, "p", 76);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div")(25, "label", 124);
    \u0275\u0275text(26, " Mode de r\xE9partition ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "div", 125)(28, "label", 126);
    \u0275\u0275element(29, "input", 127);
    \u0275\u0275elementStart(30, "div", 26)(31, "div", 128);
    \u0275\u0275text(32, "Par nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "div", 129);
    \u0275\u0275text(34, "Nombre de groupes fixe");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(35, "span", 120);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "label", 126);
    \u0275\u0275element(37, "input", 130);
    \u0275\u0275elementStart(38, "div", 26)(39, "div", 128);
    \u0275\u0275text(40, "Par taille");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "div", 129);
    \u0275\u0275text(42, "Taille de groupe fixe");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(43, "span", 131);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(44, EtudiantsComponent_Conditional_30_Conditional_44_Template, 6, 0, "div");
    \u0275\u0275conditionalCreate(45, EtudiantsComponent_Conditional_30_Conditional_45_Template, 6, 0, "div");
    \u0275\u0275elementStart(46, "div")(47, "label", 74);
    \u0275\u0275text(48, " Pr\xE9fixe du nom des groupes * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(49, "input", 132);
    \u0275\u0275elementStart(50, "p", 129);
    \u0275\u0275text(51, ' Les groupes seront nomm\xE9s: "Pr\xE9fixe 1", "Pr\xE9fixe 2", etc. ');
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(52, "div", 133);
    \u0275\u0275element(53, "input", 134);
    \u0275\u0275elementStart(54, "label", 135)(55, "div", 128);
    \u0275\u0275text(56, "R\xE9partition al\xE9atoire");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "div", 136);
    \u0275\u0275text(58, "M\xE9langer les \xE9tudiants avant de cr\xE9er les groupes");
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(59, EtudiantsComponent_Conditional_30_Conditional_59_Template, 10, 2, "div", 137);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "div", 85)(61, "button", 86);
    \u0275\u0275listener("click", function EtudiantsComponent_Conditional_30_Template_button_click_61_listener() {
      \u0275\u0275restoreView(_r22);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeGenerationModal());
    });
    \u0275\u0275text(62, " Annuler ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(63, "button", 87)(64, "span", 19);
    \u0275\u0275text(65, "auto_awesome");
    \u0275\u0275elementEnd();
    \u0275\u0275text(66, " G\xE9n\xE9rer les groupes ");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_9_0;
    let tmp_10_0;
    let tmp_11_0;
    let tmp_12_0;
    let tmp_13_0;
    let tmp_14_0;
    let tmp_15_0;
    let tmp_16_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(13);
    \u0275\u0275property("formGroup", ctx_r2.generationForm);
    \u0275\u0275advance(8);
    \u0275\u0275repeater(ctx_r2.classes());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_3_0 = ctx_r2.generationForm.get("classeId")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx_r2.generationForm.get("classeId")) == null ? null : tmp_3_0.touched) ? 23 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275classProp("border-orange-500", ((tmp_4_0 = ctx_r2.generationForm.get("modeRepartition")) == null ? null : tmp_4_0.value) === "nombre")("bg-orange-50", ((tmp_5_0 = ctx_r2.generationForm.get("modeRepartition")) == null ? null : tmp_5_0.value) === "nombre")("border-slate-200", ((tmp_6_0 = ctx_r2.generationForm.get("modeRepartition")) == null ? null : tmp_6_0.value) !== "nombre");
    \u0275\u0275advance(7);
    \u0275\u0275classProp("opacity-100", ((tmp_7_0 = ctx_r2.generationForm.get("modeRepartition")) == null ? null : tmp_7_0.value) === "nombre")("opacity-0", ((tmp_8_0 = ctx_r2.generationForm.get("modeRepartition")) == null ? null : tmp_8_0.value) !== "nombre");
    \u0275\u0275advance();
    \u0275\u0275classProp("border-pink-500", ((tmp_9_0 = ctx_r2.generationForm.get("modeRepartition")) == null ? null : tmp_9_0.value) === "taille")("bg-pink-50", ((tmp_10_0 = ctx_r2.generationForm.get("modeRepartition")) == null ? null : tmp_10_0.value) === "taille")("border-slate-200", ((tmp_11_0 = ctx_r2.generationForm.get("modeRepartition")) == null ? null : tmp_11_0.value) !== "taille");
    \u0275\u0275advance(7);
    \u0275\u0275classProp("opacity-100", ((tmp_12_0 = ctx_r2.generationForm.get("modeRepartition")) == null ? null : tmp_12_0.value) === "taille")("opacity-0", ((tmp_13_0 = ctx_r2.generationForm.get("modeRepartition")) == null ? null : tmp_13_0.value) !== "taille");
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_14_0 = ctx_r2.generationForm.get("modeRepartition")) == null ? null : tmp_14_0.value) === "nombre" ? 44 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_15_0 = ctx_r2.generationForm.get("modeRepartition")) == null ? null : tmp_15_0.value) === "taille" ? 45 : -1);
    \u0275\u0275advance(14);
    \u0275\u0275conditional(((tmp_16_0 = ctx_r2.generationForm.get("classeId")) == null ? null : tmp_16_0.value) ? 59 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("opacity-50", ctx_r2.generationForm.invalid)("cursor-not-allowed", ctx_r2.generationForm.invalid);
    \u0275\u0275property("disabled", ctx_r2.generationForm.invalid);
  }
}
var EtudiantsComponent = class _EtudiantsComponent {
  etudiantService = inject(EtudiantService);
  groupeService = inject(GroupeService);
  classeService = inject(ClasseService);
  fb = inject(FormBuilder);
  // Signaux pour les données
  etudiants = signal([], ...ngDevMode ? [{ debugName: "etudiants" }] : []);
  groupes = signal([], ...ngDevMode ? [{ debugName: "groupes" }] : []);
  classes = signal([], ...ngDevMode ? [{ debugName: "classes" }] : []);
  // Section active
  activeSection = signal("etudiants", ...ngDevMode ? [{ debugName: "activeSection" }] : []);
  // Filtres
  classeFilter = signal("", ...ngDevMode ? [{ debugName: "classeFilter" }] : []);
  groupeFilter = signal("", ...ngDevMode ? [{ debugName: "groupeFilter" }] : []);
  searchTerm = signal("", ...ngDevMode ? [{ debugName: "searchTerm" }] : []);
  // Modals
  showEtudiantModal = signal(false, ...ngDevMode ? [{ debugName: "showEtudiantModal" }] : []);
  showGroupeModal = signal(false, ...ngDevMode ? [{ debugName: "showGroupeModal" }] : []);
  showGenerationModal = signal(false, ...ngDevMode ? [{ debugName: "showGenerationModal" }] : []);
  // Mode édition
  editingEtudiant = signal(null, ...ngDevMode ? [{ debugName: "editingEtudiant" }] : []);
  editingGroupe = signal(null, ...ngDevMode ? [{ debugName: "editingGroupe" }] : []);
  // Formulaires
  etudiantForm;
  groupeForm;
  generationForm;
  // Données filtrées
  etudiantsFiltered = computed(() => {
    let result = this.etudiants();
    if (this.classeFilter()) {
      result = result.filter((e) => e.classeId === this.classeFilter());
    }
    if (this.groupeFilter()) {
      result = result.filter((e) => e.groupeId === this.groupeFilter());
    }
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      result = result.filter((e) => e.nom.toLowerCase().includes(term) || e.prenom.toLowerCase().includes(term) || e.matricule.toLowerCase().includes(term) || e.email.toLowerCase().includes(term));
    }
    return result;
  }, ...ngDevMode ? [{ debugName: "etudiantsFiltered" }] : []);
  groupesFiltered = computed(() => {
    let result = this.groupes();
    if (this.classeFilter()) {
      result = result.filter((g) => g.classeId === this.classeFilter());
    }
    return result;
  }, ...ngDevMode ? [{ debugName: "groupesFiltered" }] : []);
  ngOnInit() {
    this.initForms();
    this.loadData();
  }
  initForms() {
    this.etudiantForm = this.fb.group({
      matricule: ["", [Validators.required, Validators.minLength(4)]],
      nom: ["", [Validators.required, Validators.minLength(2)]],
      prenom: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      telephone: ["", [Validators.required, Validators.minLength(8)]],
      dateNaissance: ["", Validators.required],
      classeId: ["", Validators.required],
      groupeId: [""]
    });
    this.groupeForm = this.fb.group({
      nom: ["", [Validators.required, Validators.minLength(2)]],
      description: [""],
      capaciteMax: [15, [Validators.min(1)]],
      etudiantsIds: this.fb.array([])
    });
    this.generationForm = this.fb.group({
      classeId: ["", Validators.required],
      modeRepartition: ["nombre", Validators.required],
      nombreGroupes: [3, [Validators.min(1)]],
      tailleGroupe: [5, [Validators.min(1)]],
      prefixeNom: ["Groupe", Validators.required],
      repartitionAleatoire: [true]
    });
  }
  loadData() {
    this.etudiantService.getEtudiants().subscribe((data) => this.etudiants.set(data));
    this.groupeService.getGroupes().subscribe((data) => this.groupes.set(data));
    this.classeService.getClasses().subscribe((data) => this.classes.set(data));
  }
  // Gestion des sections
  setActiveSection(section) {
    this.activeSection.set(section);
  }
  // Gestion des étudiants
  openEtudiantModal(etudiant) {
    if (etudiant) {
      this.editingEtudiant.set(etudiant);
      this.etudiantForm.patchValue(etudiant);
    } else {
      this.editingEtudiant.set(null);
      this.etudiantForm.reset();
    }
    this.showEtudiantModal.set(true);
  }
  closeEtudiantModal() {
    this.showEtudiantModal.set(false);
    this.editingEtudiant.set(null);
    this.etudiantForm.reset();
  }
  saveEtudiant() {
    if (this.etudiantForm.invalid)
      return;
    const etudiantData = this.etudiantForm.value;
    if (this.editingEtudiant()) {
      this.etudiantService.updateEtudiant(__spreadValues({
        id: this.editingEtudiant().id
      }, etudiantData)).subscribe(() => {
        this.closeEtudiantModal();
        this.loadData();
      });
    } else {
      this.etudiantService.createEtudiant(etudiantData).subscribe(() => {
        this.closeEtudiantModal();
        this.loadData();
      });
    }
  }
  deleteEtudiant(id) {
    if (confirm("\xCAtes-vous s\xFBr de vouloir supprimer cet \xE9tudiant ?")) {
      this.etudiantService.deleteEtudiant(id).subscribe(() => {
        this.loadData();
      });
    }
  }
  // Gestion des groupes
  get etudiantsIdsArray() {
    return this.groupeForm.get("etudiantsIds");
  }
  openGroupeModal(groupe) {
    this.editingGroupe.set(groupe);
    this.groupeForm.patchValue({
      nom: groupe.nom,
      description: groupe.description,
      capaciteMax: groupe.capaciteMax
    });
    this.etudiantsIdsArray.clear();
    if (groupe.etudiantsIds && groupe.etudiantsIds.length > 0) {
      groupe.etudiantsIds.forEach((etudiantId) => {
        this.etudiantsIdsArray.push(this.fb.control(etudiantId));
      });
    }
    this.showGroupeModal.set(true);
  }
  closeGroupeModal() {
    this.showGroupeModal.set(false);
    this.editingGroupe.set(null);
    this.groupeForm.reset();
    this.etudiantsIdsArray.clear();
  }
  saveGroupe() {
    if (this.groupeForm.invalid || !this.editingGroupe())
      return;
    const groupeData = {
      id: this.editingGroupe().id,
      nom: this.groupeForm.value.nom,
      description: this.groupeForm.value.description,
      capaciteMax: this.groupeForm.value.capaciteMax,
      etudiantsIds: this.etudiantsIdsArray.value,
      classeId: this.editingGroupe().classeId
    };
    this.groupeService.updateGroupe(groupeData).subscribe(() => {
      this.closeGroupeModal();
      this.loadData();
    });
  }
  deleteGroupe(id) {
    if (confirm("\xCAtes-vous s\xFBr de vouloir supprimer ce groupe ? Les \xE9tudiants ne seront pas supprim\xE9s.")) {
      this.groupeService.deleteGroupe(id).subscribe(() => {
        this.loadData();
      });
    }
  }
  toggleEtudiant(etudiantId) {
    const index = this.etudiantsIdsArray.value.indexOf(etudiantId);
    if (index > -1) {
      this.etudiantsIdsArray.removeAt(index);
    } else {
      this.etudiantsIdsArray.push(this.fb.control(etudiantId));
    }
  }
  isEtudiantInGroupe(etudiantId) {
    return this.etudiantsIdsArray.value.includes(etudiantId);
  }
  // Génération de groupes
  openGenerationModal() {
    this.generationForm.reset({
      modeRepartition: "nombre",
      nombreGroupes: 3,
      tailleGroupe: 5,
      prefixeNom: "Groupe",
      repartitionAleatoire: true
    });
    this.showGenerationModal.set(true);
  }
  closeGenerationModal() {
    this.showGenerationModal.set(false);
    this.generationForm.reset();
  }
  genererGroupes() {
    if (this.generationForm.invalid)
      return;
    const formValue = this.generationForm.value;
    const options = {
      classeId: formValue.classeId,
      prefixeNom: formValue.prefixeNom,
      repartitionAleatoire: formValue.repartitionAleatoire,
      nombreGroupes: formValue.modeRepartition === "nombre" ? formValue.nombreGroupes : void 0,
      tailleGroupe: formValue.modeRepartition === "taille" ? formValue.tailleGroupe : void 0
    };
    this.groupeService.genererGroupes(options, this.etudiants()).subscribe(() => {
      this.closeGenerationModal();
      this.loadData();
    });
  }
  // Helpers
  getClasseName(classeId) {
    const classe = this.classes().find((c) => c.id === classeId);
    return classe ? classe.nom : "Classe inconnue";
  }
  getGroupeName(groupeId) {
    if (!groupeId)
      return "Aucun groupe";
    const groupe = this.groupes().find((g) => g.id === groupeId);
    return groupe ? groupe.nom : "Groupe inconnu";
  }
  getEtudiantsInGroupe(groupeId) {
    const groupe = this.groupes().find((g) => g.id === groupeId);
    if (!groupe || !groupe.etudiantsIds)
      return [];
    return this.etudiants().filter((e) => groupe.etudiantsIds.includes(e.id));
  }
  getEtudiantsOfClasseNotInGroup(classeId) {
    if (!this.editingGroupe())
      return [];
    const etudiantsDejaAffectes = /* @__PURE__ */ new Set();
    this.groupes().forEach((groupe) => {
      if (groupe.id !== this.editingGroupe().id && groupe.etudiantsIds) {
        groupe.etudiantsIds.forEach((id) => etudiantsDejaAffectes.add(id));
      }
    });
    return this.etudiants().filter((e) => e.classeId === classeId && !this.isEtudiantInGroupe(e.id) && !etudiantsDejaAffectes.has(e.id));
  }
  //pour filtrer les groupes par classe
  getGroupesForClasse(classeId) {
    return this.groupes().filter((groupe) => groupe.classeId === classeId);
  }
  calculateAge(dateNaissance) {
    const birthDate = new Date(dateNaissance);
    const today = /* @__PURE__ */ new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birthDate.getDate()) {
      age--;
    }
    return age;
  }
  formatDate(date) {
    return new Date(date).toLocaleDateString("fr-FR");
  }
  Math = Math;
  // TrackBy functions for *ngFor
  trackById(index, item) {
    return item.id;
  }
  trackByIndex(index) {
    return index;
  }
  static \u0275fac = function EtudiantsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EtudiantsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EtudiantsComponent, selectors: [["app-etudiants"]], decls: 31, vars: 22, consts: [[1, "p-8", "max-w-7xl", "mx-auto"], [1, "mb-8"], [1, "text-3xl", "font-bold", "text-slate-800", "mb-2"], [1, "text-slate-600"], [1, "flex", "gap-4", "mb-6", "border-b", "border-slate-200"], [1, "pb-3", "px-4", "font-medium", "border-b-2", "transition-colors", "hover:text-teal-600", 3, "click"], [1, "flex", "items-center", "gap-2"], [1, "material-icons", "text-xl"], [1, "mb-6", "flex", "flex-wrap", "gap-4"], [1, "flex-1", "min-w-64"], ["type", "text", "placeholder", "Rechercher par nom, pr\xE9nom, matricule...", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent", 3, "input", "value"], [1, "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent", 3, "change", "value"], ["value", ""], [3, "value"], [1, "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent", 3, "value"], [1, "fixed", "inset-0", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center", "z-50"], [1, "mb-6", "flex", "justify-between", "items-center"], [1, "font-medium"], [1, "bg-teal-600", "hover:bg-teal-700", "text-white", "px-4", "py-2", "rounded-lg", "flex", "items-center", "gap-2", "transition-colors", 3, "click"], [1, "material-icons"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-6"], [1, "bg-white", "rounded-lg", "shadow-md", "hover:shadow-lg", "transition-shadow", "p-6", "border", "border-slate-200"], [1, "col-span-3", "text-center", "py-12"], [1, "flex", "items-start", "gap-4", "mb-4"], [1, "w-16", "h-16", "bg-teal-100", "rounded-full", "flex", "items-center", "justify-center", "flex-shrink-0"], [1, "text-teal-700", "font-bold", "text-xl"], [1, "flex-1"], [1, "text-lg", "font-semibold", "text-slate-800"], [1, "text-sm", "text-slate-500"], [1, "space-y-2", "mb-4"], [1, "flex", "items-center", "gap-2", "text-sm", "text-slate-600"], [1, "material-icons", "text-lg"], [1, "truncate"], [1, "flex", "items-center", "gap-2", "text-sm"], [1, "flex", "gap-2", "pt-4", "border-t", "border-slate-200"], [1, "flex-1", "bg-slate-100", "hover:bg-slate-200", "text-slate-700", "px-3", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors", "flex", "items-center", "justify-center", "gap-1", 3, "click"], [1, "material-icons", "text-sm"], [1, "bg-red-50", "hover:bg-red-100", "text-red-600", "px-3", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors", "flex", "items-center", "justify-center", 3, "click"], [1, "material-icons", "text-6xl", "text-slate-300", "mb-4"], [1, "text-slate-500"], [1, "mt-4", "text-teal-600", "hover:text-teal-700", "font-medium", 3, "click"], [1, "text-slate-400", "hover:text-slate-600", "transition-colors", "text-teal-600", "hover:text-teal-700", 3, "click"], [1, "font-semibold"], [1, "bg-white", "rounded-lg", "shadow-md", "hover:shadow-lg", "transition-shadow", "border", "border-slate-200"], [1, "col-span-3", "text-center", "py-16"], [1, "p-6", "border-b", "border-slate-100"], [1, "flex", "items-start", "gap-3", "mb-4"], [1, "bg-purple-100", "rounded-lg", "p-3"], [1, "material-icons", "text-purple-600", "text-2xl"], [1, "text-lg", "font-semibold", "text-slate-800", "mb-1"], [1, "text-sm", "text-slate-600", "line-clamp-2"], [1, "p-4", "bg-slate-50"], [1, "grid", "grid-cols-2", "gap-3", "mb-3"], [1, "bg-white", "rounded-lg", "p-3", "border", "border-teal-100"], [1, "text-xs", "text-teal-600", "font-medium", "mb-1"], [1, "text-2xl", "font-bold", "text-teal-700"], [1, "bg-white", "rounded-lg", "p-3", "border", "border-blue-100"], [1, "mb-3"], [1, "flex", "gap-2", "p-4", "border-t", "border-slate-200"], [1, "text-xs", "text-blue-600", "font-medium", "mb-1"], [1, "text-2xl", "font-bold", "text-blue-700"], [1, "flex", "justify-between", "text-xs", "text-slate-600", "mb-1"], [1, "h-2", "bg-slate-200", "rounded-full", "overflow-hidden"], [1, "h-full", "bg-gradient-to-r", "from-teal-400", "to-teal-600", "transition-all"], [1, "bg-gradient-to-br", "from-orange-50", "to-pink-50", "rounded-2xl", "p-12", "max-w-md", "mx-auto"], [1, "material-icons", "text-6xl", "text-orange-400", "mb-4"], [1, "text-lg", "font-semibold", "text-slate-700", "mb-2"], [1, "text-sm", "text-slate-500", "mb-6"], [1, "bg-white", "rounded-lg", "shadow-xl", "max-w-2xl", "w-full", "mx-4", "max-h-[90vh]", "overflow-y-auto"], [1, "flex", "justify-between", "items-center", "p-6", "border-b", "border-slate-200"], [1, "text-2xl", "font-bold", "text-slate-800"], [1, "text-slate-400", "hover:text-slate-600", "transition-colors", 3, "click"], [1, "p-6", 3, "ngSubmit", "formGroup"], [1, "space-y-4"], [1, "block", "text-sm", "font-medium", "text-slate-700", "mb-1"], ["type", "text", "formControlName", "matricule", "placeholder", "Ex: 2024001", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], [1, "text-red-600", "text-sm", "mt-1"], [1, "grid", "grid-cols-2", "gap-4"], ["type", "text", "formControlName", "nom", "placeholder", "Ex: Dupont", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["type", "text", "formControlName", "prenom", "placeholder", "Ex: Jean", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["type", "email", "formControlName", "email", "placeholder", "Ex: jean.dupont@example.com", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["type", "tel", "formControlName", "telephone", "placeholder", "Ex: +237 650 123 456", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["type", "date", "formControlName", "dateNaissance", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["formControlName", "classeId", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["formControlName", "groupeId", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], [1, "flex", "gap-3", "mt-6", "pt-6", "border-t", "border-slate-200"], ["type", "button", 1, "flex-1", "px-4", "py-2", "border", "border-slate-300", "text-slate-700", "rounded-lg", "hover:bg-slate-50", "transition-colors", 3, "click"], ["type", "submit", 1, "flex-1", "px-4", "py-2", "bg-teal-600", "text-white", "rounded-lg", "hover:bg-teal-700", "transition-colors", "disabled:hover:bg-teal-600", 3, "disabled"], [1, "bg-white", "rounded-lg", "shadow-xl", "max-w-4xl", "w-full", "mx-4", "max-h-[90vh]", "overflow-y-auto"], [1, "flex", "justify-between", "items-center", "p-6", "border-b", "border-slate-200", "bg-gradient-to-r", "from-purple-50", "to-pink-50"], [1, "text-sm", "text-slate-600", "mt-1"], [1, "space-y-4", "mb-6"], ["type", "text", "formControlName", "nom", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-purple-500", "focus:border-transparent"], ["type", "number", "formControlName", "capaciteMax", "min", "1", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-purple-500", "focus:border-transparent"], ["formControlName", "description", "rows", "2", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-purple-500", "focus:border-transparent", "resize-none"], [1, "border-t", "border-slate-200", "pt-6"], [1, "text-lg", "font-semibold", "text-slate-800", "mb-4", "flex", "items-center", "gap-2"], [1, "material-icons", "text-purple-600"], [1, "text-sm", "font-normal", "text-slate-500"], [1, "mb-4"], [1, "mb-4", "text-center", "py-6", "bg-slate-50", "rounded-lg", "border-2", "border-dashed", "border-slate-200"], [1, "text-sm", "font-medium", "text-slate-700", "mb-2"], [1, "text-xs", "font-normal", "text-slate-500", "ml-2"], [1, "max-h-64", "overflow-y-auto", "border", "border-slate-200", "rounded-lg"], [1, "grid", "grid-cols-2", "gap-2"], [1, "flex", "items-center", "justify-between", "bg-teal-50", "border", "border-teal-200", "p-3", "rounded-lg"], [1, "w-8", "h-8", "bg-teal-200", "rounded-full", "flex", "items-center", "justify-center"], [1, "text-teal-700", "font-semibold", "text-sm"], [1, "text-sm", "font-medium", "text-slate-800"], [1, "text-xs", "text-slate-500"], ["type", "button", 1, "text-red-600", "hover:bg-red-100", "p-1", "rounded", "transition-colors", 3, "click"], [1, "material-icons", "text-slate-300", "text-4xl", "mb-2"], [1, "grid", "grid-cols-2", "gap-2", "p-3"], ["type", "button", 1, "flex", "items-center", "gap-2", "bg-slate-50", "hover:bg-purple-50", "border", "border-slate-200", "hover:border-purple-300", "p-3", "rounded-lg", "transition-all", "text-left"], ["type", "button", 1, "flex", "items-center", "gap-2", "bg-slate-50", "hover:bg-purple-50", "border", "border-slate-200", "hover:border-purple-300", "p-3", "rounded-lg", "transition-all", "text-left", 3, "click"], [1, "w-8", "h-8", "bg-slate-200", "rounded-full", "flex", "items-center", "justify-center"], [1, "text-slate-600", "font-semibold", "text-sm"], [1, "material-icons", "text-purple-600", "text-sm"], [1, "flex", "justify-between", "items-center", "p-6", "border-b", "border-slate-200", "bg-gradient-to-r", "from-orange-50", "to-pink-50"], [1, "text-2xl", "font-bold", "text-slate-800", "flex", "items-center", "gap-2"], [1, "material-icons", "text-orange-600"], [1, "bg-orange-50", "border-2", "border-orange-200", "rounded-lg", "p-4"], [1, "block", "text-sm", "font-medium", "text-orange-900", "mb-2"], ["formControlName", "classeId", 1, "w-full", "px-4", "py-2", "border-2", "border-orange-300", "rounded-lg", "focus:ring-2", "focus:ring-orange-500", "focus:border-orange-500", "bg-white"], [1, "block", "text-sm", "font-medium", "text-slate-700", "mb-3"], [1, "grid", "grid-cols-2", "gap-3"], [1, "relative", "flex", "items-center", "p-4", "border-2", "rounded-lg", "cursor-pointer", "transition-all"], ["type", "radio", "formControlName", "modeRepartition", "value", "nombre", 1, "sr-only"], [1, "font-medium", "text-slate-800"], [1, "text-xs", "text-slate-500", "mt-1"], ["type", "radio", "formControlName", "modeRepartition", "value", "taille", 1, "sr-only", "mr-10"], [1, "material-icons", "text-pink-600"], ["type", "text", "formControlName", "prefixeNom", "placeholder", "Ex: Groupe", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-orange-500", "focus:border-transparent"], [1, "flex", "items-center", "gap-3", "p-4", "bg-gradient-to-r", "from-orange-50", "to-pink-50", "rounded-lg", "border", "border-orange-200"], ["type", "checkbox", "formControlName", "repartitionAleatoire", "id", "repartitionAleatoire", 1, "w-4", "h-4", "text-orange-600", "rounded", "focus:ring-orange-500"], ["for", "repartitionAleatoire", 1, "flex-1", "cursor-pointer"], [1, "text-xs", "text-slate-600"], [1, "bg-blue-50", "border", "border-blue-200", "rounded-lg", "p-4"], ["type", "number", "formControlName", "nombreGroupes", "placeholder", "Ex: 3", "min", "1", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-orange-500", "focus:border-transparent"], ["type", "number", "formControlName", "tailleGroupe", "placeholder", "Ex: 5", "min", "1", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-pink-500", "focus:border-transparent"], [1, "flex", "items-start", "gap-3"], [1, "material-icons", "text-blue-600"], [1, "flex-1", "text-sm"], [1, "font-medium", "text-blue-900", "mb-1"], [1, "text-blue-700"]], template: function EtudiantsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
      \u0275\u0275text(3, "Gestion des \xC9tudiants");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "G\xE9rez les \xE9tudiants et leurs groupes");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "button", 5);
      \u0275\u0275listener("click", function EtudiantsComponent_Template_button_click_7_listener() {
        return ctx.setActiveSection("etudiants");
      });
      \u0275\u0275elementStart(8, "span", 6)(9, "span", 7);
      \u0275\u0275text(10, "school");
      \u0275\u0275elementEnd();
      \u0275\u0275text(11);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(12, "button", 5);
      \u0275\u0275listener("click", function EtudiantsComponent_Template_button_click_12_listener() {
        return ctx.setActiveSection("groupes");
      });
      \u0275\u0275elementStart(13, "span", 6)(14, "span", 7);
      \u0275\u0275text(15, "groups");
      \u0275\u0275elementEnd();
      \u0275\u0275text(16);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(17, "div", 8)(18, "div", 9)(19, "input", 10);
      \u0275\u0275listener("input", function EtudiantsComponent_Template_input_input_19_listener($event) {
        return ctx.searchTerm.set($event.target.value);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "select", 11);
      \u0275\u0275listener("change", function EtudiantsComponent_Template_select_change_20_listener($event) {
        return ctx.classeFilter.set($event.target.value);
      });
      \u0275\u0275elementStart(21, "option", 12);
      \u0275\u0275text(22, "Toutes les classes");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(23, EtudiantsComponent_For_24_Template, 2, 2, "option", 13, _forTrack0);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(25, EtudiantsComponent_Conditional_25_Template, 5, 1, "select", 14);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(26, EtudiantsComponent_Conditional_26_Template, 14, 2, "div");
      \u0275\u0275conditionalCreate(27, EtudiantsComponent_Conditional_27_Template, 15, 2, "div");
      \u0275\u0275conditionalCreate(28, EtudiantsComponent_Conditional_28_Template, 65, 15, "div", 15);
      \u0275\u0275conditionalCreate(29, EtudiantsComponent_Conditional_29_Template, 45, 13, "div", 15);
      \u0275\u0275conditionalCreate(30, EtudiantsComponent_Conditional_30_Template, 67, 30, "div", 15);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(7);
      \u0275\u0275classProp("border-teal-600", ctx.activeSection() === "etudiants")("text-teal-600", ctx.activeSection() === "etudiants")("text-slate-600", ctx.activeSection() !== "etudiants");
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1(" \xC9tudiants (", ctx.etudiants().length, ") ");
      \u0275\u0275advance();
      \u0275\u0275classProp("border-teal-600", ctx.activeSection() === "groupes")("text-teal-600", ctx.activeSection() === "groupes")("text-slate-600", ctx.activeSection() !== "groupes");
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1(" Groupes (", ctx.groupes().length, ") ");
      \u0275\u0275advance(3);
      \u0275\u0275property("value", ctx.searchTerm());
      \u0275\u0275advance();
      \u0275\u0275property("value", ctx.classeFilter());
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.classes());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.activeSection() === "etudiants" ? 25 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.activeSection() === "etudiants" ? 26 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.activeSection() === "groupes" ? 27 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showEtudiantModal() ? 28 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showGroupeModal() && ctx.editingGroupe() ? 29 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showGenerationModal() ? 30 : -1);
    }
  }, dependencies: [CommonModule, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, RadioControlValueAccessor, NgControlStatus, NgControlStatusGroup, MinValidator, FormGroupDirective, FormControlName], styles: ['\n\n.line-clamp-2[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n.modal-overlay[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeIn 0.2s ease-in-out;\n}\n.modal-content[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideUp 0.3s ease-out;\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_slideUp {\n  from {\n    transform: translateY(20px);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0);\n    opacity: 1;\n  }\n}\n.student-card[_ngcontent-%COMP%], \n.group-card[_ngcontent-%COMP%] {\n  transition: all 0.3s ease;\n}\n.student-card[_ngcontent-%COMP%]:hover, \n.group-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n}\n.avatar[_ngcontent-%COMP%] {\n  position: relative;\n}\n.avatar[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  width: 12px;\n  height: 12px;\n  background-color: #10b981;\n  border: 2px solid white;\n  border-radius: 50%;\n}\n.progress-bar[_ngcontent-%COMP%] {\n  transition: width 0.5s ease-in-out;\n}\n/*# sourceMappingURL=etudiants.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EtudiantsComponent, [{
    type: Component,
    args: [{ selector: "app-etudiants", standalone: true, imports: [CommonModule, ReactiveFormsModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `<div class="p-8 max-w-7xl mx-auto">
  <!-- En-t\xEAte -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-slate-800 mb-2">Gestion des \xC9tudiants</h1>
    <p class="text-slate-600">G\xE9rez les \xE9tudiants et leurs groupes</p>
  </div>

  <!-- Tabs de navigation -->
  <div class="flex gap-4 mb-6 border-b border-slate-200">
    <button
      (click)="setActiveSection('etudiants')"
      [class.border-teal-600]="activeSection() === 'etudiants'"
      [class.text-teal-600]="activeSection() === 'etudiants'"
      [class.text-slate-600]="activeSection() !== 'etudiants'"
      class="pb-3 px-4 font-medium border-b-2 transition-colors hover:text-teal-600"
    >
      <span class="flex items-center gap-2">
        <span class="material-icons text-xl">school</span>
        \xC9tudiants ({{ etudiants().length }})
      </span>
    </button>
    <button
      (click)="setActiveSection('groupes')"
      [class.border-teal-600]="activeSection() === 'groupes'"
      [class.text-teal-600]="activeSection() === 'groupes'"
      [class.text-slate-600]="activeSection() !== 'groupes'"
      class="pb-3 px-4 font-medium border-b-2 transition-colors hover:text-teal-600"
    >
      <span class="flex items-center gap-2">
        <span class="material-icons text-xl">groups</span>
        Groupes ({{ groupes().length }})
      </span>
    </button>
  </div>

  <!-- Filtres -->
  <div class="mb-6 flex flex-wrap gap-4">
    <!-- Recherche -->
    <div class="flex-1 min-w-64">
      <input
        type="text"
        [value]="searchTerm()"
        (input)="searchTerm.set($any($event.target).value)"
        class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        placeholder="Rechercher par nom, pr\xE9nom, matricule..."
      />
    </div>

    <!-- Filtre classe -->
    <select
      [value]="classeFilter()"
      (change)="classeFilter.set($any($event.target).value)"
      class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
    >
      <option value="">Toutes les classes</option>
      @for (classe of classes(); track classe.id; let i = $index) {
        <option [value]="classe.id">{{ classe.nom }}</option>
      }
    </select>

    @if (activeSection() === 'etudiants') {
      <!-- Filtre groupe -->
      <select
        [value]="groupeFilter()"
        (change)="groupeFilter.set($any($event.target).value)"
        class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
      >
        <option value="">Tous les groupes</option>
        @for (groupe of groupes(); track groupe.id; let i = $index) {
          <option [value]="groupe.id">{{ groupe.nom }}</option>
        }
      </select>
    }
  </div>

  <!-- Section \xC9tudiants -->
  @if (activeSection() === 'etudiants') {
    <div>
      <!-- Bouton d'ajout -->
      <div class="mb-6 flex justify-between items-center">
        <div class="text-slate-600">
          <span class="font-medium">{{ etudiantsFiltered().length }}</span> \xE9tudiant(s)
        </div>
        <button
          (click)="openEtudiantModal()"
          class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <span class="material-icons">add</span>
          Nouvel \xE9tudiant
        </button>
      </div>

      <!-- Grille de cartes d'\xE9tudiants -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (etudiant of etudiantsFiltered(); track etudiant.id; let i = $index) {
          <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-slate-200">
            <!-- En-t\xEAte de la carte -->
            <div class="flex items-start gap-4 mb-4">
              <!-- Avatar -->
              <div class="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-teal-700 font-bold text-xl">
                  {{ etudiant.nom.charAt(0) }}{{ etudiant.prenom.charAt(0) }}
                </span>
              </div>

              <!-- Informations -->
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-slate-800">
                  {{ etudiant.nom }} {{ etudiant.prenom }}
                </h3>
                <p class="text-sm text-slate-500">{{ etudiant.matricule }}</p>
                <!--<p class="text-xs text-slate-400 mt-1">{{ calculateAge(etudiant.dateNaissance) }} ans</p>-->
              </div>
            </div>

            <!-- D\xE9tails -->
            <div class="space-y-2 mb-4">
              <div class="flex items-center gap-2 text-sm text-slate-600">
                <span class="material-icons text-lg">email</span>
                <span class="truncate">{{ etudiant.email }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-slate-600">
                <span class="material-icons text-lg">phone</span>
                <span>{{ etudiant.telephone }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-slate-600">
                <span class="material-icons text-lg">class</span>
                <span>{{ getClasseName(etudiant.classeId) }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <span class="material-icons text-lg"
                      [class.text-teal-600]="etudiant.groupeId"
                      [class.text-slate-400]="!etudiant.groupeId">
                  groups
                </span>
                <span [class.text-teal-600]="etudiant.groupeId"
                      [class.font-medium]="etudiant.groupeId"
                      [class.text-slate-400]="!etudiant.groupeId">
                  {{ getGroupeName(etudiant.groupeId) }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 pt-4 border-t border-slate-200">
              <button
                (click)="openEtudiantModal(etudiant)"
                class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
              >
                <span class="material-icons text-sm">edit</span>
                Modifier
              </button>
              <button
                (click)="deleteEtudiant(etudiant.id!)"
                class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                <span class="material-icons text-sm">delete</span>
              </button>
            </div>
          </div>
        } @empty {
          <div class="col-span-3 text-center py-12">
            <span class="material-icons text-6xl text-slate-300 mb-4">school</span>
            <p class="text-slate-500">Aucun \xE9tudiant pour le moment</p>
            <button
              (click)="openEtudiantModal()"
              class="mt-4 text-teal-600 hover:text-teal-700 font-medium"
            >
              Ajouter votre premier \xE9tudiant
            </button>
          </div>
        }
      </div>
    </div>
  }
  <!-- Section Groupes -->
  @if (activeSection() === 'groupes') {
    <div>
      <!-- Bouton g\xE9n\xE9ration uniquement -->
      <div class="mb-6 flex justify-between items-center">
        <div class="text-slate-600">
          <span class="font-medium">{{ groupesFiltered().length }}</span> groupe(s)
        </div>
        <button
          (click)="openGenerationModal()"
          class="text-slate-400 hover:text-slate-600 transition-colors text-teal-600 hover:text-teal-700"
        >
          <span class="material-icons">auto_awesome</span>
          <span class="font-semibold">G\xE9n\xE9rer des groupes</span>
        </button>
      </div>

      <!-- Grille de cartes de groupes -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (groupe of groupesFiltered(); track groupe.id; let i = $index) {
          <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200">
            <!-- En-t\xEAte de la carte -->
            <div class="p-6 border-b border-slate-100">
              <div class="flex items-start gap-3 mb-4">
                <div class="bg-purple-100 rounded-lg p-3">
                  <span class="material-icons text-purple-600 text-2xl">groups</span>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-slate-800 mb-1">{{ groupe.nom }}</h3>
                  <p class="text-sm text-slate-500">{{ getClasseName(groupe.classeId) }}</p>
                </div>
              </div>

              <!-- Description -->
              @if (groupe.description) {
                <p class="text-sm text-slate-600 line-clamp-2">{{ groupe.description }}</p>
              }
            </div>

            <!-- Statistiques -->
            <div class="p-4 bg-slate-50">
              <div class="grid grid-cols-2 gap-3 mb-3">
                <div class="bg-white rounded-lg p-3 border border-teal-100">
                  <div class="text-xs text-teal-600 font-medium mb-1">\xC9tudiants</div>
                  <div class="text-2xl font-bold text-teal-700">
                    {{ getEtudiantsInGroupe(groupe.id!).length }}
                  </div>
                </div>
                @if (groupe.capaciteMax) {
                  <div class="bg-white rounded-lg p-3 border border-blue-100">
                    <div class="text-xs text-blue-600 font-medium mb-1">Capacit\xE9</div>
                    <div class="text-2xl font-bold text-blue-700">{{ groupe.capaciteMax }}</div>
                  </div>
                }
              </div>

              <!-- Progression -->
              @if (groupe.capaciteMax) {
                <div class="mb-3">
                  <div class="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Remplissage</span>
                    <span>{{ Math.round((getEtudiantsInGroupe(groupe.id!).length / groupe.capaciteMax) * 100) }}%</span>
                  </div>
                  <div class="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-teal-400 to-teal-600 transition-all"
                      [style.width.%]="(getEtudiantsInGroupe(groupe.id!).length / groupe.capaciteMax) * 100"
                    ></div>
                  </div>
                </div>
              }

              <!-- Liste des \xE9tudiants
              <div class="mb-3">
                <div class="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
                  <span class="material-icons text-sm">people</span>
                  Membres du groupe
                </div>
                @if (getEtudiantsInGroupe(groupe.id!).length > 0) {
                  <div class="space-y-1 max-h-32 overflow-y-auto">
                    @for (etudiant of getEtudiantsInGroupe(groupe.id!); track etudiant.id) {
                      <div class="flex items-center gap-2 bg-white p-2 rounded text-xs border border-slate-100">
                        <div class="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span class="text-teal-700 font-semibold text-xs">
                            {{ etudiant.prenom.charAt(0) }}{{ etudiant.nom.charAt(0) }}
                          </span>
                        </div>
                        <span class="text-slate-700 truncate">{{ etudiant.prenom }} {{ etudiant.nom }}</span>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="text-center py-3 bg-white rounded border border-dashed border-slate-200">
                    <p class="text-xs text-slate-400">Aucun \xE9tudiant</p>
                  </div>
                }
              </div>-->
            </div>

            <!-- Actions -->
            <div class="flex gap-2 p-4 border-t border-slate-200">
              <button
                (click)="openGroupeModal(groupe)"
                class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
              >
                <span class="material-icons text-sm">edit</span>
                G\xE9rer les membres
              </button>
              <button
                (click)="deleteGroupe(groupe.id!)"
                class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                <span class="material-icons text-sm">delete</span>
              </button>
            </div>
          </div>
        } @empty {
          <div class="col-span-3 text-center py-16">
            <div class="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-12 max-w-md mx-auto">
              <span class="material-icons text-6xl text-orange-400 mb-4">groups</span>
              <p class="text-lg font-semibold text-slate-700 mb-2">Aucun groupe pour le moment</p>
              <p class="text-sm text-slate-500 mb-6">Commencez par g\xE9n\xE9rer des groupes automatiquement</p>
              <button
                (click)="openGenerationModal()"
                class="text-slate-400 hover:text-slate-600 transition-colors text-teal-600 hover:text-teal-700"
              >
                <span class="material-icons">auto_awesome</span>
                G\xE9n\xE9rer automatiquement
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  }
  <!-- Modal \xC9tudiant (inchang\xE9) -->
  @if (showEtudiantModal()) {
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- En-t\xEAte du modal -->
        <div class="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 class="text-2xl font-bold text-slate-800">
            {{ editingEtudiant() ? 'Modifier l\\'\xE9tudiant' : 'Nouvel \xE9tudiant' }}
          </h2>
          <button
            (click)="closeEtudiantModal()"
            class="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Formulaire -->
        <form [formGroup]="etudiantForm" (ngSubmit)="saveEtudiant()" class="p-6">
          <div class="space-y-4">
            <!-- Matricule -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Matricule *
              </label>
              <input
                type="text"
                formControlName="matricule"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ex: 2024001"
              />
              @if (etudiantForm.get('matricule')?.invalid && etudiantForm.get('matricule')?.touched) {
                <p class="text-red-600 text-sm mt-1">Le matricule est requis (min. 4 caract\xE8res)</p>
              }
            </div>

            <!-- Nom et Pr\xE9nom -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  formControlName="nom"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Ex: Dupont"
                />
                @if (etudiantForm.get('nom')?.invalid && etudiantForm.get('nom')?.touched) {
                  <p class="text-red-600 text-sm mt-1">Le nom est requis</p>
                }
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  Pr\xE9nom *
                </label>
                <input
                  type="text"
                  formControlName="prenom"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Ex: Jean"
                />
                @if (etudiantForm.get('prenom')?.invalid && etudiantForm.get('prenom')?.touched) {
                  <p class="text-red-600 text-sm mt-1">Le pr\xE9nom est requis</p>
                }
              </div>
            </div>

            <!-- Email et T\xE9l\xE9phone -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  formControlName="email"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Ex: jean.dupont@example.com"
                />
                @if (etudiantForm.get('email')?.invalid && etudiantForm.get('email')?.touched) {
                  <p class="text-red-600 text-sm mt-1">Email valide requis</p>
                }
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  T\xE9l\xE9phone *
                </label>
                <input
                  type="tel"
                  formControlName="telephone"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Ex: +237 650 123 456"
                />
                @if (etudiantForm.get('telephone')?.invalid && etudiantForm.get('telephone')?.touched) {
                  <p class="text-red-600 text-sm mt-1">T\xE9l\xE9phone requis</p>
                }
              </div>
            </div>

            <!-- Date de naissance -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Date de naissance *
              </label>
              <input
                type="date"
                formControlName="dateNaissance"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              @if (etudiantForm.get('dateNaissance')?.invalid && etudiantForm.get('dateNaissance')?.touched) {
                <p class="text-red-600 text-sm mt-1">La date de naissance est requise</p>
              }
            </div>

            <!-- Classe et Groupe -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  Classe *
                </label>
                <select
                  formControlName="classeId"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">S\xE9lectionnez une classe</option>
                  @for (classe of classes(); track classe.id; let i = $index) {
                    <option [value]="classe.id">{{ classe.nom }}</option>
                  }
                </select>
                @if (etudiantForm.get('classeId')?.invalid && etudiantForm.get('classeId')?.touched) {
                  <p class="text-red-600 text-sm mt-1">Veuillez s\xE9lectionner une classe</p>
                }
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  Groupe (optionnel)
                </label>
                <select
                  formControlName="groupeId"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Aucun groupe</option>
                  @for (groupe of groupes(); track groupe.id; let i = $index) {
                    <option [value]="groupe.id">{{ groupe.nom }}</option>
                  }
                </select>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mt-6 pt-6 border-t border-slate-200">
            <button
              type="button"
              (click)="closeEtudiantModal()"
              class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              [disabled]="etudiantForm.invalid"
              [class.opacity-50]="etudiantForm.invalid"
              [class.cursor-not-allowed]="etudiantForm.invalid"
              class="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:hover:bg-teal-600"
            >
              {{ editingEtudiant() ? 'Enregistrer' : 'Cr\xE9er' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  }

  <!-- Modal Groupe - Gestion des membres -->
  @if (showGroupeModal() && editingGroupe()) {
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- En-t\xEAte du modal -->
        <div class="flex justify-between items-center p-6 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div>
            <h2 class="text-2xl font-bold text-slate-800">{{ editingGroupe()!.nom }}</h2>
            <p class="text-sm text-slate-600 mt-1">{{ getClasseName(editingGroupe()!.classeId) }}</p>
          </div>
          <button
            (click)="closeGroupeModal()"
            class="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Formulaire -->
        <form [formGroup]="groupeForm" (ngSubmit)="saveGroupe()" class="p-6">
          <!-- Informations du groupe -->
          <div class="space-y-4 mb-6">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  Nom du groupe *
                </label>
                <input
                  type="text"
                  formControlName="nom"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  Capacit\xE9 max
                </label>
                <input
                  type="number"
                  formControlName="capaciteMax"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                formControlName="description"
                rows="2"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Gestion des membres -->
          <div class="border-t border-slate-200 pt-6">
            <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span class="material-icons text-purple-600">people</span>
              Membres du groupe
              <span class="text-sm font-normal text-slate-500">
                ({{ etudiantsIdsArray.length }} / {{ groupeForm.get('capaciteMax')?.value || '\u221E' }})
              </span>
            </h3>

            <!-- Liste des \xE9tudiants actuels -->
            @if (etudiantsIdsArray.length > 0) {
              <div class="mb-4">
                <div class="text-sm font-medium text-slate-700 mb-2">\xC9tudiants actuels</div>
                <div class="grid grid-cols-2 gap-2">
                  @for (etudiantId of etudiantsIdsArray.value; track $index; let i = $index) {
                    @for (etudiant of etudiants(); track etudiant.id; let j = $index) {
                      @if (etudiant.id === etudiantId) {
                        <div class="flex items-center justify-between bg-teal-50 border border-teal-200 p-3 rounded-lg">
                          <div class="flex items-center gap-2">
                            <div class="w-8 h-8 bg-teal-200 rounded-full flex items-center justify-center">
                              <span class="text-teal-700 font-semibold text-sm">
                                {{ etudiant.prenom.charAt(0) }}{{ etudiant.nom.charAt(0) }}
                              </span>
                            </div>
                            <div>
                              <div class="text-sm font-medium text-slate-800">
                                {{ etudiant.prenom }} {{ etudiant.nom }}
                              </div>
                              <div class="text-xs text-slate-500">{{ etudiant.matricule }}</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            (click)="toggleEtudiant(etudiantId)"
                            class="text-red-600 hover:bg-red-100 p-1 rounded transition-colors"
                          >
                            <span class="material-icons text-sm">remove_circle</span>
                          </button>
                        </div>
                      }
                    }
                  }
                </div>
              </div>
            } @else {
              <div class="mb-4 text-center py-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                <span class="material-icons text-slate-300 text-4xl mb-2">group_off</span>
                <p class="text-sm text-slate-500">Aucun membre dans ce groupe</p>
              </div>
            }

            <!-- Ajouter des \xE9tudiants -->
            <div>
              <div class="text-sm font-medium text-slate-700 mb-2">
                Ajouter des \xE9tudiants
                @if (editingGroupe() && getEtudiantsOfClasseNotInGroup(editingGroupe()!.classeId).length === 0) {
                  <span class="text-xs font-normal text-slate-500 ml-2">(Tous les \xE9tudiants sont d\xE9j\xE0 affect\xE9s)</span>
                }
              </div>
              @if (editingGroupe() && getEtudiantsOfClasseNotInGroup(editingGroupe()!.classeId).length > 0) {
                <div class="max-h-64 overflow-y-auto border border-slate-200 rounded-lg">
                  <div class="grid grid-cols-2 gap-2 p-3">
                    @for (etudiant of getEtudiantsOfClasseNotInGroup(editingGroupe()!.classeId); track etudiant.id; let i = $index) {
                      <button
                        type="button"
                        (click)="toggleEtudiant(etudiant.id!)"
                        class="flex items-center gap-2 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 p-3 rounded-lg transition-all text-left"
                      >
                        <div class="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                          <span class="text-slate-600 font-semibold text-sm">
                            {{ etudiant.prenom.charAt(0) }}{{ etudiant.nom.charAt(0) }}
                          </span>
                        </div>
                        <div class="flex-1">
                          <div class="text-sm font-medium text-slate-800">
                            {{ etudiant.prenom }} {{ etudiant.nom }}
                          </div>
                          <div class="text-xs text-slate-500">{{ etudiant.matricule }}</div>
                        </div>
                        <span class="material-icons text-purple-600 text-sm">add_circle</span>
                      </button>
                    }
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mt-6 pt-6 border-t border-slate-200">
            <button
              type="button"
              (click)="closeGroupeModal()"
              class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              [disabled]="groupeForm.invalid"
              [class.opacity-50]="groupeForm.invalid"
              [class.cursor-not-allowed]="groupeForm.invalid"
              class="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:hover:bg-teal-600"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  }
  <!-- Modal G\xE9n\xE9ration de groupes -->
  @if (showGenerationModal()) {
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- En-t\xEAte du modal -->
        <div class="flex justify-between items-center p-6 border-b border-slate-200 bg-gradient-to-r from-orange-50 to-pink-50">
          <div>
            <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span class="material-icons text-orange-600">auto_awesome</span>
              G\xE9n\xE9rer des groupes
            </h2>
            <p class="text-sm text-slate-600 mt-1">Cr\xE9ez automatiquement des groupes d'\xE9tudiants</p>
          </div>
          <button
            (click)="closeGenerationModal()"
            class="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Formulaire -->
        <form [formGroup]="generationForm" (ngSubmit)="genererGroupes()" class="p-6">
          <div class="space-y-4">
            <!-- S\xE9lection de classe -->
            <div class="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
              <label class="block text-sm font-medium text-orange-900 mb-2">
                Classe concern\xE9e *
              </label>
              <select
                formControlName="classeId"
                class="w-full px-4 py-2 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                <option value="">S\xE9lectionnez une classe</option>
                @for (classe of classes(); track classe.id; let i = $index) {
                  <option [value]="classe.id">{{ classe.nom }}</option>
                }
              </select>
              @if (generationForm.get('classeId')?.invalid && generationForm.get('classeId')?.touched) {
                <p class="text-red-600 text-sm mt-1">Veuillez s\xE9lectionner une classe</p>
              }
            </div>

            <!-- Mode de r\xE9partition -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-3">
                Mode de r\xE9partition
              </label>
              <div class="grid grid-cols-2 gap-3">
                <label
                  class="relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                  [class.border-orange-500]="generationForm.get('modeRepartition')?.value === 'nombre'"
                  [class.bg-orange-50]="generationForm.get('modeRepartition')?.value === 'nombre'"
                  [class.border-slate-200]="generationForm.get('modeRepartition')?.value !== 'nombre'"
                >
                  <input
                    type="radio"
                    formControlName="modeRepartition"
                    value="nombre"
                    class="sr-only"
                  />
                  <div class="flex-1">
                    <div class="font-medium text-slate-800">Par nombre</div>
                    <div class="text-xs text-slate-500 mt-1">Nombre de groupes fixe</div>
                  </div>
                  <span class="material-icons text-orange-600"
                        [class.opacity-100]="generationForm.get('modeRepartition')?.value === 'nombre'"
                        [class.opacity-0]="generationForm.get('modeRepartition')?.value !== 'nombre'">
                  </span>
                </label>

                <label
                  class="relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                  [class.border-pink-500]="generationForm.get('modeRepartition')?.value === 'taille'"
                  [class.bg-pink-50]="generationForm.get('modeRepartition')?.value === 'taille'"
                  [class.border-slate-200]="generationForm.get('modeRepartition')?.value !== 'taille'"
                >
                  <input
                    type="radio"
                    formControlName="modeRepartition"
                    value="taille"
                    class="sr-only mr-10"
                  />
                  <div class="flex-1">
                    <div class="font-medium text-slate-800">Par taille</div>
                    <div class="text-xs text-slate-500 mt-1">Taille de groupe fixe</div>
                  </div>
                  <span class="material-icons text-pink-600"
                        [class.opacity-100]="generationForm.get('modeRepartition')?.value === 'taille'"
                        [class.opacity-0]="generationForm.get('modeRepartition')?.value !== 'taille'">
                  </span>
                </label>
              </div>
            </div>

            <!-- Param\xE8tres selon le mode -->
            @if (generationForm.get('modeRepartition')?.value === 'nombre') {
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  Nombre de groupes \xE0 cr\xE9er *
                </label>
                <input
                  type="number"
                  formControlName="nombreGroupes"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ex: 3"
                  min="1"
                />
                <p class="text-xs text-slate-500 mt-1">
                  Les \xE9tudiants seront r\xE9partis \xE9quitablement
                </p>
              </div>
            }

            @if (generationForm.get('modeRepartition')?.value === 'taille') {
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  Nombre d'\xE9tudiants par groupe *
                </label>
                <input
                  type="number"
                  formControlName="tailleGroupe"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Ex: 5"
                  min="1"
                />
                <p class="text-xs text-slate-500 mt-1">
                  Le nombre de groupes sera calcul\xE9 automatiquement
                </p>
              </div>
            }

            <!-- Pr\xE9fixe de nom -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Pr\xE9fixe du nom des groupes *
              </label>
              <input
                type="text"
                formControlName="prefixeNom"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: Groupe"
              />
              <p class="text-xs text-slate-500 mt-1">
                Les groupes seront nomm\xE9s: "Pr\xE9fixe 1", "Pr\xE9fixe 2", etc.
              </p>
            </div>

            <!-- R\xE9partition al\xE9atoire -->
            <div class="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200">
              <input
                type="checkbox"
                formControlName="repartitionAleatoire"
                id="repartitionAleatoire"
                class="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
              />
              <label for="repartitionAleatoire" class="flex-1 cursor-pointer">
                <div class="font-medium text-slate-800">R\xE9partition al\xE9atoire</div>
                <div class="text-xs text-slate-600">M\xE9langer les \xE9tudiants avant de cr\xE9er les groupes</div>
              </label>
            </div>

            <!-- Aper\xE7u -->
            @if (generationForm.get('classeId')?.value) {
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <span class="material-icons text-blue-600">info</span>
                  <div class="flex-1 text-sm">
                    <p class="font-medium text-blue-900 mb-1">Aper\xE7u de la g\xE9n\xE9ration</p>
                    <p class="text-blue-700">
                      @if (generationForm.get('modeRepartition')?.value === 'nombre') {
                        {{ generationForm.get('nombreGroupes')?.value }} groupe(s) seront cr\xE9\xE9s
                      }
                      @if (generationForm.get('modeRepartition')?.value === 'taille') {
                        Groupes de {{ generationForm.get('tailleGroupe')?.value }} \xE9tudiant(s)
                      }
                    </p>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mt-6 pt-6 border-t border-slate-200">
            <button
              type="button"
              (click)="closeGenerationModal()"
              class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              [disabled]="generationForm.invalid"
              [class.opacity-50]="generationForm.invalid"
              [class.cursor-not-allowed]="generationForm.invalid"
              class="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:hover:bg-teal-600"
            >
              <span class="material-icons">auto_awesome</span>
              G\xE9n\xE9rer les groupes
            </button>
          </div>
        </form>
      </div>
    </div>
  }
</div>
`, styles: ['/* src/app/features/admin/etudiants/etudiants.component.scss */\n.line-clamp-2 {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n.modal-overlay {\n  animation: fadeIn 0.2s ease-in-out;\n}\n.modal-content {\n  animation: slideUp 0.3s ease-out;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes slideUp {\n  from {\n    transform: translateY(20px);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0);\n    opacity: 1;\n  }\n}\n.student-card,\n.group-card {\n  transition: all 0.3s ease;\n}\n.student-card:hover,\n.group-card:hover {\n  transform: translateY(-2px);\n}\n.avatar {\n  position: relative;\n}\n.avatar::after {\n  content: "";\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  width: 12px;\n  height: 12px;\n  background-color: #10b981;\n  border: 2px solid white;\n  border-radius: 50%;\n}\n.progress-bar {\n  transition: width 0.5s ease-in-out;\n}\n/*# sourceMappingURL=etudiants.component.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EtudiantsComponent, { className: "EtudiantsComponent", filePath: "src/app/features/admin/etudiants/etudiants.component.ts", lineNumber: 23 });
})();
export {
  EtudiantsComponent
};
//# sourceMappingURL=chunk-FWPSXFGB.js.map
