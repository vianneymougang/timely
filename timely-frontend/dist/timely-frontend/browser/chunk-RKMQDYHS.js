import {
  AuthService
} from "./chunk-7G26F2KZ.js";
import {
  Router,
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
  RequiredValidator,
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

// src/app/features/auth/forgot-password/forgot-password.component.ts
function ForgotPasswordComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.errorMessage(), " ");
  }
}
function ForgotPasswordComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.successMessage(), " ");
  }
}
function ForgotPasswordComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Envoi en cours...");
    \u0275\u0275elementEnd();
  }
}
function ForgotPasswordComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Continuer");
    \u0275\u0275elementEnd();
  }
}
var ForgotPasswordComponent = class _ForgotPasswordComponent {
  router = inject(Router);
  authService = inject(AuthService);
  email = signal("", ...ngDevMode ? [{ debugName: "email" }] : []);
  errorMessage = signal("", ...ngDevMode ? [{ debugName: "errorMessage" }] : []);
  successMessage = signal("", ...ngDevMode ? [{ debugName: "successMessage" }] : []);
  isLoading = signal(false, ...ngDevMode ? [{ debugName: "isLoading" }] : []);
  onSubmit() {
    if (!this.email()) {
      this.errorMessage.set("Veuillez entrer votre adresse email");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email())) {
      this.errorMessage.set("Adresse email invalide");
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set("");
    this.successMessage.set("");
    this.authService.forgotPassword(this.email()).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.successMessage.set("Un email de r\xE9initialisation a \xE9t\xE9 envoy\xE9 \xE0 votre adresse email.");
        setTimeout(() => {
          this.router.navigate(["/auth/login"]);
        }, 3e3);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || "Une erreur est survenue");
      }
    });
  }
  static \u0275fac = function ForgotPasswordComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ForgotPasswordComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ForgotPasswordComponent, selectors: [["app-forgot-password"]], decls: 27, vars: 5, consts: [[1, "min-h-screen", "bg-gradient-to-br", "from-blue-50", "to-slate-100", "flex", "items-center", "justify-center", "p-4"], [1, "bg-white", "rounded-2xl", "shadow-xl", "p-8", "w-full", "max-w-md"], [1, "flex", "justify-center", "mb-6"], [1, "bg-slate-100", "p-4", "rounded-full"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-12", "h-12", "text-teal-600"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"], [1, "text-center", "mb-8"], [1, "text-2xl", "font-bold", "text-slate-800", "mb-2"], [1, "text-sm", "text-slate-500"], [1, "space-y-4", 3, "ngSubmit"], [1, "bg-red-50", "text-red-600", "px-4", "py-3", "rounded-lg", "text-sm"], [1, "bg-green-50", "text-green-600", "px-4", "py-3", "rounded-lg", "text-sm"], [1, "block", "text-sm", "font-medium", "text-slate-700", "mb-2"], [1, "relative"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "absolute", "left-3", "top-1/2", "transform", "-translate-y-1/2", "w-5", "h-5", "text-slate-400"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"], ["type", "email", "name", "email", "placeholder", "votre.email@isjcam.org", "required", "", 1, "w-full", "pl-10", "pr-4", "py-3", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent", "outline-none", 3, "ngModelChange", "ngModel"], ["type", "submit", 1, "w-full", "bg-teal-600", "hover:bg-teal-700", "disabled:bg-teal-400", "text-white", "font-semibold", "py-3", "rounded-lg", "transition-colors", 3, "disabled"], [1, "text-center", "mt-4"], ["routerLink", "/auth/login", 1, "text-sm", "text-slate-600", "hover:text-slate-800"]], template: function ForgotPasswordComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(4, "svg", 4);
      \u0275\u0275element(5, "path", 5);
      \u0275\u0275elementEnd()()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(6, "div", 6)(7, "h1", 7);
      \u0275\u0275text(8, "Mot de passe oubli\xE9 ?");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p", 8);
      \u0275\u0275text(10, " Entrez votre adresse email et nous vous enverrons un code de v\xE9rification ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "form", 9);
      \u0275\u0275listener("ngSubmit", function ForgotPasswordComponent_Template_form_ngSubmit_11_listener() {
        return ctx.onSubmit();
      });
      \u0275\u0275conditionalCreate(12, ForgotPasswordComponent_Conditional_12_Template, 2, 1, "div", 10);
      \u0275\u0275conditionalCreate(13, ForgotPasswordComponent_Conditional_13_Template, 2, 1, "div", 11);
      \u0275\u0275elementStart(14, "div")(15, "label", 12);
      \u0275\u0275text(16, "Adresse email");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "div", 13);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(18, "svg", 14);
      \u0275\u0275element(19, "path", 15);
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(20, "input", 16);
      \u0275\u0275twoWayListener("ngModelChange", function ForgotPasswordComponent_Template_input_ngModelChange_20_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.email, $event) || (ctx.email = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(21, "button", 17);
      \u0275\u0275conditionalCreate(22, ForgotPasswordComponent_Conditional_22_Template, 2, 0, "span")(23, ForgotPasswordComponent_Conditional_23_Template, 2, 0, "span");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "div", 18)(25, "a", 19);
      \u0275\u0275text(26, " \u2190 Retour \xE0 la connexion ");
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(12);
      \u0275\u0275conditional(ctx.errorMessage() ? 12 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.successMessage() ? 13 : -1);
      \u0275\u0275advance(7);
      \u0275\u0275twoWayProperty("ngModel", ctx.email);
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.isLoading());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isLoading() ? 22 : 23);
    }
  }, dependencies: [CommonModule, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, NgModel, NgForm, RouterModule, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ForgotPasswordComponent, [{
    type: Component,
    args: [{ selector: "app-forgot-password", standalone: true, imports: [CommonModule, FormsModule, RouterModule], template: '<div\n  class="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4"\n>\n  <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">\n    <div class="flex justify-center mb-6">\n      <div class="bg-slate-100 p-4 rounded-full">\n        <svg class="w-12 h-12 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n          <path\n            stroke-linecap="round"\n            stroke-linejoin="round"\n            stroke-width="2"\n            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"\n          />\n        </svg>\n      </div>\n    </div>\n\n    <div class="text-center mb-8">\n      <h1 class="text-2xl font-bold text-slate-800 mb-2">Mot de passe oubli\xE9 ?</h1>\n      <p class="text-sm text-slate-500">\n        Entrez votre adresse email et nous vous enverrons un code de v\xE9rification\n      </p>\n    </div>\n\n    <form (ngSubmit)="onSubmit()" class="space-y-4">\n      @if (errorMessage()) {\n      <div class="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">\n        {{ errorMessage() }}\n      </div>\n      } @if (successMessage()) {\n      <div class="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm">\n        {{ successMessage() }}\n      </div>\n      }\n\n      <div>\n        <label class="block text-sm font-medium text-slate-700 mb-2">Adresse email</label>\n        <div class="relative">\n          <svg\n            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"\n            fill="none"\n            stroke="currentColor"\n            viewBox="0 0 24 24"\n          >\n            <path\n              stroke-linecap="round"\n              stroke-linejoin="round"\n              stroke-width="2"\n              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"\n            />\n          </svg>\n          <input\n            type="email"\n            [(ngModel)]="email"\n            name="email"\n            placeholder="votre.email@isjcam.org"\n            class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"\n            required\n          />\n        </div>\n      </div>\n\n      <button\n        type="submit"\n        [disabled]="isLoading()"\n        class="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold py-3 rounded-lg transition-colors"\n      >\n        @if (isLoading()) {\n        <span>Envoi en cours...</span>\n        } @else {\n        <span>Continuer</span>\n        }\n      </button>\n\n      <div class="text-center mt-4">\n        <a routerLink="/auth/login" class="text-sm text-slate-600 hover:text-slate-800">\n          \u2190 Retour \xE0 la connexion\n        </a>\n      </div>\n    </form>\n  </div>\n</div>\n' }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ForgotPasswordComponent, { className: "ForgotPasswordComponent", filePath: "src/app/features/auth/forgot-password/forgot-password.component.ts", lineNumber: 14 });
})();
export {
  ForgotPasswordComponent
};
//# sourceMappingURL=chunk-RKMQDYHS.js.map
