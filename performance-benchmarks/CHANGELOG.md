# Changelog - Performance Benchmarks Suite

All notable changes to the Timely Performance Benchmarks Suite will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-14

### Added - Initial Release

#### JMeter Load Tests (Backend)
- **Auth Service Tests** (`auth-service.jmx`)
  - Login endpoint (POST /auth/login)
  - Token validation (POST /auth/validate)
  - Logout endpoint (POST /auth/logout)
  - Assertions: < 1000ms login, < 500ms validation
  - Thread configurations: 10, 50, 100, 200 concurrent users

- **User Service Tests** (`user-service.jmx`)
  - GET /users with pagination
  - POST /users (create)
  - GET /users/{id}
  - PUT /users/{id} (update)
  - DELETE /users/{id}
  - Assertions: < 500ms GET, < 1000ms POST

- **Planning Service Tests** (`planning-service.jmx`) ⭐ CRITICAL
  - GET /schedules (paginated)
  - POST /schedules/generate **CRITICAL: < 10 seconds for 200 courses**
  - GET /schedules/{id}
  - GET /schedules/{id}/conflicts
  - GET /schedules/{id}/export/pdf
  - Conflict detection performance tests

- **Booking Service Tests** (`booking-service.jmx`)
  - GET /bookings/rooms/available
  - POST /bookings (create)
  - GET /bookings/{id}
  - PUT /bookings/{id} (update)
  - DELETE /bookings/{id}
  - Assertions: < 1000ms creation, < 800ms availability check

- **Report Service Tests** (`report-service.jmx`)
  - POST /reports/attendance/pdf
  - POST /reports/attendance/excel
  - POST /reports/schedule/pdf
  - GET /reports/history
  - Assertions: < 6000ms PDF generation, < 4000ms Excel

- **All Services Integration Test** (`all-services.jmx`)
  - Parallel execution of all service tests
  - Complete system stress test
  - Aggregate reporting

#### Lighthouse CI (Frontend)
- **Configuration** (`lighthouserc.json`)
  - Desktop preset (1920×1080)
  - 3 runs per page for statistical validity
  - Performance threshold: > 90
  - Accessibility threshold: > 95
  - Best Practices threshold: > 90
  - SEO threshold: > 90

- **Pages tested**:
  - Home page (/)
  - Login page (/login)
  - Dashboard (/dashboard)
  - Schedules viewer (/schedules)
  - Reports page (/reports)
  - User management (/users)

- **Core Web Vitals tracking**:
  - First Contentful Paint (FCP) < 2s
  - Largest Contentful Paint (LCP) < 2.5s
  - Total Blocking Time (TBT) < 300ms
  - Cumulative Layout Shift (CLS) < 0.1
  - Speed Index < 3s

- **Budget constraints**:
  - JavaScript bundles < 500KB
  - CSS bundles < 100KB
  - Images < 200KB
  - Total page weight < 1MB

#### JMH Micro-benchmarks (Schedule Generation)
- **Benchmark class** (`ScheduleGenerationBenchmark.java`)
  - Greedy algorithm benchmark
  - Conflict detection benchmark
  - Complete pipeline benchmark (generation + validation + resolution)

- **Test sizes**:
  - 10 courses: Baseline (< 100ms expected)
  - 50 courses: Small department (< 500ms expected)
  - 100 courses: Medium department (< 2000ms expected)
  - **200 courses: Large department (< 10000ms CRITICAL)**

- **JMH configuration**:
  - Mode: AverageTime
  - Warmup: 3 iterations × 2 seconds
  - Measurement: 5 iterations × 5 seconds
  - Forks: 2 (for statistical validity)
  - JVM args: -Xms2G -Xmx4G

#### Automation Scripts
- **`run-all-benchmarks.sh`**
  - Master script to run all benchmark types
  - Options: --backend-only, --frontend-only, --jmh-only
  - Configurable thread count
  - Failure tracking and reporting
  - Execution time tracking

- **`run-backend-benchmarks.sh`**
  - JMeter test runner
  - Per-service or complete suite execution
  - Automatic results directory creation
  - HTML report generation
  - Service health checking

- **`run-jmh-benchmark.sh`**
  - JMH micro-benchmark runner
  - Maven integration
  - Automatic build and execution
  - Results interpretation guidance

- **`run-lighthouse.sh`**
  - Lighthouse CI runner
  - Production build automation
  - Local server management
  - Automatic cleanup

#### Documentation
- **README.md**: Complete guide (80+ pages)
  - Installation instructions
  - Usage examples
  - Threshold definitions
  - CI/CD integration
  - Troubleshooting guide

- **QUICK-START.md**: Fast-track guide
  - 3-step getting started
  - Common commands
  - Quick result verification
  - Rapid troubleshooting

