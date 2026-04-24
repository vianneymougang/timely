import {
  AuthService
} from "./chunk-7G26F2KZ.js";
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
  bootstrapApplication,
  provideRouter
} from "./chunk-SG7N3ZM6.js";
import "./chunk-AL3K22XE.js";
import {
  CommonModule,
  provideHttpClient,
  withInterceptors
} from "./chunk-GGDRA3L4.js";
import {
  BehaviorSubject,
  Component,
  Injectable,
  catchError,
  inject,
  provideZoneChangeDetection,
  setClassMetadata,
  signal,
  switchMap,
  throwError,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-DBHCOGA3.js";
import "./chunk-WDMUDEB6.js";

// src/app/core/guards/auth.guard.ts
var authGuard = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.checkAuth()) {
    return true;
  }
  router.navigate(["/auth/login"]);
  return false;
};

// src/app/core/guards/role.guard.ts
var adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }
  router.navigate(["/auth/login"]);
  return false;
};
var teacherGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated() && authService.isTeacher()) {
    return true;
  }
  router.navigate(["/auth/login"]);
  return false;
};

// src/app/core/services/ThemeService.ts
var ThemeService = class _ThemeService {
  themeSubject = new BehaviorSubject("light");
  theme$ = this.themeSubject.asObservable();
  constructor() {
    const savedTheme = localStorage.getItem("app-theme");
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme("light");
    }
  }
  setTheme(theme) {
    this.themeSubject.next(theme);
    localStorage.setItem("app-theme", theme);
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }
  toggleTheme() {
    const current = this.themeSubject.value;
    this.setTheme(current === "light" ? "dark" : "light");
  }
  static \u0275fac = function ThemeService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ThemeService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ThemeService, factory: _ThemeService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ThemeService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// src/app/shared/components/sidebar/sidebar.component.ts
