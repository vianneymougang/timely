import "./chunk-WDMUDEB6.js";

// src/app/features/teacher/teacher.routes.ts
var TEACHER_ROUTES = [
  {
    path: "dashboard",
    loadComponent: () => import("./chunk-H2FXQJ5F.js").then((m) => m.TeacherDashboardComponent)
  },
  {
    path: "schedule",
    loadComponent: () => import("./chunk-PYLWU5HI.js").then((m) => m.TeacherScheduleComponent)
  },
  {
    path: "availability",
    loadComponent: () => import("./chunk-W77YIQLK.js").then((m) => m.TeacherAvailabilityComponent)
  },
  {
    path: "notifications",
    loadComponent: () => import("./chunk-DV6VYB4S.js").then((m) => m.TeacherNotificationsComponent)
  },
  {
    path: "profile",
    loadComponent: () => import("./chunk-JLQ6VJ66.js").then((m) => m.TeacherProfileComponent)
  }
];
export {
  TEACHER_ROUTES
};
//# sourceMappingURL=chunk-I7PWA33D.js.map
