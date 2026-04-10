import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵtext
} from "./chunk-DBHCOGA3.js";
import "./chunk-WDMUDEB6.js";

// src/app/features/admin/settings/settings.component.ts
var _c0 = ["class", "component"];
var SettingsComponent = class _SettingsComponent {
  static \u0275fac = function SettingsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SettingsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SettingsComponent, selectors: [["app-settings", 8, "component"]], attrs: _c0, decls: 2, vars: 0, template: function SettingsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "p");
      \u0275\u0275text(1, "settings.component works!");
      \u0275\u0275domElementEnd();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SettingsComponent, [{
    type: Component,
    args: [{ selector: "app-settings.component", imports: [], template: "<p>settings.component works!</p>\n" }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SettingsComponent, { className: "SettingsComponent", filePath: "src/app/features/admin/settings/settings.component.ts", lineNumber: 9 });
})();
export {
  SettingsComponent
};
//# sourceMappingURL=chunk-2YTV6TT3.js.map