- **RESULTS-GUIDE.md**: Results interpretation
  - JMeter report analysis
  - Lighthouse score interpretation
  - JMH output understanding
  - Comparative analysis
  - Action recommendations

- **CHANGELOG.md**: Version history

#### Configuration
- **`.gitignore`**: Exclude results from version control
- **`config.example.sh`**: Configuration template
- **Integration with `package.json`**:
  - `npm run lighthouse`: Run frontend benchmarks
  - `npm run perf:lighthouse`: Alias for lighthouse
  - `npm run perf:all`: Run all frontend perf tests

### Performance Thresholds Defined

#### Backend (JMeter)
| Service | Endpoint | Max Latency | Max Error % |
|---------|----------|-------------|-------------|
| Auth | Login | 1000ms | 0.1% |
| Auth | Validate | 500ms | 0.1% |
| User | GET/POST/PUT/DELETE | 500-1000ms | 0.5% |
| Planning | **Generate Schedule** | **10000ms** | **0%** |
| Booking | Create/Update | 1000ms | 0.5% |
| Report | PDF Generation | 6000ms | 1% |

#### Frontend (Lighthouse)
- Performance: > 90
- Accessibility: > 95 (WCAG AA compliance)
- Best Practices: > 90
- SEO: > 90

#### Micro-benchmarks (JMH)
- 10 courses: < 100ms
- 50 courses: < 500ms
- 100 courses: < 2000ms
- **200 courses: < 10000ms (CRITICAL)**

### Technical Details

#### Technologies Used
- Apache JMeter 5.6.3
- Lighthouse CI 0.13.x
- JMH (Java Microbenchmark Harness) 1.37
- Maven 3.6+
- Node.js 18+
- Bash scripting

#### Test Coverage
- **5 microservices** tested via JMeter
- **6 frontend pages** tested via Lighthouse
- **4 algorithm sizes** tested via JMH
- **Load scenarios**: 10, 50, 100, 200 concurrent users
- **Total test scenarios**: 20+ different configurations

#### Metrics Tracked
- Response times (average, median, 90th, 95th, 99th percentiles)
- Throughput (requests/second)
- Error rates
- Core Web Vitals (FCP, LCP, TBT, CLS)
- Lighthouse scores (Performance, Accessibility, Best Practices, SEO)
- Algorithm execution time with statistical confidence intervals

### Files Structure
```
performance-benchmarks/
├── jmeter/
│   ├── auth-service.jmx
│   ├── user-service.jmx
│   ├── planning-service.jmx
│   ├── booking-service.jmx
│   ├── report-service.jmx
│   └── all-services.jmx
├── lighthouse/
│   ├── lighthouserc.json
│   ├── config/
│   │   └── lighthouse.config.js
│   └── scripts/
│       └── run-lighthouse.sh
├── scripts/
│   ├── run-all-benchmarks.sh
│   ├── run-backend-benchmarks.sh
│   └── run-jmh-benchmark.sh
├── .gitignore
├── config.example.sh
├── README.md
├── QUICK-START.md
├── RESULTS-GUIDE.md
└── CHANGELOG.md
```

### CI/CD Integration Examples
- GitHub Actions workflow template
- Jenkins pipeline example
- Automated threshold validation
- Results archiving

### Known Limitations
1. JMeter tests require all Timely services to be running
2. Lighthouse tests build frontend in production mode (adds ~2 minutes)
3. JMH benchmarks are single-threaded (no parallel generation testing yet)
4. No automated performance regression detection (manual comparison required)

### Future Enhancements (Planned)
- [ ] Gatling integration for complex user scenarios
- [ ] K6 integration for cloud-native load testing
- [ ] Prometheus/Grafana integration for real-time monitoring
- [ ] Automated baseline comparison and regression detection
- [ ] Parallel schedule generation benchmarks
- [ ] Memory profiling integration
- [ ] Database query performance tracking
- [ ] API response size optimization tests
- [ ] Mobile Lighthouse configuration
- [ ] Continuous performance monitoring

## How to Use This Changelog

When updating the benchmark suite:

1. Update the version number following SemVer
2. Add new entries under the appropriate category:
   - `Added`: New features/tests
   - `Changed`: Changes to existing functionality
   - `Deprecated`: Features to be removed
   - `Removed`: Removed features
   - `Fixed`: Bug fixes
   - `Security`: Security improvements
3. Include performance threshold changes
4. Document any breaking changes
5. Update the date

## Version History

- **1.0.0** (2026-02-14): Initial release with complete benchmark suite

---

**Maintainers**: Timely Performance Team
**Last Updated**: 2026-02-14
