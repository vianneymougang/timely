import {
  AuthService
} from "./chunk-7G26F2KZ.js";
import {
  ActivatedRoute,
  Router,
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

// src/app/features/auth/reset-password/reset-password.component.ts
function ResetPasswordComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 23);
    \u0275\u0275element(2, "circle", 24)(3, "path", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " V\xE9rification du lien de r\xE9initialisation... ");
    \u0275\u0275elementEnd();
  }
}
function ResetPasswordComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.errorMessage(), " ");
  }
}
function ResetPasswordComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 18);
    \u0275\u0275element(1, "path", 26);
    \u0275\u0275elementEnd();
  }
}
function ResetPasswordComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 18);
    \u0275\u0275element(1, "path", 27)(2, "path", 28);
    \u0275\u0275elementEnd();
  }
}
function ResetPasswordComponent_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 18);
    \u0275\u0275element(1, "path", 26);
    \u0275\u0275elementEnd();
  }
}
function ResetPasswordComponent_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 18);
    \u0275\u0275element(1, "path", 27)(2, "path", 28);
    \u0275\u0275elementEnd();
  }
}
function ResetPasswordComponent_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Enregistrement...");
    \u0275\u0275elementEnd();
  }
}
function ResetPasswordComponent_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Enregistrer");
    \u0275\u0275elementEnd();
  }
}
var ResetPasswordComponent = class _ResetPasswordComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  token = signal("", ...ngDevMode ? [{ debugName: "token" }] : []);
  newPassword = signal("", ...ngDevMode ? [{ debugName: "newPassword" }] : []);
  confirmPassword = signal("", ...ngDevMode ? [{ debugName: "confirmPassword" }] : []);
  errorMessage = signal("", ...ngDevMode ? [{ debugName: "errorMessage" }] : []);
  isLoading = signal(false, ...ngDevMode ? [{ debugName: "isLoading" }] : []);
  showPassword = signal(false, ...ngDevMode ? [{ debugName: "showPassword" }] : []);
  showConfirmPassword = signal(false, ...ngDevMode ? [{ debugName: "showConfirmPassword" }] : []);
  isValidatingToken = signal(true, ...ngDevMode ? [{ debugName: "isValidatingToken" }] : []);
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const token = params["token"];
      if (token) {
        this.token.set(token);
        this.validateToken(token);
      } else {
        this.errorMessage.set("Token manquant. Veuillez utiliser le lien re\xE7u par email.");
        this.isValidatingToken.set(false);
      }
    });
  }
  validateToken(token) {
    this.authService.validateResetToken(token).subscribe({
      next: (response) => {
        this.isValidatingToken.set(false);
        if (!response.valid) {
          this.errorMessage.set("Le lien de r\xE9initialisation est invalide ou a expir\xE9.");
        }
      },
      error: (error) => {
        this.isValidatingToken.set(false);
        this.errorMessage.set(error.message || "Le lien de r\xE9initialisation est invalide ou a expir\xE9.");
      }
    });
  }
  onSubmit() {
    this.errorMessage.set("");
    if (!this.newPassword() || !this.confirmPassword()) {
      this.errorMessage.set("Veuillez remplir tous les champs");
      return;
    }
    if (this.newPassword().length < 8) {
      this.errorMessage.set("Le mot de passe doit contenir au moins 8 caract\xE8res");
      return;
    }
    if (this.newPassword() !== this.confirmPassword()) {
      this.errorMessage.set("Les mots de passe ne correspondent pas");
      return;
    }
    this.isLoading.set(true);
    this.authService.resetPassword(this.token(), this.newPassword()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(["/auth/login"], {
          state: {
            message: "Mot de passe r\xE9initialis\xE9 avec succ\xE8s ! Vous pouvez maintenant vous connecter."
          }
        });
      },
      error: (error) => {
        this.errorMessage.set(error.message || "Erreur lors de la r\xE9initialisation");
        this.isLoading.set(false);
      }
    });
  }
  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }
  static \u0275fac = function ResetPasswordComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ResetPasswordComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ResetPasswordComponent, selectors: [["app-reset-password"]], decls: 42, vars: 10, consts: [[1, "min-h-screen", "bg-gradient-to-br", "from-blue-50", "to-slate-100", "flex", "items-center", "justify-center", "p-4"], [1, "bg-white", "rounded-2xl", "shadow-xl", "p-8", "w-full", "max-w-md"], [1, "flex", "justify-center", "mb-6"], [1, "bg-slate-100", "p-4", "rounded-full"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-12", "h-12", "text-teal-600"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"], [1, "text-center", "mb-8"], [1, "text-2xl", "font-bold", "text-slate-800", "mb-2"], [1, "text-sm", "text-slate-500"], [1, "space-y-4", 3, "ngSubmit"], [1, "bg-blue-50", "text-blue-600", "px-4", "py-3", "rounded-lg", "text-sm", "flex", "items-center"], [1, "bg-red-50", "text-red-600", "px-4", "py-3", "rounded-lg", "text-sm"], [1, "block", "text-sm", "font-medium", "text-slate-700", "mb-2"], [1, "relative"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "absolute", "left-3", "top-1/2", "transform", "-translate-y-1/2", "w-5", "h-5", "text-slate-400"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"], ["name", "newPassword", "placeholder", "Minimum 8 caract\xE8res", "required", "", 1, "w-full", "pl-10", "pr-12", "py-3", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent", "outline-none", 3, "ngModelChange", "type", "ngModel"], ["type", "button", 1, "absolute", "right-3", "top-1/2", "transform", "-translate-y-1/2", "text-slate-400", "hover:text-slate-600", 3, "click"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5"], ["name", "confirmPassword", "placeholder", "Retapez votre mot de passe", "required", "", 1, "w-full", "pl-10", "pr-12", "py-3", "border", "border-slate-300", "rounded-lg", "focus:ring-2", "focus:ring-teal-500", "focus:border-transparent", "outline-none", 3, "ngModelChange", "type", "ngModel"], [1, "bg-blue-50", "px-4", "py-3", "rounded-lg"], [1, "text-xs", "text-slate-600"], ["type", "submit", 1, "w-full", "bg-teal-600", "hover:bg-teal-700", "disabled:bg-teal-400", "text-white", "font-semibold", "py-3", "rounded-lg", "transition-colors", 3, "disabled"], ["xmlns", "http://www.w3.org/2000/svg", "fill", "none", "viewBox", "0 0 24 24", 1, "animate-spin", "h-5", "w-5", "mr-2"], ["cx", "12", "cy", "12", "r", "10", "stroke", "currentColor", "stroke-width", "4", 1, "opacity-25"], ["fill", "currentColor", "d", "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z", 1, "opacity-75"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M15 12a3 3 0 11-6 0 3 3 0 016 0z"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]], template: function ResetPasswordComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(4, "svg", 4);
      \u0275\u0275element(5, "path", 5);
      \u0275\u0275elementEnd()()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(6, "div", 6)(7, "h1", 7);
      \u0275\u0275text(8, "Nouveau mot de passe");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p", 8);
      \u0275\u0275text(10, "Cr\xE9ez un nouveau mot de passe s\xE9curis\xE9");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "form", 9);
      \u0275\u0275listener("ngSubmit", function ResetPasswordComponent_Template_form_ngSubmit_11_listener() {
        return ctx.onSubmit();
      });
      \u0275\u0275conditionalCreate(12, ResetPasswordComponent_Conditional_12_Template, 5, 0, "div", 10);
      \u0275\u0275conditionalCreate(13, ResetPasswordComponent_Conditional_13_Template, 2, 1, "div", 11);
      \u0275\u0275elementStart(14, "div")(15, "label", 12);
      \u0275\u0275text(16, "Nouveau mot de passe");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "div", 13);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(18, "svg", 14);
      \u0275\u0275element(19, "path", 15);
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(20, "input", 16);
      \u0275\u0275twoWayListener("ngModelChange", function ResetPasswordComponent_Template_input_ngModelChange_20_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.newPassword, $event) || (ctx.newPassword = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "button", 17);
      \u0275\u0275listener("click", function ResetPasswordComponent_Template_button_click_21_listener() {
        return ctx.togglePasswordVisibility();
      });
      \u0275\u0275conditionalCreate(22, ResetPasswordComponent_Conditional_22_Template, 2, 0, ":svg:svg", 18)(23, ResetPasswordComponent_Conditional_23_Template, 3, 0, ":svg:svg", 18);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(24, "div")(25, "label", 12);
      \u0275\u0275text(26, "Confirmer le mot de passe");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "div", 13);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(28, "svg", 14);
      \u0275\u0275element(29, "path", 15);
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(30, "input", 19);
      \u0275\u0275twoWayListener("ngModelChange", function ResetPasswordComponent_Template_input_ngModelChange_30_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.confirmPassword, $event) || (ctx.confirmPassword = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "button", 17);
      \u0275\u0275listener("click", function ResetPasswordComponent_Template_button_click_31_listener() {
        return ctx.toggleConfirmPasswordVisibility();
      });
      \u0275\u0275conditionalCreate(32, ResetPasswordComponent_Conditional_32_Template, 2, 0, ":svg:svg", 18)(33, ResetPasswordComponent_Conditional_33_Template, 3, 0, ":svg:svg", 18);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(34, "div", 20)(35, "p", 21)(36, "strong");
      \u0275\u0275text(37, "Conseils :");
      \u0275\u0275elementEnd();
      \u0275\u0275text(38, " Utilisez au moins 8 caract\xE8res avec des lettres, chiffres et symboles. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(39, "button", 22);
      \u0275\u0275conditionalCreate(40, ResetPasswordComponent_Conditional_40_Template, 2, 0, "span")(41, ResetPasswordComponent_Conditional_41_Template, 2, 0, "span");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(12);
      \u0275\u0275conditional(ctx.isValidatingToken() ? 12 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.errorMessage() ? 13 : -1);
      \u0275\u0275advance(7);
      \u0275\u0275property("type", ctx.showPassword() ? "text" : "password");
      \u0275\u0275twoWayProperty("ngModel", ctx.newPassword);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.showPassword() ? 22 : 23);
      \u0275\u0275advance(8);
      \u0275\u0275property("type", ctx.showConfirmPassword() ? "text" : "password");
      \u0275\u0275twoWayProperty("ngModel", ctx.confirmPassword);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.showConfirmPassword() ? 32 : 33);
      \u0275\u0275advance(7);
      \u0275\u0275property("disabled", ctx.isLoading());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isLoading() ? 40 : 41);
    }
  }, dependencies: [CommonModule, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, NgModel, NgForm, RouterModule], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResetPasswordComponent, [{
    type: Component,
    args: [{ selector: "app-reset-password", standalone: true, imports: [CommonModule, FormsModule, RouterModule], template: `<div
  class="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4"
>
  <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
    <div class="flex justify-center mb-6">
      <div class="bg-slate-100 p-4 rounded-full">
        <svg class="w-12 h-12 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          />
        </svg>
      </div>
    </div>

    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-slate-800 mb-2">Nouveau mot de passe</h1>
      <p class="text-sm text-slate-500">Cr\xE9ez un nouveau mot de passe s\xE9curis\xE9</p>
    </div>

    <form (ngSubmit)="onSubmit()" class="space-y-4">
      @if (isValidatingToken()) {
      <div class="bg-blue-50 text-blue-600 px-4 py-3 rounded-lg text-sm flex items-center">
        <svg
          class="animate-spin h-5 w-5 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
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
        V\xE9rification du lien de r\xE9initialisation...
      </div>
      } @if (errorMessage()) {
      <div class="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
        {{ errorMessage() }}
      </div>
      }

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Nouveau mot de passe</label>
        <div class="relative">
          <svg
            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <input
            [type]="showPassword() ? 'text' : 'password'"
            [(ngModel)]="newPassword"
            name="newPassword"
            placeholder="Minimum 8 caract\xE8res"
            class="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            required
          />
          <button
            type="button"
            (click)="togglePasswordVisibility()"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            @if (showPassword()) {
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
            } @else {
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            }
          </button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2"
          >Confirmer le mot de passe</label
        >
        <div class="relative">
          <svg
            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <input
            [type]="showConfirmPassword() ? 'text' : 'password'"
            [(ngModel)]="confirmPassword"
            name="confirmPassword"
            placeholder="Retapez votre mot de passe"
            class="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            required
          />
          <button
            type="button"
            (click)="toggleConfirmPasswordVisibility()"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            @if (showConfirmPassword()) {
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
            } @else {
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            }
          </button>
        </div>
      </div>

      <div class="bg-blue-50 px-4 py-3 rounded-lg">
        <p class="text-xs text-slate-600">
          <strong>Conseils :</strong> Utilisez au moins 8 caract\xE8res avec des lettres, chiffres et
          symboles.
        </p>
      </div>

      <button
        type="submit"
        [disabled]="isLoading()"
        class="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        @if (isLoading()) {
        <span>Enregistrement...</span>
        } @else {
        <span>Enregistrer</span>
        }
      </button>
    </form>
  </div>
</div>
` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ResetPasswordComponent, { className: "ResetPasswordComponent", filePath: "src/app/features/auth/reset-password/reset-password.component.ts", lineNumber: 14 });
})();
export {
  ResetPasswordComponent
};
//# sourceMappingURL=chunk-LM7R5KQ5.js.map
