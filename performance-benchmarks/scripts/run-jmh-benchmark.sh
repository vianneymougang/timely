#!/bin/bash

# JMH Benchmark Runner for Schedule Generation
# Runs micro-benchmarks for the critical schedule generation algorithm

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
PLANNING_SERVICE_DIR="$PROJECT_ROOT/services/planning-service"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "=================================================="
echo "Timely - Schedule Generation JMH Benchmark"
echo "=================================================="
echo ""
echo -e "${YELLOW}CRITICAL REQUIREMENT: Generation must be < 10 seconds for 200 courses${NC}"
echo ""

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}Error: Maven not found!${NC}"
    echo "Please install Maven 3.6+ from: https://maven.apache.org/"
    exit 1
fi

# Navigate to planning service
cd "$PLANNING_SERVICE_DIR"

echo -e "${GREEN}1. Building planning-service with benchmark classes...${NC}"
mvn clean test-compile -DskipTests

echo ""
echo -e "${GREEN}2. Running JMH benchmarks...${NC}"
echo -e "${BLUE}This may take several minutes...${NC}"
echo ""

# Run the benchmark
mvn exec:java -Dexec.mainClass="com.timely.planningservice.benchmark.ScheduleGenerationBenchmark" \
              -Dexec.classpathScope=test \
              -Dexec.args=""

echo ""
echo -e "${GREEN}=================================================="
echo "JMH Benchmark completed!"
echo "=================================================="
echo ""
echo "Key Metrics to Review:"
echo "  - 10 courses:  Should be < 100ms"
echo "  - 50 courses:  Should be < 500ms"
echo "  - 100 courses: Should be < 2000ms"
echo "  - 200 courses: CRITICAL - Should be < 10000ms (10 seconds)"
echo ""
echo "If the 200-course benchmark exceeds 10 seconds, optimization is required!"
echo ""
