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

// src/app/core/services/classe.service.ts
var ClasseService = class _ClasseService {
  apiService = inject(ApiService);
  getClasses() {
    return this.apiService.get("/bookings/classes").pipe(map((items) => items.map(this.toClasse)));
  }
  getClasseById(id) {
    return this.apiService.get(`/bookings/classes/${id}`).pipe(map(this.toClasse));
  }
  getClassesByFiliere(filiereId) {
    return this.apiService.get(`/bookings/filieres/${filiereId}/classes`).pipe(map((items) => items.map(this.toClasse)));
  }
  createClasse(classe) {
    const body = {
      filiereId: classe.filiereId,
      niveau: classe.niveau,
      code: classe.nom,
      effectif: 0,
      anneeAcademique: "2024-2025"
    };
    return this.apiService.post("/bookings/classes", body).pipe(map(this.toClasse));
  }
  updateClasse(classe) {
    const _a = classe, { id } = _a, rest = __objRest(_a, ["id"]);
    const body = {
      filiereId: rest.filiereId,
      niveau: rest.niveau,
      code: rest.nom,
      effectif: 0,
      anneeAcademique: "2024-2025"
    };
    return this.apiService.put(`/bookings/classes/${id}`, body).pipe(map(this.toClasse));
  }
  deleteClasse(id) {
    return this.apiService.delete(`/bookings/classes/${id}`);
  }
  toClasse(r) {
    return {
      id: r.id,
      nom: r.code,
      niveau: r.niveau,
      filiereId: r.filiereId
    };
  }
  static \u0275fac = function ClasseService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ClasseService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ClasseService, factory: _ClasseService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ClasseService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  ClasseService
};
//# sourceMappingURL=chunk-37GUWSLG.js.map
