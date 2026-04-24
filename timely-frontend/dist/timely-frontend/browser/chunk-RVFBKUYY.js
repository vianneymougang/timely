import {
  ApiService
} from "./chunk-M2M2Z2ZK.js";
import {
  BehaviorSubject,
  Injectable,
  Observable,
  inject,
  map,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-DBHCOGA3.js";
import {
  __objRest,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/core/services/materiel.service.ts
var MaterielService = class _MaterielService {
  materielSubject = new BehaviorSubject([]);
  materiel$ = this.materielSubject.asObservable();
  // Mock data - à remplacer par des appels API
  mockMateriels = [
    {
      id: "1",
      nom: "rallonge",
      type: "electrique",
      etat: "Bon",
      quantite: 50,
      description: "rallonge pour les appareils"
    },
    {
      id: "2",
      nom: "projecteur",
      type: "electrique",
      etat: "Excellent",
      quantite: 25,
      description: "projecteur pour les cours"
    },
    {
      id: "3",
      nom: "Marqueurs tableau blanc",
      type: "Fourniture",
      etat: "Bon",
      quantite: 100,
      description: "Marqueurs effa\xE7ables \xE0 sec"
    },
    {
      id: "4",
      nom: "Haut parleurs",
      type: "electrique",
      etat: "Excellent",
      quantite: 10,
      description: ""
    }
  ];
  constructor() {
    this.materielSubject.next(this.mockMateriels);
  }
  getMateriels() {
    return this.materiel$;
  }
  getMaterielById(id) {
    return this.mockMateriels.find((m) => m.id === id);
  }
  createMateriel(materiel) {
    return new Observable((observer) => {
      const newMateriel = __spreadValues({
        id: Date.now().toString()
      }, materiel);
      this.mockMateriels.push(newMateriel);
      this.materielSubject.next([...this.mockMateriels]);
      observer.next(newMateriel);
      observer.complete();
    });
  }
  updateMateriel(materiel) {
    return new Observable((observer) => {
      const index = this.mockMateriels.findIndex((m) => m.id === materiel.id);
      if (index !== -1) {
        this.mockMateriels[index] = __spreadValues(__spreadValues({}, this.mockMateriels[index]), materiel);
        this.materielSubject.next([...this.mockMateriels]);
        observer.next(this.mockMateriels[index]);
      }
      observer.complete();
    });
  }
  deleteMateriel(id) {
    return new Observable((observer) => {
      this.mockMateriels = this.mockMateriels.filter((m) => m.id !== id);
      this.materielSubject.next([...this.mockMateriels]);
      observer.next();
      observer.complete();
    });
  }
  static \u0275fac = function MaterielService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MaterielService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MaterielService, factory: _MaterielService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MaterielService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// src/app/core/services/equipement.service.ts
var EquipementService = class _EquipementService {
  apiService = inject(ApiService);
  getEquipements() {
    return this.apiService.get("/bookings/equipements").pipe(map((items) => items.map(this.toEquipement)));
  }
  getEquipementById(id) {
    return this.apiService.get(`/bookings/equipements/${id}`).pipe(map(this.toEquipement));
  }
  createEquipement(equipement) {
    const body = {
      nom: equipement.nom,
      code: equipement.nom.toUpperCase().replace(/\s+/g, "-").substring(0, 20),
      description: equipement.description ?? "",
      quantiteDisponible: 1
    };
    return this.apiService.post("/bookings/equipements", body).pipe(map(this.toEquipement));
  }
  updateEquipement(equipement) {
    const _a = equipement, { id } = _a, rest = __objRest(_a, ["id"]);
    const body = {
      nom: rest.nom,
      code: (rest.nom ?? "").toUpperCase().replace(/\s+/g, "-").substring(0, 20),
      description: rest.description ?? "",
      quantiteDisponible: 1
    };
    return this.apiService.put(`/bookings/equipements/${id}`, body).pipe(map(this.toEquipement));
  }
  deleteEquipement(id) {
    return this.apiService.delete(`/bookings/equipements/${id}`);
  }
  toEquipement(r) {
    return {
      id: r.id,
      nom: r.nom,
      type: "\xC9quipement",
      etat: "Bon",
      description: r.description ?? "",
      materielsAffectes: []
    };
  }
  static \u0275fac = function EquipementService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EquipementService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _EquipementService, factory: _EquipementService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EquipementService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  MaterielService,
  EquipementService
};
//# sourceMappingURL=chunk-RVFBKUYY.js.map