var _forTrack0 = ($index, $item) => $item.route;
function SidebarComponent_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 6)(1, "span", 19);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    \u0275\u0275property("routerLink", item_r1.route);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r1.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r1.label);
  }
}
function SidebarComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getUserInitials(ctx_r1.currentUser().name), " ");
  }
}
var SidebarComponent = class _SidebarComponent {
  themeService;
  authService = inject(AuthService);
  router = inject(Router);
  menuItems = [
    { icon: "dashboard", label: "Tableau de bord", route: "/admin/dashboard" },
    { icon: "schedule", label: "Emplois du temps", route: "/admin/schedule" },
    { icon: "event_note", label: "R\xE9servations", route: "/admin/reservations" },
    { icon: "school", label: "Enseignants", route: "/admin/teachers" },
    { icon: "school", label: "\xC9tudiants", route: "/admin/students" },
    { icon: "menu_book", label: "Cours & UE", route: "/admin/courses" },
    { icon: "account_tree", label: "\xC9coles & Fili\xE8res", route: "/admin/academic" },
    { icon: "meeting_room", label: "Salles", route: "/admin/room" },
    { icon: "inventory_2", label: "Ressources", route: "/admin/resources" },
    { icon: "bar_chart", label: "Statistiques", route: "/admin/statistics" },
    { icon: "settings", label: "Param\xE8tres", route: "/admin/settings" }
  ];
  currentUser = this.authService.currentUser;
  logout() {
    this.authService.logout();
  }
  currentTheme = "light";
  constructor(themeService) {
    this.themeService = themeService;
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }
  toggleTheme() {
    this.themeService.toggleTheme();
  }
  /**
   * Get user initials from name
   * Examples: "John Doe" -> "JD", "Admin" -> "AD"
   */
  getUserInitials(name) {
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  static \u0275fac = function SidebarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SidebarComponent)(\u0275\u0275directiveInject(ThemeService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SidebarComponent, selectors: [["app-sidebar"]], decls: 27, vars: 4, consts: [[1, "w-64", "bg-white", "shadow-lg", "flex", "flex-col", "h-screen", "sticky", "top-0"], [1, "p-6", "border-b", "flex", "items-center", "gap-3"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-8", "h-8", "text-teal-600"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"], [1, "text-xl", "font-bold", "text-slate-800"], [1, "flex-1", "p-4", "overflow-y-auto"], ["routerLinkActive", "bg-teal-50 text-teal-700 font-medium", 1, "flex", "items-center", "gap-3", "w-full", "p-3", "rounded-lg", "mb-1", "transition-colors", "text-slate-600", "hover:bg-slate-50", 3, "routerLink"], [1, "p-4", "border-t"], [1, "flex", "items-center", "gap-3", "text-slate-600", "hover:text-slate-800", "w-full", "p-2", "rounded-lg", "hover:bg-slate-100", "transition-colors", 3, "click"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"], [1, "p-4", "border-t", "bg-slate-50"], [1, "flex", "items-center", "gap-3"], [1, "w-12", "h-12", "bg-slate-300", "rounded-full", "flex", "items-center", "justify-center"], [1, "text-slate-600", "font-semibold", "text-lg"], [1, "flex-1"], [1, "font-semibold", "text-slate-800", "text-sm"], [1, "text-sm", "text-slate-600"], [1, "text-xs", "text-slate-500", "truncate"], [1, "material-icons", "text-xl"]], template: function SidebarComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(2, "svg", 2);
      \u0275\u0275element(3, "path", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(4, "span", 4);
      \u0275\u0275text(5, "Timely");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "nav", 5);
      \u0275\u0275repeaterCreate(7, SidebarComponent_For_8_Template, 5, 3, "a", 6, _forTrack0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "div", 7)(10, "button", 8);
      \u0275\u0275listener("click", function SidebarComponent_Template_button_click_10_listener() {
        return ctx.logout();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(11, "svg", 9);
      \u0275\u0275element(12, "path", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(13, "span");
      \u0275\u0275text(14, "Se d\xE9connecter");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(15, "div", 11)(16, "div", 12)(17, "div", 13)(18, "span", 14);
      \u0275\u0275conditionalCreate(19, SidebarComponent_Conditional_19_Template, 1, 1);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "div", 15)(21, "p", 16);
      \u0275\u0275text(22);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "p", 17);
      \u0275\u0275text(24);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "p", 18);
      \u0275\u0275text(26);
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      let tmp_2_0;
      let tmp_3_0;
      let tmp_4_0;
      \u0275\u0275advance(7);
      \u0275\u0275repeater(ctx.menuItems);
      \u0275\u0275advance(12);
      \u0275\u0275conditional(ctx.currentUser() ? 19 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate((tmp_2_0 = ctx.currentUser()) == null ? null : tmp_2_0.role);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate((tmp_3_0 = ctx.currentUser()) == null ? null : tmp_3_0.name);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate((tmp_4_0 = ctx.currentUser()) == null ? null : tmp_4_0.email);
    }
  }, dependencies: [CommonModule, RouterModule, RouterLink, RouterLinkActive], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarComponent, [{
    type: Component,
    args: [{ selector: "app-sidebar", standalone: true, imports: [CommonModule, RouterModule], template: `<div class="w-64 bg-white shadow-lg flex flex-col h-screen sticky top-0">
  <!-- Logo -->
  <div class="p-6 border-b flex items-center gap-3">
    <svg class="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
    <span class="text-xl font-bold text-slate-800">Timely</span>
    <!--<button (click)="toggleTheme()">
      {{ currentTheme === 'dark' ? '\u2600\uFE0F Light' : '\u{1F319} Dark' }}
    </button>-->
  </div>

  <!-- Navigation -->
  <nav class="flex-1 p-4 overflow-y-auto">
    @for (item of menuItems; track item.route) {
    <a
      [routerLink]="item.route"
      routerLinkActive="bg-teal-50 text-teal-700 font-medium"
      class="flex items-center gap-3 w-full p-3 rounded-lg mb-1 transition-colors text-slate-600 hover:bg-slate-50"
    >
      <span class="material-icons text-xl">{{ item.icon }}</span>
      <span>{{ item.label }}</span>
    </a>
    }
  </nav>

  <!-- Logout -->
  <div class="p-4 border-t">
    <button
      (click)="logout()"
      class="flex items-center gap-3 text-slate-600 hover:text-slate-800 w-full p-2 rounded-lg hover:bg-slate-100 transition-colors"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      <span>Se d\xE9connecter</span>
    </button>
  </div>

  <!-- User Profile -->
  <div class="p-4 border-t bg-slate-50">
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center">
        <span class="text-slate-600 font-semibold text-lg">
          @if (currentUser()) {
          {{ getUserInitials(currentUser()!.name) }}
          }
        </span>
      </div>
      <div class="flex-1">
        <p class="font-semibold text-slate-800 text-sm">{{ currentUser()?.role }}</p>
        <p class="text-sm text-slate-600">{{ currentUser()?.name }}</p>
        <p class="text-xs text-slate-500 truncate">{{ currentUser()?.email }}</p>
      </div>
    </div>
  </div>
</div>
` }]
  }], () => [{ type: ThemeService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SidebarComponent, { className: "SidebarComponent", filePath: "src/app/shared/components/sidebar/sidebar.component.ts", lineNumber: 20 });
})();

// src/app/layouts/admin-layout/admin-layout.component.ts
var AdminLayoutComponent = class _AdminLayoutComponent {
  static \u0275fac = function AdminLayoutComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminLayoutComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminLayoutComponent, selectors: [["app-admin-layout"]], decls: 4, vars: 0, consts: [[1, "min-h-screen", "bg-slate-50", "flex"], [1, "flex-1"]], template: function AdminLayoutComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "app-sidebar");
      \u0275\u0275elementStart(2, "div", 1);
      \u0275\u0275element(3, "router-outlet");
      \u0275\u0275elementEnd()();
    }
  }, dependencies: [CommonModule, RouterModule, RouterOutlet, SidebarComponent], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminLayoutComponent, [{
    type: Component,
    args: [{
      selector: "app-admin-layout",
      standalone: true,
      imports: [CommonModule, RouterModule, SidebarComponent],
      template: `
    <div class="min-h-screen bg-slate-50 flex">
      <app-sidebar></app-sidebar>
      <div class="flex-1">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminLayoutComponent, { className: "AdminLayoutComponent", filePath: "src/app/layouts/admin-layout/admin-layout.component.ts", lineNumber: 19 });
})();

// src/app/shared/components/teacher-sidebar/teacher-sidebar.component.ts
var _forTrack02 = ($index, $item) => $item.route;
function TeacherSidebarComponent_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 7)(1, "span", 19);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    \u0275\u0275property("routerLink", item_r1.route);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r1.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r1.label);
  }
}
function TeacherSidebarComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate2(" ", ctx_r1.currentUser().name.split(" ")[0].charAt(0), "", (tmp_1_0 = ctx_r1.currentUser().name.split(" ")[1]) == null ? null : tmp_1_0.charAt(0), " ");
  }
}
var TeacherSidebarComponent = class _TeacherSidebarComponent {
  authService = inject(AuthService);
  router = inject(Router);
  currentUser = this.authService.currentUser;
  menuItems = [
    { icon: "dashboard", label: "Mon tableau de bord", route: "/teacher/dashboard" },
    { icon: "schedule", label: "Mon emplois du temps", route: "/teacher/schedule" },
    { icon: "access_time", label: "Mes disponibilit\xE9s", route: "/teacher/availability" },
    { icon: "notifications", label: "Mes notifications", route: "/teacher/notifications" },
    { icon: "person", label: "Mon profil", route: "/teacher/profile" }
  ];
  logout() {
    this.authService.logout();
  }
  static \u0275fac = function TeacherSidebarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TeacherSidebarComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TeacherSidebarComponent, selectors: [["app-teacher-sidebar"]], decls: 28, vars: 3, consts: [[1, "w-80", "bg-white", "shadow-lg", "flex", "flex-col", "h-screen", "sticky", "top-0"], [1, "p-6", "border-b"], [1, "flex", "items-center", "gap-3"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-10", "h-10", "text-slate-700"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"], [1, "text-2xl", "font-bold", "text-slate-800"], [1, "flex-1", "p-4", "overflow-y-auto"], ["routerLinkActive", "bg-teal-50 text-teal-700 font-medium", 1, "w-full", "flex", "items-center", "gap-3", "px-4", "py-3", "text-slate-600", "hover:bg-slate-50", "rounded-lg", "mb-2", "transition-colors", 3, "routerLink"], [1, "p-4", "border-t"], [1, "w-full", "flex", "items-center", "gap-3", "px-4", "py-3", "text-slate-600", "hover:bg-slate-50", "rounded-lg", "transition-colors", 3, "click"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"], [1, "p-4", "border-t", "bg-slate-50"], [1, "w-12", "h-12", "bg-slate-300", "rounded-full", "flex", "items-center", "justify-center"], [1, "text-slate-600", "font-semibold", "text-lg"], [1, "flex-1"], [1, "font-semibold", "text-slate-800", "text-sm"], [1, "text-sm", "text-slate-600"], [1, "text-xs", "text-slate-500", "truncate"], [1, "material-icons", "text-xl"]], template: function TeacherSidebarComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "aside", 0)(1, "div", 1)(2, "div", 2);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(3, "svg", 3);
      \u0275\u0275element(4, "path", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(5, "h1", 5);
      \u0275\u0275text(6, "Timely");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(7, "nav", 6);
      \u0275\u0275repeaterCreate(8, TeacherSidebarComponent_For_9_Template, 5, 3, "a", 7, _forTrack02);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "div", 8)(11, "button", 9);
      \u0275\u0275listener("click", function TeacherSidebarComponent_Template_button_click_11_listener() {
        return ctx.logout();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(12, "svg", 10);
      \u0275\u0275element(13, "path", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(14, "span");
      \u0275\u0275text(15, "Se d\xE9connecter");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(16, "div", 12)(17, "div", 2)(18, "div", 13)(19, "span", 14);
      \u0275\u0275conditionalCreate(20, TeacherSidebarComponent_Conditional_20_Template, 1, 2);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(21, "div", 15)(22, "p", 16);
      \u0275\u0275text(23, "Enseignant");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "p", 17);
      \u0275\u0275text(25);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "p", 18);
      \u0275\u0275text(27);
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      let tmp_2_0;
      let tmp_3_0;
      \u0275\u0275advance(8);
      \u0275\u0275repeater(ctx.menuItems);
      \u0275\u0275advance(12);
      \u0275\u0275conditional(ctx.currentUser() ? 20 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate((tmp_2_0 = ctx.currentUser()) == null ? null : tmp_2_0.name);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate((tmp_3_0 = ctx.currentUser()) == null ? null : tmp_3_0.email);
    }
  }, dependencies: [CommonModule, RouterModule, RouterLink, RouterLinkActive], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TeacherSidebarComponent, [{
    type: Component,
    args: [{
      selector: "app-teacher-sidebar",
      standalone: true,
      imports: [CommonModule, RouterModule],
      template: `
    <aside class="w-80 bg-white shadow-lg flex flex-col h-screen sticky top-0">
      <!-- Logo -->
      <div class="p-6 border-b">
        <div class="flex items-center gap-3">
          <svg class="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <h1 class="text-2xl font-bold text-slate-800">Timely</h1>
        </div>
      </div>

      <!-- Menu -->
      <nav class="flex-1 p-4 overflow-y-auto">
        @for (item of menuItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-teal-50 text-teal-700 font-medium"
            class="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg mb-2 transition-colors">
            <span class="material-icons text-xl">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- Logout -->
      <div class="p-4 border-t">
        <button
          (click)="logout()"
          class="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span>Se d\xE9connecter</span>
        </button>
      </div>

      <!-- User Profile -->
      <div class="p-4 border-t bg-slate-50">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center">
            <span class="text-slate-600 font-semibold text-lg">
              @if (currentUser()) {
                {{ currentUser()!.name.split(' ')[0].charAt(0) }}{{ currentUser()!.name.split(' ')[1]?.charAt(0) }}
              }
            </span>
          </div>
          <div class="flex-1">
            <p class="font-semibold text-slate-800 text-sm">Enseignant</p>
            <p class="text-sm text-slate-600">{{ currentUser()?.name }}</p>
            <p class="text-xs text-slate-500 truncate">{{ currentUser()?.email }}</p>
          </div>
        </div>
      </div>
    </aside>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TeacherSidebarComponent, { className: "TeacherSidebarComponent", filePath: "src/app/shared/components/teacher-sidebar/teacher-sidebar.component.ts", lineNumber: 75 });
})();

// src/app/layouts/teacher-layout/teacher-layout.component.ts
var TeacherLayoutComponent = class _TeacherLayoutComponent {
  static \u0275fac = function TeacherLayoutComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TeacherLayoutComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TeacherLayoutComponent, selectors: [["app-teacher-layout"]], decls: 4, vars: 0, consts: [[1, "min-h-screen", "bg-slate-50", "flex"], [1, "flex-1"]], template: function TeacherLayoutComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "app-teacher-sidebar");
      \u0275\u0275elementStart(2, "div", 1);
      \u0275\u0275element(3, "router-outlet");
      \u0275\u0275elementEnd()();
    }
  }, dependencies: [CommonModule, RouterModule, RouterOutlet, TeacherSidebarComponent], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TeacherLayoutComponent, [{
    type: Component,
    args: [{
      selector: "app-teacher-layout",
      standalone: true,
      imports: [CommonModule, RouterModule, TeacherSidebarComponent],
      template: `
    <div class="min-h-screen bg-slate-50 flex">
      <app-teacher-sidebar></app-teacher-sidebar>
      <div class="flex-1">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TeacherLayoutComponent, { className: "TeacherLayoutComponent", filePath: "src/app/layouts/teacher-layout/teacher-layout.component.ts", lineNumber: 19 });
})();

// src/app/app.routes.ts
var routes = [
  {
    path: "",
    redirectTo: "/auth/login",
    pathMatch: "full"
  },
  {
    path: "auth/login",
    loadComponent: () => import("./chunk-OXXVVYZP.js").then((m) => m.LoginComponent)
  },
  {
    path: "auth/forgot-password",
    loadComponent: () => import("./chunk-RKMQDYHS.js").then((m) => m.ForgotPasswordComponent)
  },
  {
    path: "auth/verify-code",
    loadComponent: () => import("./chunk-DPYTAPG5.js").then((m) => m.VerifyCodeComponent)
  },
  {
    path: "auth/reset-password",
    loadComponent: () => import("./chunk-LM7R5KQ5.js").then((m) => m.ResetPasswordComponent)
  },
  // Routes Admin avec Layout
  {
    path: "admin",
    component: AdminLayoutComponent,
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import("./chunk-RC6ZZX35.js").then((m) => m.ADMIN_ROUTES)
  },
  // Routes Teacher avec Layout
  {
    path: "teacher",
    component: TeacherLayoutComponent,
    canActivate: [authGuard, teacherGuard],
    loadChildren: () => import("./chunk-I7PWA33D.js").then((m) => m.TEACHER_ROUTES)
  },
  {
    path: "**",
    redirectTo: "/auth/login"
  }
];

// src/app/core/interceptors/auth.interceptor.ts
var authInterceptor = (req, next) => {
  const authService = inject(AuthService);
  const publicEndpoints = ["/api/auth/login", "/api/auth/refresh"];
  const isPublicEndpoint = publicEndpoints.some((endpoint) => req.url.includes(endpoint));
  if (isPublicEndpoint) {
    return next(req);
  }
  const token = authService.getAccessToken();
  if (token) {
    const cloned = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${token}`)
    });
    return next(cloned).pipe(catchError((error) => {
      if (error.status === 401) {
        const refreshToken = authService.getRefreshToken();
        if (refreshToken) {
          return authService.refreshToken().pipe(switchMap(() => {
            const newToken = authService.getAccessToken();
            const retryReq = req.clone({
              headers: req.headers.set("Authorization", `Bearer ${newToken}`)
            });
            return next(retryReq);
          }), catchError((refreshError) => {
            authService.logout();
            return throwError(() => refreshError);
          }));
        }
        authService.logout();
      }
      return throwError(() => error);
    }));
  }
  return next(req);
};

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};

// src/app/app.ts
var App = class _App {
  title = signal("timely-frontend", ...ngDevMode ? [{ debugName: "title" }] : []);
  static \u0275fac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _App, selectors: [["app-root"]], decls: 1, vars: 0, template: function App_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "router-outlet");
    }
  }, dependencies: [RouterOutlet], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(App, [{
    type: Component,
    args: [{ selector: "app-root", imports: [RouterOutlet], template: "<router-outlet />\n" }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(App, { className: "App", filePath: "src/app/app.ts", lineNumber: 10 });
})();

// src/main.ts
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
//# sourceMappingURL=main.js.map
