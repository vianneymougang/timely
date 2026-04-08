import {
  ApiService
} from "./chunk-M2M2Z2ZK.js";
import {
  Injectable,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-DBHCOGA3.js";

// src/app/core/services/availability.service.ts
var AvailabilityService = class _AvailabilityService {
  apiService = inject(ApiService);
  /**
   * Save or update teacher's own availability
   */
  saveMyAvailability(data) {
    return this.apiService.put("/availability", data);
  }
  /**
   * Get teacher's own availability
   */
  getMyAvailability() {
    return this.apiService.get("/availability/me");
  }
  /**
   * Get specific teacher's availability (admin only)
   */
  getTeacherAvailability(teacherId) {
    return this.apiService.get(`/availability/teacher/${teacherId}`);
  }
  /**
   * Get all teachers' availability summaries (admin only)
   */
  getAllTeacherAvailabilities() {
    return this.apiService.get("/availability/all");
  }
  static \u0275fac = function AvailabilityService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AvailabilityService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AvailabilityService, factory: _AvailabilityService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AvailabilityService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  AvailabilityService
};
//# sourceMappingURL=chunk-I5BQUIP2.js.map
