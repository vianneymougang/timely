import {
  AuthService
} from "./chunk-7G26F2KZ.js";
import {
  RouterModule
} from "./chunk-SG7N3ZM6.js";
import "./chunk-AL3K22XE.js";
import {
  CommonModule
} from "./chunk-GGDRA3L4.js";
import {
  Component,
  computed,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-DBHCOGA3.js";
import "./chunk-WDMUDEB6.js";

// src/app/features/teacher/dashboard/teacher-dashboard.component.ts
var _forTrack0 = ($index, $item) => $item.title;
var _forTrack1 = ($index, $item) => $item.day;
function TeacherDashboardComponent_For_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 24)(1, "div", 29)(2, "div", 30)(3, "h4", 31);
    \u0275\u0275text(4);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(5, "span");
    \u0275\u0275text(6);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(7, "span", 32);
    \u0275\u0275text(8);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(9, "div", 33)(10, "span");
    \u0275\u0275text(11);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(12, "span");
    \u0275\u0275text(13);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(14, "div", 34);
    \u0275\u0275text(15);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const course_r1 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(course_r1.title);
    \u0275\u0275advance();
    \u0275\u0275classMap("px-3 py-1 rounded-full text-xs font-semibold text-white " + course_r1.badgeColor);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", course_r1.badge, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", course_r1.timeStart, " - ", course_r1.timeEnd);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Classe: ", course_r1.classe);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Salle: ", course_r1.salle);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", course_r1.students, " \xE9tudiants ");
  }
}
function TeacherDashboardComponent_For_61_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 26)(1, "p", 35);
    \u0275\u0275text(2);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(3, "span", 36);
    \u0275\u0275text(4);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const notification_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(notification_r2.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(notification_r2.time);
  }
}
function TeacherDashboardComponent_For_67_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 28)(1, "div", 37);
    \u0275\u0275text(2);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(3, "div", 38);
    \u0275\u0275text(4);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(5, "div", 39);
    \u0275\u0275text(6);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const day_r3 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(day_r3.day);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(day_r3.courses);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(day_r3.hours);
  }
}
var TeacherDashboardComponent = class _TeacherDashboardComponent {
  authService = inject(AuthService);
  // User info
  currentUser = this.authService.currentUser;
  logout() {
    this.authService.logout();
  }
  // Current date
  currentDate = computed(() => {
    const today = /* @__PURE__ */ new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    return today.toLocaleDateString("fr-FR", options);
  }, ...ngDevMode ? [{ debugName: "currentDate" }] : []);
  // Stats
  stats = signal({
    todayCourses: 3,
    totalCourses: 12,
    weekHours: 24,
    notifications: 5
  }, ...ngDevMode ? [{ debugName: "stats" }] : []);
  // Today's courses
  todayCourses = signal([
    {
      title: "Math\xE9matiques Avanc\xE9es",
      badge: "En cours",
      badgeColor: "bg-emerald-500",
      timeStart: "08:00",
      timeEnd: "10:00",
      classe: "L3 Info",
      salle: "A101",
      students: 45
    },
    {
      title: "Algorithmique",
      badge: "\xC0 venir",
      badgeColor: "bg-blue-500",
      timeStart: "10:30",
      timeEnd: "12:30",
      classe: "L2 Info",
      salle: "B205",
      students: 38
    },
    {
      title: "Bases de donn\xE9es",
      badge: "\xC0 venir",
      badgeColor: "bg-slate-400",
      timeStart: "14:00",
      timeEnd: "16:00",
      classe: "M1 Info",
      salle: "C103",
      students: 32
    }
  ], ...ngDevMode ? [{ debugName: "todayCourses" }] : []);
  // Notifications
  notifications = signal([
    {
      title: "Nouvelle modification de l'emploi du temps",
      time: "Il y a 2h"
    },
    {
      title: "Rappel : R\xE9union p\xE9dagogique demain",
      time: "Il y a 4h"
    },
    {
      title: "Demande de rendez-vous \xE9tudiant",
      time: "Hier"
    },
    {
      title: "\xC9valuation de cours disponible",
      time: "Il y a 2 jours"
    },
    {
      title: "Nouveau document partag\xE9",
      time: "Il y a 3 jours"
    }
  ], ...ngDevMode ? [{ debugName: "notifications" }] : []);
  // Week overview
  weekOverview = signal([
    { day: "Lundi", courses: "3 cours", hours: "6h" },
    { day: "Mardi", courses: "4 cours", hours: "8h" },
    { day: "Mercredi", courses: "2 cours", hours: "4h" },
    { day: "Jeudi", courses: "3 cours", hours: "6h" },
    { day: "Vendredi", courses: "0 cours", hours: "0h" },
    { day: "Samedi", courses: "0 cours", hours: "0h" }
  ], ...ngDevMode ? [{ debugName: "weekOverview" }] : []);
  static \u0275fac = function TeacherDashboardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TeacherDashboardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TeacherDashboardComponent, selectors: [["app-teacher-sidebar"]], decls: 68, vars: 6, consts: [[1, "flex-1", "p-8", "overflow-y-auto"], [1, "mb-8"], [1, "text-3xl", "font-bold", "text-slate-800", "mb-1"], [1, "text-slate-500"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-4", "gap-4", "mb-8"], [1, "bg-white", "rounded-xl", "shadow-sm", "p-6", "border", "border-slate-200"], [1, "flex", "items-center", "justify-between", "mb-3"], [1, "text-sm", "text-slate-600", "mb-1"], [1, "text-4xl", "font-bold", "text-slate-800"], [1, "bg-blue-100", "p-3", "rounded-lg"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-8", "h-8", "text-blue-600"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"], [1, "bg-red-100", "p-3", "rounded-lg"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-8", "h-8", "text-red-600"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"], [1, "bg-emerald-100", "p-3", "rounded-lg"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-8", "h-8", "text-emerald-600"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"], [1, "grid", "grid-cols-1", "lg:grid-cols-3", "gap-6", "mb-8"], [1, "lg:col-span-2"], [1, "bg-white", "rounded-xl", "shadow-sm", "border", "border-slate-200", "p-6"], [1, "text-xl", "font-bold", "text-slate-800", "mb-6"], [1, "space-y-4"], [1, "bg-slate-50", "rounded-lg", "p-4", "border", "border-slate-200", "hover:shadow-md", "transition-shadow"], [1, "lg:col-span-1"], [1, "pb-4", "border-b", "border-slate-200", "last:border-0", "last:pb-0"], [1, "grid", "grid-cols-6", "gap-4"], [1, "text-center"], [1, "flex", "items-start", "justify-between", "mb-3"], [1, "flex", "items-start", "gap-3"], [1, "text-lg", "font-semibold", "text-slate-800"], [1, "text-sm", "font-medium", "text-slate-600"], [1, "flex", "items-center", "gap-4", "text-sm", "text-slate-600", "mb-2"], [1, "text-sm", "text-slate-600"], [1, "text-sm", "text-slate-700", "mb-2"], [1, "text-xs", "text-slate-500"], [1, "font-bold", "text-slate-800", "mb-3", "text-lg", "capitalize"], [1, "text-sm", "text-slate-600", "mb-2"], [1, "text-xl", "font-bold", "text-slate-800"]], template: function TeacherDashboardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "main", 0)(1, "header", 1)(2, "h2", 2);
      \u0275\u0275text(3);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(4, "p", 3);
      \u0275\u0275text(5);
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(6, "div", 4)(7, "div", 5)(8, "div", 6)(9, "div")(10, "p", 7);
      \u0275\u0275text(11, "Cours d'aujourd'hui");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(12, "p", 8);
      \u0275\u0275text(13);
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(14, "div", 9);
      \u0275\u0275namespaceSVG();
      \u0275\u0275domElementStart(15, "svg", 10);
      \u0275\u0275domElement(16, "path", 11);
      \u0275\u0275domElementEnd()()()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275domElementStart(17, "div", 5)(18, "div", 6)(19, "div")(20, "p", 7);
      \u0275\u0275text(21, "Nombre de cours");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(22, "p", 8);
      \u0275\u0275text(23);
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(24, "div", 12);
      \u0275\u0275namespaceSVG();
      \u0275\u0275domElementStart(25, "svg", 13);
      \u0275\u0275domElement(26, "path", 14);
      \u0275\u0275domElementEnd()()()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275domElementStart(27, "div", 5)(28, "div", 6)(29, "div")(30, "p", 7);
      \u0275\u0275text(31, "Heures cette semaine");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(32, "p", 8);
      \u0275\u0275text(33);
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(34, "div", 15);
      \u0275\u0275namespaceSVG();
      \u0275\u0275domElementStart(35, "svg", 16);
      \u0275\u0275domElement(36, "path", 17);
      \u0275\u0275domElementEnd()()()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275domElementStart(37, "div", 5)(38, "div", 6)(39, "div")(40, "p", 7);
      \u0275\u0275text(41, "Notifications non lues");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(42, "p", 8);
      \u0275\u0275text(43);
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(44, "div", 9);
      \u0275\u0275namespaceSVG();
      \u0275\u0275domElementStart(45, "svg", 10);
      \u0275\u0275domElement(46, "path", 18);
      \u0275\u0275domElementEnd()()()()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275domElementStart(47, "div", 19)(48, "div", 20)(49, "div", 21)(50, "h3", 22);
      \u0275\u0275text(51, "Mes cours d'aujourd'hui");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(52, "div", 23);
      \u0275\u0275repeaterCreate(53, TeacherDashboardComponent_For_54_Template, 16, 9, "div", 24, _forTrack0);
      \u0275\u0275domElementEnd()()();
      \u0275\u0275domElementStart(55, "div", 25)(56, "div", 21)(57, "h3", 22);
      \u0275\u0275text(58, "Notifications r\xE9centes");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(59, "div", 23);
      \u0275\u0275repeaterCreate(60, TeacherDashboardComponent_For_61_Template, 5, 2, "div", 26, _forTrack0);
      \u0275\u0275domElementEnd()()()();
      \u0275\u0275domElementStart(62, "div", 21)(63, "h3", 22);
      \u0275\u0275text(64, "Aper\xE7u de la semaine");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(65, "div", 27);
      \u0275\u0275repeaterCreate(66, TeacherDashboardComponent_For_67_Template, 7, 3, "div", 28, _forTrack1);
      \u0275\u0275domElementEnd()()();
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1(" Bienvenue, Pr. ", (tmp_0_0 = ctx.currentUser()) == null ? null : tmp_0_0.name, " ");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.currentDate());
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate(ctx.stats().todayCourses);
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate(ctx.stats().totalCourses);
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate(ctx.stats().weekHours);
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate(ctx.stats().notifications);
      \u0275\u0275advance(10);
      \u0275\u0275repeater(ctx.todayCourses());
      \u0275\u0275advance(7);
      \u0275\u0275repeater(ctx.notifications());
      \u0275\u0275advance(6);
      \u0275\u0275repeater(ctx.weekOverview());
    }
  }, dependencies: [CommonModule, RouterModule], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TeacherDashboardComponent, [{
    type: Component,
    args: [{ selector: "app-teacher-sidebar", standalone: true, imports: [CommonModule, RouterModule], template: `<!-- Main Content UNIQUEMENT -->
<main class="flex-1 p-8 overflow-y-auto">
  <!-- Header -->
  <header class="mb-8">
    <h2 class="text-3xl font-bold text-slate-800 mb-1">
      Bienvenue, Pr. {{ currentUser()?.name }}
    </h2>
    <p class="text-slate-500">{{ currentDate() }}</p>
  </header>

  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <!-- Card 1 -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
      <div class="flex items-center justify-between mb-3">
        <div>
          <p class="text-sm text-slate-600 mb-1">Cours d'aujourd'hui</p>
          <p class="text-4xl font-bold text-slate-800">{{ stats().todayCourses }}</p>
        </div>
        <div class="bg-blue-100 p-3 rounded-lg">
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Card 2 -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
      <div class="flex items-center justify-between mb-3">
        <div>
          <p class="text-sm text-slate-600 mb-1">Nombre de cours</p>
          <p class="text-4xl font-bold text-slate-800">{{ stats().totalCourses }}</p>
        </div>
        <div class="bg-red-100 p-3 rounded-lg">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Card 3 -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
      <div class="flex items-center justify-between mb-3">
        <div>
          <p class="text-sm text-slate-600 mb-1">Heures cette semaine</p>
          <p class="text-4xl font-bold text-slate-800">{{ stats().weekHours }}</p>
        </div>
        <div class="bg-emerald-100 p-3 rounded-lg">
          <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Card 4 -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
      <div class="flex items-center justify-between mb-3">
        <div>
          <p class="text-sm text-slate-600 mb-1">Notifications non lues</p>
          <p class="text-4xl font-bold text-slate-800">{{ stats().notifications }}</p>
        </div>
        <div class="bg-blue-100 p-3 rounded-lg">
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
        </div>
      </div>
    </div>
  </div>

  <!-- Two Columns Layout -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
    <!-- Today's Courses -->
    <div class="lg:col-span-2">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 class="text-xl font-bold text-slate-800 mb-6">Mes cours d'aujourd'hui</h3>

        <div class="space-y-4">
          @for (course of todayCourses(); track course.title) {
            <div class="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-start gap-3">
                  <h4 class="text-lg font-semibold text-slate-800">{{ course.title }}</h4>
                  <span [class]="'px-3 py-1 rounded-full text-xs font-semibold text-white ' + course.badgeColor">
                    {{ course.badge }}
                  </span>
                </div>
                <span class="text-sm font-medium text-slate-600">{{ course.timeStart }} - {{ course.timeEnd }}</span>
              </div>

              <div class="flex items-center gap-4 text-sm text-slate-600 mb-2">
                <span>Classe: {{ course.classe }}</span>
                <span>Salle: {{ course.salle }}</span>
              </div>

              <div class="text-sm text-slate-600">
                {{ course.students }} \xE9tudiants
              </div>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Notifications -->
    <div class="lg:col-span-1">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 class="text-xl font-bold text-slate-800 mb-6">Notifications r\xE9centes</h3>

        <div class="space-y-4">
          @for (notification of notifications(); track notification.title) {
            <div class="pb-4 border-b border-slate-200 last:border-0 last:pb-0">
              <p class="text-sm text-slate-700 mb-2">{{ notification.title }}</p>
              <span class="text-xs text-slate-500">{{ notification.time }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  </div>

  <!-- Week Overview -->
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
    <h3 class="text-xl font-bold text-slate-800 mb-6">Aper\xE7u de la semaine</h3>

    <div class="grid grid-cols-6 gap-4">
      @for (day of weekOverview(); track day.day) {
        <div class="text-center">
          <div class="font-bold text-slate-800 mb-3 text-lg capitalize">{{ day.day }}</div>
          <div class="text-sm text-slate-600 mb-2">{{ day.courses }}</div>
          <div class="text-xl font-bold text-slate-800">{{ day.hours }}</div>
        </div>
      }
    </div>
  </div>
</main>
` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TeacherDashboardComponent, { className: "TeacherDashboardComponent", filePath: "src/app/features/teacher/dashboard/teacher-dashboard.component.ts", lineNumber: 33 });
})();
export {
  TeacherDashboardComponent
};
//# sourceMappingURL=chunk-H2FXQJ5F.js.map
