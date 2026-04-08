import {
  AuthService
} from "./chunk-7G26F2KZ.js";
import {
  RouterLink,
  RouterModule
} from "./chunk-SG7N3ZM6.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  ɵNgNoValidate
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
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtext,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-DBHCOGA3.js";
import "./chunk-WDMUDEB6.js";

// src/app/features/auth/login/login.component.ts
function LoginComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.errorMessage(), " ");
  }
}
function LoginComponent_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Connexion...");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Se Connecter");
    \u0275\u0275elementEnd();
  }
}
var LoginComponent = class _LoginComponent {
  authService = inject(AuthService);
  email = signal("", ...ngDevMode ? [{ debugName: "email" }] : []);
  password = signal("", ...ngDevMode ? [{ debugName: "password" }] : []);
  errorMessage = signal("", ...ngDevMode ? [{ debugName: "errorMessage" }] : []);
  isLoading = signal(false, ...ngDevMode ? [{ debugName: "isLoading" }] : []);
  // Comptes rapides pour le développement
  quickAccess = [
    {
      label: "Administrateur",
      email: "admin@isjcam.org",
      icon: "\u{1F468}\u200D\u{1F4BC}",
      description: "Acc\xE8s complet"
    },
    {
      label: "Enseignant",
      email: "arthur.pessah@isjcam.org",
      icon: "\u{1F468}\u200D\u{1F3EB}",
      description: "Dashboard personnel"
    }
  ];
  fillCredentials(email) {
    this.email.set(email);
    if (email === "admin@isjcam.org") {
      this.password.set("admin123");
    } else {
      this.password.set("teacher123");
    }
  }
  onSubmit() {
    if (!this.email() || !this.password()) {
      this.errorMessage.set("Veuillez remplir tous les champs");
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set("");
    this.authService.login(this.email(), this.password()).subscribe({
      next: () => {
      },
      error: (error) => {
        this.errorMessage.set(error.message || "Email ou mot de passe incorrect");
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
  static \u0275fac = function LoginComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoginComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], decls: 36, vars: 5, consts: [[1, "min-h-screen", "bg-gradient-to-br", "from-blue-50", "to-slate-100", "flex", "items-center", "justify-center", "p-4"], [1, "bg-white", "rounded-2xl", "shadow-xl", "p-8", "w-full", "max-w-md"], [1, "flex", "justify-center", "mb-6"], [1, "bg-slate-100", "p-4", "rounded-full"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-12", "h-12", "text-teal-600"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"], [1, "text-center", "mb-8"], [1, "text-2xl", "font-bold", "text-slate-800", "mb-2"], [1, "text-lg", "font-semibold", "text-slate-700"], [1, "text-sm", "text-slate-500", "mt-2"], [1, "space-y-4", 3, "ngSubmit"], [1, "text-sm", "font-semibold", "text-slate-700", "mb-4"], [1, "bg-red-50", "text-red-600", "px-4", "py-3", "rounded-lg", "text-sm"], [1, "block", "text-sm", "font-medium", "text-slate-700", "mb-2"], [1, "relative"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "absolute", "left-3", "top-1/2", "transform", "-translate-y-1/2", "w-5", "h-5", "text-slate-400"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"], ["type", "email", "name", "email", "placeholder", "votre.email@gmail.com", 1, "w-full", "pl-10", "pr-4", "py-3", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent", "outline-none", 3, "ngModelChange", "ngModel"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"], ["type", "password", "name", "password", "placeholder", "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", 1, "w-full", "pl-10", "pr-4", "py-3", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent", "outline-none", 3, "ngModelChange", "ngModel"], ["routerLink", "/auth/forgot-password", 1, "text-xs", "text-teal-600", "hover:text-teal-700", "hover:underline", "mt-2", "inline-block"], ["type", "submit", 1, "w-full", "bg-teal-600", "hover:bg-teal-700", "disabled:bg-teal-400", "text-white", "font-semibold", "py-3", "rounded-lg", "transition-colors", 3, "disabled"]], template: function LoginComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(4, "svg", 4);
      \u0275\u0275element(5, "path", 5);
      \u0275\u0275elementEnd()()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(6, "div", 6)(7, "h1", 7);
      \u0275\u0275text(8, "Timely");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "h2", 8);
      \u0275\u0275text(10, "Institut Saint Jean du Cameroun");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "p", 9);
      \u0275\u0275text(12, "Gestion des Emplois du Temps et R\xE9servation");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "form", 10);
      \u0275\u0275listener("ngSubmit", function LoginComponent_Template_form_ngSubmit_13_listener() {
        return ctx.onSubmit();
      });
      \u0275\u0275elementStart(14, "div", 11);
      \u0275\u0275text(15, "Connexion");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(16, LoginComponent_Conditional_16_Template, 2, 1, "div", 12);
      \u0275\u0275elementStart(17, "div")(18, "label", 13);
      \u0275\u0275text(19, "Email");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "div", 14);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(21, "svg", 15);
      \u0275\u0275element(22, "path", 16);
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(23, "input", 17);
      \u0275\u0275twoWayListener("ngModelChange", function LoginComponent_Template_input_ngModelChange_23_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.email, $event) || (ctx.email = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(24, "div")(25, "label", 13);
      \u0275\u0275text(26, "Mot de passe");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "div", 14);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(28, "svg", 15);
      \u0275\u0275element(29, "path", 18);
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(30, "input", 19);
      \u0275\u0275twoWayListener("ngModelChange", function LoginComponent_Template_input_ngModelChange_30_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.password, $event) || (ctx.password = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(31, "a", 20);
      \u0275\u0275text(32, " Mot de passe oubli\xE9 ? ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(33, "button", 21);
      \u0275\u0275conditionalCreate(34, LoginComponent_Conditional_34_Template, 2, 0, "span")(35, LoginComponent_Conditional_35_Template, 2, 0, "span");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(16);
      \u0275\u0275conditional(ctx.errorMessage() ? 16 : -1);
      \u0275\u0275advance(7);
      \u0275\u0275twoWayProperty("ngModel", ctx.email);
      \u0275\u0275advance(7);
      \u0275\u0275twoWayProperty("ngModel", ctx.password);
      \u0275\u0275advance(3);
      \u0275\u0275property("disabled", ctx.isLoading());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isLoading() ? 34 : 35);
    }
  }, dependencies: [CommonModule, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, NgModel, NgForm, RouterModule, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoginComponent, [{
    type: Component,
    args: [{ selector: "app-login", standalone: true, imports: [CommonModule, FormsModule, RouterModule], template: '<div class="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">\n  <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">\n    <div class="flex justify-center mb-6">\n      <div class="bg-slate-100 p-4 rounded-full">\n        <svg class="w-12 h-12 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"\n                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>\n        </svg>\n      </div>\n    </div>\n\n    <div class="text-center mb-8">\n      <h1 class="text-2xl font-bold text-slate-800 mb-2">Timely</h1>\n      <h2 class="text-lg font-semibold text-slate-700">Institut Saint Jean du Cameroun</h2>\n      <p class="text-sm text-slate-500 mt-2">Gestion des Emplois du Temps et R\xE9servation</p>\n    </div>\n\n    <form (ngSubmit)="onSubmit()" class="space-y-4">\n      <div class="text-sm font-semibold text-slate-700 mb-4">Connexion</div>\n\n      @if (errorMessage()) {\n        <div class="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">\n          {{ errorMessage() }}\n        </div>\n      }\n\n      <div>\n        <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>\n        <div class="relative">\n          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"\n               fill="none" stroke="currentColor" viewBox="0 0 24 24">\n            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"\n                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>\n          </svg>\n          <input\n            type="email"\n            [(ngModel)]="email"\n            name="email"\n            placeholder="votre.email@gmail.com"\n            class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"\n          />\n        </div>\n      </div>\n\n      <div>\n        <label class="block text-sm font-medium text-slate-700 mb-2">Mot de passe</label>\n        <div class="relative">\n          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"\n              fill="none" stroke="currentColor" viewBox="0 0 24 24">\n            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"\n                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>\n          </svg>\n          <input\n            type="password"\n            [(ngModel)]="password"\n            name="password"\n            placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"\n            class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"\n          />\n        </div>\n        <a\n          routerLink="/auth/forgot-password"\n          class="text-xs text-teal-600 hover:text-teal-700 hover:underline mt-2 inline-block">\n          Mot de passe oubli\xE9 ?\n        </a>\n      </div>\n\n      <button\n        type="submit"\n        [disabled]="isLoading()"\n        class="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold py-3 rounded-lg transition-colors"\n      >\n        @if (isLoading()) {\n          <span>Connexion...</span>\n        } @else {\n          <span>Se Connecter</span>\n        }\n      </button>\n    </form>\n  </div>\n</div>\n' }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src/app/features/auth/login/login.component.ts", lineNumber: 14 });
})();
export {
  LoginComponent
};
//# sourceMappingURL=chunk-OXXVVYZP.js.map
