import {
  EquipementService,
  MaterielService
} from "./chunk-RVFBKUYY.js";
import {
  EcoleService
} from "./chunk-BQGZQQHM.js";
import {
  ApiService
} from "./chunk-M2M2Z2ZK.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormArrayName,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  FormGroupName,
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
  computed,
  inject,
  map,
  setClassMetadata,
  signal,
  switchMap,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
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
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-DBHCOGA3.js";
import {
  __objRest,
  __spreadProps,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/core/services/salle.service.ts
var TYPE_SALLE_MAP = {
  AMPHITHEATRE: "Amphith\xE9\xE2tre",
  SALLE_COURS: "Salle de TD",
  LABORATOIRE: "Laboratoire",
  SALLE_REUNION: "Salle de TP"
};
var TYPE_SALLE_REVERSE_MAP = {
  "Amphith\xE9\xE2tre": "AMPHITHEATRE",
  "Salle de TD": "SALLE_COURS",
  "Laboratoire": "LABORATOIRE",
  "Salle de TP": "SALLE_REUNION"
};
var SalleService = class _SalleService {
  apiService = inject(ApiService);
  getSalles() {
    return this.apiService.get("/bookings/salles", { page: 0, size: 100 }).pipe(map((page) => page.content.map(this.toSalle)));
  }
  getSalleById(id) {
    return this.apiService.get(`/bookings/salles/${id}`).pipe(map(this.toSalle));
  }
  getSallesByEcole(ecoleId) {
    return this.apiService.get(`/bookings/ecoles/${ecoleId}/salles`, { page: 0, size: 100 }).pipe(map((page) => page.content.map(this.toSalle)));
  }
  getSallesDisponibles() {
    return this.apiService.get("/bookings/salles/disponibles", { page: 0, size: 100 }).pipe(map((page) => page.content.map(this.toSalle)));
  }
  getSallesByType(type) {
    return this.getSalles().pipe(map((salles) => salles.filter((s) => s.type === type)));
  }
  createSalle(salle) {
    const body = {
      ecoleId: salle.ecoleId,
      numero: salle.numeroSalle,
      typeSalle: TYPE_SALLE_REVERSE_MAP[salle.type] ?? "SALLE_COURS",
      capacite: salle.capacite,
      batiment: salle.batiment,
      etage: String(salle.etage),
      statut: salle.disponible ? "ACTIVE" : "FERMEE"
    };
    return this.apiService.post("/bookings/salles", body).pipe(map(this.toSalle));
  }
  updateSalle(salle) {
    const _a = salle, { id } = _a, rest = __objRest(_a, ["id"]);
    const body = {
      ecoleId: rest.ecoleId,
      numero: rest.numeroSalle,
      typeSalle: rest.type ? TYPE_SALLE_REVERSE_MAP[rest.type] ?? "SALLE_COURS" : void 0,
      capacite: rest.capacite,
      batiment: rest.batiment,
      etage: rest.etage != null ? String(rest.etage) : void 0,
      statut: rest.disponible != null ? rest.disponible ? "ACTIVE" : "FERMEE" : void 0
    };
    return this.apiService.put(`/bookings/salles/${id}`, body).pipe(map(this.toSalle));
  }
  deleteSalle(id) {
    return this.apiService.delete(`/bookings/salles/${id}`);
  }
  toggleDisponibilite(id) {
    return this.getSalleById(id).pipe(switchMap((salle) => this.updateSalle({ id, disponible: !salle.disponible })));
  }
  toSalle(r) {
    return {
      id: r.id,
      numeroSalle: r.numero,
      type: TYPE_SALLE_MAP[r.typeSalle] ?? r.typeSalle,
      capacite: r.capacite,
      batiment: r.batiment ?? "",
      etage: r.etage ? parseInt(r.etage, 10) || 0 : 0,
      disponible: r.statut === "ACTIVE",
      ecoleId: r.ecoleId,
      materielAffecte: [],
      equipementAffecte: []
    };
  }
  static \u0275fac = function SalleService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SalleService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SalleService, factory: _SalleService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SalleService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/core/models/salle.model.ts
var TYPES_SALLE = [
  "Amphith\xE9\xE2tre",
  "Salle de TP",
  "Salle de TD",
  "Laboratoire"
];
function isSalleEquipee(salle) {
  const hasMateriels = salle.materielAffecte && salle.materielAffecte.length > 0;
  const hasEquipements = salle.equipementAffecte && salle.equipementAffecte.length > 0;
  return !!(hasMateriels || hasEquipements);
}
function getSalleEquipmentCount(salle) {
  const totalMateriels = salle.materielAffecte?.reduce((sum, m) => sum + m.quantiteAffectee, 0) || 0;
  const totalEquipements = salle.equipementAffecte?.length || 0;
  return {
    totalMateriels,
    totalEquipements,
    isEquipee: totalMateriels > 0 || totalEquipements > 0
  };
}

// src/app/features/admin/room/room.component.ts
var _forTrack0 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.materielId;
var _forTrack2 = ($index, $item) => $item.equipementId;
function RoomComponent_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const type_r1 = ctx.$implicit;
    \u0275\u0275property("value", type_r1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(type_r1);
  }
}
function RoomComponent_For_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const batiment_r2 = ctx.$implicit;
    \u0275\u0275property("value", batiment_r2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(batiment_r2);
  }
}
function RoomComponent_For_46_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 27);
    \u0275\u0275text(1, " Disponible ");
    \u0275\u0275elementEnd();
  }
}
function RoomComponent_For_46_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 28);
    \u0275\u0275text(1, " Occup\xE9e ");
    \u0275\u0275elementEnd();
  }
}
function RoomComponent_For_46_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30)(1, "span", 42);
    \u0275\u0275text(2, "check_circle");
    \u0275\u0275elementEnd()();
  }
}
function RoomComponent_For_46_Conditional_24_Conditional_1_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45)(1, "span", 3);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 46);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ma_r6 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.getMaterielName(ma_r6.materielId));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("\xD7", ma_r6.quantiteAffectee);
  }
}
function RoomComponent_For_46_Conditional_24_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "h4", 43)(2, "span", 39);
    \u0275\u0275text(3, "inventory");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 44);
    \u0275\u0275repeaterCreate(6, RoomComponent_For_46_Conditional_24_Conditional_1_For_7_Template, 5, 2, "div", 45, _forTrack1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const salle_r7 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" Mat\xE9riels (", ctx_r3.getSalleEquipmentInfo(salle_r7).totalMateriels, ") ");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(salle_r7.materielAffecte);
  }
}
function RoomComponent_For_46_Conditional_24_Conditional_2_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47)(1, "span", 48);
    \u0275\u0275text(2, "check");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 3);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ea_r8 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r3.getEquipementName(ea_r8.equipementId));
  }
}
function RoomComponent_For_46_Conditional_24_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "h4", 43)(2, "span", 39);
    \u0275\u0275text(3, "devices");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 44);
    \u0275\u0275repeaterCreate(6, RoomComponent_For_46_Conditional_24_Conditional_2_For_7_Template, 5, 1, "div", 47, _forTrack2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const salle_r7 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" \xC9quipements (", ctx_r3.getSalleEquipmentInfo(salle_r7).totalEquipements, ") ");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(salle_r7.equipementAffecte);
  }
}
function RoomComponent_For_46_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35);
    \u0275\u0275conditionalCreate(1, RoomComponent_For_46_Conditional_24_Conditional_1_Template, 8, 1, "div");
    \u0275\u0275conditionalCreate(2, RoomComponent_For_46_Conditional_24_Conditional_2_Template, 8, 1, "div");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const salle_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275conditional(salle_r7.materielAffecte && salle_r7.materielAffecte.length > 0 ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(salle_r7.equipementAffecte && salle_r7.equipementAffecte.length > 0 ? 2 : -1);
  }
}
function RoomComponent_For_46_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36)(1, "span", 49);
    \u0275\u0275text(2, "inventory_2");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 50);
    \u0275\u0275text(4, "Aucun \xE9quipement affect\xE9");
    \u0275\u0275elementEnd()();
  }
}
function RoomComponent_For_46_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 20)(1, "div", 23)(2, "div", 24)(3, "div", 6)(4, "div", 25)(5, "h3", 26);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, RoomComponent_For_46_Conditional_7_Template, 2, 0, "span", 27)(8, RoomComponent_For_46_Conditional_8_Template, 2, 0, "span", 28);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 29);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(11, RoomComponent_For_46_Conditional_11_Template, 3, 0, "div", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 31)(13, "div", 32)(14, "span", 33);
    \u0275\u0275text(15, "domain");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 32)(19, "span", 33);
    \u0275\u0275text(20, "people");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span");
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(23, "div", 34);
    \u0275\u0275conditionalCreate(24, RoomComponent_For_46_Conditional_24_Template, 3, 2, "div", 35)(25, RoomComponent_For_46_Conditional_25_Template, 5, 0, "div", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 37)(27, "button", 38);
    \u0275\u0275listener("click", function RoomComponent_For_46_Template_button_click_27_listener() {
      const salle_r7 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.toggleDisponibilite(salle_r7));
    });
    \u0275\u0275elementStart(28, "span", 39);
    \u0275\u0275text(29);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "button", 40);
    \u0275\u0275listener("click", function RoomComponent_For_46_Template_button_click_30_listener() {
      const salle_r7 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.openSalleModal(salle_r7));
    });
    \u0275\u0275elementStart(31, "span", 39);
    \u0275\u0275text(32, "edit");
    \u0275\u0275elementEnd();
    \u0275\u0275text(33, " Modifier ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "button", 41);
    \u0275\u0275listener("click", function RoomComponent_For_46_Template_button_click_34_listener() {
      const salle_r7 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.deleteSalle(salle_r7.id));
    });
    \u0275\u0275elementStart(35, "span", 39);
    \u0275\u0275text(36, "delete");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const salle_r7 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(salle_r7.numeroSalle);
    \u0275\u0275advance();
    \u0275\u0275conditional(salle_r7.disponible ? 7 : 8);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(ctx_r3.getTypeBadgeClass(salle_r7.type));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", salle_r7.type, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.isSalleEquipee(salle_r7) ? 11 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", salle_r7.batiment, " - \xC9tage ", salle_r7.etage);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("Capacit\xE9: ", salle_r7.capacite, " places");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r3.isSalleEquipee(salle_r7) ? 24 : 25);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("bg-green-100", !salle_r7.disponible)("text-green-700", !salle_r7.disponible)("hover:bg-green-200", !salle_r7.disponible)("bg-slate-100", salle_r7.disponible)("text-slate-700", salle_r7.disponible)("hover:bg-slate-200", salle_r7.disponible);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", salle_r7.disponible ? "lock" : "lock_open", " ");
  }
}
function RoomComponent_ForEmpty_47_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 21)(1, "span", 51);
    \u0275\u0275text(2, "meeting_room");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 52);
    \u0275\u0275text(4, "Aucune salle pour le moment");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 53);
    \u0275\u0275listener("click", function RoomComponent_ForEmpty_47_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.openSalleModal());
    });
    \u0275\u0275text(6, " Ajouter votre premi\xE8re salle ");
    \u0275\u0275elementEnd()();
  }
}
function RoomComponent_Conditional_48_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 65);
    \u0275\u0275text(1, "Le num\xE9ro est requis (min. 2 caract\xE8res)");
    \u0275\u0275elementEnd();
  }
}
function RoomComponent_Conditional_48_For_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const type_r10 = ctx.$implicit;
    \u0275\u0275property("value", type_r10);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(type_r10);
  }
}
function RoomComponent_Conditional_48_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 65);
    \u0275\u0275text(1, "Le b\xE2timent est requis");
    \u0275\u0275elementEnd();
  }
}
function RoomComponent_Conditional_48_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 65);
    \u0275\u0275text(1, "La capacit\xE9 doit \xEAtre au minimum 1");
    \u0275\u0275elementEnd();
  }
}
function RoomComponent_Conditional_48_For_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ecole_r11 = ctx.$implicit;
    \u0275\u0275property("value", ecole_r11.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ecole_r11.nom);
  }
}
function RoomComponent_Conditional_48_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 65);
    \u0275\u0275text(1, "Veuillez s\xE9lectionner une \xE9cole");
    \u0275\u0275elementEnd();
  }
}
function RoomComponent_Conditional_48_Conditional_64_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 80)(1, "span", 86);
    \u0275\u0275text(2, "inventory_2");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 87);
    \u0275\u0275text(4, "Aucun mat\xE9riel affect\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 88);
    \u0275\u0275text(6, 'Cliquez sur "Ajouter un mat\xE9riel" pour commencer');
    \u0275\u0275elementEnd()();
  }
}
function RoomComponent_Conditional_48_Conditional_65_For_2_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const materiel_r13 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(4);
    \u0275\u0275property("value", materiel_r13.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", materiel_r13.nom, " - Dispo: ", ctx_r3.getQuantiteDisponible(materiel_r13.id), " ");
  }
}
function RoomComponent_Conditional_48_Conditional_65_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 89)(1, "div", 6)(2, "select", 90)(3, "option", 12);
    \u0275\u0275text(4, "S\xE9lectionnez un mat\xE9riel");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(5, RoomComponent_Conditional_48_Conditional_65_For_2_For_6_Template, 2, 3, "option", 13, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 91);
    \u0275\u0275element(8, "input", 92);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 93);
    \u0275\u0275element(10, "input", 94);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "button", 95);
    \u0275\u0275listener("click", function RoomComponent_Conditional_48_Conditional_65_For_2_Template_button_click_11_listener() {
      const \u0275$index_347_r14 = \u0275\u0275restoreView(_r12).$index;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.removeMaterielAffecte(\u0275$index_347_r14));
    });
    \u0275\u0275elementStart(12, "span", 39);
    \u0275\u0275text(13, "delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const \u0275$index_347_r14 = ctx.$index;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275property("formGroupName", \u0275$index_347_r14);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r3.materiels());
  }
}
function RoomComponent_Conditional_48_Conditional_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 81);
    \u0275\u0275repeaterCreate(1, RoomComponent_Conditional_48_Conditional_65_For_2_Template, 14, 1, "div", 89, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r3.materielAffecteArray.controls);
  }
}
function RoomComponent_Conditional_48_Conditional_74_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 80)(1, "span", 86);
    \u0275\u0275text(2, "devices");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 87);
    \u0275\u0275text(4, "Aucun \xE9quipement affect\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 88);
    \u0275\u0275text(6, 'Cliquez sur "Ajouter un \xE9quipement" pour commencer');
    \u0275\u0275elementEnd()();
  }
}
function RoomComponent_Conditional_48_Conditional_75_For_2_For_6_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " (D\xE9j\xE0 affect\xE9) ");
  }
}
function RoomComponent_Conditional_48_Conditional_75_For_2_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 13);
    \u0275\u0275text(1);
    \u0275\u0275conditionalCreate(2, RoomComponent_Conditional_48_Conditional_75_For_2_For_6_Conditional_2_Template, 1, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const equipement_r16 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(4);
    \u0275\u0275property("value", equipement_r16.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", equipement_r16.nom, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r3.isEquipementDisponible(equipement_r16.id) ? 2 : -1);
  }
}
function RoomComponent_Conditional_48_Conditional_75_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 89)(1, "div", 6)(2, "select", 96)(3, "option", 12);
    \u0275\u0275text(4, "S\xE9lectionnez un \xE9quipement");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(5, RoomComponent_Conditional_48_Conditional_75_For_2_For_6_Template, 3, 3, "option", 13, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 93);
    \u0275\u0275element(8, "input", 94);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "button", 95);
    \u0275\u0275listener("click", function RoomComponent_Conditional_48_Conditional_75_For_2_Template_button_click_9_listener() {
      const \u0275$index_402_r17 = \u0275\u0275restoreView(_r15).$index;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.removeEquipementAffecte(\u0275$index_402_r17));
    });
    \u0275\u0275elementStart(10, "span", 39);
    \u0275\u0275text(11, "delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const \u0275$index_402_r17 = ctx.$index;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275property("formGroupName", \u0275$index_402_r17);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r3.equipements());
  }
}
function RoomComponent_Conditional_48_Conditional_75_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 82);
    \u0275\u0275repeaterCreate(1, RoomComponent_Conditional_48_Conditional_75_For_2_Template, 12, 1, "div", 89, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r3.equipementAffecteArray.controls);
  }
}
function RoomComponent_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22)(1, "div", 54)(2, "div", 55)(3, "h2", 56);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 57);
    \u0275\u0275listener("click", function RoomComponent_Conditional_48_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.closeSalleModal());
    });
    \u0275\u0275elementStart(6, "span", 9);
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "form", 58);
    \u0275\u0275listener("ngSubmit", function RoomComponent_Conditional_48_Template_form_ngSubmit_8_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.saveSalle());
    });
    \u0275\u0275elementStart(9, "div", 59)(10, "h3", 60);
    \u0275\u0275text(11, "Informations g\xE9n\xE9rales");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 61)(13, "div", 62)(14, "div")(15, "label", 63);
    \u0275\u0275text(16, " Num\xE9ro de salle * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(17, "input", 64);
    \u0275\u0275conditionalCreate(18, RoomComponent_Conditional_48_Conditional_18_Template, 2, 0, "p", 65);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div")(20, "label", 63);
    \u0275\u0275text(21, " Type * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "select", 66);
    \u0275\u0275repeaterCreate(23, RoomComponent_Conditional_48_For_24_Template, 2, 2, "option", 13, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(25, "div", 67)(26, "div")(27, "label", 63);
    \u0275\u0275text(28, " B\xE2timent * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(29, "input", 68);
    \u0275\u0275conditionalCreate(30, RoomComponent_Conditional_48_Conditional_30_Template, 2, 0, "p", 65);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div")(32, "label", 63);
    \u0275\u0275text(33, " \xC9tage * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(34, "input", 69);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "div")(36, "label", 63);
    \u0275\u0275text(37, " Capacit\xE9 * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(38, "input", 70);
    \u0275\u0275conditionalCreate(39, RoomComponent_Conditional_48_Conditional_39_Template, 2, 0, "p", 65);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(40, "div")(41, "label", 63);
    \u0275\u0275text(42, " \xC9cole * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "select", 71)(44, "option", 12);
    \u0275\u0275text(45, "S\xE9lectionnez une \xE9cole");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(46, RoomComponent_Conditional_48_For_47_Template, 2, 2, "option", 13, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(48, RoomComponent_Conditional_48_Conditional_48_Template, 2, 0, "p", 65);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "div", 72);
    \u0275\u0275element(50, "input", 73);
    \u0275\u0275elementStart(51, "label", 74)(52, "div", 75);
    \u0275\u0275text(53, "Salle disponible");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "div", 76);
    \u0275\u0275text(55, "La salle peut \xEAtre utilis\xE9e pour des cours");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(56, "div", 59)(57, "div", 77)(58, "h3", 78);
    \u0275\u0275text(59, "Mat\xE9riels affect\xE9s");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "button", 79);
    \u0275\u0275listener("click", function RoomComponent_Conditional_48_Template_button_click_60_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.addMaterielAffecte());
    });
    \u0275\u0275elementStart(61, "span", 39);
    \u0275\u0275text(62, "add_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275text(63, " Ajouter un mat\xE9riel ");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(64, RoomComponent_Conditional_48_Conditional_64_Template, 7, 0, "div", 80)(65, RoomComponent_Conditional_48_Conditional_65_Template, 3, 0, "div", 81);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(66, "div", 59)(67, "div", 77)(68, "h3", 78);
    \u0275\u0275text(69, "\xC9quipements affect\xE9s");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(70, "button", 79);
    \u0275\u0275listener("click", function RoomComponent_Conditional_48_Template_button_click_70_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.addEquipementAffecte());
    });
    \u0275\u0275elementStart(71, "span", 39);
    \u0275\u0275text(72, "add_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275text(73, " Ajouter un \xE9quipement ");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(74, RoomComponent_Conditional_48_Conditional_74_Template, 7, 0, "div", 80)(75, RoomComponent_Conditional_48_Conditional_75_Template, 3, 0, "div", 82);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(76, "div", 83)(77, "button", 84);
    \u0275\u0275listener("click", function RoomComponent_Conditional_48_Template_button_click_77_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.closeSalleModal());
    });
    \u0275\u0275text(78, " Annuler ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(79, "button", 85);
    \u0275\u0275text(80);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_5_0;
    let tmp_6_0;
    let tmp_8_0;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r3.editingSalle() ? "Modifier la salle" : "Nouvelle salle", " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("formGroup", ctx_r3.salleForm);
    \u0275\u0275advance(10);
    \u0275\u0275conditional(((tmp_3_0 = ctx_r3.salleForm.get("numeroSalle")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx_r3.salleForm.get("numeroSalle")) == null ? null : tmp_3_0.touched) ? 18 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r3.typesSalle);
    \u0275\u0275advance(7);
    \u0275\u0275conditional(((tmp_5_0 = ctx_r3.salleForm.get("batiment")) == null ? null : tmp_5_0.invalid) && ((tmp_5_0 = ctx_r3.salleForm.get("batiment")) == null ? null : tmp_5_0.touched) ? 30 : -1);
    \u0275\u0275advance(9);
    \u0275\u0275conditional(((tmp_6_0 = ctx_r3.salleForm.get("capacite")) == null ? null : tmp_6_0.invalid) && ((tmp_6_0 = ctx_r3.salleForm.get("capacite")) == null ? null : tmp_6_0.touched) ? 39 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r3.ecoles());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_8_0 = ctx_r3.salleForm.get("ecoleId")) == null ? null : tmp_8_0.invalid) && ((tmp_8_0 = ctx_r3.salleForm.get("ecoleId")) == null ? null : tmp_8_0.touched) ? 48 : -1);
    \u0275\u0275advance(16);
    \u0275\u0275conditional(ctx_r3.materielAffecteArray.length === 0 ? 64 : 65);
    \u0275\u0275advance(10);
    \u0275\u0275conditional(ctx_r3.equipementAffecteArray.length === 0 ? 74 : 75);
    \u0275\u0275advance(5);
    \u0275\u0275classProp("opacity-50", ctx_r3.salleForm.invalid)("cursor-not-allowed", ctx_r3.salleForm.invalid);
    \u0275\u0275property("disabled", ctx_r3.salleForm.invalid);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r3.editingSalle() ? "Enregistrer" : "Cr\xE9er", " ");
  }
}
var RoomComponent = class _RoomComponent {
  salleService = inject(SalleService);
  materielService = inject(MaterielService);
  equipementService = inject(EquipementService);
  ecoleService = inject(EcoleService);
  fb = inject(FormBuilder);
  salles = signal([], ...ngDevMode ? [{ debugName: "salles" }] : []);
  materiels = signal([], ...ngDevMode ? [{ debugName: "materiels" }] : []);
  equipements = signal([], ...ngDevMode ? [{ debugName: "equipements" }] : []);
  ecoles = signal([], ...ngDevMode ? [{ debugName: "ecoles" }] : []);
  // Filtres
  typeFilter = signal("", ...ngDevMode ? [{ debugName: "typeFilter" }] : []);
  batimentFilter = signal("", ...ngDevMode ? [{ debugName: "batimentFilter" }] : []);
  disponibleFilter = signal("", ...ngDevMode ? [{ debugName: "disponibleFilter" }] : []);
  equipeeFilter = signal("", ...ngDevMode ? [{ debugName: "equipeeFilter" }] : []);
  searchTerm = signal("", ...ngDevMode ? [{ debugName: "searchTerm" }] : []);
  // Modals
  showSalleModal = signal(false, ...ngDevMode ? [{ debugName: "showSalleModal" }] : []);
  editingSalle = signal(null, ...ngDevMode ? [{ debugName: "editingSalle" }] : []);
  // Formulaire
  salleForm;
  // Types de salle
  typesSalle = TYPES_SALLE;
  // Données filtrées
  sallesFiltered = computed(() => {
    let result = this.salles();
    if (this.typeFilter()) {
      result = result.filter((s) => s.type === this.typeFilter());
    }
    if (this.batimentFilter()) {
      result = result.filter((s) => s.batiment === this.batimentFilter());
    }
    if (this.disponibleFilter()) {
      const isDisponible = this.disponibleFilter() === "true";
      result = result.filter((s) => s.disponible === isDisponible);
    }
    if (this.equipeeFilter()) {
      const isEquipee = this.equipeeFilter() === "true";
      result = result.filter((s) => isSalleEquipee(s) === isEquipee);
    }
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      result = result.filter((s) => s.numeroSalle.toLowerCase().includes(term) || s.type.toLowerCase().includes(term) || s.batiment.toLowerCase().includes(term));
    }
    return result;
  }, ...ngDevMode ? [{ debugName: "sallesFiltered" }] : []);
  // Liste unique des bâtiments
  batiments = computed(() => {
    const batimentsSet = new Set(this.salles().map((s) => s.batiment));
    return Array.from(batimentsSet).sort();
  }, ...ngDevMode ? [{ debugName: "batiments" }] : []);
  ngOnInit() {
    this.initForm();
    this.loadData();
  }
  initForm() {
    this.salleForm = this.fb.group({
      numeroSalle: ["", [Validators.required, Validators.minLength(2)]],
      type: ["Salle de TD", Validators.required],
      capacite: [30, [Validators.required, Validators.min(1)]],
      batiment: ["", [Validators.required, Validators.minLength(2)]],
      etage: [0, [Validators.required, Validators.min(0)]],
      disponible: [true],
      ecoleId: ["", Validators.required],
      materielAffecte: this.fb.array([]),
      equipementAffecte: this.fb.array([])
    });
  }
  loadData() {
    this.salleService.getSalles().subscribe((data) => this.salles.set(data));
    this.ecoleService.fetchEcolesFromApi().subscribe((data) => this.ecoles.set(data));
    this.materielService.getMateriels().subscribe((data) => this.materiels.set(data));
    this.equipementService.getEquipements().subscribe((data) => this.equipements.set(data));
  }
  // Gestion des FormArrays
  get materielAffecteArray() {
    return this.salleForm.get("materielAffecte");
  }
  get equipementAffecteArray() {
    return this.salleForm.get("equipementAffecte");
  }
  addMaterielAffecte() {
    const materielGroup = this.fb.group({
      materielId: ["", Validators.required],
      quantiteAffectee: [1, [Validators.required, Validators.min(1)]],
      dateAffectation: [(/* @__PURE__ */ new Date()).toISOString().split("T")[0]]
    });
    this.materielAffecteArray.push(materielGroup);
  }
  removeMaterielAffecte(index) {
    this.materielAffecteArray.removeAt(index);
  }
  addEquipementAffecte() {
    const equipementGroup = this.fb.group({
      equipementId: ["", Validators.required],
      dateAffectation: [(/* @__PURE__ */ new Date()).toISOString().split("T")[0]]
    });
    this.equipementAffecteArray.push(equipementGroup);
  }
  removeEquipementAffecte(index) {
    this.equipementAffecteArray.removeAt(index);
  }
  // Gestion du modal
  openSalleModal(salle) {
    if (salle) {
      this.editingSalle.set(salle);
      this.salleForm.patchValue({
        numeroSalle: salle.numeroSalle,
        type: salle.type,
        capacite: salle.capacite,
        batiment: salle.batiment,
        etage: salle.etage,
        disponible: salle.disponible,
        ecoleId: salle.ecoleId
      });
      this.materielAffecteArray.clear();
      if (salle.materielAffecte && salle.materielAffecte.length > 0) {
        salle.materielAffecte.forEach((ma) => {
          const materielGroup = this.fb.group({
            materielId: [ma.materielId, Validators.required],
            quantiteAffectee: [ma.quantiteAffectee, [Validators.required, Validators.min(1)]],
            dateAffectation: [ma.dateAffectation || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]]
          });
          this.materielAffecteArray.push(materielGroup);
        });
      }
      this.equipementAffecteArray.clear();
      if (salle.equipementAffecte && salle.equipementAffecte.length > 0) {
        salle.equipementAffecte.forEach((ea) => {
          const equipementGroup = this.fb.group({
            equipementId: [ea.equipementId, Validators.required],
            dateAffectation: [ea.dateAffectation || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]]
          });
          this.equipementAffecteArray.push(equipementGroup);
        });
      }
    } else {
      this.editingSalle.set(null);
      this.salleForm.reset({
        type: "Salle de TD",
        capacite: 30,
        etage: 0,
        disponible: true
      });
      this.materielAffecteArray.clear();
      this.equipementAffecteArray.clear();
    }
    this.showSalleModal.set(true);
  }
  closeSalleModal() {
    this.showSalleModal.set(false);
    this.editingSalle.set(null);
    this.salleForm.reset();
    this.materielAffecteArray.clear();
    this.equipementAffecteArray.clear();
  }
  saveSalle() {
    if (this.salleForm.invalid)
      return;
    const salleData = __spreadProps(__spreadValues({}, this.salleForm.value), {
      materielAffecte: this.materielAffecteArray.value.filter((ma) => ma.materielId),
      equipementAffecte: this.equipementAffecteArray.value.filter((ea) => ea.equipementId)
    });
    if (this.editingSalle()) {
      this.salleService.updateSalle(__spreadValues({
        id: this.editingSalle().id
      }, salleData)).subscribe(() => {
        this.closeSalleModal();
        this.loadData();
      });
    } else {
      this.salleService.createSalle(salleData).subscribe(() => {
        this.closeSalleModal();
        this.loadData();
      });
    }
  }
  deleteSalle(id) {
    if (confirm("\xCAtes-vous s\xFBr de vouloir supprimer cette salle ?")) {
      this.salleService.deleteSalle(id).subscribe(() => {
        this.loadData();
      });
    }
  }
  toggleDisponibilite(salle) {
    this.salleService.toggleDisponibilite(salle.id).subscribe(() => {
      this.loadData();
    });
  }
  // Helpers
  getTypeBadgeClass(type) {
    switch (type) {
      case "Amphith\xE9\xE2tre":
        return "bg-purple-100 text-purple-700";
      case "Salle de TP":
        return "bg-blue-100 text-blue-700";
      case "Salle de TD":
        return "bg-green-100 text-green-700";
      case "Laboratoire":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  }
  getMaterielName(materielId) {
    const materiel = this.materiels().find((m) => m.id === materielId);
    return materiel ? materiel.nom : "Mat\xE9riel inconnu";
  }
  getEquipementName(equipementId) {
    const equipement = this.equipements().find((e) => e.id === equipementId);
    return equipement ? equipement.nom : "\xC9quipement inconnu";
  }
  getSalleEquipmentInfo(salle) {
    return getSalleEquipmentCount(salle);
  }
  isSalleEquipee(salle) {
    return isSalleEquipee(salle);
  }
  getQuantiteDisponible(materielId) {
    const materiel = this.materiels().find((m) => m.id === materielId);
    if (!materiel)
      return 0;
    let quantiteAffectee = 0;
    this.salles().forEach((salle) => {
      if (salle.materielAffecte) {
        const affectation = salle.materielAffecte.find((ma) => ma.materielId === materielId);
        if (affectation) {
          quantiteAffectee += affectation.quantiteAffectee;
        }
      }
    });
    return materiel.quantite - quantiteAffectee;
  }
  isEquipementDisponible(equipementId) {
    const isAffecte = this.salles().some((salle) => salle.equipementAffecte?.some((ea) => ea.equipementId === equipementId));
    return !isAffecte;
  }
  // TrackBy functions for *ngFor
  trackById(index, item) {
    return item.id;
  }
  trackByIndex(index) {
    return index;
  }
  static \u0275fac = function RoomComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RoomComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RoomComponent, selectors: [["app-room"]], decls: 49, vars: 8, consts: [[1, "p-8", "max-w-7xl", "mx-auto"], [1, "mb-8"], [1, "text-3xl", "font-bold", "text-slate-800", "mb-2"], [1, "text-slate-600"], [1, "mb-6", "space-y-4"], [1, "flex", "gap-4"], [1, "flex-1"], ["type", "text", "placeholder", "Rechercher par num\xE9ro, type ou b\xE2timent...", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent", 3, "input", "value"], [1, "bg-teal-600", "hover:bg-teal-700", "text-white", "px-6", "py-2", "rounded-lg", "flex", "items-center", "gap-2", "transition-colors", "whitespace-nowrap", 3, "click"], [1, "material-icons"], [1, "flex", "flex-wrap", "gap-3"], [1, "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent", "bg-white", 3, "change", "value"], ["value", ""], [3, "value"], ["value", "true"], ["value", "false"], [1, "flex", "items-center", "px-4", "py-2", "bg-slate-100", "rounded-lg", "text-sm"], [1, "font-medium", "text-slate-700"], [1, "text-slate-500", "ml-1"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-6"], [1, "bg-white", "rounded-lg", "shadow-md", "hover:shadow-lg", "transition-shadow", "border", "border-slate-200"], [1, "col-span-3", "text-center", "py-12"], [1, "fixed", "inset-0", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center", "z-50"], [1, "p-6", "border-b", "border-slate-100"], [1, "flex", "justify-between", "items-start", "mb-3"], [1, "flex", "items-center", "gap-2", "mb-2"], [1, "text-xl", "font-bold", "text-slate-800"], [1, "px-2", "py-0.5", "bg-green-100", "text-green-700", "text-xs", "font-semibold", "rounded-full"], [1, "px-2", "py-0.5", "bg-red-100", "text-red-700", "text-xs", "font-semibold", "rounded-full"], [1, "px-2", "py-1", "rounded", "text-xs", "font-semibold", "inline-block"], [1, "bg-teal-100", "rounded-full", "p-2"], [1, "space-y-2", "text-sm"], [1, "flex", "items-center", "gap-2", "text-slate-600"], [1, "material-icons", "text-lg"], [1, "p-4", "bg-slate-50"], [1, "space-y-3"], [1, "text-center", "py-4"], [1, "flex", "gap-2", "p-4", "border-t", "border-slate-200"], [1, "flex-shrink-0", "px-3", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors", "flex", "items-center", "justify-center", "gap-1", 3, "click"], [1, "material-icons", "text-sm"], [1, "flex-1", "bg-slate-100", "hover:bg-slate-200", "text-slate-700", "px-3", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors", "flex", "items-center", "justify-center", "gap-1", 3, "click"], [1, "bg-red-50", "hover:bg-red-100", "text-red-600", "px-3", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors", "flex", "items-center", "justify-center", 3, "click"], [1, "material-icons", "text-teal-600", "text-xl"], [1, "text-xs", "font-semibold", "text-slate-700", "mb-2", "flex", "items-center", "gap-1"], [1, "space-y-1"], [1, "flex", "items-center", "justify-between", "text-xs", "bg-white", "rounded", "px-2", "py-1.5", "border", "border-slate-200"], [1, "font-semibold", "text-teal-700"], [1, "flex", "items-center", "gap-2", "text-xs", "bg-white", "rounded", "px-2", "py-1.5", "border", "border-slate-200"], [1, "material-icons", "text-xs", "text-blue-600"], [1, "material-icons", "text-slate-300", "text-3xl", "mb-1"], [1, "text-xs", "text-slate-400"], [1, "material-icons", "text-6xl", "text-slate-300", "mb-4"], [1, "text-slate-500"], [1, "mt-4", "text-teal-600", "hover:text-teal-700", "font-medium", 3, "click"], [1, "bg-white", "rounded-lg", "shadow-xl", "max-w-4xl", "w-full", "mx-4", "max-h-[90vh]", "overflow-y-auto"], [1, "flex", "justify-between", "items-center", "p-6", "border-b", "border-slate-200"], [1, "text-2xl", "font-bold", "text-slate-800"], [1, "text-slate-400", "hover:text-slate-600", "transition-colors", 3, "click"], [1, "p-6", 3, "ngSubmit", "formGroup"], [1, "mb-6"], [1, "text-lg", "font-semibold", "text-slate-800", "mb-4"], [1, "space-y-4"], [1, "grid", "grid-cols-2", "gap-4"], [1, "block", "text-sm", "font-medium", "text-slate-700", "mb-1"], ["type", "text", "formControlName", "numeroSalle", "placeholder", "Ex: A101", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], [1, "text-red-600", "text-sm", "mt-1"], ["formControlName", "type", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], [1, "grid", "grid-cols-3", "gap-4"], ["type", "text", "formControlName", "batiment", "placeholder", "Ex: B\xE2timent A", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["type", "number", "formControlName", "etage", "min", "0", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["type", "number", "formControlName", "capacite", "placeholder", "Ex: 30", "min", "1", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["formControlName", "ecoleId", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], [1, "flex", "items-center", "gap-3", "p-4", "bg-slate-50", "rounded-lg"], ["type", "checkbox", "formControlName", "disponible", "id", "disponible", 1, "w-4", "h-4", "text-teal-600", "rounded", "focus:ring-teal-500"], ["for", "disponible", 1, "flex-1", "cursor-pointer"], [1, "font-medium", "text-slate-800"], [1, "text-xs", "text-slate-500"], [1, "flex", "justify-between", "items-center", "mb-3"], [1, "text-lg", "font-semibold", "text-slate-800"], ["type", "button", 1, "text-teal-600", "hover:text-teal-700", "text-sm", "font-medium", "flex", "items-center", "gap-1", 3, "click"], [1, "text-center", "py-6", "bg-slate-50", "rounded-lg", "border-2", "border-dashed", "border-slate-200"], ["formArrayName", "materielAffecte", 1, "space-y-3"], ["formArrayName", "equipementAffecte", 1, "space-y-3"], [1, "flex", "gap-3", "pt-6", "border-t", "border-slate-200"], ["type", "button", 1, "flex-1", "px-4", "py-2", "border", "border-slate-300", "text-slate-700", "rounded-lg", "hover:bg-slate-50", "transition-colors", 3, "click"], ["type", "submit", 1, "flex-1", "px-4", "py-2", "bg-teal-600", "text-white", "rounded-lg", "hover:bg-teal-700", "transition-colors", "disabled:hover:bg-teal-600", 3, "disabled"], [1, "material-icons", "text-slate-300", "text-4xl", "mb-2"], [1, "text-sm", "text-slate-500"], [1, "text-xs", "text-slate-400", "mt-1"], [1, "flex", "gap-3", "items-start", "bg-slate-50", "p-3", "rounded-lg", 3, "formGroupName"], ["formControlName", "materielId", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "rounded-lg", "text-sm", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], [1, "w-24"], ["type", "number", "formControlName", "quantiteAffectee", "placeholder", "Qt\xE9", "min", "1", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "rounded-lg", "text-sm", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], [1, "w-36"], ["type", "date", "formControlName", "dateAffectation", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "rounded-lg", "text-sm", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["type", "button", 1, "p-2", "text-red-600", "hover:bg-red-50", "rounded-lg", "transition-colors", 3, "click"], ["formControlName", "equipementId", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "rounded-lg", "text-sm", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"]], template: function RoomComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
      \u0275\u0275text(3, "Gestion des Salles");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "G\xE9rez les salles et leurs \xE9quipements");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "div", 6)(9, "input", 7);
      \u0275\u0275listener("input", function RoomComponent_Template_input_input_9_listener($event) {
        return ctx.searchTerm.set($event.target.value);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "button", 8);
      \u0275\u0275listener("click", function RoomComponent_Template_button_click_10_listener() {
        return ctx.openSalleModal();
      });
      \u0275\u0275elementStart(11, "span", 9);
      \u0275\u0275text(12, "add");
      \u0275\u0275elementEnd();
      \u0275\u0275text(13, " Nouvelle salle ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "div", 10)(15, "select", 11);
      \u0275\u0275listener("change", function RoomComponent_Template_select_change_15_listener($event) {
        return ctx.typeFilter.set($event.target.value);
      });
      \u0275\u0275elementStart(16, "option", 12);
      \u0275\u0275text(17, "Tous les types");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(18, RoomComponent_For_19_Template, 2, 2, "option", 13, \u0275\u0275repeaterTrackByIndex);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "select", 11);
      \u0275\u0275listener("change", function RoomComponent_Template_select_change_20_listener($event) {
        return ctx.batimentFilter.set($event.target.value);
      });
      \u0275\u0275elementStart(21, "option", 12);
      \u0275\u0275text(22, "Tous les b\xE2timents");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(23, RoomComponent_For_24_Template, 2, 2, "option", 13, \u0275\u0275repeaterTrackByIndex);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "select", 11);
      \u0275\u0275listener("change", function RoomComponent_Template_select_change_25_listener($event) {
        return ctx.disponibleFilter.set($event.target.value);
      });
      \u0275\u0275elementStart(26, "option", 12);
      \u0275\u0275text(27, "Toutes les salles");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "option", 14);
      \u0275\u0275text(29, "Disponibles");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "option", 15);
      \u0275\u0275text(31, "Non disponibles");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(32, "select", 11);
      \u0275\u0275listener("change", function RoomComponent_Template_select_change_32_listener($event) {
        return ctx.equipeeFilter.set($event.target.value);
      });
      \u0275\u0275elementStart(33, "option", 12);
      \u0275\u0275text(34, "Toutes");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "option", 14);
      \u0275\u0275text(36, "\xC9quip\xE9es");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "option", 15);
      \u0275\u0275text(38, "Non \xE9quip\xE9es");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(39, "div", 16)(40, "span", 17);
      \u0275\u0275text(41);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "span", 18);
      \u0275\u0275text(43, "salle(s)");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(44, "div", 19);
      \u0275\u0275repeaterCreate(45, RoomComponent_For_46_Template, 37, 23, "div", 20, _forTrack0, false, RoomComponent_ForEmpty_47_Template, 7, 0, "div", 21);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(48, RoomComponent_Conditional_48_Template, 81, 14, "div", 22);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(9);
      \u0275\u0275property("value", ctx.searchTerm());
      \u0275\u0275advance(6);
      \u0275\u0275property("value", ctx.typeFilter());
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.typesSalle);
      \u0275\u0275advance(2);
      \u0275\u0275property("value", ctx.batimentFilter());
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.batiments());
      \u0275\u0275advance(2);
      \u0275\u0275property("value", ctx.disponibleFilter());
      \u0275\u0275advance(7);
      \u0275\u0275property("value", ctx.equipeeFilter());
      \u0275\u0275advance(9);
      \u0275\u0275textInterpolate(ctx.sallesFiltered().length);
      \u0275\u0275advance(4);
      \u0275\u0275repeater(ctx.sallesFiltered());
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.showSalleModal() ? 48 : -1);
    }
  }, dependencies: [CommonModule, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, MinValidator, FormGroupDirective, FormControlName, FormGroupName, FormArrayName], styles: ["\n\n.line-clamp-2[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n.modal-overlay[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeIn 0.2s ease-in-out;\n}\n.modal-content[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideUp 0.3s ease-out;\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_slideUp {\n  from {\n    transform: translateY(20px);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0);\n    opacity: 1;\n  }\n}\n.room-card[_ngcontent-%COMP%] {\n  transition: all 0.3s ease;\n}\n.room-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n}\n/*# sourceMappingURL=room.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RoomComponent, [{
    type: Component,
    args: [{ selector: "app-room", standalone: true, imports: [CommonModule, ReactiveFormsModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `<div class="p-8 max-w-7xl mx-auto">
  <!-- En-t\xEAte -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-slate-800 mb-2">Gestion des Salles</h1>
    <p class="text-slate-600">G\xE9rez les salles et leurs \xE9quipements</p>
  </div>

  <!-- Filtres et recherche -->
  <div class="mb-6 space-y-4">
    <!-- Ligne 1 : Recherche -->
    <div class="flex gap-4">
      <div class="flex-1">
        <input
          type="text"
          [value]="searchTerm()"
          (input)="searchTerm.set($any($event.target).value)"
          class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          placeholder="Rechercher par num\xE9ro, type ou b\xE2timent..."
        />
      </div>
      <button
        (click)="openSalleModal()"
        class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
      >
        <span class="material-icons">add</span>
        Nouvelle salle
      </button>
    </div>

    <!-- Ligne 2 : Filtres -->
    <div class="flex flex-wrap gap-3">
      <!-- Filtre type -->
      <select
        [value]="typeFilter()"
        (change)="typeFilter.set($any($event.target).value)"
        class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
      >
        <option value="">Tous les types</option>
        @for (type of typesSalle; track $index) {
          <option [value]="type">{{ type }}</option>
        }
      </select>

      <!-- Filtre b\xE2timent -->
      <select
        [value]="batimentFilter()"
        (change)="batimentFilter.set($any($event.target).value)"
        class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
      >
        <option value="">Tous les b\xE2timents</option>
        @for (batiment of batiments(); track $index) {
          <option [value]="batiment">{{ batiment }}</option>
        }
      </select>

      <!-- Filtre disponibilit\xE9 -->
      <select
        [value]="disponibleFilter()"
        (change)="disponibleFilter.set($any($event.target).value)"
        class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
      >
        <option value="">Toutes les salles</option>
        <option value="true">Disponibles</option>
        <option value="false">Non disponibles</option>
      </select>

      <!-- Filtre \xE9quipement -->
      <select
        [value]="equipeeFilter()"
        (change)="equipeeFilter.set($any($event.target).value)"
        class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
      >
        <option value="">Toutes</option>
        <option value="true">\xC9quip\xE9es</option>
        <option value="false">Non \xE9quip\xE9es</option>
      </select>

      <!-- Compteur de r\xE9sultats -->
      <div class="flex items-center px-4 py-2 bg-slate-100 rounded-lg text-sm">
        <span class="font-medium text-slate-700">{{ sallesFiltered().length }}</span>
        <span class="text-slate-500 ml-1">salle(s)</span>
      </div>
    </div>
  </div>

  <!-- Grille de cartes -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    @for (salle of sallesFiltered(); track salle.id) {
      <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200">
        <!-- En-t\xEAte de la carte -->
        <div class="p-6 border-b border-slate-100">
          <div class="flex justify-between items-start mb-3">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <h3 class="text-xl font-bold text-slate-800">{{ salle.numeroSalle }}</h3>
                @if (salle.disponible) {
                  <span class="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Disponible
                  </span>
                } @else {
                  <span class="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                    Occup\xE9e
                  </span>
                }
              </div>
              <span
                [class]="getTypeBadgeClass(salle.type)"
                class="px-2 py-1 rounded text-xs font-semibold inline-block"
              >
                {{ salle.type }}
              </span>
            </div>
            @if (isSalleEquipee(salle)) {
              <div class="bg-teal-100 rounded-full p-2">
                <span class="material-icons text-teal-600 text-xl">check_circle</span>
              </div>
            }
          </div>

          <!-- Informations principales -->
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2 text-slate-600">
              <span class="material-icons text-lg">domain</span>
              <span>{{ salle.batiment }} - \xC9tage {{ salle.etage }}</span>
            </div>
            <div class="flex items-center gap-2 text-slate-600">
              <span class="material-icons text-lg">people</span>
              <span>Capacit\xE9: {{ salle.capacite }} places</span>
            </div>
          </div>
        </div>

        <!-- \xC9quipements -->
        <div class="p-4 bg-slate-50">
          @if (isSalleEquipee(salle)) {
            <div class="space-y-3">
              <!-- Mat\xE9riels -->
              @if (salle.materielAffecte && salle.materielAffecte.length > 0) {
                <div>
                  <h4 class="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
                    <span class="material-icons text-sm">inventory</span>
                    Mat\xE9riels ({{ getSalleEquipmentInfo(salle).totalMateriels }})
                  </h4>
                  <div class="space-y-1">
                    @for (ma of salle.materielAffecte; track ma.materielId; let i = $index) {
                      <div class="flex items-center justify-between text-xs bg-white rounded px-2 py-1.5 border border-slate-200">
                        <span class="text-slate-600">{{ getMaterielName(ma.materielId) }}</span>
                        <span class="font-semibold text-teal-700">\xD7{{ ma.quantiteAffectee }}</span>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- \xC9quipements -->
              @if (salle.equipementAffecte && salle.equipementAffecte.length > 0) {
                <div>
                  <h4 class="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
                    <span class="material-icons text-sm">devices</span>
                    \xC9quipements ({{ getSalleEquipmentInfo(salle).totalEquipements }})
                  </h4>
                  <div class="space-y-1">
                    @for (ea of salle.equipementAffecte; track ea.equipementId; let i = $index) {
                      <div class="flex items-center gap-2 text-xs bg-white rounded px-2 py-1.5 border border-slate-200">
                        <span class="material-icons text-xs text-blue-600">check</span>
                        <span class="text-slate-600">{{ getEquipementName(ea.equipementId) }}</span>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="text-center py-4">
              <span class="material-icons text-slate-300 text-3xl mb-1">inventory_2</span>
              <p class="text-xs text-slate-400">Aucun \xE9quipement affect\xE9</p>
            </div>
          }
        </div>

        <!-- Actions -->
        <div class="flex gap-2 p-4 border-t border-slate-200">
          <button
            (click)="toggleDisponibilite(salle)"
            class="flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
            [class.bg-green-100]="!salle.disponible"
            [class.text-green-700]="!salle.disponible"
            [class.hover:bg-green-200]="!salle.disponible"
            [class.bg-slate-100]="salle.disponible"
            [class.text-slate-700]="salle.disponible"
            [class.hover:bg-slate-200]="salle.disponible"
          >
            <span class="material-icons text-sm">
              {{ salle.disponible ? 'lock' : 'lock_open' }}
            </span>
          </button>
          <button
            (click)="openSalleModal(salle)"
            class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
          >
            <span class="material-icons text-sm">edit</span>
            Modifier
          </button>
          <button
            (click)="deleteSalle(salle.id!)"
            class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
          >
            <span class="material-icons text-sm">delete</span>
          </button>
        </div>
      </div>
    } @empty {
      <div class="col-span-3 text-center py-12">
        <span class="material-icons text-6xl text-slate-300 mb-4">meeting_room</span>
        <p class="text-slate-500">Aucune salle pour le moment</p>
        <button
          (click)="openSalleModal()"
          class="mt-4 text-teal-600 hover:text-teal-700 font-medium"
        >
          Ajouter votre premi\xE8re salle
        </button>
      </div>
    }
  </div>
  <!-- Modal Salle -->
  @if (showSalleModal()) {
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- En-t\xEAte du modal -->
        <div class="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 class="text-2xl font-bold text-slate-800">
            {{ editingSalle() ? 'Modifier la salle' : 'Nouvelle salle' }}
          </h2>
          <button
            (click)="closeSalleModal()"
            class="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Formulaire -->
        <form [formGroup]="salleForm" (ngSubmit)="saveSalle()" class="p-6">
          <!-- Informations de base -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-slate-800 mb-4">Informations g\xE9n\xE9rales</h3>
            <div class="space-y-4">
              <!-- Num\xE9ro et Type -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">
                    Num\xE9ro de salle *
                  </label>
                  <input
                    type="text"
                    formControlName="numeroSalle"
                    class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Ex: A101"
                  />
                  @if (salleForm.get('numeroSalle')?.invalid && salleForm.get('numeroSalle')?.touched) {
                    <p class="text-red-600 text-sm mt-1">Le num\xE9ro est requis (min. 2 caract\xE8res)</p>
                  }
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">
                    Type *
                  </label>
                  <select
                    formControlName="type"
                    class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    @for (type of typesSalle; track $index) {
                      <option [value]="type">{{ type }}</option>
                    }
                  </select>
                </div>
              </div>

              <!-- B\xE2timent, \xC9tage et Capacit\xE9 -->
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">
                    B\xE2timent *
                  </label>
                  <input
                    type="text"
                    formControlName="batiment"
                    class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Ex: B\xE2timent A"
                  />
                  @if (salleForm.get('batiment')?.invalid && salleForm.get('batiment')?.touched) {
                    <p class="text-red-600 text-sm mt-1">Le b\xE2timent est requis</p>
                  }
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">
                    \xC9tage *
                  </label>
                  <input
                    type="number"
                    formControlName="etage"
                    class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">
                    Capacit\xE9 *
                  </label>
                  <input
                    type="number"
                    formControlName="capacite"
                    class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Ex: 30"
                    min="1"
                  />
                  @if (salleForm.get('capacite')?.invalid && salleForm.get('capacite')?.touched) {
                    <p class="text-red-600 text-sm mt-1">La capacit\xE9 doit \xEAtre au minimum 1</p>
                  }
                </div>
              </div>

              <!-- \xC9cole -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  \xC9cole *
                </label>
                <select
                  formControlName="ecoleId"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">S\xE9lectionnez une \xE9cole</option>
                  @for (ecole of ecoles(); track ecole.id) {
                    <option [value]="ecole.id">{{ ecole.nom }}</option>
                  }
                </select>
                @if (salleForm.get('ecoleId')?.invalid && salleForm.get('ecoleId')?.touched) {
                  <p class="text-red-600 text-sm mt-1">Veuillez s\xE9lectionner une \xE9cole</p>
                }
              </div>

              <!-- Disponibilit\xE9 -->
              <div class="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <input
                  type="checkbox"
                  formControlName="disponible"
                  id="disponible"
                  class="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
                <label for="disponible" class="flex-1 cursor-pointer">
                  <div class="font-medium text-slate-800">Salle disponible</div>
                  <div class="text-xs text-slate-500">La salle peut \xEAtre utilis\xE9e pour des cours</div>
                </label>
              </div>
            </div>
          </div>

          <!-- Mat\xE9riels affect\xE9s -->
          <div class="mb-6">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-lg font-semibold text-slate-800">Mat\xE9riels affect\xE9s</h3>
              <button
                type="button"
                (click)="addMaterielAffecte()"
                class="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
              >
                <span class="material-icons text-sm">add_circle</span>
                Ajouter un mat\xE9riel
              </button>
            </div>

            @if (materielAffecteArray.length === 0) {
              <div class="text-center py-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                <span class="material-icons text-slate-300 text-4xl mb-2">inventory_2</span>
                <p class="text-sm text-slate-500">Aucun mat\xE9riel affect\xE9</p>
                <p class="text-xs text-slate-400 mt-1">Cliquez sur "Ajouter un mat\xE9riel" pour commencer</p>
              </div>
            } @else {
              <div class="space-y-3" formArrayName="materielAffecte">
                @for (materielControl of materielAffecteArray.controls; track i; let i = $index) {
                  <div [formGroupName]="i" class="flex gap-3 items-start bg-slate-50 p-3 rounded-lg">
                    <!-- S\xE9lection mat\xE9riel -->
                    <div class="flex-1">
                      <select
                        formControlName="materielId"
                        class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
                        <option value="">S\xE9lectionnez un mat\xE9riel</option>
                        @for (materiel of materiels(); track materiel.id; let i = $index) {
                          <option [value]="materiel.id">
                            {{ materiel.nom }} - Dispo: {{ getQuantiteDisponible(materiel.id!) }}
                          </option>
                        }
                      </select>
                    </div>

                    <!-- Quantit\xE9 -->
                    <div class="w-24">
                      <input
                        type="number"
                        formControlName="quantiteAffectee"
                        class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Qt\xE9"
                        min="1"
                      />
                    </div>

                    <!-- Date -->
                    <div class="w-36">
                      <input
                        type="date"
                        formControlName="dateAffectation"
                        class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>

                    <!-- Bouton supprimer -->
                    <button
                      type="button"
                      (click)="removeMaterielAffecte(i)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <span class="material-icons text-sm">delete</span>
                    </button>
                  </div>
                }
              </div>
            }
          </div>

          <!-- \xC9quipements affect\xE9s -->
          <div class="mb-6">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-lg font-semibold text-slate-800">\xC9quipements affect\xE9s</h3>
              <button
                type="button"
                (click)="addEquipementAffecte()"
                class="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
              >
                <span class="material-icons text-sm">add_circle</span>
                Ajouter un \xE9quipement
              </button>
            </div>

            @if (equipementAffecteArray.length === 0) {
              <div class="text-center py-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                <span class="material-icons text-slate-300 text-4xl mb-2">devices</span>
                <p class="text-sm text-slate-500">Aucun \xE9quipement affect\xE9</p>
                <p class="text-xs text-slate-400 mt-1">Cliquez sur "Ajouter un \xE9quipement" pour commencer</p>
              </div>
            } @else {
              <div class="space-y-3" formArrayName="equipementAffecte">
                @for (equipementControl of equipementAffecteArray.controls; track i; let i = $index) {
                  <div [formGroupName]="i" class="flex gap-3 items-start bg-slate-50 p-3 rounded-lg">
                    <!-- S\xE9lection \xE9quipement -->
                    <div class="flex-1">
                      <select
                        formControlName="equipementId"
                        class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
                        <option value="">S\xE9lectionnez un \xE9quipement</option>
                        @for (equipement of equipements(); track equipement.id; let i = $index) {
                          <option [value]="equipement.id">
                            {{ equipement.nom }}
                            @if (!isEquipementDisponible(equipement.id!)) {
                              (D\xE9j\xE0 affect\xE9)
                            }
                          </option>
                        }
                      </select>
                    </div>

                    <!-- Date -->
                    <div class="w-36">
                      <input
                        type="date"
                        formControlName="dateAffectation"
                        class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>

                    <!-- Bouton supprimer -->
                    <button
                      type="button"
                      (click)="removeEquipementAffecte(i)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <span class="material-icons text-sm">delete</span>
                    </button>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              (click)="closeSalleModal()"
              class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              [disabled]="salleForm.invalid"
              [class.opacity-50]="salleForm.invalid"
              [class.cursor-not-allowed]="salleForm.invalid"
              class="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:hover:bg-teal-600"
            >
              {{ editingSalle() ? 'Enregistrer' : 'Cr\xE9er' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  }
</div>
`, styles: ["/* src/app/features/admin/room/room.component.scss */\n.line-clamp-2 {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n.modal-overlay {\n  animation: fadeIn 0.2s ease-in-out;\n}\n.modal-content {\n  animation: slideUp 0.3s ease-out;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes slideUp {\n  from {\n    transform: translateY(20px);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0);\n    opacity: 1;\n  }\n}\n.room-card {\n  transition: all 0.3s ease;\n}\n.room-card:hover {\n  transform: translateY(-2px);\n}\n/*# sourceMappingURL=room.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RoomComponent, { className: "RoomComponent", filePath: "src/app/features/admin/room/room.component.ts", lineNumber: 27 });
})();
export {
  RoomComponent
};
//# sourceMappingURL=chunk-6PWYGVNM.js.map
