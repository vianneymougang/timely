import {
  AvailabilityService
} from "./chunk-I5BQUIP2.js";
import {
  Router
} from "./chunk-SG7N3ZM6.js";
import {
  ApiService
} from "./chunk-M2M2Z2ZK.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NgSelectOption,
  RequiredValidator,
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-Y74VR2WI.js";
import "./chunk-AL3K22XE.js";
import {
  CommonModule,
  NgClass
} from "./chunk-GGDRA3L4.js";
import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  catchError,
  computed,
  delay,
  inject,
  map,
  of,
  setClassMetadata,
  signal,
  tap,
  throwError,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-DBHCOGA3.js";
import "./chunk-WDMUDEB6.js";

// src/app/core/data/mock-data.ts
var MOCK_TEACHERS = [
  {
    id: "1",
    firstName: "Arthur",
    lastName: "Pessah",
    email: "arthur.pessah@isjcam.org",
    initials: "MPA",
    phone: "+237 673032389",
    assignedCourses: 3,
    hourlyLoad: {
      used: 4,
      total: 24
    },
    availability: {
      monday: "8h-18h",
      tuesday: "9h-18h",
      wednesday: "8h-18h",
      thursday: "9h-17h",
      friday: "8h-18h",
      saturday: "-"
    },
    schedule: {
      monday: "-",
      tuesday: "-",
      wednesday: "-",
      thursday: "12h-14h",
      friday: "-",
      saturday: "-"
    },
    status: "available",
    userStatus: "ACTIVE"
  },
  {
    id: "2",
    firstName: "Marie",
    lastName: "Kouam",
    email: "marie.kouam@isjcam.org",
    initials: "MK",
    phone: "+237 698765432",
    assignedCourses: 5,
    hourlyLoad: {
      used: 12,
      total: 24
    },
    availability: {
      monday: "8h-17h",
      tuesday: "8h-17h",
      wednesday: "8h-17h",
      thursday: "8h-17h",
      friday: "8h-17h",
      saturday: "9h-12h"
    },
    schedule: {
      monday: "10h-12h",
      tuesday: "14h-16h",
      wednesday: "8h-10h",
      thursday: "10h-12h",
      friday: "14h-16h",
      saturday: "9h-11h"
    },
    status: "available",
    userStatus: "ACTIVE"
  },
  {
    id: "3",
    firstName: "Jean",
    lastName: "Mbarga",
    email: "jean.mbarga@isjcam.org",
    initials: "JM",
    phone: "+237 677889900",
    assignedCourses: 4,
    hourlyLoad: {
      used: 16,
      total: 24
    },
    availability: {
      monday: "9h-18h",
      tuesday: "9h-18h",
      wednesday: "9h-18h",
      thursday: "9h-18h",
      friday: "9h-16h",
      saturday: "-"
    },
    schedule: {
      monday: "9h-11h",
      tuesday: "14h-16h",
      wednesday: "9h-11h",
      thursday: "14h-16h",
      friday: "9h-11h",
      saturday: "-"
    },
    status: "busy",
    userStatus: "ACTIVE"
  },
  {
    id: "4",
    firstName: "Claire",
    lastName: "Ngono",
    email: "claire.ngono@isjcam.org",
    initials: "CN",
    phone: "+237 655443322",
    assignedCourses: 6,
    hourlyLoad: {
      used: 18,
      total: 24
    },
    availability: {
      monday: "8h-18h",
      tuesday: "8h-18h",
      wednesday: "8h-18h",
      thursday: "8h-18h",
      friday: "8h-18h",
      saturday: "8h-12h"
    },
    schedule: {
      monday: "10h-12h",
      tuesday: "10h-12h",
      wednesday: "14h-16h",
      thursday: "10h-12h",
      friday: "14h-16h",
      saturday: "8h-10h"
    },
    status: "busy",
    userStatus: "ACTIVE"
  },
  {
    id: "5",
    firstName: "Paul",
    lastName: "Tagne",
    email: "paul.tagne@isjcam.org",
    initials: "PT",
    phone: "+237 699887766",
    assignedCourses: 2,
    hourlyLoad: {
      used: 6,
      total: 24
    },
    availability: {
      monday: "14h-18h",
      tuesday: "14h-18h",
      wednesday: "14h-18h",
      thursday: "14h-18h",
      friday: "14h-18h",
      saturday: "-"
    },
    schedule: {
      monday: "14h-16h",
      tuesday: "-",
      wednesday: "14h-16h",
      thursday: "-",
      friday: "14h-16h",
      saturday: "-"
    },
    status: "available",
    userStatus: "ACTIVE"
  }
];

