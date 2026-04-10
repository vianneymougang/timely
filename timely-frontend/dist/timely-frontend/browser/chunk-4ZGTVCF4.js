import {
  EquipementService,
  MaterielService
} from "./chunk-RVFBKUYY.js";
import "./chunk-M2M2Z2ZK.js";
import {
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
  Component,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate3
} from "./chunk-DBHCOGA3.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/core/models/resource.model.ts
var ETATS_RESOURCE = [
  "Excellent",
  "Bon",
  "Moyen",
  "Mauvais",
  "Hors service"
];

// src/app/features/admin/ressources/ressources.component.ts
var _forTrack0 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.materielId;
function RessourcesComponent_Conditional_17_For_12_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const materiel_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(materiel_r5.description);
  }
}
function RessourcesComponent_Conditional_17_For_12_Template(rf, ctx) {
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
    \u0275\u0275conditionalCreate(9, RessourcesComponent_Conditional_17_For_12_Conditional_9_Template, 2, 1, "p", 21);
    \u0275\u0275elementStart(10, "div", 22)(11, "div", 23)(12, "div", 24)(13, "div", 25);
    \u0275\u0275text(14, "Quantit\xE9 totale");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 26);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 27)(18, "div", 28);
    \u0275\u0275text(19, "Disponible");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 29);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(22, "div", 30)(23, "button", 31);
    \u0275\u0275listener("click", function RessourcesComponent_Conditional_17_For_12_Template_button_click_23_listener() {
      const materiel_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openMaterielModal(materiel_r5));
    });
    \u0275\u0275elementStart(24, "span", 32);
    \u0275\u0275text(25, "edit");
    \u0275\u0275elementEnd();
    \u0275\u0275text(26, " Modifier ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "button", 33);
    \u0275\u0275listener("click", function RessourcesComponent_Conditional_17_For_12_Template_button_click_27_listener() {
      const materiel_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteMateriel(materiel_r5.id));
    });
    \u0275\u0275elementStart(28, "span", 32);
    \u0275\u0275text(29, "delete");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const materiel_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(materiel_r5.nom);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(materiel_r5.type);
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r1.getEtatBadgeClass(materiel_r5.etat));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", materiel_r5.etat, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(materiel_r5.description ? 9 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(materiel_r5.quantite);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.getQuantiteDisponible(materiel_r5.id));
  }
}
function RessourcesComponent_Conditional_17_ForEmpty_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "span", 34);
    \u0275\u0275text(2, "inventory");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 35);
    \u0275\u0275text(4, "Aucun mat\xE9riel pour le moment");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 36);
    \u0275\u0275listener("click", function RessourcesComponent_Conditional_17_ForEmpty_13_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openMaterielModal());
    });
    \u0275\u0275text(6, " Ajouter votre premier mat\xE9riel ");
    \u0275\u0275elementEnd()();
  }
}
function RessourcesComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 9)(2, "div", 3)(3, "span", 10);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " mat\xE9riels au total ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 11);
    \u0275\u0275listener("click", function RessourcesComponent_Conditional_17_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openMaterielModal());
    });
    \u0275\u0275elementStart(7, "span", 12);
    \u0275\u0275text(8, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(9, " Nouveau mat\xE9riel ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 13);
    \u0275\u0275repeaterCreate(11, RessourcesComponent_Conditional_17_For_12_Template, 30, 8, "div", 14, _forTrack0, false, RessourcesComponent_Conditional_17_ForEmpty_13_Template, 7, 0, "div", 15);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.materiels().length);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r1.materiels());
  }
}
function RessourcesComponent_Conditional_18_For_12_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const equipement_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(equipement_r9.description);
  }
}
function RessourcesComponent_Conditional_18_For_12_Conditional_10_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41)(1, "span", 3);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 42);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ma_r10 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getMaterielName(ma_r10.materielId));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("\xD7", ma_r10.quantiteAffectee);
  }
}
function RessourcesComponent_Conditional_18_For_12_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 37)(1, "h4", 39)(2, "span", 32);
    \u0275\u0275text(3, "build");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Mat\xE9riels inclus ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 40);
    \u0275\u0275repeaterCreate(6, RessourcesComponent_Conditional_18_For_12_Conditional_10_For_7_Template, 5, 2, "div", 41, _forTrack1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const equipement_r9 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r1.getMaterielsAffectes(equipement_r9));
  }
}
function RessourcesComponent_Conditional_18_For_12_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38);
    \u0275\u0275text(1, " Aucun mat\xE9riel affect\xE9 ");
    \u0275\u0275elementEnd();
  }
}
function RessourcesComponent_Conditional_18_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 14)(1, "div", 16)(2, "div", 17)(3, "h3", 18);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 19);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "span", 20);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(9, RessourcesComponent_Conditional_18_For_12_Conditional_9_Template, 2, 1, "p", 21);
    \u0275\u0275conditionalCreate(10, RessourcesComponent_Conditional_18_For_12_Conditional_10_Template, 8, 0, "div", 37)(11, RessourcesComponent_Conditional_18_For_12_Conditional_11_Template, 2, 0, "div", 38);
    \u0275\u0275elementStart(12, "div", 30)(13, "button", 31);
    \u0275\u0275listener("click", function RessourcesComponent_Conditional_18_For_12_Template_button_click_13_listener() {
      const equipement_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openEquipementModal(equipement_r9));
    });
    \u0275\u0275elementStart(14, "span", 32);
    \u0275\u0275text(15, "edit");
    \u0275\u0275elementEnd();
    \u0275\u0275text(16, " Modifier ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "button", 33);
    \u0275\u0275listener("click", function RessourcesComponent_Conditional_18_For_12_Template_button_click_17_listener() {
      const equipement_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteEquipement(equipement_r9.id));
    });
    \u0275\u0275elementStart(18, "span", 32);
    \u0275\u0275text(19, "delete");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const equipement_r9 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(equipement_r9.nom);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(equipement_r9.type);
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r1.getEtatBadgeClass(equipement_r9.etat));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", equipement_r9.etat, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(equipement_r9.description ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.getMaterielsAffectes(equipement_r9).length > 0 ? 10 : 11);
  }
}
function RessourcesComponent_Conditional_18_ForEmpty_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "span", 34);
    \u0275\u0275text(2, "devices");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 35);
    \u0275\u0275text(4, "Aucun \xE9quipement pour le moment");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 36);
    \u0275\u0275listener("click", function RessourcesComponent_Conditional_18_ForEmpty_13_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openEquipementModal());
    });
    \u0275\u0275text(6, " Ajouter votre premier \xE9quipement ");
    \u0275\u0275elementEnd()();
  }
}
function RessourcesComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 9)(2, "div", 3)(3, "span", 10);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " \xE9quipements au total ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 11);
    \u0275\u0275listener("click", function RessourcesComponent_Conditional_18_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openEquipementModal());
    });
    \u0275\u0275elementStart(7, "span", 12);
    \u0275\u0275text(8, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(9, " Nouvel \xE9quipement ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 13);
    \u0275\u0275repeaterCreate(11, RessourcesComponent_Conditional_18_For_12_Template, 20, 7, "div", 14, _forTrack0, false, RessourcesComponent_Conditional_18_ForEmpty_13_Template, 7, 0, "div", 15);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.equipements().length);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r1.equipements());
  }
}
function RessourcesComponent_Conditional_19_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 51);
    \u0275\u0275text(1, "Le nom est requis (min. 3 caract\xE8res)");
    \u0275\u0275elementEnd();
  }
}
function RessourcesComponent_Conditional_19_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 51);
    \u0275\u0275text(1, "Le type est requis");
    \u0275\u0275elementEnd();
  }
}
function RessourcesComponent_Conditional_19_For_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 55);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const etat_r12 = ctx.$implicit;
    \u0275\u0275property("value", etat_r12);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(etat_r12);
  }
}
function RessourcesComponent_Conditional_19_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 51);
    \u0275\u0275text(1, "La quantit\xE9 doit \xEAtre au minimum 1");
    \u0275\u0275elementEnd();
  }
}
function RessourcesComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 43)(2, "div", 44)(3, "h2", 45);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 46);
    \u0275\u0275listener("click", function RessourcesComponent_Conditional_19_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeMaterielModal());
    });
    \u0275\u0275elementStart(6, "span", 12);
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "form", 47);
    \u0275\u0275listener("ngSubmit", function RessourcesComponent_Conditional_19_Template_form_ngSubmit_8_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveMateriel());
    });
    \u0275\u0275elementStart(9, "div", 48)(10, "div")(11, "label", 49);
    \u0275\u0275text(12, " Nom du mat\xE9riel * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "input", 50);
    \u0275\u0275conditionalCreate(14, RessourcesComponent_Conditional_19_Conditional_14_Template, 2, 0, "p", 51);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 52)(16, "div")(17, "label", 49);
    \u0275\u0275text(18, " Type * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(19, "input", 53);
    \u0275\u0275conditionalCreate(20, RessourcesComponent_Conditional_19_Conditional_20_Template, 2, 0, "p", 51);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div")(22, "label", 49);
    \u0275\u0275text(23, " \xC9tat * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "select", 54);
    \u0275\u0275repeaterCreate(25, RessourcesComponent_Conditional_19_For_26_Template, 2, 2, "option", 55, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(27, "div")(28, "label", 49);
    \u0275\u0275text(29, " Quantit\xE9 * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(30, "input", 56);
    \u0275\u0275conditionalCreate(31, RessourcesComponent_Conditional_19_Conditional_31_Template, 2, 0, "p", 51);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "div")(33, "label", 49);
    \u0275\u0275text(34, " Description ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(35, "textarea", 57);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "div", 58)(37, "button", 59);
    \u0275\u0275listener("click", function RessourcesComponent_Conditional_19_Template_button_click_37_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeMaterielModal());
    });
    \u0275\u0275text(38, " Annuler ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "button", 60);
    \u0275\u0275text(40);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    let tmp_6_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.editingMateriel() ? "Modifier le mat\xE9riel" : "Nouveau mat\xE9riel", " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("formGroup", ctx_r1.materielForm);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(((tmp_3_0 = ctx_r1.materielForm.get("nom")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx_r1.materielForm.get("nom")) == null ? null : tmp_3_0.touched) ? 14 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(((tmp_4_0 = ctx_r1.materielForm.get("type")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx_r1.materielForm.get("type")) == null ? null : tmp_4_0.touched) ? 20 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r1.etats);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(((tmp_6_0 = ctx_r1.materielForm.get("quantite")) == null ? null : tmp_6_0.invalid) && ((tmp_6_0 = ctx_r1.materielForm.get("quantite")) == null ? null : tmp_6_0.touched) ? 31 : -1);
    \u0275\u0275advance(8);
    \u0275\u0275classProp("opacity-50", ctx_r1.materielForm.invalid)("cursor-not-allowed", ctx_r1.materielForm.invalid);
    \u0275\u0275property("disabled", ctx_r1.materielForm.invalid);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.editingMateriel() ? "Enregistrer" : "Cr\xE9er", " ");
  }
}
function RessourcesComponent_Conditional_20_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 51);
    \u0275\u0275text(1, "Le nom est requis (min. 3 caract\xE8res)");
    \u0275\u0275elementEnd();
  }
}
function RessourcesComponent_Conditional_20_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 51);
    \u0275\u0275text(1, "Le type est requis");
    \u0275\u0275elementEnd();
  }
}
function RessourcesComponent_Conditional_20_For_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 55);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const etat_r14 = ctx.$implicit;
    \u0275\u0275property("value", etat_r14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(etat_r14);
  }
}
function RessourcesComponent_Conditional_20_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 68)(1, "span", 71);
    \u0275\u0275text(2, "inventory_2");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 19);
    \u0275\u0275text(4, "Aucun mat\xE9riel affect\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 72);
    \u0275\u0275text(6, 'Cliquez sur "Ajouter un mat\xE9riel" pour commencer');
    \u0275\u0275elementEnd()();
  }
}
function RessourcesComponent_Conditional_20_Conditional_40_For_2_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 55);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const materiel_r16 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275property("value", materiel_r16.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" ", materiel_r16.nom, " (", materiel_r16.type, ") - Disponible: ", ctx_r1.getQuantiteDisponible(materiel_r16.id), " ");
  }
}
function RessourcesComponent_Conditional_20_Conditional_40_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 73)(1, "div", 17)(2, "select", 74)(3, "option", 75);
    \u0275\u0275text(4, "S\xE9lectionnez un mat\xE9riel");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(5, RessourcesComponent_Conditional_20_Conditional_40_For_2_For_6_Template, 2, 4, "option", 55, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 76);
    \u0275\u0275element(8, "input", 77);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "button", 78);
    \u0275\u0275listener("click", function RessourcesComponent_Conditional_20_Conditional_40_For_2_Template_button_click_9_listener() {
      const \u0275$index_370_r17 = \u0275\u0275restoreView(_r15).$index;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.removeMaterielAffecte(\u0275$index_370_r17));
    });
    \u0275\u0275elementStart(10, "span", 32);
    \u0275\u0275text(11, "delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const \u0275$index_370_r17 = ctx.$index;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("formGroupName", \u0275$index_370_r17);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r1.materiels());
  }
}
function RessourcesComponent_Conditional_20_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 69);
    \u0275\u0275repeaterCreate(1, RessourcesComponent_Conditional_20_Conditional_40_For_2_Template, 12, 1, "div", 73, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.materielsAffectesArray.controls);
  }
}
function RessourcesComponent_Conditional_20_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 70)(1, "span", 79);
    \u0275\u0275text(2, "info");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Assurez-vous que les quantit\xE9s ne d\xE9passent pas les stocks disponibles ");
    \u0275\u0275elementEnd();
  }
}
function RessourcesComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 61)(2, "div", 44)(3, "h2", 45);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 46);
    \u0275\u0275listener("click", function RessourcesComponent_Conditional_20_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeEquipementModal());
    });
    \u0275\u0275elementStart(6, "span", 12);
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "form", 47);
    \u0275\u0275listener("ngSubmit", function RessourcesComponent_Conditional_20_Template_form_ngSubmit_8_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveEquipement());
    });
    \u0275\u0275elementStart(9, "div", 48)(10, "div")(11, "label", 49);
    \u0275\u0275text(12, " Nom de l'\xE9quipement * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "input", 62);
    \u0275\u0275conditionalCreate(14, RessourcesComponent_Conditional_20_Conditional_14_Template, 2, 0, "p", 51);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 52)(16, "div")(17, "label", 49);
    \u0275\u0275text(18, " Type * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(19, "input", 63);
    \u0275\u0275conditionalCreate(20, RessourcesComponent_Conditional_20_Conditional_20_Template, 2, 0, "p", 51);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div")(22, "label", 49);
    \u0275\u0275text(23, " \xC9tat * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "select", 54);
    \u0275\u0275repeaterCreate(25, RessourcesComponent_Conditional_20_For_26_Template, 2, 2, "option", 55, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(27, "div")(28, "label", 49);
    \u0275\u0275text(29, " Description ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(30, "textarea", 64);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div")(32, "div", 65)(33, "label", 66);
    \u0275\u0275text(34, " Mat\xE9riels affect\xE9s ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "button", 67);
    \u0275\u0275listener("click", function RessourcesComponent_Conditional_20_Template_button_click_35_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addMaterielAffecte());
    });
    \u0275\u0275elementStart(36, "span", 32);
    \u0275\u0275text(37, "add_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275text(38, " Ajouter un mat\xE9riel ");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(39, RessourcesComponent_Conditional_20_Conditional_39_Template, 7, 0, "div", 68)(40, RessourcesComponent_Conditional_20_Conditional_40_Template, 3, 0, "div", 69);
    \u0275\u0275conditionalCreate(41, RessourcesComponent_Conditional_20_Conditional_41_Template, 4, 0, "p", 70);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "div", 58)(43, "button", 59);
    \u0275\u0275listener("click", function RessourcesComponent_Conditional_20_Template_button_click_43_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeEquipementModal());
    });
    \u0275\u0275text(44, " Annuler ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "button", 60);
    \u0275\u0275text(46);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.editingEquipement() ? "Modifier l'\xE9quipement" : "Nouvel \xE9quipement", " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("formGroup", ctx_r1.equipementForm);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(((tmp_3_0 = ctx_r1.equipementForm.get("nom")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx_r1.equipementForm.get("nom")) == null ? null : tmp_3_0.touched) ? 14 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(((tmp_4_0 = ctx_r1.equipementForm.get("type")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx_r1.equipementForm.get("type")) == null ? null : tmp_4_0.touched) ? 20 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r1.etats);
    \u0275\u0275advance(14);
    \u0275\u0275conditional(ctx_r1.materielsAffectesArray.length === 0 ? 39 : 40);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.materielsAffectesArray.length > 0 ? 41 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("opacity-50", ctx_r1.equipementForm.invalid)("cursor-not-allowed", ctx_r1.equipementForm.invalid);
    \u0275\u0275property("disabled", ctx_r1.equipementForm.invalid);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.editingEquipement() ? "Enregistrer" : "Cr\xE9er", " ");
  }
}
var RessourcesComponent = class _RessourcesComponent {
  materielService = inject(MaterielService);
  equipementService = inject(EquipementService);
  fb = inject(FormBuilder);
  // Signaux pour les données
  materiels = signal([], ...ngDevMode ? [{ debugName: "materiels" }] : []);
  equipements = signal([], ...ngDevMode ? [{ debugName: "equipements" }] : []);
  // Section active (materiel ou equipement)
  activeSection = signal("materiel", ...ngDevMode ? [{ debugName: "activeSection" }] : []);
  // Modals
  showMaterielModal = signal(false, ...ngDevMode ? [{ debugName: "showMaterielModal" }] : []);
  showEquipementModal = signal(false, ...ngDevMode ? [{ debugName: "showEquipementModal" }] : []);
  // Mode édition
  editingMateriel = signal(null, ...ngDevMode ? [{ debugName: "editingMateriel" }] : []);
  editingEquipement = signal(null, ...ngDevMode ? [{ debugName: "editingEquipement" }] : []);
  // Formulaires
  materielForm;
  equipementForm;
  // États disponibles
  etats = ETATS_RESOURCE;
  ngOnInit() {
    this.initForms();
    this.loadData();
  }
  initForms() {
    this.materielForm = this.fb.group({
      nom: ["", [Validators.required, Validators.minLength(3)]],
      type: ["", [Validators.required, Validators.minLength(2)]],
      etat: ["Bon", Validators.required],
      quantite: [1, [Validators.required, Validators.min(1)]],
      description: [""]
    });
    this.equipementForm = this.fb.group({
      nom: ["", [Validators.required, Validators.minLength(3)]],
      type: ["", [Validators.required, Validators.minLength(2)]],
      etat: ["Bon", Validators.required],
      description: [""],
      materielsAffectes: this.fb.array([])
    });
  }
  loadData() {
    this.materielService.getMateriels().subscribe((data) => this.materiels.set(data));
    this.equipementService.getEquipements().subscribe((data) => this.equipements.set(data));
  }
  // Gestion des sections
  setActiveSection(section) {
    this.activeSection.set(section);
  }
  // Gestion des matériels
  openMaterielModal(materiel) {
    if (materiel) {
      this.editingMateriel.set(materiel);
      this.materielForm.patchValue({
        nom: materiel.nom,
        type: materiel.type,
        etat: materiel.etat,
        quantite: materiel.quantite,
        description: materiel.description || ""
      });
    } else {
      this.editingMateriel.set(null);
      this.materielForm.reset({ etat: "Bon", quantite: 1 });
    }
    this.showMaterielModal.set(true);
  }
  closeMaterielModal() {
    this.showMaterielModal.set(false);
    this.editingMateriel.set(null);
    this.materielForm.reset();
  }
  saveMateriel() {
    if (this.materielForm.invalid)
      return;
    const materielData = this.materielForm.value;
    if (this.editingMateriel()) {
      this.materielService.updateMateriel(__spreadValues({
        id: this.editingMateriel().id
      }, materielData)).subscribe(() => {
        this.closeMaterielModal();
        this.loadData();
      });
    } else {
      this.materielService.createMateriel(materielData).subscribe(() => {
        this.closeMaterielModal();
        this.loadData();
      });
    }
  }
  deleteMateriel(id) {
    if (confirm("\xCAtes-vous s\xFBr de vouloir supprimer ce mat\xE9riel ?")) {
      this.materielService.deleteMateriel(id).subscribe(() => {
        this.loadData();
      });
    }
  }
  // Gestion des équipements
  get materielsAffectesArray() {
    return this.equipementForm.get("materielsAffectes");
  }
  addMaterielAffecte() {
    const materielGroup = this.fb.group({
      materielId: ["", Validators.required],
      quantiteAffectee: [1, [Validators.required, Validators.min(1)]]
    });
    this.materielsAffectesArray.push(materielGroup);
  }
  removeMaterielAffecte(index) {
    this.materielsAffectesArray.removeAt(index);
  }
  openEquipementModal(equipement) {
    if (equipement) {
      this.editingEquipement.set(equipement);
      this.equipementForm.patchValue({
        nom: equipement.nom,
        type: equipement.type,
        etat: equipement.etat,
        description: equipement.description || ""
      });
      this.materielsAffectesArray.clear();
      if (equipement.materielsAffectes && equipement.materielsAffectes.length > 0) {
        equipement.materielsAffectes.forEach((ma) => {
          const materielGroup = this.fb.group({
            materielId: [ma.materielId, Validators.required],
            quantiteAffectee: [ma.quantiteAffectee, [Validators.required, Validators.min(1)]]
          });
          this.materielsAffectesArray.push(materielGroup);
        });
      }
    } else {
      this.editingEquipement.set(null);
      this.equipementForm.reset({ etat: "Bon" });
      this.materielsAffectesArray.clear();
    }
    this.showEquipementModal.set(true);
  }
  closeEquipementModal() {
    this.showEquipementModal.set(false);
    this.editingEquipement.set(null);
    this.equipementForm.reset();
    this.materielsAffectesArray.clear();
  }
  saveEquipement() {
    if (this.equipementForm.invalid)
      return;
    const equipementData = __spreadProps(__spreadValues({}, this.equipementForm.value), {
      materielsAffectes: this.materielsAffectesArray.value.filter((ma) => ma.materielId)
    });
    if (this.editingEquipement()) {
      this.equipementService.updateEquipement(__spreadValues({
        id: this.editingEquipement().id
      }, equipementData)).subscribe(() => {
        this.closeEquipementModal();
        this.loadData();
      });
    } else {
      this.equipementService.createEquipement(equipementData).subscribe(() => {
        this.closeEquipementModal();
        this.loadData();
      });
    }
  }
  deleteEquipement(id) {
    if (confirm("\xCAtes-vous s\xFBr de vouloir supprimer cet \xE9quipement ?")) {
      this.equipementService.deleteEquipement(id).subscribe(() => {
        this.loadData();
      });
    }
  }
  // Helpers
  getEtatBadgeClass(etat) {
    switch (etat) {
      case "Excellent":
        return "bg-green-100 text-green-700";
      case "Bon":
        return "bg-blue-100 text-blue-700";
      case "Moyen":
        return "bg-yellow-100 text-yellow-700";
      case "Mauvais":
        return "bg-orange-100 text-orange-700";
      case "Hors service":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  }
  getMaterielName(materielId) {
    const materiel = this.materiels().find((m) => m.id === materielId);
    return materiel ? materiel.nom : "Mat\xE9riel inconnu";
  }
  getMaterielsAffectes(equipement) {
    return equipement.materielsAffectes || [];
  }
  getQuantiteDisponible(materielId) {
    const materiel = this.materiels().find((m) => m.id === materielId);
    if (!materiel)
      return 0;
    let quantiteAffectee = 0;
    this.equipements().forEach((eq) => {
      if (eq.materielsAffectes) {
        const affectation = eq.materielsAffectes.find((ma) => ma.materielId === materielId);
        if (affectation) {
          quantiteAffectee += affectation.quantiteAffectee;
        }
      }
    });
    return materiel.quantite - quantiteAffectee;
  }
  static \u0275fac = function RessourcesComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RessourcesComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RessourcesComponent, selectors: [["app-ressources"]], decls: 21, vars: 18, consts: [[1, "p-8", "max-w-7xl", "mx-auto"], [1, "mb-8"], [1, "text-3xl", "font-bold", "text-slate-800", "mb-2"], [1, "text-slate-600"], [1, "flex", "gap-4", "mb-6", "border-b", "border-slate-200"], [1, "pb-3", "px-4", "font-medium", "border-b-2", "transition-colors", "hover:text-teal-600", 3, "click"], [1, "flex", "items-center", "gap-2"], [1, "material-icons", "text-xl"], [1, "fixed", "inset-0", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center", "z-50"], [1, "mb-6", "flex", "justify-between", "items-center"], [1, "font-medium"], [1, "bg-teal-600", "hover:bg-teal-700", "text-white", "px-4", "py-2", "rounded-lg", "flex", "items-center", "gap-2", "transition-colors", 3, "click"], [1, "material-icons"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-6"], [1, "bg-white", "rounded-lg", "shadow-md", "hover:shadow-lg", "transition-shadow", "p-6", "border", "border-slate-200"], [1, "col-span-3", "text-center", "py-12"], [1, "flex", "justify-between", "items-start", "mb-4"], [1, "flex-1"], [1, "text-lg", "font-semibold", "text-slate-800", "mb-1"], [1, "text-sm", "text-slate-500"], [1, "px-2", "py-1", "rounded", "text-xs", "font-semibold", "whitespace-nowrap"], [1, "text-sm", "text-slate-600", "mb-4", "line-clamp-2"], [1, "space-y-2", "mb-4"], [1, "flex", "items-center", "gap-2", "text-sm"], [1, "bg-teal-50", "rounded-lg", "p-3", "flex-1"], [1, "text-xs", "text-teal-600", "font-medium", "mb-1"], [1, "text-2xl", "font-bold", "text-teal-700"], [1, "bg-blue-50", "rounded-lg", "p-3", "flex-1"], [1, "text-xs", "text-blue-600", "font-medium", "mb-1"], [1, "text-2xl", "font-bold", "text-blue-700"], [1, "flex", "gap-2", "pt-4", "border-t", "border-slate-200"], [1, "flex-1", "bg-slate-100", "hover:bg-slate-200", "text-slate-700", "px-3", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors", "flex", "items-center", "justify-center", "gap-1", 3, "click"], [1, "material-icons", "text-sm"], [1, "bg-red-50", "hover:bg-red-100", "text-red-600", "px-3", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors", "flex", "items-center", "justify-center", 3, "click"], [1, "material-icons", "text-6xl", "text-slate-300", "mb-4"], [1, "text-slate-500"], [1, "mt-4", "text-teal-600", "hover:text-teal-700", "font-medium", 3, "click"], [1, "mb-4"], [1, "mb-4", "h-16", "flex", "items-center", "justify-center", "text-xs", "text-slate-400"], [1, "text-xs", "font-semibold", "text-slate-700", "mb-2", "flex", "items-center", "gap-1"], [1, "space-y-1"], [1, "flex", "items-center", "justify-between", "text-xs", "bg-slate-50", "rounded", "px-2", "py-1"], [1, "font-semibold", "text-slate-700"], [1, "bg-white", "rounded-lg", "shadow-xl", "max-w-2xl", "w-full", "mx-4", "max-h-[90vh]", "overflow-y-auto"], [1, "flex", "justify-between", "items-center", "p-6", "border-b", "border-slate-200"], [1, "text-2xl", "font-bold", "text-slate-800"], [1, "text-slate-400", "hover:text-slate-600", "transition-colors", 3, "click"], [1, "p-6", 3, "ngSubmit", "formGroup"], [1, "space-y-4"], [1, "block", "text-sm", "font-medium", "text-slate-700", "mb-1"], ["type", "text", "formControlName", "nom", "placeholder", "Ex: Chaises ergonomiques", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], [1, "text-red-600", "text-sm", "mt-1"], [1, "grid", "grid-cols-2", "gap-4"], ["type", "text", "formControlName", "type", "placeholder", "Ex: Mobilier", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["formControlName", "etat", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], [3, "value"], ["type", "number", "formControlName", "quantite", "placeholder", "Ex: 50", "min", "1", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["formControlName", "description", "rows", "3", "placeholder", "Description optionnelle du mat\xE9riel...", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent", "resize-none"], [1, "flex", "gap-3", "mt-6", "pt-6", "border-t", "border-slate-200"], ["type", "button", 1, "flex-1", "px-4", "py-2", "border", "border-slate-300", "text-slate-700", "rounded-lg", "hover:bg-slate-50", "transition-colors", 3, "click"], ["type", "submit", 1, "flex-1", "px-4", "py-2", "bg-teal-600", "text-white", "rounded-lg", "hover:bg-teal-700", "transition-colors", "disabled:hover:bg-teal-600", 3, "disabled"], [1, "bg-white", "rounded-lg", "shadow-xl", "max-w-3xl", "w-full", "mx-4", "max-h-[90vh]", "overflow-y-auto"], ["type", "text", "formControlName", "nom", "placeholder", "Ex: Projecteur HD", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["type", "text", "formControlName", "type", "placeholder", "Ex: Audiovisuel", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["formControlName", "description", "rows", "3", "placeholder", "Description optionnelle de l'\xE9quipement...", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent", "resize-none"], [1, "flex", "justify-between", "items-center", "mb-3"], [1, "block", "text-sm", "font-medium", "text-slate-700"], ["type", "button", 1, "text-teal-600", "hover:text-teal-700", "text-sm", "font-medium", "flex", "items-center", "gap-1", 3, "click"], [1, "text-center", "py-6", "bg-slate-50", "rounded-lg", "border-2", "border-dashed", "border-slate-200"], ["formArrayName", "materielsAffectes", 1, "space-y-3"], [1, "text-xs", "text-slate-500", "mt-2"], [1, "material-icons", "text-slate-300", "text-4xl", "mb-2"], [1, "text-xs", "text-slate-400", "mt-1"], [1, "flex", "gap-3", "items-start", "bg-slate-50", "p-3", "rounded-lg", 3, "formGroupName"], ["formControlName", "materielId", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "rounded-lg", "text-sm", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["value", ""], [1, "w-24"], ["type", "number", "formControlName", "quantiteAffectee", "placeholder", "Qt\xE9", "min", "1", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "rounded-lg", "text-sm", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["type", "button", 1, "p-2", "text-red-600", "hover:bg-red-50", "rounded-lg", "transition-colors", 3, "click"], [1, "material-icons", "text-xs", "align-middle"]], template: function RessourcesComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
      \u0275\u0275text(3, "Gestion des Ressources");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "G\xE9rez les mat\xE9riels et \xE9quipements de l'\xE9tablissement");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "button", 5);
      \u0275\u0275listener("click", function RessourcesComponent_Template_button_click_7_listener() {
        return ctx.setActiveSection("materiel");
      });
      \u0275\u0275elementStart(8, "span", 6)(9, "span", 7);
      \u0275\u0275text(10, "inventory");
      \u0275\u0275elementEnd();
      \u0275\u0275text(11);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(12, "button", 5);
      \u0275\u0275listener("click", function RessourcesComponent_Template_button_click_12_listener() {
        return ctx.setActiveSection("equipement");
      });
      \u0275\u0275elementStart(13, "span", 6)(14, "span", 7);
      \u0275\u0275text(15, "devices");
      \u0275\u0275elementEnd();
      \u0275\u0275text(16);
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(17, RessourcesComponent_Conditional_17_Template, 14, 2, "div");
      \u0275\u0275conditionalCreate(18, RessourcesComponent_Conditional_18_Template, 14, 2, "div");
      \u0275\u0275conditionalCreate(19, RessourcesComponent_Conditional_19_Template, 41, 11, "div", 8);
      \u0275\u0275conditionalCreate(20, RessourcesComponent_Conditional_20_Template, 47, 12, "div", 8);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(7);
      \u0275\u0275classProp("border-teal-600", ctx.activeSection() === "materiel")("text-teal-600", ctx.activeSection() === "materiel")("text-slate-600", ctx.activeSection() !== "materiel");
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1(" Mat\xE9riels (", ctx.materiels().length, ") ");
      \u0275\u0275advance();
      \u0275\u0275classProp("border-teal-600", ctx.activeSection() === "equipement")("text-teal-600", ctx.activeSection() === "equipement")("text-slate-600", ctx.activeSection() !== "equipement");
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1(" \xC9quipements (", ctx.equipements().length, ") ");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.activeSection() === "materiel" ? 17 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.activeSection() === "equipement" ? 18 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showMaterielModal() ? 19 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showEquipementModal() ? 20 : -1);
    }
  }, dependencies: [CommonModule, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, MinValidator, FormGroupDirective, FormControlName, FormGroupName, FormArrayName], styles: ['\n\n.line-clamp-2[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n.modal-overlay[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeIn 0.2s ease-in-out;\n}\n.modal-content[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideUp 0.3s ease-out;\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_slideUp {\n  from {\n    transform: translateY(20px);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0);\n    opacity: 1;\n  }\n}\n.resource-card[_ngcontent-%COMP%] {\n  transition: all 0.3s ease;\n}\n.resource-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n}\n.etat-badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n}\n.etat-badge[_ngcontent-%COMP%]::before {\n  content: "";\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background-color: currentColor;\n}\n/*# sourceMappingURL=ressources.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RessourcesComponent, [{
    type: Component,
    args: [{ selector: "app-ressources", standalone: true, imports: [CommonModule, ReactiveFormsModule], template: `<div class="p-8 max-w-7xl mx-auto">
  <!-- En-t\xEAte -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-slate-800 mb-2">Gestion des Ressources</h1>
    <p class="text-slate-600">G\xE9rez les mat\xE9riels et \xE9quipements de l'\xE9tablissement</p>
  </div>

  <!-- Tabs de navigation -->
  <div class="flex gap-4 mb-6 border-b border-slate-200">
    <button
      (click)="setActiveSection('materiel')"
      [class.border-teal-600]="activeSection() === 'materiel'"
      [class.text-teal-600]="activeSection() === 'materiel'"
      [class.text-slate-600]="activeSection() !== 'materiel'"
      class="pb-3 px-4 font-medium border-b-2 transition-colors hover:text-teal-600"
    >
      <span class="flex items-center gap-2">
        <span class="material-icons text-xl">inventory</span>
        Mat\xE9riels ({{ materiels().length }})
      </span>
    </button>
    <button
      (click)="setActiveSection('equipement')"
      [class.border-teal-600]="activeSection() === 'equipement'"
      [class.text-teal-600]="activeSection() === 'equipement'"
      [class.text-slate-600]="activeSection() !== 'equipement'"
      class="pb-3 px-4 font-medium border-b-2 transition-colors hover:text-teal-600"
    >
      <span class="flex items-center gap-2">
        <span class="material-icons text-xl">devices</span>
        \xC9quipements ({{ equipements().length }})
      </span>
    </button>
  </div>

  <!-- Section Mat\xE9riels -->
  @if (activeSection() === 'materiel') {
    <div>
      <!-- Bouton d'ajout -->
      <div class="mb-6 flex justify-between items-center">
        <div class="text-slate-600">
          <span class="font-medium">{{ materiels().length }}</span> mat\xE9riels au total
        </div>
        <button
          (click)="openMaterielModal()"
          class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <span class="material-icons">add</span>
          Nouveau mat\xE9riel
        </button>
      </div>

      <!-- Grille de cartes de mat\xE9riels -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (materiel of materiels(); track materiel.id) {
          <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-slate-200">
            <!-- En-t\xEAte de la carte -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-slate-800 mb-1">{{ materiel.nom }}</h3>
                <p class="text-sm text-slate-500">{{ materiel.type }}</p>
              </div>
              <span
                [class]="getEtatBadgeClass(materiel.etat)"
                class="px-2 py-1 rounded text-xs font-semibold whitespace-nowrap"
              >
                {{ materiel.etat }}
              </span>
            </div>

            <!-- Description -->
            @if (materiel.description) {
              <p class="text-sm text-slate-600 mb-4 line-clamp-2">{{ materiel.description }}</p>
            }

            <!-- Informations -->
            <div class="space-y-2 mb-4">
              <div class="flex items-center gap-2 text-sm">
                <div class="bg-teal-50 rounded-lg p-3 flex-1">
                  <div class="text-xs text-teal-600 font-medium mb-1">Quantit\xE9 totale</div>
                  <div class="text-2xl font-bold text-teal-700">{{ materiel.quantite }}</div>
                </div>
                <div class="bg-blue-50 rounded-lg p-3 flex-1">
                  <div class="text-xs text-blue-600 font-medium mb-1">Disponible</div>
                  <div class="text-2xl font-bold text-blue-700">{{ getQuantiteDisponible(materiel.id!) }}</div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 pt-4 border-t border-slate-200">
              <button
                (click)="openMaterielModal(materiel)"
                class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
              >
                <span class="material-icons text-sm">edit</span>
                Modifier
              </button>
              <button
                (click)="deleteMateriel(materiel.id!)"
                class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                <span class="material-icons text-sm">delete</span>
              </button>
            </div>
          </div>
        } @empty {
          <div class="col-span-3 text-center py-12">
            <span class="material-icons text-6xl text-slate-300 mb-4">inventory</span>
            <p class="text-slate-500">Aucun mat\xE9riel pour le moment</p>
            <button
              (click)="openMaterielModal()"
              class="mt-4 text-teal-600 hover:text-teal-700 font-medium"
            >
              Ajouter votre premier mat\xE9riel
            </button>
          </div>
        }
      </div>
    </div>
  }

  <!-- Section \xC9quipements -->
  @if (activeSection() === 'equipement') {
    <div>
      <!-- Bouton d'ajout -->
      <div class="mb-6 flex justify-between items-center">
        <div class="text-slate-600">
          <span class="font-medium">{{ equipements().length }}</span> \xE9quipements au total
        </div>
        <button
          (click)="openEquipementModal()"
          class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <span class="material-icons">add</span>
          Nouvel \xE9quipement
        </button>
      </div>

      <!-- Grille de cartes d'\xE9quipements -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (equipement of equipements(); track equipement.id) {
          <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-slate-200">
            <!-- En-t\xEAte de la carte -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-slate-800 mb-1">{{ equipement.nom }}</h3>
                <p class="text-sm text-slate-500">{{ equipement.type }}</p>
              </div>
              <span
                [class]="getEtatBadgeClass(equipement.etat)"
                class="px-2 py-1 rounded text-xs font-semibold whitespace-nowrap"
              >
                {{ equipement.etat }}
              </span>
            </div>

            <!-- Description -->
            @if (equipement.description) {
              <p class="text-sm text-slate-600 mb-4 line-clamp-2">{{ equipement.description }}</p>
            }

            <!-- Mat\xE9riels affect\xE9s -->
            @if (getMaterielsAffectes(equipement).length > 0) {
              <div class="mb-4">
                <h4 class="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
                  <span class="material-icons text-sm">build</span>
                  Mat\xE9riels inclus
                </h4>
                <div class="space-y-1">
                  @for (ma of getMaterielsAffectes(equipement); track ma.materielId) {
                    <div class="flex items-center justify-between text-xs bg-slate-50 rounded px-2 py-1">
                      <span class="text-slate-600">{{ getMaterielName(ma.materielId) }}</span>
                      <span class="font-semibold text-slate-700">\xD7{{ ma.quantiteAffectee }}</span>
                    </div>
                  }
                </div>
              </div>
            } @else {
              <div class="mb-4 h-16 flex items-center justify-center text-xs text-slate-400">
                Aucun mat\xE9riel affect\xE9
              </div>
            }

            <!-- Actions -->
            <div class="flex gap-2 pt-4 border-t border-slate-200">
              <button
                (click)="openEquipementModal(equipement)"
                class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
              >
                <span class="material-icons text-sm">edit</span>
                Modifier
              </button>
              <button
                (click)="deleteEquipement(equipement.id!)"
                class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                <span class="material-icons text-sm">delete</span>
              </button>
            </div>
          </div>
        } @empty {
          <div class="col-span-3 text-center py-12">
            <span class="material-icons text-6xl text-slate-300 mb-4">devices</span>
            <p class="text-slate-500">Aucun \xE9quipement pour le moment</p>
            <button
              (click)="openEquipementModal()"
              class="mt-4 text-teal-600 hover:text-teal-700 font-medium"
            >
              Ajouter votre premier \xE9quipement
            </button>
          </div>
        }
      </div>
    </div>
  }
  <!-- Modal Mat\xE9riel -->
  @if (showMaterielModal()) {
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- En-t\xEAte du modal -->
        <div class="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 class="text-2xl font-bold text-slate-800">
            {{ editingMateriel() ? 'Modifier le mat\xE9riel' : 'Nouveau mat\xE9riel' }}
          </h2>
          <button
            (click)="closeMaterielModal()"
            class="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Formulaire -->
        <form [formGroup]="materielForm" (ngSubmit)="saveMateriel()" class="p-6">
          <div class="space-y-4">
            <!-- Nom -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Nom du mat\xE9riel *
              </label>
              <input
                type="text"
                formControlName="nom"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ex: Chaises ergonomiques"
              />
              @if (materielForm.get('nom')?.invalid && materielForm.get('nom')?.touched) {
                <p class="text-red-600 text-sm mt-1">Le nom est requis (min. 3 caract\xE8res)</p>
              }
            </div>

            <!-- Type et \xC9tat -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  Type *
                </label>
                <input
                  type="text"
                  formControlName="type"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Ex: Mobilier"
                />
                @if (materielForm.get('type')?.invalid && materielForm.get('type')?.touched) {
                  <p class="text-red-600 text-sm mt-1">Le type est requis</p>
                }
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  \xC9tat *
                </label>
                <select
                  formControlName="etat"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  @for (etat of etats; track etat) {
                    <option [value]="etat">{{ etat }}</option>
                  }
                </select>
              </div>
            </div>

            <!-- Quantit\xE9 -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Quantit\xE9 *
              </label>
              <input
                type="number"
                formControlName="quantite"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ex: 50"
                min="1"
              />
              @if (materielForm.get('quantite')?.invalid && materielForm.get('quantite')?.touched) {
                <p class="text-red-600 text-sm mt-1">La quantit\xE9 doit \xEAtre au minimum 1</p>
              }
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                formControlName="description"
                rows="3"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                placeholder="Description optionnelle du mat\xE9riel..."
              ></textarea>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mt-6 pt-6 border-t border-slate-200">
            <button
              type="button"
              (click)="closeMaterielModal()"
              class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              [disabled]="materielForm.invalid"
              [class.opacity-50]="materielForm.invalid"
              [class.cursor-not-allowed]="materielForm.invalid"
              class="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:hover:bg-teal-600"
            >
              {{ editingMateriel() ? 'Enregistrer' : 'Cr\xE9er' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  }
  <!-- Modal \xC9quipement -->
  @if (showEquipementModal()) {
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- En-t\xEAte du modal -->
        <div class="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 class="text-2xl font-bold text-slate-800">
            {{ editingEquipement() ? 'Modifier l\\'\xE9quipement' : 'Nouvel \xE9quipement' }}
          </h2>
          <button
            (click)="closeEquipementModal()"
            class="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Formulaire -->
        <form [formGroup]="equipementForm" (ngSubmit)="saveEquipement()" class="p-6">
          <div class="space-y-4">
            <!-- Nom -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Nom de l'\xE9quipement *
              </label>
              <input
                type="text"
                formControlName="nom"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ex: Projecteur HD"
              />
              @if (equipementForm.get('nom')?.invalid && equipementForm.get('nom')?.touched) {
                <p class="text-red-600 text-sm mt-1">Le nom est requis (min. 3 caract\xE8res)</p>
              }
            </div>

            <!-- Type et \xC9tat -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  Type *
                </label>
                <input
                  type="text"
                  formControlName="type"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Ex: Audiovisuel"
                />
                @if (equipementForm.get('type')?.invalid && equipementForm.get('type')?.touched) {
                  <p class="text-red-600 text-sm mt-1">Le type est requis</p>
                }
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  \xC9tat *
                </label>
                <select
                  formControlName="etat"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  @for (etat of etats; track etat) {
                    <option [value]="etat">{{ etat }}</option>
                  }
                </select>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                formControlName="description"
                rows="3"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                placeholder="Description optionnelle de l'\xE9quipement..."
              ></textarea>
            </div>

            <!-- Mat\xE9riels affect\xE9s -->
            <div>
              <div class="flex justify-between items-center mb-3">
                <label class="block text-sm font-medium text-slate-700">
                  Mat\xE9riels affect\xE9s
                </label>
                <button
                  type="button"
                  (click)="addMaterielAffecte()"
                  class="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
                >
                  <span class="material-icons text-sm">add_circle</span>
                  Ajouter un mat\xE9riel
                </button>
              </div>

              @if (materielsAffectesArray.length === 0) {
                <div class="text-center py-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                  <span class="material-icons text-slate-300 text-4xl mb-2">inventory_2</span>
                  <p class="text-sm text-slate-500">Aucun mat\xE9riel affect\xE9</p>
                  <p class="text-xs text-slate-400 mt-1">Cliquez sur "Ajouter un mat\xE9riel" pour commencer</p>
                </div>
              } @else {
                <div class="space-y-3" formArrayName="materielsAffectes">
                  @for (materielControl of materielsAffectesArray.controls; track i; let i = $index) {
                    <div [formGroupName]="i" class="flex gap-3 items-start bg-slate-50 p-3 rounded-lg">
                      <!-- S\xE9lection mat\xE9riel -->
                      <div class="flex-1">
                        <select
                          formControlName="materielId"
                          class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="">S\xE9lectionnez un mat\xE9riel</option>
                          @for (materiel of materiels(); track materiel.id) {
                            <option [value]="materiel.id">
                              {{ materiel.nom }} ({{ materiel.type }}) - Disponible: {{ getQuantiteDisponible(materiel.id!) }}
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

              @if (materielsAffectesArray.length > 0) {
                <p class="text-xs text-slate-500 mt-2">
                  <span class="material-icons text-xs align-middle">info</span>
                  Assurez-vous que les quantit\xE9s ne d\xE9passent pas les stocks disponibles
                </p>
              }
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mt-6 pt-6 border-t border-slate-200">
            <button
              type="button"
              (click)="closeEquipementModal()"
              class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              [disabled]="equipementForm.invalid"
              [class.opacity-50]="equipementForm.invalid"
              [class.cursor-not-allowed]="equipementForm.invalid"
              class="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:hover:bg-teal-600"
            >
              {{ editingEquipement() ? 'Enregistrer' : 'Cr\xE9er' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  }
</div>
`, styles: ['/* src/app/features/admin/ressources/ressources.component.scss */\n.line-clamp-2 {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n.modal-overlay {\n  animation: fadeIn 0.2s ease-in-out;\n}\n.modal-content {\n  animation: slideUp 0.3s ease-out;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes slideUp {\n  from {\n    transform: translateY(20px);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0);\n    opacity: 1;\n  }\n}\n.resource-card {\n  transition: all 0.3s ease;\n}\n.resource-card:hover {\n  transform: translateY(-2px);\n}\n.etat-badge {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n}\n.etat-badge::before {\n  content: "";\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background-color: currentColor;\n}\n/*# sourceMappingURL=ressources.component.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RessourcesComponent, { className: "RessourcesComponent", filePath: "src/app/features/admin/ressources/ressources.component.ts", lineNumber: 22 });
})();
export {
  RessourcesComponent
};
//# sourceMappingURL=chunk-4ZGTVCF4.js.map
