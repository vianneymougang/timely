import {
  AvailabilityService
} from "./chunk-I5BQUIP2.js";
import {
  AuthService
} from "./chunk-7G26F2KZ.js";
import "./chunk-SG7N3ZM6.js";
import "./chunk-M2M2Z2ZK.js";
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
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵdomProperty,
  ɵɵgetCurrentView,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-DBHCOGA3.js";
import "./chunk-WDMUDEB6.js";

// src/app/features/teacher/availability/teacher-availability.component.ts
var _forTrack0 = ($index, $item) => $item.key;
var _forTrack1 = ($index, $item) => $item.hour;
function TeacherAvailabilityComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(0, "svg", 33);
    \u0275\u0275domElement(1, "circle", 34)(2, "path", 35);
    \u0275\u0275domElementEnd();
    \u0275\u0275text(3, " Enregistrement... ");
  }
}
function TeacherAvailabilityComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(0, "svg", 36);
    \u0275\u0275domElement(1, "path", 37);
    \u0275\u0275domElementEnd();
    \u0275\u0275text(2, " Soumettre disponibilit\xE9s ");
  }
}
function TeacherAvailabilityComponent_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 19);
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(1, "svg", 38);
    \u0275\u0275domElement(2, "path", 39);
    \u0275\u0275domElementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275domElementStart(3, "span", 40);
    \u0275\u0275text(4);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.successMessage());
  }
}
function TeacherAvailabilityComponent_For_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "th", 25);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const day_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", day_r2.label, " ");
  }
}
function TeacherAvailabilityComponent_For_50_For_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 43)(1, "span", 45);
    \u0275\u0275text(2, "Pause");
    \u0275\u0275domElementEnd()();
  }
}
function TeacherAvailabilityComponent_For_50_For_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "button", 46);
    \u0275\u0275domListener("mousedown", function TeacherAvailabilityComponent_For_50_For_4_Conditional_2_Template_button_mousedown_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const day_r4 = \u0275\u0275nextContext().$implicit;
      const \u0275$index_105_r5 = \u0275\u0275nextContext().$index;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onMouseDown(\u0275$index_105_r5, day_r4.key, $event));
    })("mouseenter", function TeacherAvailabilityComponent_For_50_For_4_Conditional_2_Template_button_mouseenter_0_listener() {
      \u0275\u0275restoreView(_r3);
      const day_r4 = \u0275\u0275nextContext().$implicit;
      const \u0275$index_105_r5 = \u0275\u0275nextContext().$index;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onMouseEnter(\u0275$index_105_r5, day_r4.key));
    });
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const day_r4 = \u0275\u0275nextContext().$implicit;
    const slot_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classMap("w-full h-16 transition-all cursor-pointer select-none " + (slot_r6.slots[day_r4.key] ? "bg-emerald-400 hover:bg-emerald-500" : "bg-white hover:bg-slate-100"));
    \u0275\u0275attribute("aria-label", "Cr\xE9neau " + slot_r6.hour + " " + day_r4.label + (slot_r6.slots[day_r4.key] ? " s\xE9lectionn\xE9" : " non s\xE9lectionn\xE9"));
  }
}
function TeacherAvailabilityComponent_For_50_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "td", 42);
    \u0275\u0275conditionalCreate(1, TeacherAvailabilityComponent_For_50_For_4_Conditional_1_Template, 3, 0, "div", 43)(2, TeacherAvailabilityComponent_For_50_For_4_Conditional_2_Template, 1, 3, "button", 44);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const \u0275$index_105_r5 = \u0275\u0275nextContext().$index;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isPauseSlot(\u0275$index_105_r5) ? 1 : 2);
  }
}
function TeacherAvailabilityComponent_For_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "tr", 26)(1, "td", 41);
    \u0275\u0275text(2);
    \u0275\u0275domElementEnd();
    \u0275\u0275repeaterCreate(3, TeacherAvailabilityComponent_For_50_For_4_Template, 3, 1, "td", 42, _forTrack0);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const slot_r6 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", slot_r6.hour, " ");
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.weekDays);
  }
}
var TeacherAvailabilityComponent = class _TeacherAvailabilityComponent {
  authService = inject(AuthService);
  availabilityService = inject(AvailabilityService);
  currentUser = this.authService.currentUser;
  isSaving = signal(false, ...ngDevMode ? [{ debugName: "isSaving" }] : []);
  successMessage = signal("", ...ngDevMode ? [{ debugName: "successMessage" }] : []);
  isDragging = signal(false, ...ngDevMode ? [{ debugName: "isDragging" }] : []);
  dragMode = signal("select", ...ngDevMode ? [{ debugName: "dragMode" }] : []);
  // Jours de la semaine
  weekDays = [
    { key: "lundi", label: "Lundi" },
    { key: "mardi", label: "Mardi" },
    { key: "mercredi", label: "Mercredi" },
    { key: "jeudi", label: "Jeudi" },
    { key: "vendredi", label: "Vendredi" },
    { key: "samedi", label: "Samedi" }
  ];
  // Créneaux horaires (8h - 17h)
  timeSlots = signal([], ...ngDevMode ? [{ debugName: "timeSlots" }] : []);
  ngOnInit() {
    this.initializeTimeSlots();
    this.loadSavedAvailability();
  }
  initializeTimeSlots() {
    const slots = [];
    for (let hour = 8; hour < 17; hour++) {
      slots.push({
        hour: `${hour}h - ${hour + 1}h`,
        slots: {
          lundi: false,
          mardi: false,
          mercredi: false,
          jeudi: false,
          vendredi: false,
          samedi: false
        }
      });
    }
    this.timeSlots.set(slots);
  }
  isPauseSlot(hourIndex) {
    return hourIndex === 4;
  }
  loadSavedAvailability() {
    this.availabilityService.getMyAvailability().subscribe({
      next: (data) => {
        if (data && data.timeSlots) {
          this.timeSlots.set(data.timeSlots);
        }
      },
      error: (error) => {
        if (error?.status === 404) {
          console.log("No availability set yet");
        } else {
          console.error("Error loading availability:", error);
        }
      }
    });
  }
  toggleSlot(hourIndex, day) {
    if (this.isPauseSlot(hourIndex)) {
      return;
    }
    const currentSlots = this.timeSlots();
    const newSlots = JSON.parse(JSON.stringify(currentSlots));
    newSlots[hourIndex].slots[day] = !newSlots[hourIndex].slots[day];
    this.timeSlots.set(newSlots);
    this.successMessage.set("");
  }
  onMouseDown(hourIndex, day, event) {
    event.preventDefault();
    if (this.isPauseSlot(hourIndex)) {
      return;
    }
    this.isDragging.set(true);
    const currentValue = this.timeSlots()[hourIndex].slots[day];
    this.dragMode.set(currentValue ? "deselect" : "select");
    this.toggleSlot(hourIndex, day);
  }
  onMouseEnter(hourIndex, day) {
    if (this.isPauseSlot(hourIndex)) {
      return;
    }
    if (this.isDragging()) {
      const currentValue = this.timeSlots()[hourIndex].slots[day];
      const shouldSelect = this.dragMode() === "select";
      if (shouldSelect && !currentValue || !shouldSelect && currentValue) {
        this.toggleSlot(hourIndex, day);
      }
    }
  }
  onMouseUp() {
    this.isDragging.set(false);
  }
  clearAll() {
    const currentSlots = this.timeSlots();
    const slots = JSON.parse(JSON.stringify(currentSlots));
    slots.forEach((slot, index) => {
      if (!this.isPauseSlot(index)) {
        slot.slots = {
          lundi: false,
          mardi: false,
          mercredi: false,
          jeudi: false,
          vendredi: false,
          samedi: false
        };
      }
    });
    this.timeSlots.set(slots);
    this.successMessage.set("");
  }
  selectAll() {
    const currentSlots = this.timeSlots();
    const slots = JSON.parse(JSON.stringify(currentSlots));
    slots.forEach((slot, index) => {
      if (!this.isPauseSlot(index)) {
        slot.slots = {
          lundi: true,
          mardi: true,
          mercredi: true,
          jeudi: true,
          vendredi: true,
          samedi: true
        };
      }
    });
    this.timeSlots.set(slots);
    this.successMessage.set("");
  }
  selectWorkDays() {
    const currentSlots = this.timeSlots();
    const slots = JSON.parse(JSON.stringify(currentSlots));
    slots.forEach((slot, index) => {
      if (!this.isPauseSlot(index)) {
        slot.slots = {
          lundi: true,
          mardi: true,
          mercredi: true,
          jeudi: true,
          vendredi: true,
          samedi: false
        };
      }
    });
    this.timeSlots.set(slots);
    this.successMessage.set("");
  }
  submitAvailability() {
    this.isSaving.set(true);
    this.successMessage.set("");
    const availabilityData = {
      timeSlots: this.timeSlots()
    };
    this.availabilityService.saveMyAvailability(availabilityData).subscribe({
      next: () => {
        this.successMessage.set("\u2713 Disponibilit\xE9s enregistr\xE9es avec succ\xE8s !");
        this.isSaving.set(false);
        setTimeout(() => {
          this.successMessage.set("");
        }, 5e3);
      },
      error: (error) => {
        console.error("Error saving availability:", error);
        let errorMessage = "Erreur lors de l'enregistrement";
        if (error?.error?.message) {
          errorMessage = error.error.message;
        }
        alert(errorMessage);
        this.isSaving.set(false);
      }
    });
  }
  getSelectedSlotsCount() {
    return this.timeSlots().reduce((total, slot) => {
      return total + Object.values(slot.slots).filter((v) => v).length;
    }, 0);
  }
  getSelectedHoursCount() {
    return this.getSelectedSlotsCount();
  }
  static \u0275fac = function TeacherAvailabilityComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TeacherAvailabilityComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TeacherAvailabilityComponent, selectors: [["app-teacher-availability"]], decls: 66, vars: 5, consts: [[1, "flex-1", "p-8", "overflow-y-auto", 3, "mouseup", "mouseleave"], [1, "mb-8", "flex", "items-center", "justify-between", "gap-6", "flex-wrap"], [1, "text-3xl", "font-bold", "text-slate-800", "mb-1"], [1, "text-slate-500"], [1, "mt-8", "flex", "justify-end"], ["type", "button", 1, "px-8", "py-3", "bg-teal-600", "hover:bg-teal-700", "disabled:bg-slate-300", "disabled:cursor-not-allowed", "text-white", "font-semibold", "rounded-lg", "transition-colors", "flex", "items-center", "gap-2", 3, "click", "disabled"], [1, "bg-blue-50", "border", "border-blue-200", "rounded-xl", "p-4", "mb-6", "flex", "items-start", "gap-3"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-6", "h-6", "text-blue-600", "flex-shrink-0", "mt-0.5"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"], [1, "flex-1"], [1, "text-sm", "text-blue-800", "font-medium", "mb-1"], [1, "text-sm", "text-blue-700"], [1, "flex", "items-center", "justify-between", "mb-6", "flex-wrap", "gap-4"], [1, "flex", "items-center", "gap-6"], [1, "bg-white", "rounded-lg", "px-4", "py-2", "border", "border-slate-200"], [1, "text-sm", "text-slate-600"], [1, "font-bold", "text-teal-600"], [1, "flex", "items-center", "gap-2"], ["type", "button", 1, "px-4", "py-2", "bg-slate-100", "hover:bg-slate-200", "text-slate-700", "rounded-lg", "text-sm", "font-medium", "transition-colors", 3, "click"], [1, "bg-emerald-50", "border", "border-emerald-200", "text-emerald-700", "px-4", "py-3", "rounded-lg", "mb-6", "flex", "items-center", "gap-3", "animate-fade-in"], [1, "bg-white", "rounded-xl", "shadow-sm", "border", "border-slate-200", "overflow-hidden"], [1, "overflow-x-auto"], [1, "w-full", "border-collapse"], [1, "bg-slate-50"], [1, "sticky", "left-0", "z-10", "bg-slate-50", "px-4", "py-3", "text-left", "text-sm", "font-semibold", "text-slate-700", "border-b", "border-r", "border-slate-200", "min-w-[120px]"], [1, "px-4", "py-3", "text-center", "text-sm", "font-semibold", "text-slate-700", "border-b", "border-slate-200", "min-w-[140px]"], [1, "hover:bg-slate-50", "transition-colors"], [1, "mt-6", "flex", "items-center", "justify-center", "gap-6", "text-sm"], [1, "w-8", "h-8", "bg-emerald-400", "rounded", "border", "border-slate-300"], [1, "text-slate-600"], [1, "w-8", "h-8", "bg-white", "rounded", "border", "border-slate-300"], [1, "w-8", "h-8", "bg-slate-200", "rounded", "border", "border-slate-300", "flex", "items-center", "justify-center"], [1, "text-xs", "text-slate-500"], ["fill", "none", "viewBox", "0 0 24 24", 1, "animate-spin", "h-5", "w-5"], ["cx", "12", "cy", "12", "r", "10", "stroke", "currentColor", "stroke-width", "4", 1, "opacity-25"], ["fill", "currentColor", "d", "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z", 1, "opacity-75"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M12 19l9 2-9-18-9 18 9-2zm0 0v-8"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5", "flex-shrink-0"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"], [1, "font-medium"], [1, "sticky", "left-0", "z-10", "bg-white", "px-4", "py-3", "text-sm", "font-medium", "text-slate-700", "border-r", "border-slate-200"], [1, "border", "border-slate-200", "p-0"], [1, "w-full", "h-16", "bg-slate-200", "flex", "items-center", "justify-center", "cursor-not-allowed"], ["type", "button", 3, "class"], [1, "text-slate-500", "text-sm", "font-medium"], ["type", "button", 3, "mousedown", "mouseenter"]], template: function TeacherAvailabilityComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "main", 0);
      \u0275\u0275domListener("mouseup", function TeacherAvailabilityComponent_Template_main_mouseup_0_listener() {
        return ctx.onMouseUp();
      })("mouseleave", function TeacherAvailabilityComponent_Template_main_mouseleave_0_listener() {
        return ctx.onMouseUp();
      });
      \u0275\u0275domElementStart(1, "header", 1)(2, "div")(3, "h2", 2);
      \u0275\u0275text(4, " Disponibilit\xE9s hebdomadaires ");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(5, "p", 3);
      \u0275\u0275text(6, " D\xE9finir mes cr\xE9neaux de disponibilit\xE9 ");
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(7, "div", 4)(8, "button", 5);
      \u0275\u0275domListener("click", function TeacherAvailabilityComponent_Template_button_click_8_listener() {
        return ctx.submitAvailability();
      });
      \u0275\u0275conditionalCreate(9, TeacherAvailabilityComponent_Conditional_9_Template, 4, 0)(10, TeacherAvailabilityComponent_Conditional_10_Template, 3, 0);
      \u0275\u0275domElementEnd()()();
      \u0275\u0275domElementStart(11, "div", 6);
      \u0275\u0275namespaceSVG();
      \u0275\u0275domElementStart(12, "svg", 7);
      \u0275\u0275domElement(13, "path", 8);
      \u0275\u0275domElementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275domElementStart(14, "div", 9)(15, "p", 10);
      \u0275\u0275text(16, " Comment s\xE9lectionner vos disponibilit\xE9s ? ");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(17, "p", 11);
      \u0275\u0275text(18, " Cliquez sur une case pour la s\xE9lectionner/d\xE9s\xE9lectionner, ou maintenez le clic et glissez pour s\xE9lectionner plusieurs cr\xE9neaux \xE0 la fois. ");
      \u0275\u0275domElementEnd()()();
      \u0275\u0275domElementStart(19, "div", 12)(20, "div", 13)(21, "div", 14)(22, "span", 15);
      \u0275\u0275text(23, "Cr\xE9neaux s\xE9lectionn\xE9s : ");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(24, "span", 16);
      \u0275\u0275text(25);
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(26, "div", 14)(27, "span", 15);
      \u0275\u0275text(28, "Total heures : ");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(29, "span", 16);
      \u0275\u0275text(30);
      \u0275\u0275domElementEnd()()();
      \u0275\u0275domElementStart(31, "div", 17)(32, "button", 18);
      \u0275\u0275domListener("click", function TeacherAvailabilityComponent_Template_button_click_32_listener() {
        return ctx.selectWorkDays();
      });
      \u0275\u0275text(33, " Lun-Ven ");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(34, "button", 18);
      \u0275\u0275domListener("click", function TeacherAvailabilityComponent_Template_button_click_34_listener() {
        return ctx.selectAll();
      });
      \u0275\u0275text(35, " Tout s\xE9lectionner ");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(36, "button", 18);
      \u0275\u0275domListener("click", function TeacherAvailabilityComponent_Template_button_click_36_listener() {
        return ctx.clearAll();
      });
      \u0275\u0275text(37, " Tout effacer ");
      \u0275\u0275domElementEnd()()();
      \u0275\u0275conditionalCreate(38, TeacherAvailabilityComponent_Conditional_38_Template, 5, 1, "div", 19);
      \u0275\u0275domElementStart(39, "div", 20)(40, "div", 21)(41, "table", 22)(42, "thead")(43, "tr", 23)(44, "th", 24);
      \u0275\u0275text(45, " Horaires ");
      \u0275\u0275domElementEnd();
      \u0275\u0275repeaterCreate(46, TeacherAvailabilityComponent_For_47_Template, 2, 1, "th", 25, _forTrack0);
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(48, "tbody");
      \u0275\u0275repeaterCreate(49, TeacherAvailabilityComponent_For_50_Template, 5, 1, "tr", 26, _forTrack1);
      \u0275\u0275domElementEnd()()()();
      \u0275\u0275domElementStart(51, "div", 27)(52, "div", 17);
      \u0275\u0275domElement(53, "div", 28);
      \u0275\u0275domElementStart(54, "span", 29);
      \u0275\u0275text(55, "Disponible");
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(56, "div", 17);
      \u0275\u0275domElement(57, "div", 30);
      \u0275\u0275domElementStart(58, "span", 29);
      \u0275\u0275text(59, "Non disponible");
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(60, "div", 17)(61, "div", 31)(62, "span", 32);
      \u0275\u0275text(63, "P");
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(64, "span", 29);
      \u0275\u0275text(65, "Pause (12h-13h)");
      \u0275\u0275domElementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275domProperty("disabled", ctx.isSaving() || ctx.getSelectedSlotsCount() === 0);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isSaving() ? 9 : 10);
      \u0275\u0275advance(16);
      \u0275\u0275textInterpolate(ctx.getSelectedSlotsCount());
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1("", ctx.getSelectedHoursCount(), "h");
      \u0275\u0275advance(8);
      \u0275\u0275conditional(ctx.successMessage() ? 38 : -1);
      \u0275\u0275advance(8);
      \u0275\u0275repeater(ctx.weekDays);
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.timeSlots());
    }
  }, dependencies: [CommonModule], styles: ['@charset "UTF-8";\n\n\n\n@keyframes _ngcontent-%COMP%_fade-in {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.animate-fade-in[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fade-in 0.3s ease-out;\n}\n.select-none[_ngcontent-%COMP%] {\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\ntable[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th.sticky[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  z-index: 20;\n}\ntable[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td.sticky[_ngcontent-%COMP%] {\n  position: sticky;\n  left: 0;\n  z-index: 10;\n}\ntable[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover   td.sticky[_ngcontent-%COMP%] {\n  background-color: #f8fafc;\n}\n/*# sourceMappingURL=teacher-availability.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TeacherAvailabilityComponent, [{
    type: Component,
    args: [{ selector: "app-teacher-availability", standalone: true, imports: [CommonModule], template: `<main class="flex-1 p-8 overflow-y-auto" (mouseup)="onMouseUp()" (mouseleave)="onMouseUp()">
  <!-- Header -->
  <header class="mb-8 flex items-center justify-between gap-6 flex-wrap">
    <!-- Titre + sous-titre -->
    <div>
      <h2 class="text-3xl font-bold text-slate-800 mb-1">
        Disponibilit\xE9s hebdomadaires
      </h2>
      <p class="text-slate-500">
        D\xE9finir mes cr\xE9neaux de disponibilit\xE9
      </p>
    </div>
    <!-- Submit Button -->
    <div class="mt-8 flex justify-end">
      <button
        type="button"
        (click)="submitAvailability()"
        [disabled]="isSaving() || getSelectedSlotsCount() === 0"
        class="px-8 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
        @if (isSaving()) {
          <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Enregistrement...
        } @else {
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
          Soumettre disponibilit\xE9s
        }
      </button>
    </div>
  </header>

  <!-- Info Banner -->
  <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
    <svg
      class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <div class="flex-1">
      <p class="text-sm text-blue-800 font-medium mb-1">
        Comment s\xE9lectionner vos disponibilit\xE9s ?
      </p>
      <p class="text-sm text-blue-700">
        Cliquez sur une case pour la s\xE9lectionner/d\xE9s\xE9lectionner, ou maintenez le clic et glissez
        pour s\xE9lectionner plusieurs cr\xE9neaux \xE0 la fois.
      </p>
    </div>
  </div>

  <!-- Stats & Actions -->
  <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
    <div class="flex items-center gap-6">
      <div class="bg-white rounded-lg px-4 py-2 border border-slate-200">
        <span class="text-sm text-slate-600">Cr\xE9neaux s\xE9lectionn\xE9s : </span>
        <span class="font-bold text-teal-600">{{ getSelectedSlotsCount() }}</span>
      </div>
      <div class="bg-white rounded-lg px-4 py-2 border border-slate-200">
        <span class="text-sm text-slate-600">Total heures : </span>
        <span class="font-bold text-teal-600">{{ getSelectedHoursCount() }}h</span>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <button
        type="button"
        (click)="selectWorkDays()"
        class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
      >
        Lun-Ven
      </button>
      <button
        type="button"
        (click)="selectAll()"
        class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
      >
        Tout s\xE9lectionner
      </button>
      <button
        type="button"
        (click)="clearAll()"
        class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
      >
        Tout effacer
      </button>
    </div>
  </div>

  <!-- Success Message -->
  @if (successMessage()) {
  <div
    class="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-3 animate-fade-in"
  >
    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span class="font-medium">{{ successMessage() }}</span>
  </div>
  }

  <!-- Availability Grid -->
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-slate-50">
            <th
              class="sticky left-0 z-10 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b border-r border-slate-200 min-w-[120px]"
            >
              Horaires
            </th>
            @for (day of weekDays; track day.key) {
            <th
              class="px-4 py-3 text-center text-sm font-semibold text-slate-700 border-b border-slate-200 min-w-[140px]"
            >
              {{ day.label }}
            </th>
            }
          </tr>
        </thead>
        <tbody>
          @for (slot of timeSlots(); track slot.hour; let hourIndex = $index) {
          <tr class="hover:bg-slate-50 transition-colors">
            <td
              class="sticky left-0 z-10 bg-white px-4 py-3 text-sm font-medium text-slate-700 border-r border-slate-200"
            >
              {{ slot.hour }}
            </td>
            @for (day of weekDays; track day.key) {
            <td class="border border-slate-200 p-0">
              @if (isPauseSlot(hourIndex)) {
              <!-- Cellule de pause - non cliquable -->
              <div
                class="w-full h-16 bg-slate-200 flex items-center justify-center cursor-not-allowed"
              >
                <span class="text-slate-500 text-sm font-medium">Pause</span>
              </div>
              } @else {
              <!-- Cellule normale - cliquable -->
              <button
                type="button"
                (mousedown)="onMouseDown(hourIndex, day.key, $event)"
                (mouseenter)="onMouseEnter(hourIndex, day.key)"
                [class]="
                  'w-full h-16 transition-all cursor-pointer select-none ' +
                  (slot.slots[day.key]
                    ? 'bg-emerald-400 hover:bg-emerald-500'
                    : 'bg-white hover:bg-slate-100')
                "
                [attr.aria-label]="
                  'Cr\xE9neau ' +
                  slot.hour +
                  ' ' +
                  day.label +
                  (slot.slots[day.key] ? ' s\xE9lectionn\xE9' : ' non s\xE9lectionn\xE9')
                "
              ></button>
              }
            </td>
            }
          </tr>
          }
        </tbody>
      </table>
    </div>
  </div>

  <!-- Submit Button 
  <div class="mt-8 flex justify-end">
    <button
      type="button"
      (click)="submitAvailability()"
      [disabled]="isSaving() || getSelectedSlotsCount() === 0"
      class="px-8 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
    >
      @if (isSaving()) {
      <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      Enregistrement... } @else {
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
        />
      </svg>
      Soumettre disponibilit\xE9s }
    </button>
  </div>-->

  <!-- Legend -->
  <div class="mt-6 flex items-center justify-center gap-6 text-sm">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 bg-emerald-400 rounded border border-slate-300"></div>
      <span class="text-slate-600">Disponible</span>
    </div>
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 bg-white rounded border border-slate-300"></div>
      <span class="text-slate-600">Non disponible</span>
    </div>
    <div class="flex items-center gap-2">
      <div
        class="w-8 h-8 bg-slate-200 rounded border border-slate-300 flex items-center justify-center"
      >
        <span class="text-xs text-slate-500">P</span>
      </div>
      <span class="text-slate-600">Pause (12h-13h)</span>
    </div>
  </div>
</main>`, styles: ['@charset "UTF-8";\n\n/* src/app/features/teacher/availability/teacher-availability.component.scss */\n@keyframes fade-in {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.animate-fade-in {\n  animation: fade-in 0.3s ease-out;\n}\n.select-none {\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\ntable thead th.sticky {\n  position: sticky;\n  top: 0;\n  z-index: 20;\n}\ntable tbody td.sticky {\n  position: sticky;\n  left: 0;\n  z-index: 10;\n}\ntable tbody tr:hover td.sticky {\n  background-color: #f8fafc;\n}\n/*# sourceMappingURL=teacher-availability.component.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TeacherAvailabilityComponent, { className: "TeacherAvailabilityComponent", filePath: "src/app/features/teacher/availability/teacher-availability.component.ts", lineNumber: 23 });
})();
export {
  TeacherAvailabilityComponent
};
//# sourceMappingURL=chunk-W77YIQLK.js.map
