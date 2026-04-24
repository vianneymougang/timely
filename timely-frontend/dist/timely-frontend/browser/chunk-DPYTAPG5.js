import {
  Router,
  RouterLink,
  RouterModule
} from "./chunk-SG7N3ZM6.js";
import {
  FormsModule
} from "./chunk-Y74VR2WI.js";
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
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-DBHCOGA3.js";
import "./chunk-WDMUDEB6.js";

// src/app/features/auth/verify-code/verify-code.component.ts
function VerifyCodeComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 26);
    \u0275\u0275element(2, "path", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "span", 28);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.errorMessage());
  }
}
function VerifyCodeComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 26);
    \u0275\u0275element(2, "path", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "span", 28);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.successMessage());
  }
}
function VerifyCodeComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 30);
    \u0275\u0275element(2, "circle", 31)(3, "path", 32);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " V\xE9rification du code... ");
    \u0275\u0275elementEnd();
  }
}
function VerifyCodeComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 33);
    \u0275\u0275element(2, "path", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Code valide - Redirection... ");
    \u0275\u0275elementEnd();
  }
}
function VerifyCodeComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 34);
    \u0275\u0275element(2, "path", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Effacement dans un instant... ");
    \u0275\u0275elementEnd();
  }
}
function VerifyCodeComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 16);
    \u0275\u0275text(1, " Entrez le code \xE0 6 chiffres ");
    \u0275\u0275elementEnd();
  }
}
function VerifyCodeComponent_For_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 35);
    \u0275\u0275listener("input", function VerifyCodeComponent_For_24_Template_input_input_0_listener($event) {
      const $index_r3 = \u0275\u0275restoreView(_r2).$index;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onCodeInput($index_r3, $event));
    })("keydown", function VerifyCodeComponent_For_24_Template_input_keydown_0_listener($event) {
      const $index_r3 = \u0275\u0275restoreView(_r2).$index;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onKeyDown($index_r3, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const digit_r4 = ctx.$implicit;
    const $index_r3 = ctx.$index;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classMap("w-12 h-14 text-center text-2xl font-bold rounded-lg outline-none transition-all " + (ctx_r0.codeStatus() === "valid" ? "border-2 border-emerald-500 bg-emerald-50 text-emerald-700" : ctx_r0.codeStatus() === "invalid" ? "border-2 border-red-500 bg-red-50 text-red-700 animate-shake" : ctx_r0.codeStatus() === "verifying" ? "border-2 border-teal-400 bg-teal-50 cursor-not-allowed" : "border-2 border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200") + (ctx_r0.isVerifying() || ctx_r0.codeStatus() === "valid" || ctx_r0.codeStatus() === "invalid" ? " cursor-not-allowed opacity-75" : ""));
    \u0275\u0275property("id", "code-" + $index_r3)("value", digit_r4)("disabled", ctx_r0.isVerifying() || ctx_r0.codeStatus() === "valid" || ctx_r0.codeStatus() === "invalid");
  }
}
function VerifyCodeComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Astuce : Vous pouvez coller le code directement");
    \u0275\u0275elementEnd();
  }
}
function VerifyCodeComponent_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 20);
    \u0275\u0275text(1, "Redirection automatique en cours...");
    \u0275\u0275elementEnd();
  }
}
function VerifyCodeComponent_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 21);
    \u0275\u0275text(1, "Le code va s'effacer automatiquement...");
    \u0275\u0275elementEnd();
  }
}
var VerifyCodeComponent = class _VerifyCodeComponent {
  router = inject(Router);
  email = signal("", ...ngDevMode ? [{ debugName: "email" }] : []);
  code = signal(["", "", "", "", "", ""], ...ngDevMode ? [{ debugName: "code" }] : []);
  // 6 chiffres
  errorMessage = signal("", ...ngDevMode ? [{ debugName: "errorMessage" }] : []);
  successMessage = signal("", ...ngDevMode ? [{ debugName: "successMessage" }] : []);
  isVerifying = signal(false, ...ngDevMode ? [{ debugName: "isVerifying" }] : []);
  codeStatus = signal("idle", ...ngDevMode ? [{ debugName: "codeStatus" }] : []);
  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;
    if (state && state["email"]) {
      this.email.set(state["email"]);
    } else {
      this.router.navigate(["/auth/forgot-password"]);
    }
  }
  onCodeInput(index, event) {
    const value = event.target.value;
    if (value && !/^\d$/.test(value)) {
      event.target.value = "";
      return;
    }
    if (value.length === 1 && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput)
        nextInput.focus();
    }
    const newCode = [...this.code()];
    newCode[index] = value;
    this.code.set(newCode);
    const fullCode = newCode.join("");
    if (fullCode.length === 6) {
      this.verifyCodeAutomatically(fullCode);
    } else {
      this.codeStatus.set("idle");
      this.errorMessage.set("");
      this.successMessage.set("");
    }
  }
  onKeyDown(index, event) {
    if (event.key === "Backspace") {
      const currentInput = document.getElementById(`code-${index}`);
      if (!this.code()[index] && index > 0) {
        const prevInput = document.getElementById(`code-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
          const newCode = [...this.code()];
          newCode[index - 1] = "";
          this.code.set(newCode);
        }
      } else {
        const newCode = [...this.code()];
        newCode[index] = "";
        this.code.set(newCode);
      }
      this.codeStatus.set("idle");
      this.errorMessage.set("");
      this.successMessage.set("");
    }
  }
  onPaste(event) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData("text");
    if (pastedData && /^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      this.code.set(digits);
      digits.forEach((digit, index) => {
        const input = document.getElementById(`code-${index}`);
        if (input)
          input.value = digit;
      });
      const lastInput = document.getElementById("code-5");
      if (lastInput)
        lastInput.focus();
      this.verifyCodeAutomatically(pastedData);
    }
  }
  verifyCodeAutomatically(fullCode) {
    this.codeStatus.set("verifying");
    this.isVerifying.set(true);
    this.errorMessage.set("");
    this.successMessage.set("");
    setTimeout(() => {
      if (fullCode === "123456") {
        this.handleValidCode(fullCode);
      } else {
        this.handleInvalidCode();
      }
    }, 800);
  }
  handleValidCode(fullCode) {
    this.codeStatus.set("valid");
    this.successMessage.set("\u2713 Code valide");
    this.isVerifying.set(false);
    setTimeout(() => {
      this.router.navigate(["/auth/reset-password"], {
        state: { email: this.email(), code: fullCode }
      });
    }, 1500);
  }
  handleInvalidCode() {
    this.codeStatus.set("invalid");
    this.errorMessage.set("\u2717 Code incorrect");
    this.isVerifying.set(false);
    setTimeout(() => {
      this.clearCodeAutomatically();
    }, 1500);
  }
  clearCodeAutomatically() {
    this.code.set(["", "", "", "", "", ""]);
    this.codeStatus.set("idle");
    this.errorMessage.set("");
    this.successMessage.set("");
    for (let i = 0; i < 6; i++) {
      const input = document.getElementById(`code-${i}`);
      if (input)
        input.value = "";
    }
    const firstInput = document.getElementById("code-0");
    if (firstInput)
      firstInput.focus();
  }
  resendCode() {
    this.clearCodeAutomatically();
    this.successMessage.set("\u2713 Code renvoy\xE9 avec succ\xE8s !");
    setTimeout(() => {
      this.successMessage.set("");
    }, 3e3);
  }
  static \u0275fac = function VerifyCodeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VerifyCodeComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VerifyCodeComponent, selectors: [["app-verify-code"]], decls: 36, vars: 11, consts: [[1, "min-h-screen", "bg-gradient-to-br", "from-blue-50", "to-slate-100", "flex", "items-center", "justify-center", "p-4"], [1, "bg-white", "rounded-2xl", "shadow-xl", "p-8", "w-full", "max-w-md"], [1, "flex", "justify-center", "mb-6"], [1, "bg-slate-100", "p-4", "rounded-full"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-12", "h-12", "text-teal-600"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"], [1, "text-center", "mb-8"], [1, "text-2xl", "font-bold", "text-slate-800", "mb-2"], [1, "text-sm", "text-slate-500"], [1, "space-y-6"], [1, "bg-red-50", "border", "border-red-200", "text-red-600", "px-4", "py-3", "rounded-lg", "text-sm", "flex", "items-center", "justify-center", "gap-2", "animate-fade-in"], [1, "bg-emerald-50", "border", "border-emerald-200", "text-emerald-600", "px-4", "py-3", "rounded-lg", "text-sm", "flex", "items-center", "justify-center", "gap-2", "animate-fade-in"], [1, "flex", "items-center", "justify-center", "mb-4"], [1, "text-sm", "text-slate-600", "flex", "items-center", "gap-2"], [1, "text-sm", "text-emerald-600", "font-medium", "flex", "items-center", "gap-2"], [1, "text-sm", "text-red-600", "font-medium", "flex", "items-center", "gap-2"], [1, "text-sm", "text-slate-500", "font-medium"], [1, "flex", "gap-2", "justify-center", 3, "paste"], ["type", "text", "inputmode", "numeric", "maxlength", "1", 3, "id", "value", "disabled", "class"], [1, "text-xs", "text-slate-500", "text-center", "mt-3"], [1, "text-emerald-600", "font-medium"], [1, "text-red-600", "font-medium"], [1, "text-center", "mt-6", "space-y-3"], [1, "text-sm", "text-slate-600"], ["type", "button", 1, "text-teal-600", "hover:text-teal-700", "hover:underline", "ml-1", "font-medium", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], ["routerLink", "/auth/forgot-password", 1, "text-sm", "text-slate-600", "hover:text-slate-800", "inline-block"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5", "flex-shrink-0"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"], [1, "font-medium"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"], ["fill", "none", "viewBox", "0 0 24 24", 1, "animate-spin", "h-4", "w-4", "text-teal-600"], ["cx", "12", "cy", "12", "r", "10", "stroke", "currentColor", "stroke-width", "4", 1, "opacity-25"], ["fill", "currentColor", "d", "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z", 1, "opacity-75"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5", "animate-bounce"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5"], ["type", "text", "inputmode", "numeric", "maxlength", "1", 3, "input", "keydown", "id", "value", "disabled"]], template: function VerifyCodeComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(4, "svg", 4);
      \u0275\u0275element(5, "path", 5);
      \u0275\u0275elementEnd()()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(6, "div", 6)(7, "h1", 7);
      \u0275\u0275text(8, "V\xE9rification du code");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p", 8);
      \u0275\u0275text(10, " Nous avons envoy\xE9 un code \xE0 ");
      \u0275\u0275elementStart(11, "strong");
      \u0275\u0275text(12);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(13, "div", 9);
      \u0275\u0275conditionalCreate(14, VerifyCodeComponent_Conditional_14_Template, 5, 1, "div", 10);
      \u0275\u0275conditionalCreate(15, VerifyCodeComponent_Conditional_15_Template, 5, 1, "div", 11);
      \u0275\u0275elementStart(16, "div")(17, "div", 12);
      \u0275\u0275conditionalCreate(18, VerifyCodeComponent_Conditional_18_Template, 5, 0, "span", 13);
      \u0275\u0275conditionalCreate(19, VerifyCodeComponent_Conditional_19_Template, 4, 0, "span", 14);
      \u0275\u0275conditionalCreate(20, VerifyCodeComponent_Conditional_20_Template, 4, 0, "span", 15);
      \u0275\u0275conditionalCreate(21, VerifyCodeComponent_Conditional_21_Template, 2, 0, "span", 16);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "div", 17);
      \u0275\u0275listener("paste", function VerifyCodeComponent_Template_div_paste_22_listener($event) {
        return ctx.onPaste($event);
      });
      \u0275\u0275repeaterCreate(23, VerifyCodeComponent_For_24_Template, 1, 5, "input", 18, \u0275\u0275repeaterTrackByIndex);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "p", 19);
      \u0275\u0275conditionalCreate(26, VerifyCodeComponent_Conditional_26_Template, 2, 0, "span");
      \u0275\u0275conditionalCreate(27, VerifyCodeComponent_Conditional_27_Template, 2, 0, "span", 20);
      \u0275\u0275conditionalCreate(28, VerifyCodeComponent_Conditional_28_Template, 2, 0, "span", 21);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(29, "div", 22)(30, "p", 23);
      \u0275\u0275text(31, " Vous n'avez pas re\xE7u le code ? ");
      \u0275\u0275elementStart(32, "button", 24);
      \u0275\u0275listener("click", function VerifyCodeComponent_Template_button_click_32_listener() {
        return ctx.resendCode();
      });
      \u0275\u0275text(33, " Renvoyer ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(34, "a", 25);
      \u0275\u0275text(35, " \u2190 Changer l'adresse email ");
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(12);
      \u0275\u0275textInterpolate(ctx.email());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.errorMessage() ? 14 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.successMessage() ? 15 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.isVerifying() ? 18 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.codeStatus() === "valid" ? 19 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.codeStatus() === "invalid" ? 20 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.codeStatus() === "idle" ? 21 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.code());
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.codeStatus() === "idle" || ctx.codeStatus() === "verifying" ? 26 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.codeStatus() === "valid" ? 27 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.codeStatus() === "invalid" ? 28 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.isVerifying());
    }
  }, dependencies: [CommonModule, FormsModule, RouterModule, RouterLink], styles: ["\n\n@keyframes _ngcontent-%COMP%_shake {\n  0%, 100% {\n    transform: translateX(0);\n  }\n  10%, 30%, 50%, 70%, 90% {\n    transform: translateX(-5px);\n  }\n  20%, 40%, 60%, 80% {\n    transform: translateX(5px);\n  }\n}\n.animate-shake[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_shake 0.5s;\n}\n@keyframes _ngcontent-%COMP%_fade-in {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.animate-fade-in[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fade-in 0.3s ease-out;\n}\n/*# sourceMappingURL=verify-code.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VerifyCodeComponent, [{
    type: Component,
    args: [{ selector: "app-verify-code", standalone: true, imports: [CommonModule, FormsModule, RouterModule], template: `<div class="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
  <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
    <div class="flex justify-center mb-6">
      <div class="bg-slate-100 p-4 rounded-full">
        <svg class="w-12 h-12 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      </div>
    </div>

    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-slate-800 mb-2">V\xE9rification du code</h1>
      <p class="text-sm text-slate-500">
        Nous avons envoy\xE9 un code \xE0 <strong>{{ email() }}</strong>
      </p>
    </div>

    <div class="space-y-6">
      <!-- Messages de feedback -->
      @if (errorMessage()) {
        <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center justify-center gap-2 animate-fade-in">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="font-medium">{{ errorMessage() }}</span>
        </div>
      }

      @if (successMessage()) {
        <div class="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-lg text-sm flex items-center justify-center gap-2 animate-fade-in">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="font-medium">{{ successMessage() }}</span>
        </div>
      }

      <div>
        <div class="flex items-center justify-center mb-4">
          @if (isVerifying()) {
            <span class="text-sm text-slate-600 flex items-center gap-2">
              <svg class="animate-spin h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              V\xE9rification du code...
            </span>
          }
          @if (codeStatus() === 'valid') {
            <span class="text-sm text-emerald-600 font-medium flex items-center gap-2">
              <svg class="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Code valide - Redirection...
            </span>
          }
          @if (codeStatus() === 'invalid') {
            <span class="text-sm text-red-600 font-medium flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Effacement dans un instant...
            </span>
          }
          @if (codeStatus() === 'idle') {
            <span class="text-sm text-slate-500 font-medium">
              Entrez le code \xE0 6 chiffres
            </span>
          }
        </div>

        <div class="flex gap-2 justify-center" (paste)="onPaste($event)">
          @for (digit of code(); track $index) {
            <input
              [id]="'code-' + $index"
              type="text"
              inputmode="numeric"
              maxlength="1"
              [value]="digit"
              [disabled]="isVerifying() || codeStatus() === 'valid' || codeStatus() === 'invalid'"
              (input)="onCodeInput($index, $event)"
              (keydown)="onKeyDown($index, $event)"
              [class]="'w-12 h-14 text-center text-2xl font-bold rounded-lg outline-none transition-all ' +
                (codeStatus() === 'valid' ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-700' :
                 codeStatus() === 'invalid' ? 'border-2 border-red-500 bg-red-50 text-red-700 animate-shake' :
                 codeStatus() === 'verifying' ? 'border-2 border-teal-400 bg-teal-50 cursor-not-allowed' :
                 'border-2 border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200') +
                (isVerifying() || codeStatus() === 'valid' || codeStatus() === 'invalid' ? ' cursor-not-allowed opacity-75' : '')"
            />
          }
        </div>

        <p class="text-xs text-slate-500 text-center mt-3">
          @if (codeStatus() === 'idle' || codeStatus() === 'verifying') {
            <span>Astuce : Vous pouvez coller le code directement</span>
          }
          @if (codeStatus() === 'valid') {
            <span class="text-emerald-600 font-medium">Redirection automatique en cours...</span>
          }
          @if (codeStatus() === 'invalid') {
            <span class="text-red-600 font-medium">Le code va s'effacer automatiquement...</span>
          }
        </p>
      </div>

      <!-- Actions -->
      <div class="text-center mt-6 space-y-3">
        <p class="text-sm text-slate-600">
          Vous n'avez pas re\xE7u le code ?
          <button
            type="button"
            (click)="resendCode()"
            [disabled]="isVerifying()"
            class="text-teal-600 hover:text-teal-700 hover:underline ml-1 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            Renvoyer
          </button>
        </p>

        <a
          routerLink="/auth/forgot-password"
          class="text-sm text-slate-600 hover:text-slate-800 inline-block">
          \u2190 Changer l'adresse email
        </a>
      </div>
    </div>
  </div>
</div>
`, styles: ["/* src/app/features/auth/verify-code/verify-code.component.scss */\n@keyframes shake {\n  0%, 100% {\n    transform: translateX(0);\n  }\n  10%, 30%, 50%, 70%, 90% {\n    transform: translateX(-5px);\n  }\n  20%, 40%, 60%, 80% {\n    transform: translateX(5px);\n  }\n}\n.animate-shake {\n  animation: shake 0.5s;\n}\n@keyframes fade-in {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.animate-fade-in {\n  animation: fade-in 0.3s ease-out;\n}\n/*# sourceMappingURL=verify-code.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VerifyCodeComponent, { className: "VerifyCodeComponent", filePath: "src/app/features/auth/verify-code/verify-code.component.ts", lineNumber: 13 });
})();
export {
  VerifyCodeComponent
};
//# sourceMappingURL=chunk-DPYTAPG5.js.map
