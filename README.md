# Timely

Timely builds weekly school timetables. It takes courses, rooms and teacher availability from several schools on one campus and places each course in a time slot and a room.

Team project. My role: backend lead and software architecture.

Tutored project at Saint Jean Ingénieur, 2026.

## Main features

- Campus-wide timetable generation for a given week. The planning service runs one pass per course type (CM, then TD, then TP). Each pass solves a max-flow problem that matches courses to free teacher hours, then rooms are assigned by group size and room type.
- Conflict list for each timetable, with a "resolve" action.
- Timetable workflow: draft, validate, publish. Export to PDF and iCalendar.
- School data management: schools, programs, classes, teaching units, courses, student groups, students, rooms, equipment, events and room reservations.
- Teacher availability, with weekly overrides.
- User management for admins and teachers: create, block, unblock, bulk actions.
- Login with JWT access and refresh tokens. Password reset by email code.
- Notifications by email, with templates, scheduled sends and retry of failed sends. SMS (Twilio) and push (Firebase) are wired in and off by default.
- Reports and statistics on rooms, teachers and courses, with PDF and Excel export and an audit log.
- Export of published timetables to Agora, the school's external platform, through a RabbitMQ queue.
- Angular frontend with an admin area (dashboard, schedule generation and viewer, conflicts, courses, rooms, teachers, students, analytics, settings) and a teacher area (week view, availability, notifications, profile).

## Architecture and stack

Backend: Java 21, Spring Boot 3.5, Spring Cloud 2025.0, built with Maven. Each service has its own Dockerfile and Maven wrapper.

| Service | Port | Notes |
|---|---|---|
| config-server | 8888 | Spring Cloud Config, native profile, files in `services/config-server/src/main/resources/configurations` |
| discovery-server | 8761 | Eureka server |
| api-gateway | 8090 | Spring Cloud Gateway (WebMVC), JWT check, Redis rate limiting with Bucket4j, Resilience4j circuit breakers |
| auth-service | 8091 | Login, refresh, logout, password reset. PostgreSQL, Redis, RabbitMQ |
| user-service | 8092 | Admins, teachers, availability. PostgreSQL, Flyway, Redis |
| planning-service | 8093 | Timetable generation, conflicts, PDF (OpenHTMLtoPDF) and iCal export. PostgreSQL, Redis |
| booking-service | 8094 | Schools, courses, rooms, groups, reservations. PostgreSQL, Redis |
| notification-service | 8095 | Email (Thymeleaf templates), Twilio, Firebase. MongoDB |
| report-service | 8096 | Reports, KPIs, audit, PDF (Flying Saucer) and Excel (Apache POI). PostgreSQL |
| agora-service | 8097 | Export to the Agora platform, Spring Batch. PostgreSQL |

Services talk to each other with OpenFeign and RabbitMQ. Each PostgreSQL-backed service has its own database. API docs use springdoc-openapi.

Frontend: Angular 20 with PrimeNG, Angular Material and Tailwind CSS. End-to-end tests use Playwright.

Infrastructure in `docker-compose.yml`: PostgreSQL (one container per service), MongoDB, Redis 7, RabbitMQ 3 with the management UI, a local mail catcher (Mailtrap image), pgAdmin and Mongo Express.

## How to run it locally

You need Docker, and Node.js for the frontend.

Copy the environment file and set `JWT_SECRET` (at least 32 characters):

```bash
cp .env.example .env
```

Build and start the infrastructure and all backend services:

```bash
docker compose up -d --build
```

The gateway listens on http://localhost:8090. Eureka is on http://localhost:8761, RabbitMQ on http://localhost:15672 and the mail catcher on http://localhost:1080.

Start the frontend:

```bash
cd timely-frontend
npm install --legacy-peer-deps
npm start
```

Open http://localhost:4200. In development, the frontend calls the gateway at `http://localhost:8090/api`.

Sample data for the user, booking and planning databases is in `docs/seed`.

Run the end-to-end tests:

```bash
cd timely-frontend
npm run e2e
```
