#!/bin/bash

# Performance Benchmarks Configuration
# Copy this file to config.sh and customize for your environment
# DO NOT commit config.sh to version control

# ==================== JMeter Configuration ====================

# Base URL for API Gateway
export JMETER_BASE_URL="http://localhost:8090"

# Default number of threads (concurrent users)
export JMETER_THREADS=50

# Ramp-up time in seconds
export JMETER_RAMP_UP=30

# Test duration in seconds
export JMETER_DURATION=120

# Admin credentials for authenticated tests
export ADMIN_USERNAME="admin@timely.com"
export ADMIN_PASSWORD="Admin123!"

# ==================== Lighthouse Configuration ====================

# Frontend URL
export LIGHTHOUSE_BASE_URL="http://localhost:4200"

# Number of runs per page
export LIGHTHOUSE_RUNS=3

# Performance thresholds
export LIGHTHOUSE_PERF_THRESHOLD=0.9
export LIGHTHOUSE_A11Y_THRESHOLD=0.95
export LIGHTHOUSE_BP_THRESHOLD=0.9
export LIGHTHOUSE_SEO_THRESHOLD=0.9

# ==================== JMH Configuration ====================

# JVM heap size for benchmarks
export JMH_HEAP_MIN="2G"
export JMH_HEAP_MAX="4G"

# Number of warmup iterations
export JMH_WARMUP_ITERATIONS=3

# Number of measurement iterations
export JMH_MEASUREMENT_ITERATIONS=5

# Number of forks
export JMH_FORKS=2

# ==================== General Configuration ====================

# Results directory
export RESULTS_DIR="./results"

# Enable verbose logging
export VERBOSE=false

# ==================== Docker Services ====================

# Docker Compose file location
export DOCKER_COMPOSE_FILE="../docker-compose.yml"

# Wait time for services to start (seconds)
export SERVICES_STARTUP_WAIT=30

# ==================== Notification Settings ====================

# Send email notification on completion (true/false)
export SEND_EMAIL_NOTIFICATION=false

# Email recipient
export NOTIFICATION_EMAIL="team@example.com"

# Slack webhook URL (optional)
export SLACK_WEBHOOK_URL=""

# ==================== CI/CD Settings ====================

# Fail fast on first error
export FAIL_FAST=false

# Generate HTML reports
export GENERATE_REPORTS=true

# Archive results
export ARCHIVE_RESULTS=true
