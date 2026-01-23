#!/bin/bash

echo "==================================="
echo "Tech Store Backend - Quick Start"
echo "==================================="
echo ""

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "ERROR: Java is not installed or not in PATH"
    echo "Please install Java JDK 21+ from: https://www.oracle.com/java/technologies/downloads/"
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "ERROR: Maven is not installed or not in PATH"
    echo "Please install Maven from: https://maven.apache.org/download.cgi"
    exit 1
fi

echo "[1/3] Cleaning and installing dependencies..."
mvn clean install

if [ $? -ne 0 ]; then
    echo "ERROR: Maven build failed"
    exit 1
fi

echo ""
echo "[2/3] Build completed successfully!"
echo ""
echo "[3/3] Starting Spring Boot application..."
echo "The application will be available at: http://localhost:8080"
echo ""
echo "Press CTRL+C to stop the server"
echo ""

mvn spring-boot:run
