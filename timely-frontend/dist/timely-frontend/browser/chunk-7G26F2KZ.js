import {
  Router
} from "./chunk-SG7N3ZM6.js";
import {
  environment
} from "./chunk-AL3K22XE.js";
import {
  HttpClient
} from "./chunk-GGDRA3L4.js";
import {
  Injectable,
  catchError,
  inject,
  setClassMetadata,
  signal,
  tap,
  throwError,
  ɵɵdefineInjectable
} from "./chunk-DBHCOGA3.js";

// src/app/core/services/auth.service.ts
var AuthService = class _AuthService {
  http = inject(HttpClient);
  router = inject(Router);
  currentUser = signal(null, ...ngDevMode ? [{ debugName: "currentUser" }] : []);
  isAuthenticated = signal(false, ...ngDevMode ? [{ debugName: "isAuthenticated" }] : []);
  AUTH_API = `${environment.apiUrl}/auth`;
  ACCESS_TOKEN_KEY = "accessToken";
  REFRESH_TOKEN_KEY = "refreshToken";
  USER_KEY = "user";
  constructor() {
    this.checkStoredAuth();
  }
  /**
   * Login with API Gateway
   */
  login(email, password) {
    const loginRequest = { email, password };
    return this.http.post(`${this.AUTH_API}/login`, loginRequest).pipe(tap((response) => this.handleSuccessfulLogin(response)), catchError((error) => {
      console.error("Login error:", error);
      return throwError(() => new Error(error.error?.message || "Email ou mot de passe incorrect"));
    }));
  }
  /**
   * Refresh access token
   */
  refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error("No refresh token available"));
    }
    return this.http.post(`${this.AUTH_API}/refresh`, { refreshToken }).pipe(tap((response) => {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    }), catchError((error) => {
      console.error("Token refresh error:", error);
      this.logout();
      return throwError(() => error);
    }));
  }
  /**
   * Handle successful login
   */
  handleSuccessfulLogin(response) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    const user = {
      id: response.userId,
      email: response.email,
      name: response.name,
      role: this.mapRole(response.role),
      status: response.status
    };
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    if (user.role === "admin") {
      this.router.navigate(["/admin/dashboard"]);
    } else {
      this.router.navigate(["/teacher/dashboard"]);
    }
  }
  /**
   * Map backend role format to frontend format
   * ROLE_ADMIN -> 'admin', ROLE_TEACHER -> 'teacher'
   */
  mapRole(backendRole) {
    if (backendRole.includes("ADMIN")) {
      return "admin";
    }
    return "teacher";
  }
  /**
   * Check stored authentication
   */
  checkStoredAuth() {
    const token = this.getAccessToken();
    const userStr = localStorage.getItem(this.USER_KEY);
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch (error) {
        this.logout();
      }
    }
  }
  /**
   * Logout
   */
  logout() {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.http.post(`${this.AUTH_API}/logout`, { refreshToken }).subscribe({
        error: (error) => console.error("Logout error:", error)
      });
    }
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(["/auth/login"]);
  }
  /**
   * Get access token
   */
  getAccessToken() {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }
  /**
   * Get refresh token
   */
  getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }
  /**
   * Legacy method for backward compatibility
   */
  getToken() {
    return this.getAccessToken();
  }
  checkAuth() {
    return !!this.getAccessToken();
  }
  getCurrentUser() {
    return this.currentUser();
  }
  isAdmin() {
    return this.currentUser()?.role === "admin";
  }
  isTeacher() {
    return this.currentUser()?.role === "teacher";
  }
  /**
   * Request password reset - sends email with reset link
   */
  forgotPassword(email) {
    return this.http.post(`${this.AUTH_API}/forgot-password`, { email }).pipe(catchError((error) => {
      console.error("Forgot password error:", error);
      return throwError(() => new Error(error.error?.message || "Erreur lors de l'envoi de l'email"));
    }));
  }
  /**
   * Validate password reset token
   */
  validateResetToken(token) {
    return this.http.get(`${this.AUTH_API}/validate-reset-token/${token}`).pipe(catchError((error) => {
      console.error("Token validation error:", error);
      return throwError(() => new Error(error.error?.message || "Token invalide ou expir\xE9"));
    }));
  }
  /**
   * Reset password with token
   */
  resetPassword(token, newPassword) {
    return this.http.post(`${this.AUTH_API}/reset-password`, { token, newPassword }).pipe(catchError((error) => {
      console.error("Reset password error:", error);
      return throwError(() => new Error(error.error?.message || "Erreur lors de la r\xE9initialisation"));
    }));
  }
  static \u0275fac = function AuthService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

export {
  AuthService
};
//# sourceMappingURL=chunk-7G26F2KZ.js.map
