import {
  EcoleService
} from "./chunk-BQGZQQHM.js";
import {
  FiliereService
} from "./chunk-GCDGGT2I.js";
import {
  ClasseService
} from "./chunk-37GUWSLG.js";
import "./chunk-M2M2Z2ZK.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  NgSelectOption,
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
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-DBHCOGA3.js";
import {
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/features/admin/academic/academic.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function AcademicComponent_Conditional_22_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 14)(1, "div", 16)(2, "div", 17)(3, "span", 18);
    \u0275\u0275text(4, "apartment");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 19)(6, "h3", 20);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 21)(9, "span", 22);
    \u0275\u0275text(10, "person");
    \u0275\u0275elementEnd();
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "p", 23);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 24)(15, "button", 25);
    \u0275\u0275listener("click", function AcademicComponent_Conditional_22_For_12_Template_button_click_15_listener() {
      const ecole_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openEcoleModal(ecole_r5));
    });
    \u0275\u0275elementStart(16, "span", 26);
    \u0275\u0275text(17, "edit");
    \u0275\u0275elementEnd();
    \u0275\u0275text(18, " Modifier ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "button", 27);
    \u0275\u0275listener("click", function AcademicComponent_Conditional_22_For_12_Template_button_click_19_listener() {
      const ecole_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteEcole(ecole_r5.id));
    });
    \u0275\u0275elementStart(20, "span", 26);
    \u0275\u0275text(21, "delete");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ecole_r5 = ctx.$implicit;
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ecole_r5.nom);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ecole_r5.directeur, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ecole_r5.description);
  }
}
function AcademicComponent_Conditional_22_ForEmpty_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "span", 28);
    \u0275\u0275text(2, "apartment");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 29);
    \u0275\u0275text(4, "Aucune \xE9cole pour le moment");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 30);
    \u0275\u0275listener("click", function AcademicComponent_Conditional_22_ForEmpty_13_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openEcoleModal());
    });
    \u0275\u0275text(6, " Cr\xE9er votre premi\xE8re \xE9cole ");
    \u0275\u0275elementEnd()();
  }
}
function AcademicComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 9)(2, "div", 3)(3, "span", 10);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " \xE9coles au total ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 11);
    \u0275\u0275listener("click", function AcademicComponent_Conditional_22_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openEcoleModal());
    });
    \u0275\u0275elementStart(7, "span", 12);
    \u0275\u0275text(8, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(9, " Nouvelle \xE9cole ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 13);
    \u0275\u0275repeaterCreate(11, AcademicComponent_Conditional_22_For_12_Template, 22, 3, "div", 14, _forTrack0, false, AcademicComponent_Conditional_22_ForEmpty_13_Template, 7, 0, "div", 15);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.ecoles().length);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r1.ecoles());
  }
}
function AcademicComponent_Conditional_23_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 14)(1, "div", 16)(2, "div", 31)(3, "span", 32);
    \u0275\u0275text(4, "account_tree");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 19)(6, "h3", 20);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 21)(9, "span", 22);
    \u0275\u0275text(10, "apartment");
    \u0275\u0275elementEnd();
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "p", 23);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 24)(15, "button", 25);
    \u0275\u0275listener("click", function AcademicComponent_Conditional_23_For_12_Template_button_click_15_listener() {
      const filiere_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openFiliereModal(filiere_r9));
    });
    \u0275\u0275elementStart(16, "span", 26);
    \u0275\u0275text(17, "edit");
    \u0275\u0275elementEnd();
    \u0275\u0275text(18, " Modifier ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "button", 27);
    \u0275\u0275listener("click", function AcademicComponent_Conditional_23_For_12_Template_button_click_19_listener() {
      const filiere_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteFiliere(filiere_r9.id));
    });
    \u0275\u0275elementStart(20, "span", 26);
    \u0275\u0275text(21, "delete");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const filiere_r9 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(filiere_r9.nom);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.getEcoleName(filiere_r9.ecoleId), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(filiere_r9.description);
  }
}
function AcademicComponent_Conditional_23_ForEmpty_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "span", 28);
    \u0275\u0275text(2, "account_tree");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 29);
    \u0275\u0275text(4, "Aucune fili\xE8re pour le moment");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 30);
    \u0275\u0275listener("click", function AcademicComponent_Conditional_23_ForEmpty_13_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openFiliereModal());
    });
    \u0275\u0275text(6, " Cr\xE9er votre premi\xE8re fili\xE8re ");
    \u0275\u0275elementEnd()();
  }
}
function AcademicComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 9)(2, "div", 3)(3, "span", 10);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " fili\xE8res au total ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 11);
    \u0275\u0275listener("click", function AcademicComponent_Conditional_23_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openFiliereModal());
    });
    \u0275\u0275elementStart(7, "span", 12);
    \u0275\u0275text(8, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(9, " Nouvelle fili\xE8re ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 13);
    \u0275\u0275repeaterCreate(11, AcademicComponent_Conditional_23_For_12_Template, 22, 3, "div", 14, _forTrack0, false, AcademicComponent_Conditional_23_ForEmpty_13_Template, 7, 0, "div", 15);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.filieres().length);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r1.filieres());
  }
}
function AcademicComponent_Conditional_24_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 14)(1, "div", 16)(2, "div", 33)(3, "span", 34);
    \u0275\u0275text(4, "group");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 19)(6, "h3", 20);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 21)(9, "span", 22);
    \u0275\u0275text(10, "account_tree");
    \u0275\u0275elementEnd();
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "div", 35)(13, "div", 36);
    \u0275\u0275text(14, "Niveau");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 37);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 24)(18, "button", 25);
    \u0275\u0275listener("click", function AcademicComponent_Conditional_24_For_12_Template_button_click_18_listener() {
      const classe_r13 = \u0275\u0275restoreView(_r12).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openClasseModal(classe_r13));
    });
    \u0275\u0275elementStart(19, "span", 26);
    \u0275\u0275text(20, "edit");
    \u0275\u0275elementEnd();
    \u0275\u0275text(21, " Modifier ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "button", 27);
    \u0275\u0275listener("click", function AcademicComponent_Conditional_24_For_12_Template_button_click_22_listener() {
      const classe_r13 = \u0275\u0275restoreView(_r12).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteClasse(classe_r13.id));
    });
    \u0275\u0275elementStart(23, "span", 26);
    \u0275\u0275text(24, "delete");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const classe_r13 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(classe_r13.nom);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.getFiliereName(classe_r13.filiereId), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(classe_r13.niveau);
  }
}
function AcademicComponent_Conditional_24_ForEmpty_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "span", 28);
    \u0275\u0275text(2, "group");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 29);
    \u0275\u0275text(4, "Aucune classe pour le moment");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 30);
    \u0275\u0275listener("click", function AcademicComponent_Conditional_24_ForEmpty_13_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openClasseModal());
    });
    \u0275\u0275text(6, " Cr\xE9er votre premi\xE8re classe ");
    \u0275\u0275elementEnd()();
  }
}
function AcademicComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 9)(2, "div", 3)(3, "span", 10);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " classes au total ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 11);
    \u0275\u0275listener("click", function AcademicComponent_Conditional_24_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openClasseModal());
    });
    \u0275\u0275elementStart(7, "span", 12);
    \u0275\u0275text(8, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(9, " Nouvelle classe ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 13);
    \u0275\u0275repeaterCreate(11, AcademicComponent_Conditional_24_For_12_Template, 25, 3, "div", 14, _forTrack0, false, AcademicComponent_Conditional_24_ForEmpty_13_Template, 7, 0, "div", 15);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.classes().length);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r1.classes());
  }
}
function AcademicComponent_Conditional_25_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 46);
    \u0275\u0275text(1, "Le nom est requis (min. 3 caract\xE8res)");
    \u0275\u0275elementEnd();
  }
}
function AcademicComponent_Conditional_25_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 46);
    \u0275\u0275text(1, "Le nom du directeur est requis (min. 3 caract\xE8res)");
    \u0275\u0275elementEnd();
  }
}
function AcademicComponent_Conditional_25_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 46);
    \u0275\u0275text(1, "La description est requise (min. 10 caract\xE8res)");
    \u0275\u0275elementEnd();
  }
}
function AcademicComponent_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 38)(2, "div", 39)(3, "h2", 40);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 41);
    \u0275\u0275listener("click", function AcademicComponent_Conditional_25_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeEcoleModal());
    });
    \u0275\u0275elementStart(6, "span", 12);
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "form", 42);
    \u0275\u0275listener("ngSubmit", function AcademicComponent_Conditional_25_Template_form_ngSubmit_8_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveEcole());
    });
    \u0275\u0275elementStart(9, "div", 43)(10, "div")(11, "label", 44);
    \u0275\u0275text(12, " Nom de l'\xE9cole * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "input", 45);
    \u0275\u0275conditionalCreate(14, AcademicComponent_Conditional_25_Conditional_14_Template, 2, 0, "p", 46);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div")(16, "label", 44);
    \u0275\u0275text(17, " Directeur * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(18, "input", 47);
    \u0275\u0275conditionalCreate(19, AcademicComponent_Conditional_25_Conditional_19_Template, 2, 0, "p", 46);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div")(21, "label", 44);
    \u0275\u0275text(22, " Description * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(23, "textarea", 48);
    \u0275\u0275conditionalCreate(24, AcademicComponent_Conditional_25_Conditional_24_Template, 2, 0, "p", 46);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 49)(26, "button", 50);
    \u0275\u0275listener("click", function AcademicComponent_Conditional_25_Template_button_click_26_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeEcoleModal());
    });
    \u0275\u0275text(27, " Annuler ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "button", 51);
    \u0275\u0275text(29);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.editingEcole() ? "Modifier l'\xE9cole" : "Nouvelle \xE9cole", " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("formGroup", ctx_r1.ecoleForm);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(((tmp_3_0 = ctx_r1.ecoleForm.get("nom")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx_r1.ecoleForm.get("nom")) == null ? null : tmp_3_0.touched) ? 14 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(((tmp_4_0 = ctx_r1.ecoleForm.get("directeur")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx_r1.ecoleForm.get("directeur")) == null ? null : tmp_4_0.touched) ? 19 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(((tmp_5_0 = ctx_r1.ecoleForm.get("description")) == null ? null : tmp_5_0.invalid) && ((tmp_5_0 = ctx_r1.ecoleForm.get("description")) == null ? null : tmp_5_0.touched) ? 24 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("opacity-50", ctx_r1.ecoleForm.invalid)("cursor-not-allowed", ctx_r1.ecoleForm.invalid);
    \u0275\u0275property("disabled", ctx_r1.ecoleForm.invalid);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.editingEcole() ? "Enregistrer" : "Cr\xE9er", " ");
  }
}
function AcademicComponent_Conditional_26_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 46);
    \u0275\u0275text(1, "Le nom est requis (min. 3 caract\xE8res)");
    \u0275\u0275elementEnd();
  }
}
function AcademicComponent_Conditional_26_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 55);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ecole_r16 = ctx.$implicit;
    \u0275\u0275property("value", ecole_r16.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ecole_r16.nom);
  }
}
function AcademicComponent_Conditional_26_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 46);
    \u0275\u0275text(1, "Veuillez s\xE9lectionner une \xE9cole");
    \u0275\u0275elementEnd();
  }
}
function AcademicComponent_Conditional_26_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 46);
    \u0275\u0275text(1, "La description est requise (min. 10 caract\xE8res)");
    \u0275\u0275elementEnd();
  }
}
function AcademicComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 38)(2, "div", 39)(3, "h2", 40);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 41);
    \u0275\u0275listener("click", function AcademicComponent_Conditional_26_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeFiliereModal());
    });
    \u0275\u0275elementStart(6, "span", 12);
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "form", 42);
    \u0275\u0275listener("ngSubmit", function AcademicComponent_Conditional_26_Template_form_ngSubmit_8_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveFiliere());
    });
    \u0275\u0275elementStart(9, "div", 43)(10, "div")(11, "label", 44);
    \u0275\u0275text(12, " Nom de la fili\xE8re * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "input", 52);
    \u0275\u0275conditionalCreate(14, AcademicComponent_Conditional_26_Conditional_14_Template, 2, 0, "p", 46);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div")(16, "label", 44);
    \u0275\u0275text(17, " \xC9cole * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "select", 53)(19, "option", 54);
    \u0275\u0275text(20, "S\xE9lectionnez une \xE9cole");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(21, AcademicComponent_Conditional_26_For_22_Template, 2, 2, "option", 55, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(23, AcademicComponent_Conditional_26_Conditional_23_Template, 2, 0, "p", 46);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div")(25, "label", 44);
    \u0275\u0275text(26, " Description * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(27, "textarea", 56);
    \u0275\u0275conditionalCreate(28, AcademicComponent_Conditional_26_Conditional_28_Template, 2, 0, "p", 46);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "div", 49)(30, "button", 50);
    \u0275\u0275listener("click", function AcademicComponent_Conditional_26_Template_button_click_30_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeFiliereModal());
    });
    \u0275\u0275text(31, " Annuler ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "button", 51);
    \u0275\u0275text(33);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_5_0;
    let tmp_6_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.editingFiliere() ? "Modifier la fili\xE8re" : "Nouvelle fili\xE8re", " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("formGroup", ctx_r1.filiereForm);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(((tmp_3_0 = ctx_r1.filiereForm.get("nom")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx_r1.filiereForm.get("nom")) == null ? null : tmp_3_0.touched) ? 14 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r1.ecoles());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_5_0 = ctx_r1.filiereForm.get("ecoleId")) == null ? null : tmp_5_0.invalid) && ((tmp_5_0 = ctx_r1.filiereForm.get("ecoleId")) == null ? null : tmp_5_0.touched) ? 23 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(((tmp_6_0 = ctx_r1.filiereForm.get("description")) == null ? null : tmp_6_0.invalid) && ((tmp_6_0 = ctx_r1.filiereForm.get("description")) == null ? null : tmp_6_0.touched) ? 28 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("opacity-50", ctx_r1.filiereForm.invalid)("cursor-not-allowed", ctx_r1.filiereForm.invalid);
    \u0275\u0275property("disabled", ctx_r1.filiereForm.invalid);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.editingFiliere() ? "Enregistrer" : "Cr\xE9er", " ");
  }
}
function AcademicComponent_Conditional_27_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 46);
    \u0275\u0275text(1, "Le nom est requis (min. 2 caract\xE8res)");
    \u0275\u0275elementEnd();
  }
}
function AcademicComponent_Conditional_27_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 46);
    \u0275\u0275text(1, "Veuillez s\xE9lectionner un niveau");
    \u0275\u0275elementEnd();
  }
}
function AcademicComponent_Conditional_27_For_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 55);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const filiere_r18 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", filiere_r18.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", filiere_r18.nom, " - ", ctx_r1.getEcoleName(filiere_r18.ecoleId));
  }
}
function AcademicComponent_Conditional_27_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 46);
    \u0275\u0275text(1, "Veuillez s\xE9lectionner une fili\xE8re");
    \u0275\u0275elementEnd();
  }
}
function AcademicComponent_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 38)(2, "div", 39)(3, "h2", 40);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 41);
    \u0275\u0275listener("click", function AcademicComponent_Conditional_27_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeClasseModal());
    });
    \u0275\u0275elementStart(6, "span", 12);
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "form", 42);
    \u0275\u0275listener("ngSubmit", function AcademicComponent_Conditional_27_Template_form_ngSubmit_8_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveClasse());
    });
    \u0275\u0275elementStart(9, "div", 43)(10, "div")(11, "label", 44);
    \u0275\u0275text(12, " Nom de la classe * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "input", 57);
    \u0275\u0275conditionalCreate(14, AcademicComponent_Conditional_27_Conditional_14_Template, 2, 0, "p", 46);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div")(16, "label", 44);
    \u0275\u0275text(17, " Niveau * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "select", 58)(19, "option", 54);
    \u0275\u0275text(20, "S\xE9lectionnez un niveau");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "option", 59);
    \u0275\u0275text(22, "Licence 1 (L1)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "option", 60);
    \u0275\u0275text(24, "Licence 2 (L2)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "option", 61);
    \u0275\u0275text(26, "Licence 3 (L3)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "option", 62);
    \u0275\u0275text(28, "Master 1 (M1)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "option", 63);
    \u0275\u0275text(30, "Master 2 (M2)");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(31, AcademicComponent_Conditional_27_Conditional_31_Template, 2, 0, "p", 46);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "div")(33, "label", 44);
    \u0275\u0275text(34, " Fili\xE8re * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "select", 64)(36, "option", 54);
    \u0275\u0275text(37, "S\xE9lectionnez une fili\xE8re");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(38, AcademicComponent_Conditional_27_For_39_Template, 2, 3, "option", 55, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(40, AcademicComponent_Conditional_27_Conditional_40_Template, 2, 0, "p", 46);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(41, "div", 49)(42, "button", 50);
    \u0275\u0275listener("click", function AcademicComponent_Conditional_27_Template_button_click_42_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeClasseModal());
    });
    \u0275\u0275text(43, " Annuler ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "button", 51);
    \u0275\u0275text(45);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    let tmp_6_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.editingClasse() ? "Modifier la classe" : "Nouvelle classe", " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("formGroup", ctx_r1.classeForm);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(((tmp_3_0 = ctx_r1.classeForm.get("nom")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx_r1.classeForm.get("nom")) == null ? null : tmp_3_0.touched) ? 14 : -1);
    \u0275\u0275advance(17);
    \u0275\u0275conditional(((tmp_4_0 = ctx_r1.classeForm.get("niveau")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx_r1.classeForm.get("niveau")) == null ? null : tmp_4_0.touched) ? 31 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r1.filieres());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_6_0 = ctx_r1.classeForm.get("filiereId")) == null ? null : tmp_6_0.invalid) && ((tmp_6_0 = ctx_r1.classeForm.get("filiereId")) == null ? null : tmp_6_0.touched) ? 40 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("opacity-50", ctx_r1.classeForm.invalid)("cursor-not-allowed", ctx_r1.classeForm.invalid);
    \u0275\u0275property("disabled", ctx_r1.classeForm.invalid);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.editingClasse() ? "Enregistrer" : "Cr\xE9er", " ");
  }
}
var AcademicComponent = class _AcademicComponent {
  ecoleService = inject(EcoleService);
  filiereService = inject(FiliereService);
  classeService = inject(ClasseService);
  fb = inject(FormBuilder);
  // Signaux pour les données
  ecoles = signal([], ...ngDevMode ? [{ debugName: "ecoles" }] : []);
  filieres = signal([], ...ngDevMode ? [{ debugName: "filieres" }] : []);
  classes = signal([], ...ngDevMode ? [{ debugName: "classes" }] : []);
  // Section active (ecole, filiere ou classe)
  activeSection = signal("ecole", ...ngDevMode ? [{ debugName: "activeSection" }] : []);
  // Modals
  showEcoleModal = signal(false, ...ngDevMode ? [{ debugName: "showEcoleModal" }] : []);
  showFiliereModal = signal(false, ...ngDevMode ? [{ debugName: "showFiliereModal" }] : []);
  showClasseModal = signal(false, ...ngDevMode ? [{ debugName: "showClasseModal" }] : []);
  // Mode édition
  editingEcole = signal(null, ...ngDevMode ? [{ debugName: "editingEcole" }] : []);
  editingFiliere = signal(null, ...ngDevMode ? [{ debugName: "editingFiliere" }] : []);
  editingClasse = signal(null, ...ngDevMode ? [{ debugName: "editingClasse" }] : []);
  // Formulaires
  ecoleForm;
  filiereForm;
  classeForm;
  ngOnInit() {
    this.initForms();
    this.loadData();
  }
  initForms() {
    this.ecoleForm = this.fb.group({
      nom: ["", [Validators.required, Validators.minLength(3)]],
      directeur: ["", [Validators.required, Validators.minLength(3)]],
      description: ["", [Validators.required, Validators.minLength(10)]]
    });
    this.filiereForm = this.fb.group({
      nom: ["", [Validators.required, Validators.minLength(3)]],
      description: ["", [Validators.required, Validators.minLength(10)]],
      ecoleId: ["", Validators.required]
    });
    this.classeForm = this.fb.group({
      nom: ["", [Validators.required, Validators.minLength(2)]],
      niveau: ["", Validators.required],
      filiereId: ["", Validators.required]
    });
  }
  loadData() {
    this.ecoleService.getEcoles().subscribe((data) => this.ecoles.set(data));
    this.filiereService.getFilieres().subscribe((data) => this.filieres.set(data));
    this.classeService.getClasses().subscribe((data) => this.classes.set(data));
  }
  // Gestion des sections
  setActiveSection(section) {
    this.activeSection.set(section);
  }
  // Gestion des écoles
  openEcoleModal(ecole) {
    if (ecole) {
      this.editingEcole.set(ecole);
      this.ecoleForm.patchValue(ecole);
    } else {
      this.editingEcole.set(null);
      this.ecoleForm.reset();
    }
    this.showEcoleModal.set(true);
  }
  closeEcoleModal() {
    this.showEcoleModal.set(false);
    this.editingEcole.set(null);
    this.ecoleForm.reset();
  }
  saveEcole() {
    if (this.ecoleForm.invalid)
      return;
    const ecoleData = this.ecoleForm.value;
    if (this.editingEcole()) {
      this.ecoleService.updateEcole(__spreadValues({
        id: this.editingEcole().id
      }, ecoleData)).subscribe(() => {
        this.closeEcoleModal();
        this.loadData();
      });
    } else {
      this.ecoleService.createEcole(ecoleData).subscribe(() => {
        this.closeEcoleModal();
        this.loadData();
      });
    }
  }
  deleteEcole(id) {
    if (confirm("\xCAtes-vous s\xFBr de vouloir supprimer cette \xE9cole ? Toutes les fili\xE8res associ\xE9es seront \xE9galement affect\xE9es.")) {
      this.ecoleService.deleteEcole(id).subscribe(() => {
        this.loadData();
      });
    }
  }
  // Gestion des filières
  openFiliereModal(filiere) {
    if (filiere) {
      this.editingFiliere.set(filiere);
      this.filiereForm.patchValue(filiere);
    } else {
      this.editingFiliere.set(null);
      this.filiereForm.reset();
    }
    this.showFiliereModal.set(true);
  }
  closeFiliereModal() {
    this.showFiliereModal.set(false);
    this.editingFiliere.set(null);
    this.filiereForm.reset();
  }
  saveFiliere() {
    if (this.filiereForm.invalid)
      return;
    const filiereData = this.filiereForm.value;
    if (this.editingFiliere()) {
      this.filiereService.updateFiliere(__spreadValues({
        id: this.editingFiliere().id
      }, filiereData)).subscribe(() => {
        this.closeFiliereModal();
        this.loadData();
      });
    } else {
      this.filiereService.createFiliere(filiereData).subscribe(() => {
        this.closeFiliereModal();
        this.loadData();
      });
    }
  }
  deleteFiliere(id) {
    if (confirm("\xCAtes-vous s\xFBr de vouloir supprimer cette fili\xE8re ? Toutes les classes associ\xE9es seront \xE9galement affect\xE9es.")) {
      this.filiereService.deleteFiliere(id).subscribe(() => {
        this.loadData();
      });
    }
  }
  // Gestion des classes
  openClasseModal(classe) {
    if (classe) {
      this.editingClasse.set(classe);
      this.classeForm.patchValue(classe);
    } else {
      this.editingClasse.set(null);
      this.classeForm.reset();
    }
    this.showClasseModal.set(true);
  }
  closeClasseModal() {
    this.showClasseModal.set(false);
    this.editingClasse.set(null);
    this.classeForm.reset();
  }
  saveClasse() {
    if (this.classeForm.invalid)
      return;
    const classeData = this.classeForm.value;
    if (this.editingClasse()) {
      this.classeService.updateClasse(__spreadValues({
        id: this.editingClasse().id
      }, classeData)).subscribe(() => {
        this.closeClasseModal();
        this.loadData();
      });
    } else {
      this.classeService.createClasse(classeData).subscribe(() => {
        this.closeClasseModal();
        this.loadData();
      });
    }
  }
  deleteClasse(id) {
    if (confirm("\xCAtes-vous s\xFBr de vouloir supprimer cette classe ?")) {
      this.classeService.deleteClasse(id).subscribe(() => {
        this.loadData();
      });
    }
  }
  // Helpers
  getEcoleName(ecoleId) {
    const ecole = this.ecoles().find((e) => e.id === ecoleId);
    return ecole ? ecole.nom : "\xC9cole inconnue";
  }
  getFiliereName(filiereId) {
    const filiere = this.filieres().find((f) => f.id === filiereId);
    return filiere ? filiere.nom : "Fili\xE8re inconnue";
  }
  static \u0275fac = function AcademicComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AcademicComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AcademicComponent, selectors: [["app-academic"]], decls: 28, vars: 27, consts: [[1, "p-8", "max-w-7xl", "mx-auto"], [1, "mb-8"], [1, "text-3xl", "font-bold", "text-slate-800", "mb-2"], [1, "text-slate-600"], [1, "flex", "gap-4", "mb-6", "border-b", "border-slate-200"], [1, "pb-3", "px-4", "font-medium", "border-b-2", "transition-colors", "hover:text-teal-600", 3, "click"], [1, "flex", "items-center", "gap-2"], [1, "material-icons", "text-xl"], [1, "fixed", "inset-0", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center", "z-50"], [1, "mb-6", "flex", "justify-between", "items-center"], [1, "font-medium"], [1, "bg-teal-600", "hover:bg-teal-700", "text-white", "px-4", "py-2", "rounded-lg", "flex", "items-center", "gap-2", "transition-colors", 3, "click"], [1, "material-icons"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-6"], [1, "bg-white", "rounded-lg", "shadow-md", "hover:shadow-lg", "transition-shadow", "p-6", "border", "border-slate-200"], [1, "col-span-3", "text-center", "py-12"], [1, "flex", "items-start", "gap-3", "mb-4"], [1, "bg-teal-100", "rounded-lg", "p-3"], [1, "material-icons", "text-teal-600", "text-2xl"], [1, "flex-1"], [1, "text-lg", "font-semibold", "text-slate-800", "mb-1"], [1, "text-sm", "text-slate-500", "flex", "items-center", "gap-1"], [1, "material-icons", "text-xs"], [1, "text-sm", "text-slate-600", "mb-4", "line-clamp-3"], [1, "flex", "gap-2", "pt-4", "border-t", "border-slate-200"], [1, "flex-1", "bg-slate-100", "hover:bg-slate-200", "text-slate-700", "px-3", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors", "flex", "items-center", "justify-center", "gap-1", 3, "click"], [1, "material-icons", "text-sm"], [1, "bg-red-50", "hover:bg-red-100", "text-red-600", "px-3", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors", "flex", "items-center", "justify-center", 3, "click"], [1, "material-icons", "text-6xl", "text-slate-300", "mb-4"], [1, "text-slate-500"], [1, "mt-4", "text-teal-600", "hover:text-teal-700", "font-medium", 3, "click"], [1, "bg-blue-100", "rounded-lg", "p-3"], [1, "material-icons", "text-blue-600", "text-2xl"], [1, "bg-purple-100", "rounded-lg", "p-3"], [1, "material-icons", "text-purple-600", "text-2xl"], [1, "bg-slate-50", "rounded-lg", "p-3", "mb-4"], [1, "text-xs", "text-slate-500", "mb-1"], [1, "text-sm", "font-semibold", "text-slate-700"], [1, "bg-white", "rounded-lg", "shadow-xl", "max-w-2xl", "w-full", "mx-4", "max-h-[90vh]", "overflow-y-auto"], [1, "flex", "justify-between", "items-center", "p-6", "border-b", "border-slate-200"], [1, "text-2xl", "font-bold", "text-slate-800"], [1, "text-slate-400", "hover:text-slate-600", "transition-colors", 3, "click"], [1, "p-6", 3, "ngSubmit", "formGroup"], [1, "space-y-4"], [1, "block", "text-sm", "font-medium", "text-slate-700", "mb-1"], ["type", "text", "formControlName", "nom", "placeholder", "Ex: \xC9cole Nationale Sup\xE9rieure Polytechnique", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], [1, "text-red-600", "text-sm", "mt-1"], ["type", "text", "formControlName", "directeur", "placeholder", "Ex: Dr. Jean Dupont", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["formControlName", "description", "rows", "4", "placeholder", "D\xE9crivez l'\xE9cole...", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent", "resize-none"], [1, "flex", "gap-3", "mt-6", "pt-6", "border-t", "border-slate-200"], ["type", "button", 1, "flex-1", "px-4", "py-2", "border", "border-slate-300", "text-slate-700", "rounded-lg", "hover:bg-slate-50", "transition-colors", 3, "click"], ["type", "submit", 1, "flex-1", "px-4", "py-2", "bg-teal-600", "text-white", "rounded-lg", "hover:bg-teal-700", "transition-colors", "disabled:hover:bg-teal-600", 3, "disabled"], ["type", "text", "formControlName", "nom", "placeholder", "Ex: G\xE9nie Informatique", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["formControlName", "ecoleId", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["value", ""], [3, "value"], ["formControlName", "description", "rows", "4", "placeholder", "D\xE9crivez la fili\xE8re...", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent", "resize-none"], ["type", "text", "formControlName", "nom", "placeholder", "Ex: GI-3A", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["formControlName", "niveau", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"], ["value", "L1"], ["value", "L2"], ["value", "L3"], ["value", "M1"], ["value", "M2"], ["formControlName", "filiereId", 1, "w-full", "px-4", "py-2", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent"]], template: function AcademicComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
      \u0275\u0275text(3, "Gestion Acad\xE9mique");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "G\xE9rez les \xE9coles, fili\xE8res et classes");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "button", 5);
      \u0275\u0275listener("click", function AcademicComponent_Template_button_click_7_listener() {
        return ctx.setActiveSection("ecole");
      });
      \u0275\u0275elementStart(8, "span", 6)(9, "span", 7);
      \u0275\u0275text(10, "apartment");
      \u0275\u0275elementEnd();
      \u0275\u0275text(11);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(12, "button", 5);
      \u0275\u0275listener("click", function AcademicComponent_Template_button_click_12_listener() {
        return ctx.setActiveSection("filiere");
      });
      \u0275\u0275elementStart(13, "span", 6)(14, "span", 7);
      \u0275\u0275text(15, "account_tree");
      \u0275\u0275elementEnd();
      \u0275\u0275text(16);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "button", 5);
      \u0275\u0275listener("click", function AcademicComponent_Template_button_click_17_listener() {
        return ctx.setActiveSection("classe");
      });
      \u0275\u0275elementStart(18, "span", 6)(19, "span", 7);
      \u0275\u0275text(20, "group");
      \u0275\u0275elementEnd();
      \u0275\u0275text(21);
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(22, AcademicComponent_Conditional_22_Template, 14, 2, "div");
      \u0275\u0275conditionalCreate(23, AcademicComponent_Conditional_23_Template, 14, 2, "div");
      \u0275\u0275conditionalCreate(24, AcademicComponent_Conditional_24_Template, 14, 2, "div");
      \u0275\u0275conditionalCreate(25, AcademicComponent_Conditional_25_Template, 30, 11, "div", 8);
      \u0275\u0275conditionalCreate(26, AcademicComponent_Conditional_26_Template, 34, 11, "div", 8);
      \u0275\u0275conditionalCreate(27, AcademicComponent_Conditional_27_Template, 46, 11, "div", 8);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(7);
      \u0275\u0275classProp("border-teal-600", ctx.activeSection() === "ecole")("text-teal-600", ctx.activeSection() === "ecole")("text-slate-600", ctx.activeSection() !== "ecole");
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1(" \xC9coles (", ctx.ecoles().length, ") ");
      \u0275\u0275advance();
      \u0275\u0275classProp("border-teal-600", ctx.activeSection() === "filiere")("text-teal-600", ctx.activeSection() === "filiere")("text-slate-600", ctx.activeSection() !== "filiere");
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1(" Fili\xE8res (", ctx.filieres().length, ") ");
      \u0275\u0275advance();
      \u0275\u0275classProp("border-teal-600", ctx.activeSection() === "classe")("text-teal-600", ctx.activeSection() === "classe")("text-slate-600", ctx.activeSection() !== "classe");
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1(" Classes (", ctx.classes().length, ") ");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.activeSection() === "ecole" ? 22 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.activeSection() === "filiere" ? 23 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.activeSection() === "classe" ? 24 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showEcoleModal() ? 25 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showFiliereModal() ? 26 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showClasseModal() ? 27 : -1);
    }
  }, dependencies: [CommonModule, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName], styles: ["\n\n.line-clamp-3[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n.modal-overlay[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeIn 0.2s ease-in-out;\n}\n.modal-content[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideUp 0.3s ease-out;\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_slideUp {\n  from {\n    transform: translateY(20px);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0);\n    opacity: 1;\n  }\n}\n.ecole-card[_ngcontent-%COMP%], \n.filiere-card[_ngcontent-%COMP%], \n.classe-card[_ngcontent-%COMP%] {\n  transition: all 0.3s ease;\n}\n.ecole-card[_ngcontent-%COMP%]:hover, \n.filiere-card[_ngcontent-%COMP%]:hover, \n.classe-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n}\n/*# sourceMappingURL=academic.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AcademicComponent, [{
    type: Component,
    args: [{ selector: "app-academic", standalone: true, imports: [CommonModule, ReactiveFormsModule], template: `<div class="p-8 max-w-7xl mx-auto">
  <!-- En-t\xEAte -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-slate-800 mb-2">Gestion Acad\xE9mique</h1>
    <p class="text-slate-600">G\xE9rez les \xE9coles, fili\xE8res et classes</p>
  </div>

  <!-- Tabs de navigation -->
  <div class="flex gap-4 mb-6 border-b border-slate-200">
    <button
      (click)="setActiveSection('ecole')"
      [class.border-teal-600]="activeSection() === 'ecole'"
      [class.text-teal-600]="activeSection() === 'ecole'"
      [class.text-slate-600]="activeSection() !== 'ecole'"
      class="pb-3 px-4 font-medium border-b-2 transition-colors hover:text-teal-600"
    >
      <span class="flex items-center gap-2">
        <span class="material-icons text-xl">apartment</span>
        \xC9coles ({{ ecoles().length }})
      </span>
    </button>
    <button
      (click)="setActiveSection('filiere')"
      [class.border-teal-600]="activeSection() === 'filiere'"
      [class.text-teal-600]="activeSection() === 'filiere'"
      [class.text-slate-600]="activeSection() !== 'filiere'"
      class="pb-3 px-4 font-medium border-b-2 transition-colors hover:text-teal-600"
    >
      <span class="flex items-center gap-2">
        <span class="material-icons text-xl">account_tree</span>
        Fili\xE8res ({{ filieres().length }})
      </span>
    </button>
    <button
      (click)="setActiveSection('classe')"
      [class.border-teal-600]="activeSection() === 'classe'"
      [class.text-teal-600]="activeSection() === 'classe'"
      [class.text-slate-600]="activeSection() !== 'classe'"
      class="pb-3 px-4 font-medium border-b-2 transition-colors hover:text-teal-600"
    >
      <span class="flex items-center gap-2">
        <span class="material-icons text-xl">group</span>
        Classes ({{ classes().length }})
      </span>
    </button>
  </div>

  <!-- Section \xC9coles -->
  @if (activeSection() === 'ecole') {
    <div>
      <!-- Bouton d'ajout -->
      <div class="mb-6 flex justify-between items-center">
        <div class="text-slate-600">
          <span class="font-medium">{{ ecoles().length }}</span> \xE9coles au total
        </div>
        <button
          (click)="openEcoleModal()"
          class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <span class="material-icons">add</span>
          Nouvelle \xE9cole
        </button>
      </div>

      <!-- Grille de cartes d'\xE9coles -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (ecole of ecoles(); track ecole.id) {
          <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-slate-200">
            <!-- En-t\xEAte de la carte -->
            <div class="flex items-start gap-3 mb-4">
              <div class="bg-teal-100 rounded-lg p-3">
                <span class="material-icons text-teal-600 text-2xl">apartment</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-slate-800 mb-1">{{ ecole.nom }}</h3>
                <p class="text-sm text-slate-500 flex items-center gap-1">
                  <span class="material-icons text-xs">person</span>
                  {{ ecole.directeur }}
                </p>
              </div>
            </div>

            <!-- Description -->
            <p class="text-sm text-slate-600 mb-4 line-clamp-3">{{ ecole.description }}</p>

            <!-- Actions -->
            <div class="flex gap-2 pt-4 border-t border-slate-200">
              <button
                (click)="openEcoleModal(ecole)"
                class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
              >
                <span class="material-icons text-sm">edit</span>
                Modifier
              </button>
              <button
                (click)="deleteEcole(ecole.id!)"
                class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                <span class="material-icons text-sm">delete</span>
              </button>
            </div>
          </div>
        } @empty {
          <div class="col-span-3 text-center py-12">
            <span class="material-icons text-6xl text-slate-300 mb-4">apartment</span>
            <p class="text-slate-500">Aucune \xE9cole pour le moment</p>
            <button
              (click)="openEcoleModal()"
              class="mt-4 text-teal-600 hover:text-teal-700 font-medium"
            >
              Cr\xE9er votre premi\xE8re \xE9cole
            </button>
          </div>
        }
      </div>
    </div>
  }

  <!-- Section Fili\xE8res -->
  @if (activeSection() === 'filiere') {
    <div>
      <!-- Bouton d'ajout -->
      <div class="mb-6 flex justify-between items-center">
        <div class="text-slate-600">
          <span class="font-medium">{{ filieres().length }}</span> fili\xE8res au total
        </div>
        <button
          (click)="openFiliereModal()"
          class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <span class="material-icons">add</span>
          Nouvelle fili\xE8re
        </button>
      </div>

      <!-- Grille de cartes de fili\xE8res -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (filiere of filieres(); track filiere.id) {
          <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-slate-200">
            <!-- En-t\xEAte de la carte -->
            <div class="flex items-start gap-3 mb-4">
              <div class="bg-blue-100 rounded-lg p-3">
                <span class="material-icons text-blue-600 text-2xl">account_tree</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-slate-800 mb-1">{{ filiere.nom }}</h3>
                <p class="text-sm text-slate-500 flex items-center gap-1">
                  <span class="material-icons text-xs">apartment</span>
                  {{ getEcoleName(filiere.ecoleId) }}
                </p>
              </div>
            </div>

            <!-- Description -->
            <p class="text-sm text-slate-600 mb-4 line-clamp-3">{{ filiere.description }}</p>

            <!-- Actions -->
            <div class="flex gap-2 pt-4 border-t border-slate-200">
              <button
                (click)="openFiliereModal(filiere)"
                class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
              >
                <span class="material-icons text-sm">edit</span>
                Modifier
              </button>
              <button
                (click)="deleteFiliere(filiere.id!)"
                class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                <span class="material-icons text-sm">delete</span>
              </button>
            </div>
          </div>
        } @empty {
          <div class="col-span-3 text-center py-12">
            <span class="material-icons text-6xl text-slate-300 mb-4">account_tree</span>
            <p class="text-slate-500">Aucune fili\xE8re pour le moment</p>
            <button
              (click)="openFiliereModal()"
              class="mt-4 text-teal-600 hover:text-teal-700 font-medium"
            >
              Cr\xE9er votre premi\xE8re fili\xE8re
            </button>
          </div>
        }
      </div>
    </div>
  }

  <!-- Section Classes -->
  @if (activeSection() === 'classe') {
    <div>
      <!-- Bouton d'ajout -->
      <div class="mb-6 flex justify-between items-center">
        <div class="text-slate-600">
          <span class="font-medium">{{ classes().length }}</span> classes au total
        </div>
        <button
          (click)="openClasseModal()"
          class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <span class="material-icons">add</span>
          Nouvelle classe
        </button>
      </div>

      <!-- Grille de cartes de classes -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (classe of classes(); track classe.id) {
          <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-slate-200">
            <!-- En-t\xEAte de la carte -->
            <div class="flex items-start gap-3 mb-4">
              <div class="bg-purple-100 rounded-lg p-3">
                <span class="material-icons text-purple-600 text-2xl">group</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-slate-800 mb-1">{{ classe.nom }}</h3>
                <p class="text-sm text-slate-500 flex items-center gap-1">
                  <span class="material-icons text-xs">account_tree</span>
                  {{ getFiliereName(classe.filiereId) }}
                </p>
              </div>
            </div>

            <!-- Informations -->
            <div class="bg-slate-50 rounded-lg p-3 mb-4">
              <div class="text-xs text-slate-500 mb-1">Niveau</div>
              <div class="text-sm font-semibold text-slate-700">{{ classe.niveau }}</div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 pt-4 border-t border-slate-200">
              <button
                (click)="openClasseModal(classe)"
                class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
              >
                <span class="material-icons text-sm">edit</span>
                Modifier
              </button>
              <button
                (click)="deleteClasse(classe.id!)"
                class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                <span class="material-icons text-sm">delete</span>
              </button>
            </div>
          </div>
        } @empty {
          <div class="col-span-3 text-center py-12">
            <span class="material-icons text-6xl text-slate-300 mb-4">group</span>
            <p class="text-slate-500">Aucune classe pour le moment</p>
            <button
              (click)="openClasseModal()"
              class="mt-4 text-teal-600 hover:text-teal-700 font-medium"
            >
              Cr\xE9er votre premi\xE8re classe
            </button>
          </div>
        }
      </div>
    </div>
  }

  <!-- Modal \xC9cole -->
  @if (showEcoleModal()) {
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- En-t\xEAte du modal -->
        <div class="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 class="text-2xl font-bold text-slate-800">
            {{ editingEcole() ? 'Modifier l\\'\xE9cole' : 'Nouvelle \xE9cole' }}
          </h2>
          <button
            (click)="closeEcoleModal()"
            class="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Formulaire -->
        <form [formGroup]="ecoleForm" (ngSubmit)="saveEcole()" class="p-6">
          <div class="space-y-4">
            <!-- Nom -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Nom de l'\xE9cole *
              </label>
              <input
                type="text"
                formControlName="nom"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ex: \xC9cole Nationale Sup\xE9rieure Polytechnique"
              />
              @if (ecoleForm.get('nom')?.invalid && ecoleForm.get('nom')?.touched) {
                <p class="text-red-600 text-sm mt-1">Le nom est requis (min. 3 caract\xE8res)</p>
              }
            </div>

            <!-- Directeur -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Directeur *
              </label>
              <input
                type="text"
                formControlName="directeur"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ex: Dr. Jean Dupont"
              />
              @if (ecoleForm.get('directeur')?.invalid && ecoleForm.get('directeur')?.touched) {
                <p class="text-red-600 text-sm mt-1">Le nom du directeur est requis (min. 3 caract\xE8res)</p>
              }
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
                placeholder="D\xE9crivez l'\xE9cole..."
              ></textarea>
              @if (ecoleForm.get('description')?.invalid && ecoleForm.get('description')?.touched) {
                <p class="text-red-600 text-sm mt-1">La description est requise (min. 10 caract\xE8res)</p>
              }
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mt-6 pt-6 border-t border-slate-200">
            <button
              type="button"
              (click)="closeEcoleModal()"
              class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              [disabled]="ecoleForm.invalid"
              [class.opacity-50]="ecoleForm.invalid"
              [class.cursor-not-allowed]="ecoleForm.invalid"
              class="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:hover:bg-teal-600"
            >
              {{ editingEcole() ? 'Enregistrer' : 'Cr\xE9er' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  }

  <!-- Modal Fili\xE8re -->
  @if (showFiliereModal()) {
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- En-t\xEAte du modal -->
        <div class="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 class="text-2xl font-bold text-slate-800">
            {{ editingFiliere() ? 'Modifier la fili\xE8re' : 'Nouvelle fili\xE8re' }}
          </h2>
          <button
            (click)="closeFiliereModal()"
            class="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Formulaire -->
        <form [formGroup]="filiereForm" (ngSubmit)="saveFiliere()" class="p-6">
          <div class="space-y-4">
            <!-- Nom -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Nom de la fili\xE8re *
              </label>
              <input
                type="text"
                formControlName="nom"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ex: G\xE9nie Informatique"
              />
              @if (filiereForm.get('nom')?.invalid && filiereForm.get('nom')?.touched) {
                <p class="text-red-600 text-sm mt-1">Le nom est requis (min. 3 caract\xE8res)</p>
              }
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
              @if (filiereForm.get('ecoleId')?.invalid && filiereForm.get('ecoleId')?.touched) {
                <p class="text-red-600 text-sm mt-1">Veuillez s\xE9lectionner une \xE9cole</p>
              }
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
                placeholder="D\xE9crivez la fili\xE8re..."
              ></textarea>
              @if (filiereForm.get('description')?.invalid && filiereForm.get('description')?.touched) {
                <p class="text-red-600 text-sm mt-1">La description est requise (min. 10 caract\xE8res)</p>
              }
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mt-6 pt-6 border-t border-slate-200">
            <button
              type="button"
              (click)="closeFiliereModal()"
              class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              [disabled]="filiereForm.invalid"
              [class.opacity-50]="filiereForm.invalid"
              [class.cursor-not-allowed]="filiereForm.invalid"
              class="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:hover:bg-teal-600"
            >
              {{ editingFiliere() ? 'Enregistrer' : 'Cr\xE9er' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  }

  <!-- Modal Classe -->
  @if (showClasseModal()) {
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- En-t\xEAte du modal -->
        <div class="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 class="text-2xl font-bold text-slate-800">
            {{ editingClasse() ? 'Modifier la classe' : 'Nouvelle classe' }}
          </h2>
          <button
            (click)="closeClasseModal()"
            class="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Formulaire -->
        <form [formGroup]="classeForm" (ngSubmit)="saveClasse()" class="p-6">
          <div class="space-y-4">
            <!-- Nom -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Nom de la classe *
              </label>
              <input
                type="text"
                formControlName="nom"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ex: GI-3A"
              />
              @if (classeForm.get('nom')?.invalid && classeForm.get('nom')?.touched) {
                <p class="text-red-600 text-sm mt-1">Le nom est requis (min. 2 caract\xE8res)</p>
              }
            </div>

            <!-- Niveau -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Niveau *
              </label>
              <select
                formControlName="niveau"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">S\xE9lectionnez un niveau</option>
                <option value="L1">Licence 1 (L1)</option>
                <option value="L2">Licence 2 (L2)</option>
                <option value="L3">Licence 3 (L3)</option>
                <option value="M1">Master 1 (M1)</option>
                <option value="M2">Master 2 (M2)</option>
              </select>
              @if (classeForm.get('niveau')?.invalid && classeForm.get('niveau')?.touched) {
                <p class="text-red-600 text-sm mt-1">Veuillez s\xE9lectionner un niveau</p>
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
                @for (filiere of filieres(); track filiere.id) {
                  <option [value]="filiere.id">{{ filiere.nom }} - {{ getEcoleName(filiere.ecoleId) }}</option>
                }
              </select>
              @if (classeForm.get('filiereId')?.invalid && classeForm.get('filiereId')?.touched) {
                <p class="text-red-600 text-sm mt-1">Veuillez s\xE9lectionner une fili\xE8re</p>
              }
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mt-6 pt-6 border-t border-slate-200">
            <button
              type="button"
              (click)="closeClasseModal()"
              class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              [disabled]="classeForm.invalid"
              [class.opacity-50]="classeForm.invalid"
              [class.cursor-not-allowed]="classeForm.invalid"
              class="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:hover:bg-teal-600"
            >
              {{ editingClasse() ? 'Enregistrer' : 'Cr\xE9er' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  }
</div>
`, styles: ["/* src/app/features/admin/academic/academic.component.scss */\n.line-clamp-3 {\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n.modal-overlay {\n  animation: fadeIn 0.2s ease-in-out;\n}\n.modal-content {\n  animation: slideUp 0.3s ease-out;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes slideUp {\n  from {\n    transform: translateY(20px);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0);\n    opacity: 1;\n  }\n}\n.ecole-card,\n.filiere-card,\n.classe-card {\n  transition: all 0.3s ease;\n}\n.ecole-card:hover,\n.filiere-card:hover,\n.classe-card:hover {\n  transform: translateY(-2px);\n}\n/*# sourceMappingURL=academic.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AcademicComponent, { className: "AcademicComponent", filePath: "src/app/features/admin/academic/academic.component.ts", lineNumber: 23 });
})();
export {
  AcademicComponent
};
//# sourceMappingURL=chunk-GVUTETO2.js.map
