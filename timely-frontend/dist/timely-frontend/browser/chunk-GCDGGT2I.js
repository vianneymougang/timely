import {
  ApiService
} from "./chunk-M2M2Z2ZK.js";
import {
  Injectable,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-DBHCOGA3.js";
import {
  __objRest,
  __spreadProps,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/core/services/filiere.service.ts
var FiliereService = class _FiliereService {
  apiService = inject(ApiService);
  getFilieres() {
    return this.apiService.get("/bookings/filieres");
  }
  getFiliereById(id) {
    return this.apiService.get(`/bookings/filieres/${id}`);
  }
  getFilieresByEcole(ecoleId) {
    return this.apiService.get(`/bookings/ecoles/${ecoleId}/filieres`);
  }
  createFiliere(filiere) {
    const body = __spreadProps(__spreadValues({}, filiere), {
      code: filiere.code || filiere.nom.toUpperCase().replace(/\s+/g, "").substring(0, 8)
    });
    return this.apiService.post("/bookings/filieres", body);
  }
  updateFiliere(filiere) {
    const _a = filiere, { id } = _a, rest = __objRest(_a, ["id"]);
    const body = __spreadProps(__spreadValues({}, rest), {
      code: rest.code || (rest.nom ?? "").toUpperCase().replace(/\s+/g, "").substring(0, 8)
    });
    return this.apiService.put(`/bookings/filieres/${id}`, body);
  }
  deleteFiliere(id) {
    return this.apiService.delete(`/bookings/filieres/${id}`);
  }
  static \u0275fac = function FiliereService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FiliereService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _FiliereService, factory: _FiliereService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FiliereService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  FiliereService
};
//# sourceMappingURL=chunk-GCDGGT2I.js.map
