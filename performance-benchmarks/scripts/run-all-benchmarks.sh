#!/bin/bash

# Complete Performance Benchmark Suite for Timely
# Runs all performance tests: Backend (JMeter), Frontend (Lighthouse), and Micro-benchmarks (JMH)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

clear

echo -e "${MAGENTA}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║        TIMELY - COMPLETE PERFORMANCE BENCHMARK SUITE         ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Parse command line arguments
RUN_BACKEND=true
RUN_FRONTEND=true
RUN_JMH=true
THREADS=50

while [[ $# -gt 0 ]]; do
    case $1 in
        --backend-only)
            RUN_FRONTEND=false
            RUN_JMH=false
            shift
            ;;
        --frontend-only)
            RUN_BACKEND=false
            RUN_JMH=false
            shift
            ;;
        --jmh-only)
            RUN_BACKEND=false
            RUN_FRONTEND=false
            shift
            ;;
        --threads)
            THREADS="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --backend-only    Run only backend (JMeter) tests"
            echo "  --frontend-only   Run only frontend (Lighthouse) tests"
            echo "  --jmh-only        Run only JMH micro-benchmarks"
            echo "  --threads N       Number of threads for JMeter (default: 50)"
            echo "  --help            Show this help message"
            echo ""
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

echo -e "${GREEN}Benchmark Configuration:${NC}"
echo "  Backend (JMeter): $RUN_BACKEND"
echo "  Frontend (Lighthouse): $RUN_FRONTEND"
echo "  JMH Micro-benchmarks: $RUN_JMH"
echo "  JMeter Threads: $THREADS"
echo ""

START_TIME=$(date +%s)

# Track failures
FAILURES=0

# ==================== PHASE 1: JMH Micro-benchmarks ====================

if [ "$RUN_JMH" = true ]; then
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  PHASE 1: JMH Micro-benchmarks (Schedule Generation)  ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""

    if bash "$SCRIPT_DIR/run-jmh-benchmark.sh"; then
        echo -e "${GREEN}✓ JMH benchmarks completed successfully${NC}"
    else
        echo -e "${RED}✗ JMH benchmarks failed${NC}"
        FAILURES=$((FAILURES + 1))
    fi
fi

# ==================== PHASE 2: Backend Load Tests ====================

if [ "$RUN_BACKEND" = true ]; then
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  PHASE 2: Backend Load Tests (JMeter)                 ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""

    # Check if services are running
    echo -e "${YELLOW}Checking if Timely services are running...${NC}"
    if ! curl -s http://localhost:8090/actuator/health > /dev/null 2>&1; then
        echo -e "${RED}✗ API Gateway not responding at http://localhost:8090${NC}"
        echo -e "${YELLOW}Please start all Timely services before running backend tests.${NC}"
        echo ""
        echo "To start services:"
        echo "  cd $PROJECT_ROOT"
        echo "  docker-compose up -d"
        echo ""
        FAILURES=$((FAILURES + 1))
    else
        echo -e "${GREEN}✓ API Gateway is responding${NC}"
        echo ""

        if bash "$SCRIPT_DIR/run-backend-benchmarks.sh" $THREADS all; then
            echo -e "${GREEN}✓ Backend benchmarks completed successfully${NC}"
        else
            echo -e "${RED}✗ Backend benchmarks failed${NC}"
            FAILURES=$((FAILURES + 1))
        fi
    fi
fi

# ==================== PHASE 3: Frontend Performance Tests ====================

if [ "$RUN_FRONTEND" = true ]; then
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  PHASE 3: Frontend Performance Tests (Lighthouse CI)  ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""

    if bash "$SCRIPT_DIR/../lighthouse/scripts/run-lighthouse.sh"; then
        echo -e "${GREEN}✓ Lighthouse tests completed successfully${NC}"
    else
        echo -e "${RED}✗ Lighthouse tests failed${NC}"
        FAILURES=$((FAILURES + 1))
    fi
fi

# ==================== Summary ====================

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo -e "${MAGENTA}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║                    BENCHMARK SUMMARY                         ║${NC}"
echo -e "${MAGENTA}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Total Duration: ${DURATION} seconds"
echo "Failures: $FAILURES"
echo ""

if [ $FAILURES -eq 0 ]; then
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║              ✓ ALL BENCHMARKS PASSED                         ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Next Steps:"
    echo "  1. Review JMeter results in: performance-benchmarks/jmeter/results/"
    echo "  2. Check Lighthouse reports in: performance-benchmarks/lighthouse/.lighthouseci/"
    echo "  3. Analyze JMH benchmark output above"
    echo ""
    echo "Key Metrics to Verify:"
    echo "  ✓ Schedule generation: < 10 seconds for 200 courses"
    echo "  ✓ Frontend Performance score: > 90"
    echo "  ✓ Accessibility score: > 95"
    echo "  ✓ API response times within thresholds"
    exit 0
else
    echo -e "${RED}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║              ✗ SOME BENCHMARKS FAILED                        ║${NC}"
    echo -e "${RED}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Please review the error messages above and:"
    echo "  1. Check that all services are running"
    echo "  2. Verify network connectivity"
    echo "  3. Check resource availability (CPU, RAM)"
    echo "  4. Review failed test logs"
    exit 1
fi
