import {
  environment
} from "./chunk-AL3K22XE.js";
import {
  HttpClient,
  HttpParams
} from "./chunk-GGDRA3L4.js";
import {
  Injectable,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-DBHCOGA3.js";

// src/app/core/services/api.service.ts
var ApiService = class _ApiService {
  http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  get(endpoint, params) {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        httpParams = httpParams.set(key, params[key]);
      });
    }
    return this.http.get(`${this.baseUrl}${endpoint}`, { params: httpParams });
  }
  post(endpoint, data) {
    return this.http.post(`${this.baseUrl}${endpoint}`, data);
  }
  put(endpoint, data) {
    return this.http.put(`${this.baseUrl}${endpoint}`, data);
  }
  delete(endpoint) {
    return this.http.delete(`${this.baseUrl}${endpoint}`);
  }
  static \u0275fac = function ApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ApiService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ApiService, factory: _ApiService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ApiService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  ApiService
};
//# sourceMappingURL=chunk-M2M2Z2ZK.js.map
