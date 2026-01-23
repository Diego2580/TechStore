@echo off
echo ===================================
echo Tech Store Backend - Quick Start
echo ===================================
echo.

REM Check if Java is installed
java -version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java JDK 21+ from: https://www.oracle.com/java/technologies/downloads/
    pause
    exit /b 1
)

REM Check if Maven is installed
mvn -version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Maven is not installed or not in PATH
    echo Please install Maven from: https://maven.apache.org/download.cgi
    pause
    exit /b 1
)

echo [1/3] Cleaning and installing dependencies...
mvn clean install

if errorlevel 1 (
    echo ERROR: Maven build failed
    pause
    exit /b 1
)

echo.
echo [2/3] Build completed successfully!
echo.
echo [3/3] Starting Spring Boot application...
echo The application will be available at: http://localhost:8080
echo.
echo Press CTRL+C to stop the server
echo.

mvn spring-boot:run

pause
