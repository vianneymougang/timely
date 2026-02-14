#!/bin/bash

# Backend Performance Benchmarks Runner for Timely
# Runs JMeter load tests on all microservices

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
JMETER_DIR="$SCRIPT_DIR/../jmeter"
RESULTS_DIR="$JMETER_DIR/results"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "=================================================="
echo "Timely Backend - Performance Benchmarks with JMeter"
echo "=================================================="
echo ""

# Check if JMeter is installed
if ! command -v jmeter &> /dev/null; then
    echo -e "${RED}Error: JMeter not found!${NC}"
    echo ""
    echo "Please install JMeter 5.6+ from: https://jmeter.apache.org/download_jmeter.cgi"
    echo ""
    echo "On macOS with Homebrew:"
    echo "  brew install jmeter"
    echo ""
    echo "On Linux:"
    echo "  Download and extract from Apache JMeter website"
    echo "  Add JMETER_HOME/bin to your PATH"
    exit 1
fi

JMETER_VERSION=$(jmeter -v 2>&1 | grep -oP "(?<=Version )[\d.]+")
echo -e "${GREEN}JMeter version: $JMETER_VERSION${NC}"
echo ""

# Create results directory
mkdir -p "$RESULTS_DIR"

# Check if services are running
echo -e "${BLUE}Checking if Timely services are running...${NC}"
if ! curl -s http://localhost:8090/actuator/health > /dev/null 2>&1; then
    echo -e "${YELLOW}Warning: API Gateway not responding at http://localhost:8090${NC}"
    echo -e "${YELLOW}Make sure all Timely services are running before continuing.${NC}"
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Parse command line arguments
THREADS=${1:-10}
TEST=${2:-all}

echo ""
echo -e "${GREEN}Configuration:${NC}"
echo "  Threads: $THREADS"
echo "  Test: $TEST"
echo "  Results directory: $RESULTS_DIR"
echo ""

# Function to run a JMeter test
run_test() {
    local test_name=$1
    local jmx_file="$JMETER_DIR/${test_name}.jmx"
    local result_file="$RESULTS_DIR/${test_name}-$(date +%Y%m%d-%H%M%S).csv"
    local log_file="$RESULTS_DIR/${test_name}-$(date +%Y%m%d-%H%M%S).log"

    if [ ! -f "$jmx_file" ]; then
        echo -e "${RED}Error: Test file not found: $jmx_file${NC}"
        return 1
    fi

    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}Running: $test_name${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""

    jmeter -n -t "$jmx_file" \
           -Jthreads=$THREADS \
           -l "$result_file" \
           -j "$log_file" \
           -e -o "$RESULTS_DIR/${test_name}-report-$(date +%Y%m%d-%H%M%S)"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Test completed successfully: $test_name${NC}"
        echo "Results: $result_file"
        echo "Report: $RESULTS_DIR/${test_name}-report-$(date +%Y%m%d-%H%M%S)"
    else
        echo -e "${RED}Test failed: $test_name${NC}"
        return 1
    fi
}

# Run tests based on selection
case $TEST in
    auth)
        run_test "auth-service"
        ;;
    user)
        run_test "user-service"
        ;;
    planning)
        run_test "planning-service"
        ;;
    booking)
        run_test "booking-service"
        ;;
    report)
        run_test "report-service"
        ;;
    all)
        echo -e "${BLUE}Running all service tests...${NC}"
        run_test "auth-service"
        run_test "user-service"
        run_test "planning-service"
        run_test "booking-service"
        run_test "report-service"
        ;;
    complete)
        echo -e "${BLUE}Running complete integration test...${NC}"
        run_test "all-services"
        ;;
    *)
        echo -e "${RED}Unknown test: $TEST${NC}"
        echo ""
        echo "Usage: $0 [threads] [test]"
        echo ""
        echo "  threads: Number of concurrent users (default: 10)"
        echo "  test: Test to run (default: all)"
        echo ""
        echo "Available tests:"
        echo "  auth      - Auth Service tests"
        echo "  user      - User Service tests"
        echo "  planning  - Planning Service tests (CRITICAL: <10s requirement)"
        echo "  booking   - Booking Service tests"
        echo "  report    - Report Service tests"
        echo "  all       - Run all individual service tests"
        echo "  complete  - Run complete integration test"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}=================================================="
echo "Benchmarks completed!"
echo "=================================================="
echo ""
echo "Results saved to: $RESULTS_DIR"
echo ""
echo "To view results:"
echo "  1. Open the HTML report in the results directory"
echo "  2. Or analyze CSV files with your preferred tool"
echo ""