// src/app/core/services/teacher.service.ts
var TeacherService = class _TeacherService {
  apiService = inject(ApiService);
  teachers = signal([], ...ngDevMode ? [{ debugName: "teachers" }] : []);
  selectedTeacher = signal(null, ...ngDevMode ? [{ debugName: "selectedTeacher" }] : []);
  /**
   * Convertir TeacherResponseDTO (backend) vers Teacher (frontend)
   */
  mapToTeacher(dto) {
    const initials = (dto.name.charAt(0) + dto.surname.charAt(0)).toUpperCase();
    let status = "available";
    const userStatus = dto.status || "ACTIVE";
    if (dto.status === "INACTIVE" || dto.status === "SUSPENDED" || dto.status === "BLOCKED") {
      status = "unavailable";
    } else if (dto.status === "ACTIVE") {
      status = "available";
    }
    return {
      id: dto.id,
      firstName: dto.name,
      lastName: dto.surname,
      email: dto.email,
      initials,
      phone: dto.telephoneNumber?.toString(),
      assignedCourses: 0,
      hourlyLoad: {
        used: 0,
        total: 24
      },
      availability: {
        monday: "8h-17h",
        tuesday: "8h-17h",
        wednesday: "8h-17h",
        thursday: "8h-17h",
        friday: "8h-17h",
        saturday: "-"
      },
      schedule: {
        monday: "-",
        tuesday: "-",
        wednesday: "-",
        thursday: "-",
        friday: "-",
        saturday: "-"
      },
      status,
      userStatus
    };
  }
  getTeachers() {
    return this.apiService.get("/users/teachers").pipe(map((response) => response.content.map((dto) => this.mapToTeacher(dto))), tap((teachers) => this.teachers.set(teachers)));
  }
  getTeacherById(id) {
    return this.apiService.get(`/users/teachers/${id}`).pipe(map((dto) => this.mapToTeacher(dto)), tap((teacher) => this.selectedTeacher.set(teacher)));
  }
  updateTeacher(id, teacher) {
    return this.apiService.put(`/users/${id}`, teacher);
  }
  deleteTeacher(id) {
    return this.apiService.delete(`/users/${id}`);
  }
  getMockTeachers() {
    return of(MOCK_TEACHERS).pipe(delay(500));
  }
  static \u0275fac = function TeacherService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TeacherService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TeacherService, factory: _TeacherService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TeacherService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/core/services/user.service.ts
var UserService = class _UserService {
  apiService = inject(ApiService);
  USERS_API = "/users";
  /**
   * Créer un nouvel enseignant (Admin uniquement)
   */
  createTeacher(request) {
    return this.apiService.post(`${this.USERS_API}/teachers`, request).pipe(catchError((error) => {
      console.error("Error creating teacher:", error);
      return throwError(() => new Error(error.error?.message || "Erreur lors de la cr\xE9ation de l'enseignant"));
    }));
  }
  /**
   * Créer un nouvel administrateur (Admin uniquement)
   */
  createAdmin(request) {
    return this.apiService.post(`${this.USERS_API}/admins`, request).pipe(catchError((error) => {
      console.error("Error creating admin:", error);
      return throwError(() => new Error(error.error?.message || "Erreur lors de la cr\xE9ation de l'administrateur"));
    }));
  }
  /**
   * Récupérer tous les utilisateurs
   */
  getAllUsers() {
    return this.apiService.get(this.USERS_API).pipe(map((response) => response.content), catchError((error) => {
      console.error("Error fetching users:", error);
      return throwError(() => new Error(error.error?.message || "Erreur lors de la r\xE9cup\xE9ration des utilisateurs"));
    }));
  }
  /**
   * Récupérer un utilisateur par ID
   */
  getUserById(id) {
    return this.apiService.get(`${this.USERS_API}/${id}`).pipe(catchError((error) => {
      console.error("Error fetching user:", error);
      return throwError(() => new Error(error.error?.message || "Erreur lors de la r\xE9cup\xE9ration de l'utilisateur"));
    }));
  }
  /**
   * Mettre à jour un utilisateur
   */
  updateUser(id, request) {
    return this.apiService.put(`${this.USERS_API}/${id}`, request).pipe(catchError((error) => {
      console.error("Error updating user:", error);
      return throwError(() => new Error(error.error?.message || "Erreur lors de la mise \xE0 jour de l'utilisateur"));
    }));
  }
  /**
   * Bloquer un utilisateur (Admin uniquement)
   */
  blockUser(id) {
    return this.apiService.put(`${this.USERS_API}/${id}/block`, {}).pipe(catchError((error) => {
      console.error("Error blocking user:", error);
      return throwError(() => new Error(error.error?.message || "Erreur lors du blocage de l'utilisateur"));
    }));
  }
  /**
   * Débloquer un utilisateur (Admin uniquement)
   */
  unblockUser(id) {
    return this.apiService.put(`${this.USERS_API}/${id}/unblock`, {}).pipe(catchError((error) => {
      console.error("Error unblocking user:", error);
      return throwError(() => new Error(error.error?.message || "Erreur lors du d\xE9blocage de l'utilisateur"));
    }));
  }
  /**
   * Supprimer un utilisateur (Admin uniquement)
   */
  deleteUser(id) {
    return this.apiService.delete(`${this.USERS_API}/${id}`).pipe(catchError((error) => {
      console.error("Error deleting user:", error);
      return throwError(() => new Error(error.error?.message || "Erreur lors de la suppression de l'utilisateur"));
    }));
  }
  /**
   * Bloquer plusieurs utilisateurs (Admin uniquement)
   */
  bulkBlockUsers(userIds) {
    return this.apiService.put(`${this.USERS_API}/bulk-block`, { userIds }).pipe(catchError((error) => {
      console.error("Error bulk blocking users:", error);
      return throwError(() => new Error(error.error?.message || "Erreur lors du blocage des utilisateurs"));
    }));
  }
  /**
   * Débloquer plusieurs utilisateurs (Admin uniquement)
   */
  bulkUnblockUsers(userIds) {
    return this.apiService.put(`${this.USERS_API}/bulk-unblock`, { userIds }).pipe(catchError((error) => {
      console.error("Error bulk unblocking users:", error);
      return throwError(() => new Error(error.error?.message || "Erreur lors du d\xE9blocage des utilisateurs"));
    }));
  }
  static \u0275fac = function UserService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UserService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _UserService, factory: _UserService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UserService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/features/admin/teachers/teachers-list/teachers-list.component.ts
var _c0 = () => ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
var _c1 = () => ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
var _c2 = () => ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
var _forTrack0 = ($index, $item) => $item.id;
function TeachersListComponent_Conditional_19_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 26);
  }
}
function TeachersListComponent_Conditional_19_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 8);
    \u0275\u0275element(1, "path", 29);
    \u0275\u0275elementEnd();
  }
}
function TeachersListComponent_Conditional_19_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 26);
  }
}
function TeachersListComponent_Conditional_19_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 8);
    \u0275\u0275element(1, "path", 30);
    \u0275\u0275elementEnd();
  }
}
function TeachersListComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "div", 22)(2, "span", 23);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 24);
    \u0275\u0275listener("click", function TeachersListComponent_Conditional_19_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleSelectAll());
    });
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 6)(7, "button", 25);
    \u0275\u0275listener("click", function TeachersListComponent_Conditional_19_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.bulkBlockTeachers());
    });
    \u0275\u0275conditionalCreate(8, TeachersListComponent_Conditional_19_Conditional_8_Template, 1, 0, "span", 26)(9, TeachersListComponent_Conditional_19_Conditional_9_Template, 2, 0, ":svg:svg", 8);
    \u0275\u0275text(10, " Bloquer ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "button", 27);
    \u0275\u0275listener("click", function TeachersListComponent_Conditional_19_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.bulkUnblockTeachers());
    });
    \u0275\u0275conditionalCreate(12, TeachersListComponent_Conditional_19_Conditional_12_Template, 1, 0, "span", 26)(13, TeachersListComponent_Conditional_19_Conditional_13_Template, 2, 0, ":svg:svg", 8);
    \u0275\u0275text(14, " D\xE9bloquer ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "button", 28);
    \u0275\u0275listener("click", function TeachersListComponent_Conditional_19_Template_button_click_15_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.clearSelection());
    });
    \u0275\u0275text(16, " Annuler ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.selectedCount(), " enseignant(s) s\xE9lectionn\xE9(s) ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.allFilteredSelected() ? "Tout d\xE9s\xE9lectionner" : "Tout s\xE9lectionner", " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.isBulkActionLoading());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isBulkActionLoading() ? 8 : 9);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r1.isBulkActionLoading());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isBulkActionLoading() ? 12 : 13);
  }
}
function TeachersListComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275element(1, "div", 31);
    \u0275\u0275elementStart(2, "p", 32);
    \u0275\u0275text(3, "Chargement...");
    \u0275\u0275elementEnd()();
  }
}
function TeachersListComponent_Conditional_23_For_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 36)(1, "input", 42);
    \u0275\u0275listener("click", function TeachersListComponent_Conditional_23_For_1_Conditional_2_Template_input_click_1_listener($event) {
      \u0275\u0275restoreView(_r5);
      const teacher_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleTeacherSelection(teacher_r4.id, $event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const teacher_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r1.isTeacherSelected(teacher_r4.id));
  }
}
function TeachersListComponent_Conditional_23_For_1_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Bloqu\xE9 ");
  }
}
function TeachersListComponent_Conditional_23_For_1_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const teacher_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" ", teacher_r4.status === "available" ? "Disponible" : "Occup\xE9", " ");
  }
}
function TeachersListComponent_Conditional_23_For_1_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 40);
    \u0275\u0275text(1, " Bloqu\xE9 ");
    \u0275\u0275elementEnd();
  }
}
function TeachersListComponent_Conditional_23_For_1_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 41);
    \u0275\u0275text(1, " Disponible ");
    \u0275\u0275elementEnd();
  }
}
function TeachersListComponent_Conditional_23_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 35);
    \u0275\u0275listener("click", function TeachersListComponent_Conditional_23_For_1_Template_div_click_0_listener() {
      const teacher_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selectTeacher(teacher_r4));
    });
    \u0275\u0275elementStart(1, "div", 6);
    \u0275\u0275conditionalCreate(2, TeachersListComponent_Conditional_23_For_1_Conditional_2_Template, 2, 1, "div", 36);
    \u0275\u0275elementStart(3, "div")(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 37)(7, "h3", 38);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 5);
    \u0275\u0275conditionalCreate(10, TeachersListComponent_Conditional_23_For_1_Conditional_10_Template, 1, 0)(11, TeachersListComponent_Conditional_23_For_1_Conditional_11_Template, 1, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "p", 39);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(14, TeachersListComponent_Conditional_23_For_1_Conditional_14_Template, 2, 0, "span", 40)(15, TeachersListComponent_Conditional_23_For_1_Conditional_15_Template, 2, 0, "span", 41);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_12_0;
    let tmp_13_0;
    const teacher_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("ring-2", ((tmp_12_0 = ctx_r1.selectedTeacher()) == null ? null : tmp_12_0.id) === teacher_r4.id)("ring-teal-500", ((tmp_13_0 = ctx_r1.selectedTeacher()) == null ? null : tmp_13_0.id) === teacher_r4.id)("opacity-60", teacher_r4.userStatus === "BLOCKED");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.isSelectionMode() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275classMap(teacher_r4.userStatus === "BLOCKED" ? "bg-red-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0" : "bg-teal-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0");
    \u0275\u0275advance();
    \u0275\u0275classMap(teacher_r4.userStatus === "BLOCKED" ? "text-lg font-bold text-red-700" : "text-lg font-bold text-teal-700");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(teacher_r4.initials);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", teacher_r4.firstName, " ", teacher_r4.lastName, " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(teacher_r4.userStatus === "BLOCKED" ? 10 : 11);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", teacher_r4.hourlyLoad.used, " de ", teacher_r4.hourlyLoad.total, " / 24h ");
    \u0275\u0275advance();
    \u0275\u0275conditional(teacher_r4.userStatus === "BLOCKED" ? 14 : teacher_r4.status === "available" ? 15 : -1);
  }
}
function TeachersListComponent_Conditional_23_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34);
    \u0275\u0275text(1, "Aucun utilisateur trouv\xE9");
    \u0275\u0275elementEnd();
  }
}
function TeachersListComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, TeachersListComponent_Conditional_23_For_1_Template, 16, 18, "div", 33, _forTrack0);
    \u0275\u0275conditionalCreate(2, TeachersListComponent_Conditional_23_Conditional_2_Template, 2, 0, "div", 34);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r1.filteredTeachers());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.filteredTeachers().length === 0 ? 2 : -1);
  }
}
function TeachersListComponent_Conditional_24_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 48);
    \u0275\u0275element(2, "path", 69);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.selectedTeacher().phone);
  }
}
function TeachersListComponent_Conditional_24_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 52);
    \u0275\u0275text(1, " Bloqu\xE9 ");
    \u0275\u0275elementEnd();
  }
}
function TeachersListComponent_Conditional_24_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, " Actif ");
    \u0275\u0275elementEnd();
  }
}
function TeachersListComponent_Conditional_24_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 70);
    \u0275\u0275listener("click", function TeachersListComponent_Conditional_24_Conditional_25_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.unblockTeacher(ctx_r1.selectedTeacher().id));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 8);
    \u0275\u0275element(2, "path", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " D\xE9bloquer l'enseignant ");
    \u0275\u0275elementEnd();
  }
}
function TeachersListComponent_Conditional_24_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 71);
    \u0275\u0275listener("click", function TeachersListComponent_Conditional_24_Conditional_26_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.blockTeacher(ctx_r1.selectedTeacher().id));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 8);
    \u0275\u0275element(2, "path", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Bloquer l'enseignant ");
    \u0275\u0275elementEnd();
  }
}
function TeachersListComponent_Conditional_24_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 65);
    \u0275\u0275element(1, "div", 72);
    \u0275\u0275elementStart(2, "p", 73);
    \u0275\u0275text(3, "Chargement des disponibilit\xE9s...");
    \u0275\u0275elementEnd()();
  }
}
function TeachersListComponent_Conditional_24_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 66);
    \u0275\u0275text(1, " Aucune disponibilit\xE9 enregistr\xE9e pour cet enseignant ");
    \u0275\u0275elementEnd();
  }
}
function TeachersListComponent_Conditional_24_Conditional_42_For_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 80);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const day_r8 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(day_r8);
  }
}
function TeachersListComponent_Conditional_24_Conditional_42_For_14_For_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 84)(1, "span", 86);
    \u0275\u0275text(2, "Pause");
    \u0275\u0275elementEnd()();
  }
}
function TeachersListComponent_Conditional_24_Conditional_42_For_14_For_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 85);
  }
  if (rf & 2) {
    const day_r9 = \u0275\u0275nextContext().$implicit;
    const slot_r10 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("ngClass", slot_r10.slots[day_r9] ? "bg-emerald-400" : "bg-transparent");
    \u0275\u0275attribute("title", slot_r10.slots[day_r9] ? "Disponible" : "Non disponible");
  }
}
function TeachersListComponent_Conditional_24_Conditional_42_For_14_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 83);
    \u0275\u0275conditionalCreate(1, TeachersListComponent_Conditional_24_Conditional_42_For_14_For_4_Conditional_1_Template, 3, 0, "div", 84)(2, TeachersListComponent_Conditional_24_Conditional_42_For_14_For_4_Conditional_2_Template, 1, 2, "div", 85);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const \u0275$index_260_r11 = \u0275\u0275nextContext().$index;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isPauseSlotByIndex(\u0275$index_260_r11) ? 1 : 2);
  }
}
function TeachersListComponent_Conditional_24_Conditional_42_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 81)(1, "td", 82);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, TeachersListComponent_Conditional_24_Conditional_42_For_14_For_4_Template, 3, 1, "td", 83, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const slot_r10 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", slot_r10.hour, " ");
    \u0275\u0275advance();
    \u0275\u0275repeater(\u0275\u0275pureFunction0(1, _c2));
  }
}
function TeachersListComponent_Conditional_24_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 74);
    \u0275\u0275element(1, "span", 75);
    \u0275\u0275elementStart(2, "span", 62);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 76)(5, "table", 77)(6, "thead")(7, "tr", 78)(8, "th", 79);
    \u0275\u0275text(9, " Heure ");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(10, TeachersListComponent_Conditional_24_Conditional_42_For_11_Template, 2, 1, "th", 80, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "tbody");
    \u0275\u0275repeaterCreate(13, TeachersListComponent_Conditional_24_Conditional_42_For_14_Template, 5, 2, "tr", 81, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", ctx_r1.getAvailableSlotsCount(), " cr\xE9neaux disponibles");
    \u0275\u0275advance(7);
    \u0275\u0275repeater(\u0275\u0275pureFunction0(1, _c1));
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.selectedTeacherAvailability().timeSlots);
  }
}
function TeachersListComponent_Conditional_24_For_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 68)(1, "div", 87);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 88);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const day_r12 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", day_r12.substring(0, 3), " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r1.selectedTeacher().schedule[day_r12] && ctx_r1.selectedTeacher().schedule[day_r12] !== "-" ? "bg-purple-200 text-purple-700" : "bg-slate-100 text-slate-400");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.selectedTeacher().schedule[day_r12] || "-", " ");
  }
}
function TeachersListComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19)(1, "div", 43)(2, "div", 44)(3, "span", 45);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 37)(6, "h3", 46);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 47);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(9, "svg", 48);
    \u0275\u0275element(10, "path", 49);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(11, "span", 50);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(13, TeachersListComponent_Conditional_24_Conditional_13_Template, 5, 1, "div", 47);
    \u0275\u0275elementStart(14, "div", 47);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(15, "svg", 48);
    \u0275\u0275element(16, "path", 51);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(17, "span");
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(19, TeachersListComponent_Conditional_24_Conditional_19_Template, 2, 0, "span", 52)(20, TeachersListComponent_Conditional_24_Conditional_20_Template, 2, 0, "span", 53);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div", 54)(22, "h4", 55);
    \u0275\u0275text(23, "Actions");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 56);
    \u0275\u0275conditionalCreate(25, TeachersListComponent_Conditional_24_Conditional_25_Template, 4, 0, "button", 57)(26, TeachersListComponent_Conditional_24_Conditional_26_Template, 4, 0, "button", 58);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "div", 59)(28, "h4", 55);
    \u0275\u0275text(29, "Charge horaire");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "div", 60)(31, "span", 61);
    \u0275\u0275text(32, "Horaire utilis\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "span", 62);
    \u0275\u0275text(34);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div", 63);
    \u0275\u0275element(36, "div", 64);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(37, "div", 59)(38, "h4", 55);
    \u0275\u0275text(39, "Disponibilit\xE9s d\xE9taill\xE9es");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(40, TeachersListComponent_Conditional_24_Conditional_40_Template, 4, 0, "div", 65)(41, TeachersListComponent_Conditional_24_Conditional_41_Template, 2, 0, "div", 66)(42, TeachersListComponent_Conditional_24_Conditional_42_Template, 15, 2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "div")(44, "h4", 55);
    \u0275\u0275text(45, "Emploi du temps");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "div", 67);
    \u0275\u0275repeaterCreate(47, TeachersListComponent_Conditional_24_For_48_Template, 5, 3, "div", 68, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.selectedTeacher().initials);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", ctx_r1.selectedTeacher().firstName, " ", ctx_r1.selectedTeacher().lastName, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.selectedTeacher().email);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.selectedTeacher().phone ? 13 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", ctx_r1.selectedTeacher().assignedCourses, " cours assign\xE9s");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.selectedTeacher().userStatus === "BLOCKED" ? 19 : 20);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx_r1.selectedTeacher().userStatus === "BLOCKED" ? 25 : 26);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate2(" ", ctx_r1.selectedTeacher().hourlyLoad.used, "h / ", ctx_r1.selectedTeacher().hourlyLoad.total, "h ");
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", ctx_r1.selectedTeacher().hourlyLoad.used / ctx_r1.selectedTeacher().hourlyLoad.total * 100, "%");
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r1.isLoadingAvailability() ? 40 : !ctx_r1.selectedTeacherAvailability() ? 41 : 42);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(\u0275\u0275pureFunction0(13, _c0));
  }
}
function TeachersListComponent_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "div", 89);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(2, "svg", 90);
    \u0275\u0275element(3, "path", 91);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5, "S\xE9lectionnez un enseignant pour voir les d\xE9tails");
    \u0275\u0275elementEnd()()();
  }
}
function TeachersListComponent_Conditional_26_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 94)(1, "div")(2, "label", 23);
    \u0275\u0275text(3, "Grade ");
    \u0275\u0275elementStart(4, "span", 95);
    \u0275\u0275text(5, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(6, "input", 106);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div")(8, "label", 23);
    \u0275\u0275text(9, "Rang ");
    \u0275\u0275elementStart(10, "span", 95);
    \u0275\u0275text(11, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(12, "input", 107);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div")(14, "label", 23);
    \u0275\u0275text(15, "Charge horaire ");
    \u0275\u0275elementStart(16, "span", 95);
    \u0275\u0275text(17, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(18, "input", 108);
    \u0275\u0275elementEnd();
  }
}
function TeachersListComponent_Conditional_26_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 26);
    \u0275\u0275text(1, " Cr\xE9ation... ");
  }
}
function TeachersListComponent_Conditional_26_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Ajouter ");
  }
}
function TeachersListComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 21)(1, "div", 92)(2, "h2", 93);
    \u0275\u0275text(3, "Ajouter un enseignant");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "form", 17, 0)(6, "div", 94)(7, "div")(8, "label", 23);
    \u0275\u0275text(9, "Pr\xE9nom ");
    \u0275\u0275elementStart(10, "span", 95);
    \u0275\u0275text(11, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(12, "input", 96);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div")(14, "label", 23);
    \u0275\u0275text(15, "Nom ");
    \u0275\u0275elementStart(16, "span", 95);
    \u0275\u0275text(17, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(18, "input", 97);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div")(20, "label", 23);
    \u0275\u0275text(21, "Email ");
    \u0275\u0275elementStart(22, "span", 95);
    \u0275\u0275text(23, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(24, "input", 98);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div")(26, "label", 23);
    \u0275\u0275text(27, "R\xF4le ");
    \u0275\u0275elementStart(28, "span", 95);
    \u0275\u0275text(29, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "select", 99, 1)(32, "option", 100);
    \u0275\u0275text(33, "Enseignant");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "option", 101);
    \u0275\u0275text(35, "Administrateur");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(36, "div")(37, "label", 23);
    \u0275\u0275text(38, "Num\xE9ro de t\xE9l\xE9phone");
    \u0275\u0275elementEnd();
    \u0275\u0275element(39, "input", 102);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(40, TeachersListComponent_Conditional_26_Conditional_40_Template, 19, 0);
    \u0275\u0275elementStart(41, "div", 103)(42, "button", 104);
    \u0275\u0275listener("click", function TeachersListComponent_Conditional_26_Template_button_click_42_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeModals());
    });
    \u0275\u0275text(43, " Annuler ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "button", 105);
    \u0275\u0275listener("click", function TeachersListComponent_Conditional_26_Template_button_click_44_listener() {
      \u0275\u0275restoreView(_r13);
      const teacherForm_r14 = \u0275\u0275reference(5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.submitAddTeacher(teacherForm_r14));
    });
    \u0275\u0275conditionalCreate(45, TeachersListComponent_Conditional_26_Conditional_45_Template, 2, 0)(46, TeachersListComponent_Conditional_26_Conditional_46_Template, 1, 0);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const teacherForm_r14 = \u0275\u0275reference(5);
    const userRoleSelect_r15 = \u0275\u0275reference(31);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(40);
    \u0275\u0275conditional(userRoleSelect_r15.value === "teacher" ? 40 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", !teacherForm_r14.valid || ctx_r1.isSubmittingTeacher());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isSubmittingTeacher() ? 45 : 46);
  }
}
var TeachersListComponent = class _TeachersListComponent {
  teacherService = inject(TeacherService);
  userService = inject(UserService);
  router = inject(Router);
  availabilityService = inject(AvailabilityService);
  teachers = signal([], ...ngDevMode ? [{ debugName: "teachers" }] : []);
  selectedTeacher = signal(null, ...ngDevMode ? [{ debugName: "selectedTeacher" }] : []);
  selectedTeacherAvailability = signal(null, ...ngDevMode ? [{ debugName: "selectedTeacherAvailability" }] : []);
  searchQuery = signal("", ...ngDevMode ? [{ debugName: "searchQuery" }] : []);
  isLoading = signal(false, ...ngDevMode ? [{ debugName: "isLoading" }] : []);
  isLoadingAvailability = signal(false, ...ngDevMode ? [{ debugName: "isLoadingAvailability" }] : []);
  isSubmittingTeacher = signal(false, ...ngDevMode ? [{ debugName: "isSubmittingTeacher" }] : []);
  // Sélection multiple
  selectedTeacherIds = signal(/* @__PURE__ */ new Set(), ...ngDevMode ? [{ debugName: "selectedTeacherIds" }] : []);
  isSelectionMode = signal(false, ...ngDevMode ? [{ debugName: "isSelectionMode" }] : []);
  isBulkActionLoading = signal(false, ...ngDevMode ? [{ debugName: "isBulkActionLoading" }] : []);
  // Computed pour vérifier si tous les enseignants filtrés sont sélectionnés
  allFilteredSelected = computed(() => {
    const filtered = this.filteredTeachers();
    const selected = this.selectedTeacherIds();
    return filtered.length > 0 && filtered.every((t) => selected.has(t.id));
  }, ...ngDevMode ? [{ debugName: "allFilteredSelected" }] : []);
  // Nombre d'enseignants sélectionnés
  selectedCount = computed(() => this.selectedTeacherIds().size, ...ngDevMode ? [{ debugName: "selectedCount" }] : []);
  /*ngOnInit(): void {
      // En développement, utilisez les données mock
      this.teacherService.getMockTeachers().subscribe(teachers => {
        this.teachers.set(teachers);
        if (teachers.length > 0) {
          this.selectTeacher(teachers[0]);
        }
      });
      this.loadTeachers();
  
  
    }*/
  ngOnInit() {
    this.loadTeachers();
  }
  loadTeachers() {
    this.isLoading.set(true);
    this.teacherService.getTeachers().subscribe({
      next: (teachers) => {
        this.teachers.set(teachers);
        if (teachers.length > 0) {
          if (!this.selectedTeacher()) {
            this.selectTeacher(teachers[0]);
          }
        } else {
          this.selectedTeacher.set(null);
        }
      },
      error: (error) => {
        console.error("Error loading teachers:", error);
        this.teachers.set([]);
        this.selectedTeacher.set(null);
        let errorMessage = "Erreur lors du chargement des enseignants";
        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.error?.error) {
          errorMessage = error.error.error;
        } else if (error?.status === 401) {
          errorMessage = "Vous devez \xEAtre connect\xE9 en tant qu'administrateur";
        } else if (error?.status === 403) {
          errorMessage = "Acc\xE8s refus\xE9. Seuls les administrateurs peuvent voir les enseignants";
        } else if (error?.status === 500) {
          errorMessage = "Erreur serveur. V\xE9rifiez que l'auth-service est d\xE9marr\xE9";
        }
        alert("Erreur: " + errorMessage);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
  selectTeacher(teacher) {
    this.selectedTeacher.set(teacher);
    this.loadTeacherAvailability(teacher.id);
  }
  loadTeacherAvailability(teacherId) {
    this.isLoadingAvailability.set(true);
    this.selectedTeacherAvailability.set(null);
    this.availabilityService.getTeacherAvailability(teacherId).subscribe({
      next: (availability) => {
        this.selectedTeacherAvailability.set(availability);
        this.isLoadingAvailability.set(false);
      },
      error: (error) => {
        console.error("Error loading teacher availability:", error);
        this.selectedTeacherAvailability.set(null);
        this.isLoadingAvailability.set(false);
      }
    });
  }
  getAvailableSlotsCount() {
    const availability = this.selectedTeacherAvailability();
    if (!availability || !availability.timeSlots)
      return 0;
    return availability.timeSlots.reduce((total, slot) => {
      return total + Object.values(slot.slots).filter((v) => v).length;
    }, 0);
  }
  isPauseSlotByIndex(hourIndex) {
    return hourIndex === 4;
  }
  filteredTeachers() {
    const query = this.searchQuery().toLowerCase();
    if (!query)
      return this.teachers();
    return this.teachers().filter((teacher) => `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(query) || teacher.email.toLowerCase().includes(query));
  }
  addTeacher() {
    this.openAddTeacherModal();
  }
  showAddTeacherModal = signal(false, ...ngDevMode ? [{ debugName: "showAddTeacherModal" }] : []);
  showAddCourseModal = signal(false, ...ngDevMode ? [{ debugName: "showAddCourseModal" }] : []);
  openAddTeacherModal() {
    this.showAddTeacherModal.set(true);
  }
  closeModals() {
    this.showAddTeacherModal.set(false);
    this.showAddCourseModal.set(false);
  }
  submitAddTeacher(form) {
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        const control = form.controls[key];
        if (control.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }
    this.isSubmittingTeacher.set(true);
    const data = form.value;
    const userRole = data.userRole || "teacher";
    if (userRole === "admin") {
      const registerRequest = {
        name: data.firstName,
        surname: data.lastName,
        email: data.email,
        telephoneNumber: data.telephoneNumber ? parseInt(data.telephoneNumber) : void 0
      };
      this.userService.createAdmin(registerRequest).subscribe({
        next: () => {
          this.isSubmittingTeacher.set(false);
          this.closeModals();
          this.loadTeachers();
          alert("Administrateur cr\xE9\xE9 avec succ\xE8s !");
        },
        error: (error) => {
          this.isSubmittingTeacher.set(false);
          console.error("Error creating admin:", error);
          let errorMessage = "Erreur lors de la cr\xE9ation de l'administrateur";
          if (error?.error?.message) {
            errorMessage = error.error.message;
          } else if (error?.error?.error) {
            errorMessage = error.error.error;
          } else if (error?.message) {
            errorMessage = error.message;
          }
          alert("Erreur: " + errorMessage);
        }
      });
    } else {
      const registerRequest = {
        name: data.firstName,
        surname: data.lastName,
        email: data.email,
        telephoneNumber: data.telephoneNumber ? parseInt(data.telephoneNumber) : void 0,
        grade: data.grade,
        rank: data.rank,
        hourlyRate: data.hourlyRate
      };
      this.userService.createTeacher(registerRequest).subscribe({
        next: () => {
          this.isSubmittingTeacher.set(false);
          this.closeModals();
          this.loadTeachers();
          alert("Enseignant cr\xE9\xE9 avec succ\xE8s !");
        },
        error: (error) => {
          this.isSubmittingTeacher.set(false);
          console.error("Error creating teacher:", error);
          let errorMessage = "Erreur lors de la cr\xE9ation de l'enseignant";
          if (error?.error?.message) {
            errorMessage = error.error.message;
          } else if (error?.error?.error) {
            errorMessage = error.error.error;
          } else if (error?.message) {
            errorMessage = error.message;
          }
          alert("Erreur: " + errorMessage);
        }
      });
    }
  }
  submitAddCourse(form) {
    if (!form.valid)
      return;
    console.log("Course added:", form.value);
    this.closeModals();
  }
  // Méthodes pour la sélection multiple
  toggleSelectionMode() {
    this.isSelectionMode.update((v) => !v);
    if (!this.isSelectionMode()) {
      this.selectedTeacherIds.set(/* @__PURE__ */ new Set());
    }
  }
  toggleTeacherSelection(teacherId, event) {
    event.stopPropagation();
    this.selectedTeacherIds.update((set) => {
      const newSet = new Set(set);
      if (newSet.has(teacherId)) {
        newSet.delete(teacherId);
      } else {
        newSet.add(teacherId);
      }
      return newSet;
    });
  }
  isTeacherSelected(teacherId) {
    return this.selectedTeacherIds().has(teacherId);
  }
  toggleSelectAll() {
    const filtered = this.filteredTeachers();
    if (this.allFilteredSelected()) {
      this.selectedTeacherIds.set(/* @__PURE__ */ new Set());
    } else {
      this.selectedTeacherIds.set(new Set(filtered.map((t) => t.id)));
    }
  }
  clearSelection() {
    this.selectedTeacherIds.set(/* @__PURE__ */ new Set());
  }
  // Actions de blocage/déblocage
  blockTeacher(teacherId) {
    if (confirm("\xCAtes-vous s\xFBr de vouloir bloquer cet enseignant ?")) {
      this.userService.blockUser(teacherId).subscribe({
        next: () => {
          const currentSelectedId = this.selectedTeacher()?.id;
          this.loadTeachers();
          if (currentSelectedId) {
            setTimeout(() => {
              const updatedTeacher = this.teachers().find((t) => t.id === currentSelectedId);
              if (updatedTeacher) {
                this.selectedTeacher.set(updatedTeacher);
              }
            }, 100);
          }
          alert("Enseignant bloqu\xE9 avec succ\xE8s");
        },
        error: (error) => {
          console.error("Error blocking teacher:", error);
          alert("Erreur lors du blocage de l'enseignant: " + error.message);
        }
      });
    }
  }
  unblockTeacher(teacherId) {
    if (confirm("\xCAtes-vous s\xFBr de vouloir d\xE9bloquer cet enseignant ?")) {
      this.userService.unblockUser(teacherId).subscribe({
        next: () => {
          const currentSelectedId = this.selectedTeacher()?.id;
          this.loadTeachers();
          if (currentSelectedId) {
            setTimeout(() => {
              const updatedTeacher = this.teachers().find((t) => t.id === currentSelectedId);
              if (updatedTeacher) {
                this.selectedTeacher.set(updatedTeacher);
              }
            }, 100);
          }
          alert("Enseignant d\xE9bloqu\xE9 avec succ\xE8s");
        },
        error: (error) => {
          console.error("Error unblocking teacher:", error);
          alert("Erreur lors du d\xE9blocage de l'enseignant: " + error.message);
        }
      });
    }
  }
  bulkBlockTeachers() {
    const selectedIds = Array.from(this.selectedTeacherIds());
    if (selectedIds.length === 0) {
      alert("Veuillez s\xE9lectionner au moins un enseignant");
      return;
    }
    if (confirm(`\xCAtes-vous s\xFBr de vouloir bloquer ${selectedIds.length} enseignant(s) ?`)) {
      this.isBulkActionLoading.set(true);
      this.userService.bulkBlockUsers(selectedIds).subscribe({
        next: (response) => {
          this.isBulkActionLoading.set(false);
          this.selectedTeacherIds.set(/* @__PURE__ */ new Set());
          this.loadTeachers();
          alert(`${response.successCount} enseignant(s) bloqu\xE9(s) avec succ\xE8s.` + (response.failureCount > 0 ? ` ${response.failureCount} \xE9chec(s).` : ""));
        },
        error: (error) => {
          this.isBulkActionLoading.set(false);
          console.error("Error bulk blocking teachers:", error);
          alert("Erreur lors du blocage des enseignants: " + error.message);
        }
      });
    }
  }
  bulkUnblockTeachers() {
    const selectedIds = Array.from(this.selectedTeacherIds());
    if (selectedIds.length === 0) {
      alert("Veuillez s\xE9lectionner au moins un enseignant");
      return;
    }
    if (confirm(`\xCAtes-vous s\xFBr de vouloir d\xE9bloquer ${selectedIds.length} enseignant(s) ?`)) {
      this.isBulkActionLoading.set(true);
      this.userService.bulkUnblockUsers(selectedIds).subscribe({
        next: (response) => {
          this.isBulkActionLoading.set(false);
          this.selectedTeacherIds.set(/* @__PURE__ */ new Set());
          this.loadTeachers();
          alert(`${response.successCount} enseignant(s) d\xE9bloqu\xE9(s) avec succ\xE8s.` + (response.failureCount > 0 ? ` ${response.failureCount} \xE9chec(s).` : ""));
        },
        error: (error) => {
          this.isBulkActionLoading.set(false);
          console.error("Error bulk unblocking teachers:", error);
          alert("Erreur lors du d\xE9blocage des enseignants: " + error.message);
        }
      });
    }
  }
  // TrackBy functions for *ngFor
  trackById(index, item) {
    return item.id;
  }
  trackByDay(index, day) {
    return day;
  }
  trackByHour(index, slot) {
    return slot.hour;
  }
  static \u0275fac = function TeachersListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TeachersListComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TeachersListComponent, selectors: [["app-teachers-list"]], decls: 27, vars: 8, consts: [["teacherForm", "ngForm"], ["userRoleSelect", "ngModel"], [1, "flex-1", "p-6"], [1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold", "text-slate-800"], [1, "text-sm", "text-slate-500"], [1, "flex", "items-center", "gap-3"], [1, "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "flex", "items-center", "gap-2", "transition-colors", 3, "click"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-4", "h-4"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"], [1, "bg-blue-600", "hover:bg-blue-700", "text-white", "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "flex", "items-center", "gap-2", "transition-colors", 3, "click"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M12 4v16m8-8H4"], [1, "search-wrapper"], [1, "fa", "fa-search"], ["type", "text", "placeholder", "Rechercher un enseignant...", 3, "input", "value"], [1, "bg-slate-100", "rounded-lg", "p-4", "mb-6", "flex", "items-center", "justify-between"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], [1, "text-center", "py-8"], [1, "bg-white", "rounded-xl", "shadow-sm", "p-6", "sticky", "top-6"], [1, "bg-white", "rounded-xl", "shadow-sm", "p-6", "flex", "items-center", "justify-center", "h-96"], [1, "fixed", "inset-0", "bg-black/40", "backdrop-blur-sm", "flex", "items-center", "justify-center", "z-50"], [1, "flex", "items-center", "gap-4"], [1, "text-sm", "font-medium", "text-slate-700"], [1, "text-sm", "text-blue-600", "hover:text-blue-800", "font-medium", 3, "click"], [1, "bg-red-600", "hover:bg-red-700", "disabled:bg-red-400", "text-white", "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "flex", "items-center", "gap-2", "transition-colors", 3, "click", "disabled"], [1, "inline-block", "animate-spin", "rounded-full", "h-4", "w-4", "border-b-2", "border-white"], [1, "bg-emerald-600", "hover:bg-emerald-700", "disabled:bg-emerald-400", "text-white", "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "flex", "items-center", "gap-2", "transition-colors", 3, "click", "disabled"], [1, "bg-slate-200", "hover:bg-slate-300", "text-slate-700", "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors", 3, "click"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"], [1, "inline-block", "animate-spin", "rounded-full", "h-8", "w-8", "border-b-2", "border-teal-600"], [1, "text-slate-600", "mt-2"], [1, "bg-white", "rounded-xl", "shadow-sm", "p-4", "hover:shadow-md", "transition-all", "cursor-pointer", 3, "ring-2", "ring-teal-500", "opacity-60"], [1, "text-center", "py-8", "text-slate-500"], [1, "bg-white", "rounded-xl", "shadow-sm", "p-4", "hover:shadow-md", "transition-all", "cursor-pointer", 3, "click"], [1, "flex-shrink-0"], [1, "flex-1", "min-w-0"], [1, "font-semibold", "text-slate-800", "truncate"], [1, "text-xs", "text-slate-400"], [1, "px-2", "py-1", "bg-red-100", "text-red-700", "rounded-full", "text-xs", "font-medium"], [1, "px-2", "py-1", "bg-emerald-100", "text-emerald-700", "rounded-full", "text-xs", "font-medium"], ["type", "checkbox", 1, "w-5", "h-5", "text-teal-600", "border-slate-300", "rounded", "focus:ring-teal-500", "cursor-pointer", 3, "click", "checked"], [1, "flex", "items-center", "gap-4", "mb-6", "pb-6", "border-b"], [1, "bg-teal-100", "rounded-full", "w-16", "h-16", "flex", "items-center", "justify-center", "flex-shrink-0"], [1, "text-2xl", "font-bold", "text-teal-700"], [1, "font-bold", "text-slate-800", "text-lg"], [1, "flex", "items-center", "gap-2", "text-sm", "text-slate-600", "mt-1"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-4", "h-4", "flex-shrink-0"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"], [1, "truncate"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"], [1, "px-3", "py-1", "bg-red-100", "text-red-700", "rounded-full", "text-xs", "font-medium", "flex-shrink-0"], [1, "px-3", "py-1", "bg-emerald-100", "text-emerald-700", "rounded-full", "text-xs", "font-medium", "flex-shrink-0"], [1, "mb-6", "pb-6", "border-b"], [1, "font-semibold", "text-slate-800", "mb-3"], [1, "flex", "gap-3"], [1, "flex-1", "bg-emerald-600", "hover:bg-emerald-700", "text-white", "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "flex", "items-center", "justify-center", "gap-2", "transition-colors"], [1, "flex-1", "bg-red-600", "hover:bg-red-700", "text-white", "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "flex", "items-center", "justify-center", "gap-2", "transition-colors"], [1, "mb-6"], [1, "mb-2", "flex", "justify-between", "text-sm"], [1, "text-slate-600"], [1, "font-medium"], [1, "w-full", "bg-slate-200", "rounded-full", "h-2"], [1, "bg-teal-600", "h-2", "rounded-full", "transition-all"], [1, "text-center", "py-4"], [1, "text-center", "py-4", "text-slate-500", "text-sm", "bg-slate-50", "rounded-lg", "border", "border-slate-200"], [1, "grid", "grid-cols-6", "gap-2"], [1, "text-center"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"], [1, "flex-1", "bg-emerald-600", "hover:bg-emerald-700", "text-white", "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "flex", "items-center", "justify-center", "gap-2", "transition-colors", 3, "click"], [1, "flex-1", "bg-red-600", "hover:bg-red-700", "text-white", "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "flex", "items-center", "justify-center", "gap-2", "transition-colors", 3, "click"], [1, "inline-block", "animate-spin", "rounded-full", "h-6", "w-6", "border-b-2", "border-teal-600"], [1, "text-sm", "text-slate-600", "mt-2"], [1, "mb-3", "text-sm", "text-slate-600", "flex", "items-center", "gap-2"], [1, "inline-block", "w-3", "h-3", "bg-emerald-400", "rounded-sm"], [1, "overflow-x-auto", "border", "border-slate-200", "rounded-lg"], [1, "w-full", "border-collapse", "text-xs"], [1, "bg-slate-50", "border-b", "border-slate-200"], [1, "px-2", "py-2", "text-left", "font-medium", "text-slate-500", "w-16", "sticky", "left-0", "bg-slate-50", "z-10"], [1, "px-1", "py-2", "text-center", "font-medium", "text-slate-500", "w-12"], [1, "border-b", "border-slate-100", "last:border-0", "hover:bg-slate-50"], [1, "px-2", "py-1", "font-medium", "text-slate-700", "bg-white", "sticky", "left-0", "z-10", "border-r", "border-slate-100"], [1, "p-0", "border-r", "border-slate-100", "last:border-0", "relative", "h-8"], [1, "absolute", "inset-0", "bg-slate-100", "flex", "items-center", "justify-center"], [1, "absolute", "inset-0", "m-[1px]", "rounded-sm", "transition-colors", "duration-200", 3, "ngClass"], [1, "text-[10px]", "text-slate-400", "font-medium"], [1, "text-xs", "text-slate-600", "mb-1", "capitalize"], [1, "py-2", "rounded", "text-xs", "font-medium", 3, "ngClass"], [1, "text-center", "text-slate-400"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-16", "h-16", "mx-auto", "mb-4"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"], [1, "bg-white", "w-full", "max-w-lg", "rounded-xl", "shadow-xl", "p-6", "animate-fadeIn"], [1, "text-xl", "font-bold", "mb-4", "text-slate-800"], [1, "grid", "grid-cols-2", "gap-4"], [1, "text-red-500"], ["type", "text", "name", "firstName", "ngModel", "", "required", "", "placeholder", "Pr\xE9nom", 1, "mt-1", "w-full", "border", "border-slate-300", "rounded-lg", "p-2", "focus:ring-2", "focus:ring-blue-500", "focus:border-blue-500"], ["type", "text", "name", "lastName", "ngModel", "", "required", "", "placeholder", "Nom", 1, "mt-1", "w-full", "border", "border-slate-300", "rounded-lg", "p-2", "focus:ring-2", "focus:ring-blue-500", "focus:border-blue-500"], ["type", "email", "name", "email", "ngModel", "", "required", "", "placeholder", "email@example.com", 1, "mt-1", "w-full", "border", "border-slate-300", "rounded-lg", "p-2", "focus:ring-2", "focus:ring-blue-500", "focus:border-blue-500"], ["name", "userRole", "ngModel", "teacher", "required", "", 1, "mt-1", "w-full", "border", "border-slate-300", "rounded-lg", "p-2", "focus:ring-2", "focus:ring-blue-500", "focus:border-blue-500"], ["value", "teacher"], ["value", "admin"], ["type", "tel", "name", "telephoneNumber", "ngModel", "", "placeholder", "Ex: 123456789", 1, "mt-1", "w-full", "border", "border-slate-300", "rounded-lg", "p-2", "focus:ring-2", "focus:ring-blue-500", "focus:border-blue-500"], [1, "flex", "justify-end", "gap-3", "pt-4", "border-t"], ["type", "button", 1, "px-4", "py-2", "bg-slate-200", "text-slate-700", "rounded-lg", "hover:bg-slate-300", "transition-colors", 3, "click"], ["type", "submit", 1, "px-4", "py-2", "bg-blue-600", "text-white", "rounded-lg", "hover:bg-blue-700", "disabled:bg-slate-400", "disabled:cursor-not-allowed", "transition-colors", "flex", "items-center", "gap-2", 3, "click", "disabled"], ["type", "text", "name", "grade", "ngModel", "", "required", "", "placeholder", "Ex: Professeur", 1, "mt-1", "w-full", "border", "border-slate-300", "rounded-lg", "p-2", "focus:ring-2", "focus:ring-blue-500", "focus:border-blue-500"], ["type", "text", "name", "rank", "ngModel", "", "required", "", "placeholder", "Ex: Ma\xEEtre de conf\xE9rences", 1, "mt-1", "w-full", "border", "border-slate-300", "rounded-lg", "p-2", "focus:ring-2", "focus:ring-blue-500", "focus:border-blue-500"], ["type", "text", "name", "hourlyRate", "ngModel", "", "required", "", "placeholder", "Ex: 60", 1, "mt-1", "w-full", "border", "border-slate-300", "rounded-lg", "p-2", "focus:ring-2", "focus:ring-blue-500", "focus:border-blue-500"]], template: function TeachersListComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 2)(1, "div", 3)(2, "div")(3, "h1", 4);
      \u0275\u0275text(4, "Enseignants & cours");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p", 5);
      \u0275\u0275text(6, "G\xE9rez les enseignants et leurs affectations");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 6)(8, "button", 7);
      \u0275\u0275listener("click", function TeachersListComponent_Template_button_click_8_listener() {
        return ctx.toggleSelectionMode();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(9, "svg", 8);
      \u0275\u0275element(10, "path", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275text(11);
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(12, "button", 10);
      \u0275\u0275listener("click", function TeachersListComponent_Template_button_click_12_listener() {
        return ctx.addTeacher();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(13, "svg", 8);
      \u0275\u0275element(14, "path", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275text(15, " Ajouter un utilisateur ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(16, "div", 12);
      \u0275\u0275element(17, "i", 13);
      \u0275\u0275elementStart(18, "input", 14);
      \u0275\u0275listener("input", function TeachersListComponent_Template_input_input_18_listener($event) {
        return ctx.searchQuery.set($event.target.value);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(19, TeachersListComponent_Conditional_19_Template, 17, 6, "div", 15);
      \u0275\u0275elementStart(20, "div", 16)(21, "div", 17);
      \u0275\u0275conditionalCreate(22, TeachersListComponent_Conditional_22_Template, 4, 0, "div", 18)(23, TeachersListComponent_Conditional_23_Template, 3, 1);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(24, TeachersListComponent_Conditional_24_Template, 49, 14, "div", 19)(25, TeachersListComponent_Conditional_25_Template, 6, 0, "div", 20);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(26, TeachersListComponent_Conditional_26_Template, 47, 3, "div", 21);
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275classMap(ctx.isSelectionMode() ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1(" ", ctx.isSelectionMode() ? "Annuler" : "S\xE9lection multiple", " ");
      \u0275\u0275advance(7);
      \u0275\u0275property("value", ctx.searchQuery());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isSelectionMode() && ctx.selectedCount() > 0 ? 19 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.isLoading() ? 22 : 23);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.selectedTeacher() ? 24 : 25);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.showAddTeacherModal() ? 26 : -1);
    }
  }, dependencies: [CommonModule, NgClass, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, NgModel, NgForm], styles: ["\n\n.search-wrapper[_ngcontent-%COMP%] {\n  position: relative;\n  width: 260px;\n  margin-bottom: 25px;\n}\n.search-wrapper[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 10px 40px 10px 15px;\n  border-radius: 8px;\n  border: 1px solid #ddd;\n}\n.search-wrapper[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 12px;\n  top: 50%;\n  transform: translateY(-50%);\n  color: #666;\n}\n/*# sourceMappingURL=teachers-list.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TeachersListComponent, [{
    type: Component,
    args: [{ selector: "app-teachers-list", standalone: true, imports: [CommonModule, FormsModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `<!--<div class="min-h-screen bg-slate-50 flex">
  <app-sidebar></app-sidebar>-->

<div class="flex-1 p-6">
  <!-- Header -->
  <div class="flex justify-between items-center mb-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-800">Enseignants & cours</h1>
      <p class="text-sm text-slate-500">G\xE9rez les enseignants et leurs affectations</p>
    </div>

    <div class="flex items-center gap-3">
      <!-- Bouton mode s\xE9lection -->
      <button
        (click)="toggleSelectionMode()"
        [class]="isSelectionMode()
          ? 'bg-slate-700 text-white'
          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'"
        class="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
        {{ isSelectionMode() ? 'Annuler' : 'S\xE9lection multiple' }}
      </button>

      <!-- Bouton ajouter utilisateur -->
      <button
        (click)="addTeacher()"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Ajouter un utilisateur
      </button>
    </div>
  </div>

  <!-- Search Bar -->
  <div class="search-wrapper">
    <i class="fa fa-search"></i>
    <input
      type="text"
      placeholder="Rechercher un enseignant..."
      [value]="searchQuery()"
      (input)="searchQuery.set($any($event.target).value)"
    />
  </div>

  <!-- Barre d'actions pour la s\xE9lection multiple -->
  @if (isSelectionMode() && selectedCount() > 0) {
  <div class="bg-slate-100 rounded-lg p-4 mb-6 flex items-center justify-between">
    <div class="flex items-center gap-4">
      <span class="text-sm font-medium text-slate-700">
        {{ selectedCount() }} enseignant(s) s\xE9lectionn\xE9(s)
      </span>
      <button
        (click)="toggleSelectAll()"
        class="text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        {{ allFilteredSelected() ? 'Tout d\xE9s\xE9lectionner' : 'Tout s\xE9lectionner' }}
      </button>
    </div>
    <div class="flex items-center gap-3">
      <!-- Bouton Bloquer -->
      <button
        (click)="bulkBlockTeachers()"
        [disabled]="isBulkActionLoading()"
        class="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
      >
        @if (isBulkActionLoading()) {
        <span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
        } @else {
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
        }
        Bloquer
      </button>
      <!-- Bouton D\xE9bloquer -->
      <button
        (click)="bulkUnblockTeachers()"
        [disabled]="isBulkActionLoading()"
        class="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
      >
        @if (isBulkActionLoading()) {
        <span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
        } @else {
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        }
        D\xE9bloquer
      </button>
      <!-- Bouton Annuler -->
      <button
        (click)="clearSelection()"
        class="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        Annuler
      </button>
    </div>
  </div>
  }

  <!-- Two Column Layout -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Teachers List -->
    <div class="space-y-4">
      @if (isLoading()) {
      <div class="text-center py-8">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"
        ></div>
        <p class="text-slate-600 mt-2">Chargement...</p>
      </div>
      } @else { @for (teacher of filteredTeachers(); track teacher.id; let i = $index) {
      <div
        (click)="selectTeacher(teacher)"
        [class.ring-2]="selectedTeacher()?.id === teacher.id"
        [class.ring-teal-500]="selectedTeacher()?.id === teacher.id"
        [class.opacity-60]="teacher.userStatus === 'BLOCKED'"
        class="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all cursor-pointer"
      >
        <div class="flex items-center gap-3">
          <!-- Checkbox pour la s\xE9lection multiple -->
          @if (isSelectionMode()) {
          <div class="flex-shrink-0">
            <input
              type="checkbox"
              [checked]="isTeacherSelected(teacher.id)"
              (click)="toggleTeacherSelection(teacher.id, $event)"
              class="w-5 h-5 text-teal-600 border-slate-300 rounded focus:ring-teal-500 cursor-pointer"
            />
          </div>
          }
          <div
            [class]="teacher.userStatus === 'BLOCKED'
              ? 'bg-red-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0'
              : 'bg-teal-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0'"
          >
            <span
              [class]="teacher.userStatus === 'BLOCKED'
                ? 'text-lg font-bold text-red-700'
                : 'text-lg font-bold text-teal-700'"
            >{{ teacher.initials }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-slate-800 truncate">
              {{ teacher.firstName }} {{ teacher.lastName }}
            </h3>
            <p class="text-sm text-slate-500">
              @if (teacher.userStatus === 'BLOCKED') {
                Bloqu\xE9
              } @else {
                {{ teacher.status === 'available' ? 'Disponible' : 'Occup\xE9' }}
              }
            </p>
            <p class="text-xs text-slate-400">
              {{ teacher.hourlyLoad.used }} de {{ teacher.hourlyLoad.total }} / 24h
            </p>
          </div>
          @if (teacher.userStatus === 'BLOCKED') {
          <span class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            Bloqu\xE9
          </span>
          } @else if (teacher.status === 'available') {
          <span class="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
            Disponible
          </span>
          }
        </div>
      </div>
      } @if (filteredTeachers().length === 0) {
      <div class="text-center py-8 text-slate-500">Aucun utilisateur trouv\xE9</div>
      } }
    </div>

    <!-- Teacher Detail Panel -->
    @if (selectedTeacher()) {
    <div class="bg-white rounded-xl shadow-sm p-6 sticky top-6">
      <!-- Teacher Header -->
      <div class="flex items-center gap-4 mb-6 pb-6 border-b">
        <div
          class="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0"
        >
          <span class="text-2xl font-bold text-teal-700">{{ selectedTeacher()!.initials }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-slate-800 text-lg">
            {{ selectedTeacher()!.firstName }} {{ selectedTeacher()!.lastName }}
          </h3>
          <div class="flex items-center gap-2 text-sm text-slate-600 mt-1">
            <svg
              class="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span class="truncate">{{ selectedTeacher()!.email }}</span>
          </div>
          @if (selectedTeacher()!.phone) {
          <div class="flex items-center gap-2 text-sm text-slate-600 mt-1">
            <svg
              class="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>{{ selectedTeacher()!.phone }}</span>
          </div>
          }
          <div class="flex items-center gap-2 text-sm text-slate-600 mt-1">
            <svg
              class="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{{ selectedTeacher()!.assignedCourses }} cours assign\xE9s</span>
          </div>
        </div>
        @if (selectedTeacher()!.userStatus === 'BLOCKED') {
        <span
          class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex-shrink-0"
        >
          Bloqu\xE9
        </span>
        } @else {
        <span
          class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium flex-shrink-0"
        >
          Actif
        </span>
        }
      </div>

      <!-- Boutons d'action Bloquer/D\xE9bloquer -->
      <div class="mb-6 pb-6 border-b">
        <h4 class="font-semibold text-slate-800 mb-3">Actions</h4>
        <div class="flex gap-3">
          @if (selectedTeacher()!.userStatus === 'BLOCKED') {
          <button
            (click)="unblockTeacher(selectedTeacher()!.id)"
            class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            D\xE9bloquer l'enseignant
          </button>
          } @else {
          <button
            (click)="blockTeacher(selectedTeacher()!.id)"
            class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
            Bloquer l'enseignant
          </button>
          }
        </div>
      </div>

      <!-- Hourly Load -->
      <div class="mb-6">
        <h4 class="font-semibold text-slate-800 mb-3">Charge horaire</h4>
        <div class="mb-2 flex justify-between text-sm">
          <span class="text-slate-600">Horaire utilis\xE9</span>
          <span class="font-medium">
            {{ selectedTeacher()!.hourlyLoad.used }}h / {{ selectedTeacher()!.hourlyLoad.total }}h
          </span>
        </div>
        <div class="w-full bg-slate-200 rounded-full h-2">
          <div
            class="bg-teal-600 h-2 rounded-full transition-all"
            [style.width.%]="
              (selectedTeacher()!.hourlyLoad.used / selectedTeacher()!.hourlyLoad.total) * 100
            "
          ></div>
        </div>
      </div>

      <!-- Weekly Availability -->
      <!-- Detailed Availability Grid -->
      <div class="mb-6">
        <h4 class="font-semibold text-slate-800 mb-3">Disponibilit\xE9s d\xE9taill\xE9es</h4>

        @if (isLoadingAvailability()) {
        <div class="text-center py-4">
          <div
            class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"
          ></div>
          <p class="text-sm text-slate-600 mt-2">Chargement des disponibilit\xE9s...</p>
        </div>
        } @else if (!selectedTeacherAvailability()) {
        <div
          class="text-center py-4 text-slate-500 text-sm bg-slate-50 rounded-lg border border-slate-200"
        >
          Aucune disponibilit\xE9 enregistr\xE9e pour cet enseignant
        </div>
        } @else {
        <!-- Summary -->
        <div class="mb-3 text-sm text-slate-600 flex items-center gap-2">
          <span class="inline-block w-3 h-3 bg-emerald-400 rounded-sm"></span>
          <span class="font-medium">{{ getAvailableSlotsCount() }} cr\xE9neaux disponibles</span>
        </div>

        <!-- Read-only Grid -->
        <div class="overflow-x-auto border border-slate-200 rounded-lg">
          <table class="w-full border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th
                  class="px-2 py-2 text-left font-medium text-slate-500 w-16 sticky left-0 bg-slate-50 z-10"
                >
                  Heure
                </th>
                @for (day of ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']; track $index) {
                <th class="px-1 py-2 text-center font-medium text-slate-500 w-12">{{ day }}</th>
                }
              </tr>
            </thead>
            <tbody>
              @for (slot of selectedTeacherAvailability()!.timeSlots; track $index; let hourIndex
              = $index) {
              <tr class="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td
                  class="px-2 py-1 font-medium text-slate-700 bg-white sticky left-0 z-10 border-r border-slate-100"
                >
                  {{ slot.hour }}
                </td>
                @for (day of ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']; track $index) {
                <td class="p-0 border-r border-slate-100 last:border-0 relative h-8">
                  @if (isPauseSlotByIndex(hourIndex)) {
                  <div class="absolute inset-0 bg-slate-100 flex items-center justify-center">
                    <span class="text-[10px] text-slate-400 font-medium">Pause</span>
                  </div>
                  } @else {
                  <div
                    class="absolute inset-0 m-[1px] rounded-sm transition-colors duration-200"
                    [ngClass]="slot.slots[day] ? 'bg-emerald-400' : 'bg-transparent'"
                    [attr.title]="slot.slots[day] ? 'Disponible' : 'Non disponible'"
                  ></div>
                  }
                </td>
                }
              </tr>
              }
            </tbody>
          </table>
        </div>
        }
      </div>

      <!-- Schedule -->
      <div>
        <h4 class="font-semibold text-slate-800 mb-3">Emploi du temps</h4>
        <div class="grid grid-cols-6 gap-2">
          @for (day of ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']; track $index) {
          <div class="text-center">
            <div class="text-xs text-slate-600 mb-1 capitalize">
              {{ day.substring(0, 3) }}
            </div>
            <div
              class="py-2 rounded text-xs font-medium"
              [ngClass]="
                selectedTeacher()!.schedule[day] && selectedTeacher()!.schedule[day] !== '-'
                  ? 'bg-purple-200 text-purple-700'
                  : 'bg-slate-100 text-slate-400'
              "
            >
              {{ selectedTeacher()!.schedule[day] || '-' }}
            </div>
          </div>
          }
        </div>
      </div>
    </div>
    } @else {
    <div class="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center h-96">
      <div class="text-center text-slate-400">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <p>S\xE9lectionnez un enseignant pour voir les d\xE9tails</p>
      </div>
    </div>
    }
  </div>
</div>

<!-- Modal Ajouter Enseignant -->
@if (showAddTeacherModal()) {
<div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
  <div class="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 animate-fadeIn">
    <h2 class="text-xl font-bold mb-4 text-slate-800">Ajouter un enseignant</h2>

    <form #teacherForm="ngForm" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm font-medium text-slate-700"
            >Pr\xE9nom <span class="text-red-500">*</span></label
          >
          <input
            type="text"
            class="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            name="firstName"
            ngModel
            required
            placeholder="Pr\xE9nom"
          />
        </div>

        <div>
          <label class="text-sm font-medium text-slate-700"
            >Nom <span class="text-red-500">*</span></label
          >
          <input
            type="text"
            class="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            name="lastName"
            ngModel
            required
            placeholder="Nom"
          />
        </div>
      </div>

      <div>
        <label class="text-sm font-medium text-slate-700"
          >Email <span class="text-red-500">*</span></label
        >
        <input
          type="email"
          class="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          name="email"
          ngModel
          required
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label class="text-sm font-medium text-slate-700"
          >R\xF4le <span class="text-red-500">*</span></label
        >
        <select
          class="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          name="userRole"
          ngModel="teacher"
          required
          #userRoleSelect="ngModel"
        >
          <option value="teacher">Enseignant</option>
          <option value="admin">Administrateur</option>
        </select>
      </div>

      <div>
        <label class="text-sm font-medium text-slate-700">Num\xE9ro de t\xE9l\xE9phone</label>
        <input
          type="tel"
          class="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          name="telephoneNumber"
          ngModel
          placeholder="Ex: 123456789"
        />
      </div>

      @if (userRoleSelect.value === 'teacher') {
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm font-medium text-slate-700"
            >Grade <span class="text-red-500">*</span></label
          >
          <input
            type="text"
            class="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            name="grade"
            ngModel
            required
            placeholder="Ex: Professeur"
          />
        </div>

        <div>
          <label class="text-sm font-medium text-slate-700"
            >Rang <span class="text-red-500">*</span></label
          >
          <input
            type="text"
            class="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            name="rank"
            ngModel
            required
            placeholder="Ex: Ma\xEEtre de conf\xE9rences"
          />
        </div>
      </div>

      <div>
        <label class="text-sm font-medium text-slate-700"
          >Charge horaire <span class="text-red-500">*</span></label
        >
        <input
          type="text"
          class="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          name="hourlyRate"
          ngModel
          required
          placeholder="Ex: 60"
        />
      </div>
      }

      <div class="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          (click)="closeModals()"
          class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
        >
          Annuler
        </button>

        <button
          type="submit"
          (click)="submitAddTeacher(teacherForm)"
          [disabled]="!teacherForm.valid || isSubmittingTeacher()"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          @if (isSubmittingTeacher()) {
          <span
            class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"
          ></span>
          Cr\xE9ation... } @else { Ajouter }
        </button>
      </div>
    </form>
  </div>
</div>
}

<!--
</div>-->
`, styles: ["/* src/app/features/admin/teachers/teachers-list/teachers-list.component.scss */\n.search-wrapper {\n  position: relative;\n  width: 260px;\n  margin-bottom: 25px;\n}\n.search-wrapper input {\n  width: 100%;\n  padding: 10px 40px 10px 15px;\n  border-radius: 8px;\n  border: 1px solid #ddd;\n}\n.search-wrapper i {\n  position: absolute;\n  right: 12px;\n  top: 50%;\n  transform: translateY(-50%);\n  color: #666;\n}\n/*# sourceMappingURL=teachers-list.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TeachersListComponent, { className: "TeachersListComponent", filePath: "src/app/features/admin/teachers/teachers-list/teachers-list.component.ts", lineNumber: 21 });
})();
export {
  TeachersListComponent
};
//# sourceMappingURL=chunk-BQST6ZLZ.js.map
