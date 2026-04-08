import {
  AlertSeverityLabels,
  AuditActionLabels,
  EntityTypeLabels,
  ReportService
} from "./chunk-ZNSQ77LR.js";
import "./chunk-AL3K22XE.js";
import {
  CommonModule,
  DatePipe
} from "./chunk-GGDRA3L4.js";
import {
  Component,
  Input,
  catchError,
  inject,
  interval,
  setClassMetadata,
  signal,
  startWith,
  switchMap,
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
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind4,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-DBHCOGA3.js";
import "./chunk-WDMUDEB6.js";

// src/app/features/admin/dashboard/widgets/kpi-card.component.ts
var _c0 = ["*"];
function KpiCardComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p", 5);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.subtitle);
  }
}
function KpiCardComponent_Conditional_8_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 7);
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(1, "svg", 10);
    \u0275\u0275domElement(2, "path", 11);
    \u0275\u0275domElementEnd();
    \u0275\u0275text(3);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" +", ctx_r0.trend, "% ");
  }
}
function KpiCardComponent_Conditional_8_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 8);
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(1, "svg", 10);
    \u0275\u0275domElement(2, "path", 12);
    \u0275\u0275domElementEnd();
    \u0275\u0275text(3);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.trend, "% ");
  }
}
function KpiCardComponent_Conditional_8_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 9);
    \u0275\u0275text(1, "Stable");
    \u0275\u0275domElementEnd();
  }
}
function KpiCardComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 6);
    \u0275\u0275conditionalCreate(1, KpiCardComponent_Conditional_8_Conditional_1_Template, 4, 1, "span", 7)(2, KpiCardComponent_Conditional_8_Conditional_2_Template, 4, 1, "span", 8)(3, KpiCardComponent_Conditional_8_Conditional_3_Template, 2, 0, "span", 9);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.trend > 0 ? 1 : ctx_r0.trend < 0 ? 2 : 3);
  }
}
var KpiCardComponent = class _KpiCardComponent {
  title = "";
  value = "";
  subtitle;
  trend;
  // Pourcentage de variation
  bgColor = "bg-blue-500";
  static \u0275fac = function KpiCardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _KpiCardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _KpiCardComponent, selectors: [["app-kpi-card"]], inputs: { title: "title", value: "value", subtitle: "subtitle", trend: "trend", bgColor: "bgColor" }, ngContentSelectors: _c0, decls: 11, vars: 6, consts: [[1, "bg-white", "rounded-xl", "shadow-sm", "p-6", "hover:shadow-md", "transition-shadow", "duration-200"], [1, "flex", "items-center", "justify-between"], [1, "flex-1"], [1, "text-sm", "text-slate-600", "mb-1", "font-medium"], [1, "text-3xl", "font-bold", "text-slate-800", "mb-2"], [1, "text-xs", "text-slate-500"], [1, "flex", "items-center", "mt-2", "text-xs"], [1, "text-green-600", "flex", "items-center"], [1, "text-red-600", "flex", "items-center"], [1, "text-slate-500"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-4", "h-4", "mr-1"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"]], template: function KpiCardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275domElementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "p", 3);
      \u0275\u0275text(4);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(5, "p", 4);
      \u0275\u0275text(6);
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(7, KpiCardComponent_Conditional_7_Template, 2, 1, "p", 5);
      \u0275\u0275conditionalCreate(8, KpiCardComponent_Conditional_8_Template, 4, 1, "div", 6);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(9, "div");
      \u0275\u0275projection(10);
      \u0275\u0275domElementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.title);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.value);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.subtitle ? 7 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.trend !== void 0 ? 8 : -1);
      \u0275\u0275advance();
      \u0275\u0275classMap("text-white p-4 rounded-xl " + ctx.bgColor);
    }
  }, dependencies: [CommonModule], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(KpiCardComponent, [{
    type: Component,
    args: [{
      selector: "app-kpi-card",
      standalone: true,
      imports: [CommonModule],
      template: `
    <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="text-sm text-slate-600 mb-1 font-medium">{{ title }}</p>
          <p class="text-3xl font-bold text-slate-800 mb-2">{{ value }}</p>
          @if (subtitle) {
            <p class="text-xs text-slate-500">{{ subtitle }}</p>
          }
          @if (trend !== undefined) {
            <div class="flex items-center mt-2 text-xs">
              @if (trend > 0) {
                <span class="text-green-600 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                  +{{ trend }}%
                </span>
              } @else if (trend < 0) {
                <span class="text-red-600 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"></path>
                  </svg>
                  {{ trend }}%
                </span>
              } @else {
                <span class="text-slate-500">Stable</span>
              }
            </div>
          }
        </div>
        <div [class]="'text-white p-4 rounded-xl ' + bgColor">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
    }]
  }], null, { title: [{
    type: Input
  }], value: [{
    type: Input
  }], subtitle: [{
    type: Input
  }], trend: [{
    type: Input
  }], bgColor: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(KpiCardComponent, { className: "KpiCardComponent", filePath: "src/app/features/admin/dashboard/widgets/kpi-card.component.ts", lineNumber: 46 });
})();

// src/app/features/admin/dashboard/widgets/recent-activity.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function RecentActivityComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 4);
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(1, "svg", 6);
    \u0275\u0275domElement(2, "path", 7);
    \u0275\u0275domElementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275domElementStart(3, "p", 8);
    \u0275\u0275text(4, "Aucune activit\xE9 r\xE9cente");
    \u0275\u0275domElementEnd()();
  }
}
function RecentActivityComponent_Conditional_7_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 9)(1, "div");
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(2, "svg", 10);
    \u0275\u0275domElement(3, "path", 11);
    \u0275\u0275domElementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275domElementStart(4, "div", 12)(5, "p", 13);
    \u0275\u0275text(6);
    \u0275\u0275domElementStart(7, "span", 14);
    \u0275\u0275text(8);
    \u0275\u0275domElementEnd();
    \u0275\u0275text(9);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(10, "p", 15);
    \u0275\u0275text(11);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(12, "p", 16);
    \u0275\u0275text(13);
    \u0275\u0275domElementEnd()()();
  }
  if (rf & 2) {
    const activity_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classMap("p-2 rounded-lg flex-shrink-0 " + ctx_r1.getActionColor(activity_r1.action));
    \u0275\u0275advance(2);
    \u0275\u0275attribute("d", ctx_r1.getActionIcon(activity_r1.action));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", activity_r1.userName, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" a ", ctx_r1.getActionLabel(activity_r1.action).toLowerCase(), " ");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getEntityLabel(activity_r1.entity).toLowerCase(), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(activity_r1.details);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.formatTimestamp(activity_r1.timestamp));
  }
}
function RecentActivityComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 5);
    \u0275\u0275repeaterCreate(1, RecentActivityComponent_Conditional_7_For_2_Template, 14, 8, "div", 9, _forTrack0);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.activities);
  }
}
var RecentActivityComponent = class _RecentActivityComponent {
  activities = [];
  AuditActionLabels = AuditActionLabels;
  EntityTypeLabels = EntityTypeLabels;
  onViewAll() {
    window.location.href = "/admin/reports?tab=audit";
  }
  getActionLabel(action) {
    return AuditActionLabels[action] || action;
  }
  getEntityLabel(entity) {
    return EntityTypeLabels[entity] || entity;
  }
  getActionColor(action) {
    const colors = {
      CREATE: "bg-green-500",
      UPDATE: "bg-blue-500",
      DELETE: "bg-red-500",
      VALIDATE: "bg-purple-500",
      PUBLISH: "bg-indigo-500",
      GENERATE: "bg-yellow-500",
      EXPORT: "bg-cyan-500"
    };
    return colors[action] || "bg-slate-500";
  }
  getActionIcon(action) {
    const icons = {
      CREATE: "M12 4v16m8-8H4",
      UPDATE: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
      DELETE: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
      VALIDATE: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      PUBLISH: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
      GENERATE: "M13 10V3L4 14h7v7l9-11h-7z",
      EXPORT: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    };
    return icons[action] || "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z";
  }
  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = /* @__PURE__ */ new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 6e4);
    const diffHours = Math.floor(diffMs / 36e5);
    const diffDays = Math.floor(diffMs / 864e5);
    if (diffMins < 1)
      return "\xC0 l'instant";
    if (diffMins < 60)
      return `Il y a ${diffMins} min`;
    if (diffHours < 24)
      return `Il y a ${diffHours}h`;
    if (diffDays < 7)
      return `Il y a ${diffDays}j`;
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  static \u0275fac = function RecentActivityComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RecentActivityComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RecentActivityComponent, selectors: [["app-recent-activity"]], inputs: { activities: "activities" }, decls: 8, vars: 1, consts: [[1, "bg-white", "rounded-xl", "shadow-sm", "p-6"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "text-lg", "font-semibold", "text-slate-800"], [1, "text-sm", "text-blue-600", "hover:text-blue-700", "font-medium", 3, "click"], [1, "text-center", "py-8", "text-slate-500"], [1, "space-y-3", "max-h-96", "overflow-y-auto"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-12", "h-12", "mx-auto", "mb-2", "text-slate-300"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"], [1, "text-sm"], [1, "flex", "items-start", "space-x-3", "p-3", "rounded-lg", "hover:bg-slate-50", "transition-colors", "duration-150"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-4", "h-4", "text-white"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2"], [1, "flex-1", "min-w-0"], [1, "text-sm", "text-slate-800", "font-medium"], [1, "text-slate-600", "font-normal"], [1, "text-xs", "text-slate-500", "mt-1"], [1, "text-xs", "text-slate-400", "mt-1"]], template: function RecentActivityComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "div", 1)(2, "h3", 2);
      \u0275\u0275text(3, "Activit\xE9s R\xE9centes");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(4, "button", 3);
      \u0275\u0275domListener("click", function RecentActivityComponent_Template_button_click_4_listener() {
        return ctx.onViewAll();
      });
      \u0275\u0275text(5, " Voir tout ");
      \u0275\u0275domElementEnd()();
      \u0275\u0275conditionalCreate(6, RecentActivityComponent_Conditional_6_Template, 5, 0, "div", 4)(7, RecentActivityComponent_Conditional_7_Template, 3, 0, "div", 5);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275conditional(ctx.activities.length === 0 ? 6 : 7);
    }
  }, dependencies: [CommonModule], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RecentActivityComponent, [{
    type: Component,
    args: [{
      selector: "app-recent-activity",
      standalone: true,
      imports: [CommonModule],
      template: `
    <div class="bg-white rounded-xl shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-slate-800">Activit\xE9s R\xE9centes</h3>
        <button
          (click)="onViewAll()"
          class="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Voir tout
        </button>
      </div>

      @if (activities.length === 0) {
        <div class="text-center py-8 text-slate-500">
          <svg class="w-12 h-12 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p class="text-sm">Aucune activit\xE9 r\xE9cente</p>
        </div>
      } @else {
        <div class="space-y-3 max-h-96 overflow-y-auto">
          @for (activity of activities; track activity.id) {
            <div class="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-150">
              <div [class]="'p-2 rounded-lg flex-shrink-0 ' + getActionColor(activity.action)">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getActionIcon(activity.action)"></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-slate-800 font-medium">
                  {{ activity.userName }}
                  <span class="text-slate-600 font-normal">
                    a {{ getActionLabel(activity.action).toLowerCase() }}
                  </span>
                  {{ getEntityLabel(activity.entity).toLowerCase() }}
                </p>
                <p class="text-xs text-slate-500 mt-1">{{ activity.details }}</p>
                <p class="text-xs text-slate-400 mt-1">{{ formatTimestamp(activity.timestamp) }}</p>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
    }]
  }], null, { activities: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RecentActivityComponent, { className: "RecentActivityComponent", filePath: "src/app/features/admin/dashboard/widgets/recent-activity.component.ts", lineNumber: 55 });
})();

// src/app/features/admin/dashboard/widgets/alerts-widget.component.ts
var _forTrack02 = ($index, $item) => $item.id;
function AlertsWidgetComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 3);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", ctx_r0.unreadCount, " nouveau", ctx_r0.unreadCount > 1 ? "x" : "", " ");
  }
}
function AlertsWidgetComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 4);
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(1, "svg", 6);
    \u0275\u0275domElement(2, "path", 7);
    \u0275\u0275domElementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275domElementStart(3, "p", 8);
    \u0275\u0275text(4, "Aucune alerte");
    \u0275\u0275domElementEnd()();
  }
}
function AlertsWidgetComponent_Conditional_6_For_2_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 19);
    \u0275\u0275text(1, "Action requise");
    \u0275\u0275domElementEnd();
  }
}
function AlertsWidgetComponent_Conditional_6_For_2_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "button", 21);
    \u0275\u0275domListener("click", function AlertsWidgetComponent_Conditional_6_For_2_Conditional_18_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const alert_r3 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.dismissAlert(alert_r3.id));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(1, "svg", 22);
    \u0275\u0275domElement(2, "path", 23);
    \u0275\u0275domElementEnd()();
  }
}
function AlertsWidgetComponent_Conditional_6_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div")(1, "div", 10)(2, "div", 11)(3, "div");
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(4, "svg", 12);
    \u0275\u0275domElement(5, "path", 13);
    \u0275\u0275domElementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275domElementStart(6, "div", 14)(7, "div", 15)(8, "h4", 16);
    \u0275\u0275text(9);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(10, "span");
    \u0275\u0275text(11);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(12, "p", 17);
    \u0275\u0275text(13);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(14, "div", 18)(15, "span");
    \u0275\u0275text(16);
    \u0275\u0275domElementEnd();
    \u0275\u0275conditionalCreate(17, AlertsWidgetComponent_Conditional_6_For_2_Conditional_17_Template, 2, 0, "span", 19);
    \u0275\u0275domElementEnd()()();
    \u0275\u0275conditionalCreate(18, AlertsWidgetComponent_Conditional_6_For_2_Conditional_18_Template, 3, 0, "button", 20);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const alert_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap("p-4 rounded-lg border-l-4 " + ctx_r0.getBorderColor(alert_r3.severity) + " " + (alert_r3.dismissed ? "bg-slate-50 opacity-60" : "bg-slate-50"));
    \u0275\u0275advance(3);
    \u0275\u0275classMap("p-1.5 rounded-lg " + ctx_r0.getBgColor(alert_r3.severity));
    \u0275\u0275advance(2);
    \u0275\u0275attribute("d", ctx_r0.getIcon(alert_r3.severity));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(alert_r3.title);
    \u0275\u0275advance();
    \u0275\u0275classMap("px-2 py-0.5 text-xs font-medium rounded " + ctx_r0.getTagColor(alert_r3.severity));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getSeverityLabel(alert_r3.severity), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(alert_r3.message);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.formatTimestamp(alert_r3.timestamp));
    \u0275\u0275advance();
    \u0275\u0275conditional(alert_r3.actionRequired ? 17 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!alert_r3.dismissed ? 18 : -1);
  }
}
function AlertsWidgetComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 5);
    \u0275\u0275repeaterCreate(1, AlertsWidgetComponent_Conditional_6_For_2_Template, 19, 13, "div", 9, _forTrack02);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.alerts);
  }
}
var AlertsWidgetComponent = class _AlertsWidgetComponent {
  alerts = [];
  AlertSeverityLabels = AlertSeverityLabels;
  get unreadCount() {
    return this.alerts.filter((a) => !a.dismissed).length;
  }
  getSeverityLabel(severity) {
    return AlertSeverityLabels[severity] || severity;
  }
  getBorderColor(severity) {
    const colors = {
      INFO: "border-blue-500",
      WARNING: "border-yellow-500",
      ERROR: "border-red-500",
      CRITICAL: "border-purple-500"
    };
    return colors[severity] || "border-slate-500";
  }
  getBgColor(severity) {
    const colors = {
      INFO: "bg-blue-500",
      WARNING: "bg-yellow-500",
      ERROR: "bg-red-500",
      CRITICAL: "bg-purple-500"
    };
    return colors[severity] || "bg-slate-500";
  }
  getTagColor(severity) {
    const colors = {
      INFO: "bg-blue-100 text-blue-700",
      WARNING: "bg-yellow-100 text-yellow-700",
      ERROR: "bg-red-100 text-red-700",
      CRITICAL: "bg-purple-100 text-purple-700"
    };
    return colors[severity] || "bg-slate-100 text-slate-700";
  }
  getIcon(severity) {
    const icons = {
      INFO: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      WARNING: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
      ERROR: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
      CRITICAL: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    };
    return icons[severity] || icons["INFO"];
  }
  dismissAlert(id) {
    const alert = this.alerts.find((a) => a.id === id);
    if (alert) {
      alert.dismissed = true;
    }
  }
  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = /* @__PURE__ */ new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 6e4);
    const diffHours = Math.floor(diffMs / 36e5);
    const diffDays = Math.floor(diffMs / 864e5);
    if (diffMins < 1)
      return "\xC0 l'instant";
    if (diffMins < 60)
      return `Il y a ${diffMins} min`;
    if (diffHours < 24)
      return `Il y a ${diffHours}h`;
    if (diffDays < 7)
      return `Il y a ${diffDays}j`;
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  static \u0275fac = function AlertsWidgetComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AlertsWidgetComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AlertsWidgetComponent, selectors: [["app-alerts-widget"]], inputs: { alerts: "alerts" }, decls: 7, vars: 2, consts: [[1, "bg-white", "rounded-xl", "shadow-sm", "p-6"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "text-lg", "font-semibold", "text-slate-800"], [1, "px-2", "py-1", "text-xs", "font-semibold", "rounded-full", "bg-red-100", "text-red-600"], [1, "text-center", "py-8", "text-slate-500"], [1, "space-y-3", "max-h-96", "overflow-y-auto"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-12", "h-12", "mx-auto", "mb-2", "text-green-300"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"], [1, "text-sm"], [3, "class"], [1, "flex", "items-start", "justify-between"], [1, "flex", "items-start", "space-x-3", "flex-1"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-4", "h-4", "text-white"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2"], [1, "flex-1", "min-w-0"], [1, "flex", "items-center", "space-x-2", "mb-1"], [1, "text-sm", "font-semibold", "text-slate-800"], [1, "text-sm", "text-slate-600", "mb-2"], [1, "flex", "items-center", "space-x-4", "text-xs", "text-slate-500"], [1, "text-orange-600", "font-medium"], ["title", "Fermer", 1, "text-slate-400", "hover:text-slate-600", "ml-2"], ["title", "Fermer", 1, "text-slate-400", "hover:text-slate-600", "ml-2", 3, "click"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-4", "h-4"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M6 18L18 6M6 6l12 12"]], template: function AlertsWidgetComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "div", 1)(2, "h3", 2);
      \u0275\u0275text(3, "Alertes Syst\xE8me");
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(4, AlertsWidgetComponent_Conditional_4_Template, 2, 2, "span", 3);
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(5, AlertsWidgetComponent_Conditional_5_Template, 5, 0, "div", 4)(6, AlertsWidgetComponent_Conditional_6_Template, 3, 0, "div", 5);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.unreadCount > 0 ? 4 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.alerts.length === 0 ? 5 : 6);
    }
  }, dependencies: [CommonModule], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AlertsWidgetComponent, [{
    type: Component,
    args: [{
      selector: "app-alerts-widget",
      standalone: true,
      imports: [CommonModule],
      template: `
    <div class="bg-white rounded-xl shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-slate-800">Alertes Syst\xE8me</h3>
        @if (unreadCount > 0) {
          <span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600">
            {{ unreadCount }} nouveau{{ unreadCount > 1 ? 'x' : '' }}
          </span>
        }
      </div>

      @if (alerts.length === 0) {
        <div class="text-center py-8 text-slate-500">
          <svg class="w-12 h-12 mx-auto mb-2 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-sm">Aucune alerte</p>
        </div>
      } @else {
        <div class="space-y-3 max-h-96 overflow-y-auto">
          @for (alert of alerts; track alert.id) {
            <div
              [class]="'p-4 rounded-lg border-l-4 ' + getBorderColor(alert.severity) + ' ' + (alert.dismissed ? 'bg-slate-50 opacity-60' : 'bg-slate-50')"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-start space-x-3 flex-1">
                  <div [class]="'p-1.5 rounded-lg ' + getBgColor(alert.severity)">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getIcon(alert.severity)"></path>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-2 mb-1">
                      <h4 class="text-sm font-semibold text-slate-800">{{ alert.title }}</h4>
                      <span [class]="'px-2 py-0.5 text-xs font-medium rounded ' + getTagColor(alert.severity)">
                        {{ getSeverityLabel(alert.severity) }}
                      </span>
                    </div>
                    <p class="text-sm text-slate-600 mb-2">{{ alert.message }}</p>
                    <div class="flex items-center space-x-4 text-xs text-slate-500">
                      <span>{{ formatTimestamp(alert.timestamp) }}</span>
                      @if (alert.actionRequired) {
                        <span class="text-orange-600 font-medium">Action requise</span>
                      }
                    </div>
                  </div>
                </div>
                @if (!alert.dismissed) {
                  <button
                    (click)="dismissAlert(alert.id)"
                    class="text-slate-400 hover:text-slate-600 ml-2"
                    title="Fermer"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
    }]
  }], null, { alerts: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AlertsWidgetComponent, { className: "AlertsWidgetComponent", filePath: "src/app/features/admin/dashboard/widgets/alerts-widget.component.ts", lineNumber: 75 });
})();

// src/app/features/admin/dashboard/dashboard.component.ts
var _c02 = () => [1, 2, 3, 4];
var _forTrack03 = ($index, $item) => $item.day;
function DashboardComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 5);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" Derni\xE8re mise \xE0 jour : ", \u0275\u0275pipeBind4(2, 1, ctx_r0.kpis().derniereMiseAJour, "short", "", "fr-FR"), " ");
  }
}
function DashboardComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.alerts().length, " ");
  }
}
function DashboardComponent_Conditional_20_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275element(1, "div", 26)(2, "div", 27);
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13);
    \u0275\u0275repeaterCreate(1, DashboardComponent_Conditional_20_For_2_Template, 3, 0, "div", 25, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275repeater(\u0275\u0275pureFunction0(0, _c02));
  }
}
function DashboardComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "app-kpi-card", 28)(2, "span", 29);
    \u0275\u0275text(3, "groups");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "app-kpi-card", 30)(5, "span", 29);
    \u0275\u0275text(6, "meeting_room");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "app-kpi-card", 31)(8, "span", 29);
    \u0275\u0275text(9, "school");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "app-kpi-card", 32)(11, "span", 29);
    \u0275\u0275text(12, "warning");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r0.kpis().totalEnseignants.toString());
    \u0275\u0275advance(3);
    \u0275\u0275property("value", ctx_r0.kpis().totalSalles.toString())("subtitle", "Occupation : " + ctx_r0.kpis().tauxOccupationGlobal + "%");
    \u0275\u0275advance(3);
    \u0275\u0275property("value", ctx_r0.kpis().totalCours.toString())("subtitle", ctx_r0.kpis().coursNonPlanifies + " non planifi\xE9s");
    \u0275\u0275advance(3);
    \u0275\u0275property("value", ctx_r0.kpis().conflitsActifs.toString())("bgColor", ctx_r0.kpis().conflitsActifs > 0 ? "bg-red-500" : "bg-emerald-500");
  }
}
function DashboardComponent_For_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "div", 33);
    \u0275\u0275element(2, "div", 34)(3, "div", 35)(4, "div", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 37);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const data_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("height", data_r2.coord, "px");
    \u0275\u0275advance();
    \u0275\u0275styleProp("height", data_r2.avail, "px");
    \u0275\u0275advance();
    \u0275\u0275styleProp("height", data_r2.limited, "px");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(data_r2.day);
  }
}
var DashboardComponent = class _DashboardComponent {
  reportService = inject(ReportService);
  refreshSubscription;
  // Signals pour state management
  kpis = signal(null, ...ngDevMode ? [{ debugName: "kpis" }] : []);
  recentActivities = signal([], ...ngDevMode ? [{ debugName: "recentActivities" }] : []);
  alerts = signal([], ...ngDevMode ? [{ debugName: "alerts" }] : []);
  isLoading = signal(true, ...ngDevMode ? [{ debugName: "isLoading" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  // Chart data pour occupation des salles
  chartData = signal([
    { day: "Lun", coord: 80, avail: 90, limited: 70 },
    { day: "Mar", coord: 90, avail: 98, limited: 75 },
    { day: "Mer", coord: 90, avail: 106, limited: 80 },
    { day: "Jeu", coord: 100, avail: 114, limited: 85 },
    { day: "Ven", coord: 110, avail: 122, limited: 90 },
    { day: "Sam", coord: 120, avail: 130, limited: 95 }
  ], ...ngDevMode ? [{ debugName: "chartData" }] : []);
  ngOnInit() {
    this.loadDashboardData();
    this.setupAutoRefresh();
  }
  ngOnDestroy() {
    this.refreshSubscription?.unsubscribe();
  }
  /**
   * Charge les données du dashboard depuis l'API
   */
  loadDashboardData() {
    this.isLoading.set(true);
    this.error.set(null);
    this.reportService.getDashboardStats().pipe(catchError((err) => {
      this.error.set("Erreur lors du chargement des donn\xE9es");
      console.error("Dashboard loading error:", err);
      this.isLoading.set(false);
      throw err;
    })).subscribe({
      next: (stats) => {
        this.kpis.set(stats.kpis);
        this.recentActivities.set(stats.recentActivities || []);
        this.alerts.set(stats.alerts || []);
        this.updateChartData(stats);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
  /**
   * Configure le rafraîchissement automatique toutes les 5 minutes
   */
  setupAutoRefresh() {
    this.refreshSubscription = interval(3e5).pipe(startWith(0), switchMap(() => this.reportService.getDashboardStats())).subscribe({
      next: (stats) => {
        this.kpis.set(stats.kpis);
        this.recentActivities.set(stats.recentActivities || []);
        this.alerts.set(stats.alerts || []);
        this.updateChartData(stats);
      },
      error: (err) => {
        console.error("Auto-refresh error:", err);
      }
    });
  }
  /**
   * Met à jour les données du graphique
   */
  updateChartData(stats) {
    if (stats.chartsData?.occupationParJour) {
      const data = stats.chartsData.occupationParJour;
    }
  }
  /**
   * Force le rechargement des données
   */
  refresh() {
    this.loadDashboardData();
  }
  static \u0275fac = function DashboardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DashboardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DashboardComponent, selectors: [["app-dashboard"]], decls: 44, vars: 5, consts: [[1, "flex-1", "p-6"], [1, "flex", "justify-between", "items-start", "mb-4"], [1, "text-xl", "font-bold", "text-slate-800", "flex", "items-center", "gap-2"], [1, "material-icons", "text-slate-700"], [1, "text-sm", "text-slate-500", "mt-1"], [1, "text-xs", "text-slate-400", "mt-0.5"], [1, "flex", "items-center", "gap-2"], ["title", "Actualiser", 1, "p-2", "bg-white", "shadow-sm", "rounded-xl", "hover:bg-slate-100", "transition", 3, "click"], [1, "material-icons", "text-slate-600", "text-xl"], [1, "p-2", "bg-white", "shadow-sm", "rounded-xl", "hover:bg-slate-100", "transition"], [1, "absolute", "-top-1", "-right-1", "bg-red-500", "text-white", "text-xs", "rounded-full", "w-5", "h-5", "flex", "items-center", "justify-center"], [1, "grid", "grid-cols-1", "xl:grid-cols-3", "gap-6"], [1, "col-span-2", "space-y-6"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-4", "gap-4"], [1, "bg-white", "rounded-xl", "shadow-sm", "p-6", "border", "border-slate-200"], [1, "text-lg", "font-semibold", "text-slate-800", "mb-4"], [1, "flex", "items-end", "justify-around", "h-52"], [1, "flex", "flex-col", "items-center", "gap-1"], [1, "flex", "justify-center", "gap-6", "mt-6", "text-sm"], [1, "w-3", "h-3", "bg-teal-500", "rounded-sm"], [1, "w-3", "h-3", "bg-emerald-400", "rounded-sm"], [1, "w-3", "h-3", "bg-red-400", "rounded-sm"], [3, "alerts"], [1, "space-y-4"], [3, "activities"], [1, "bg-white", "rounded-xl", "shadow-sm", "p-6", "animate-pulse"], [1, "h-4", "bg-slate-200", "rounded", "w-3/4", "mb-4"], [1, "h-8", "bg-slate-200", "rounded", "w-1/2"], ["title", "Total Enseignants", "subtitle", "Actifs dans le syst\xE8me", "bgColor", "bg-blue-500", 3, "value"], [1, "material-icons"], ["title", "Total Salles", "bgColor", "bg-green-500", 3, "value", "subtitle"], ["title", "Total Cours", "bgColor", "bg-purple-500", 3, "value", "subtitle"], ["title", "Conflits Actifs", "subtitle", "\xC0 r\xE9soudre", 3, "value", "bgColor"], [1, "flex", "gap-1"], [1, "w-6", "bg-teal-500", "rounded-t"], [1, "w-6", "bg-emerald-400", "rounded-t"], [1, "w-6", "bg-red-400", "rounded-t"], [1, "text-xs", "text-slate-600", "mt-1"]], template: function DashboardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2)(4, "span", 3);
      \u0275\u0275text(5, "dashboard");
      \u0275\u0275elementEnd();
      \u0275\u0275text(6, " Tableau de Bord ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "p", 4);
      \u0275\u0275text(8, "Bienvenue sur votre tableau de bord");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, DashboardComponent_Conditional_9_Template, 3, 6, "p", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "div", 6)(11, "button", 7);
      \u0275\u0275listener("click", function DashboardComponent_Template_button_click_11_listener() {
        return ctx.refresh();
      });
      \u0275\u0275elementStart(12, "span", 8);
      \u0275\u0275text(13, "refresh");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "button", 9)(15, "span", 8);
      \u0275\u0275text(16, "notifications");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(17, DashboardComponent_Conditional_17_Template, 2, 1, "span", 10);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(18, "div", 11)(19, "div", 12);
      \u0275\u0275conditionalCreate(20, DashboardComponent_Conditional_20_Template, 3, 1, "div", 13)(21, DashboardComponent_Conditional_21_Template, 13, 7, "div", 13);
      \u0275\u0275elementStart(22, "div", 14)(23, "h2", 15);
      \u0275\u0275text(24, "R\xE9partition des salles");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "div", 16);
      \u0275\u0275repeaterCreate(26, DashboardComponent_For_27_Template, 7, 7, "div", 17, _forTrack03);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "div", 18)(29, "div", 6);
      \u0275\u0275element(30, "div", 19);
      \u0275\u0275elementStart(31, "span");
      \u0275\u0275text(32, "En cours");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(33, "div", 6);
      \u0275\u0275element(34, "div", 20);
      \u0275\u0275elementStart(35, "span");
      \u0275\u0275text(36, "Disponibles");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(37, "div", 6);
      \u0275\u0275element(38, "div", 21);
      \u0275\u0275elementStart(39, "span");
      \u0275\u0275text(40, "Occupation limit\xE9e");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275element(41, "app-alerts-widget", 22);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "div", 23);
      \u0275\u0275element(43, "app-recent-activity", 24);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275advance(9);
      \u0275\u0275conditional(((tmp_0_0 = ctx.kpis()) == null ? null : tmp_0_0.derniereMiseAJour) ? 9 : -1);
      \u0275\u0275advance(8);
      \u0275\u0275conditional(ctx.alerts().length > 0 ? 17 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.isLoading() ? 20 : ctx.kpis() ? 21 : -1);
      \u0275\u0275advance(6);
      \u0275\u0275repeater(ctx.chartData());
      \u0275\u0275advance(15);
      \u0275\u0275property("alerts", ctx.alerts());
      \u0275\u0275advance(2);
      \u0275\u0275property("activities", ctx.recentActivities());
    }
  }, dependencies: [
    CommonModule,
    KpiCardComponent,
    RecentActivityComponent,
    AlertsWidgetComponent,
    DatePipe
  ], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DashboardComponent, [{
    type: Component,
    args: [{ selector: "app-dashboard", standalone: true, imports: [
      CommonModule,
      KpiCardComponent,
      RecentActivityComponent,
      AlertsWidgetComponent
    ], template: `<!--<div class="min-h-screen bg-slate-50 flex ">
  <app-sidebar></app-sidebar>
-->
  <div class="flex-1 p-6">
    <!-- HEADER -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h1 class="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span class="material-icons text-slate-700">dashboard</span>
          Tableau de Bord
        </h1>
        <p class="text-sm text-slate-500 mt-1">Bienvenue sur votre tableau de bord</p>
        @if (kpis()?.derniereMiseAJour) {
          <p class="text-xs text-slate-400 mt-0.5">
            Derni\xE8re mise \xE0 jour : {{ kpis()!.derniereMiseAJour | date:'short':'':'fr-FR' }}
          </p>
        }
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <button
          (click)="refresh()"
          class="p-2 bg-white shadow-sm rounded-xl hover:bg-slate-100 transition"
          title="Actualiser"
        >
          <span class="material-icons text-slate-600 text-xl">refresh</span>
        </button>
        <button class="p-2 bg-white shadow-sm rounded-xl hover:bg-slate-100 transition">
          <span class="material-icons text-slate-600 text-xl">notifications</span>
          @if (alerts().length > 0) {
            <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {{ alerts().length }}
            </span>
          }
        </button>
      </div>
    </div>

    <!-- CONTENU PRINCIPAL en 2 colonnes -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">

      <!-- COLONNE GAUCHE (stats + chart + alertes) -->
      <div class="col-span-2 space-y-6">

        <!-- KPIs CARDS -->
        @if (isLoading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            @for (i of [1,2,3,4]; track i) {
              <div class="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div class="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div class="h-8 bg-slate-200 rounded w-1/2"></div>
              </div>
            }
          </div>
        } @else if (kpis()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <app-kpi-card
              title="Total Enseignants"
              [value]="kpis()!.totalEnseignants.toString()"
              subtitle="Actifs dans le syst\xE8me"
              bgColor="bg-blue-500">
              <span class="material-icons">groups</span>
            </app-kpi-card>

            <app-kpi-card
              title="Total Salles"
              [value]="kpis()!.totalSalles.toString()"
              [subtitle]="'Occupation : ' + kpis()!.tauxOccupationGlobal + '%'"
              bgColor="bg-green-500">
              <span class="material-icons">meeting_room</span>
            </app-kpi-card>

            <app-kpi-card
              title="Total Cours"
              [value]="kpis()!.totalCours.toString()"
              [subtitle]="kpis()!.coursNonPlanifies + ' non planifi\xE9s'"
              bgColor="bg-purple-500">
              <span class="material-icons">school</span>
            </app-kpi-card>

            <app-kpi-card
              title="Conflits Actifs"
              [value]="kpis()!.conflitsActifs.toString()"
              subtitle="\xC0 r\xE9soudre"
              [bgColor]="kpis()!.conflitsActifs > 0 ? 'bg-red-500' : 'bg-emerald-500'">
              <span class="material-icons">warning</span>
            </app-kpi-card>
          </div>
        }

        <!-- CHART CARD -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">R\xE9partition des salles</h2>

          <div class="flex items-end justify-around h-52">
            @for (data of chartData(); track data.day) {
              <div class="flex flex-col items-center gap-1">
                <div class="flex gap-1">
                  <div class="w-6 bg-teal-500 rounded-t" [style.height.px]="data.coord"></div>
                  <div class="w-6 bg-emerald-400 rounded-t" [style.height.px]="data.avail"></div>
                  <div class="w-6 bg-red-400 rounded-t" [style.height.px]="data.limited"></div>
                </div>
                <span class="text-xs text-slate-600 mt-1">{{ data.day }}</span>
              </div>
            }
          </div>

          <!-- Legend -->
          <div class="flex justify-center gap-6 mt-6 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-teal-500 rounded-sm"></div>
              <span>En cours</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-emerald-400 rounded-sm"></div>
              <span>Disponibles</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-red-400 rounded-sm"></div>
              <span>Occupation limit\xE9e</span>
            </div>
          </div>
        </div>

        <!-- ALERTES SYST\xC8ME -->
        <app-alerts-widget [alerts]="alerts()"></app-alerts-widget>
      </div>

      <!-- COLONNE DROITE (activit\xE9s r\xE9centes) -->
      <div class="space-y-4">
        <app-recent-activity [activities]="recentActivities()"></app-recent-activity>
      </div>
    </div>
  </div>
<!--</div>-->
` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DashboardComponent, { className: "DashboardComponent", filePath: "src/app/features/admin/dashboard/dashboard.component.ts", lineNumber: 25 });
})();
export {
  DashboardComponent
};
//# sourceMappingURL=chunk-AXSZBHX5.js.map
