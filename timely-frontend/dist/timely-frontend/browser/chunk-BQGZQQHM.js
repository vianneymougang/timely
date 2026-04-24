import {
  ApiService
} from "./chunk-M2M2Z2ZK.js";
import {
  Injectable,
  inject,
  map,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-DBHCOGA3.js";
import {
  __objRest
} from "./chunk-WDMUDEB6.js";

// src/app/core/services/ecole.service.ts
var EcoleService = class _EcoleService {
  apiService = inject(ApiService);
  getEcoles() {
    return this.apiService.get("/bookings/ecoles").pipe(map((items) => items.map(this.toEcole)));
  }
  fetchEcolesFromApi() {
    return this.apiService.get("/bookings/ecoles");
  }
  getEcoleById(id) {
    return this.apiService.get(`/bookings/ecoles/${id}`).pipe(map(this.toEcole));
  }
  createEcole(ecole) {
    const body = {
      nom: ecole.nom,
      code: ecole.nom.toUpperCase().replace(/\s+/g, "-").substring(0, 10),
      contactResponsable: ecole.directeur ?? "",
      adresse: ecole.description ?? ""
    };
    return this.apiService.post("/bookings/ecoles", body).pipe(map(this.toEcole));
  }
  updateEcole(ecole) {
    const _a = ecole, { id } = _a, rest = __objRest(_a, ["id"]);
    const body = {
      nom: rest.nom,
      code: (rest.nom ?? "").toUpperCase().replace(/\s+/g, "-").substring(0, 10),
      contactResponsable: rest.directeur ?? "",
      adresse: rest.description ?? ""
    };
    return this.apiService.put(`/bookings/ecoles/${id}`, body).pipe(map(this.toEcole));
  }
  deleteEcole(id) {
    return this.apiService.delete(`/bookings/ecoles/${id}`);
  }
  toEcole(r) {
    return {
      id: r.id,
      nom: r.nom,
      directeur: r.contactResponsable ?? "",
      description: r.adresse ?? ""
    };
  }
  static \u0275fac = function EcoleService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EcoleService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _EcoleService, factory: _EcoleService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EcoleService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  EcoleService
};
//# sourceMappingURL=chunk-BQGZQQHM.js.map
