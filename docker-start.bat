@echo off
REM Food Delivery App - Quick Start Script for Windows
REM This script helps you get started quickly with Docker

echo.
echo 🍔 Food Delivery App - Docker Setup
echo ====================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    echo    Download from: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop.
    pause
    exit /b 1
)

echo ✅ Docker is installed and running
echo.

REM Prompt user for setup option
echo Choose setup option:
echo 1. Database only (recommended for development)
echo 2. Database + Supabase Studio (with UI)
echo 3. Full stack (database + Expo dev server)
echo.
set /p option="Enter option (1-3): "

if "%option%"=="1" (
    echo.
    echo 🚀 Starting database only...
    docker-compose up postgres -d
) else if "%option%"=="2" (
    echo.
    echo 🚀 Starting database + Supabase Studio...
    docker-compose up postgres supabase-studio -d
) else if "%option%"=="3" (
    echo.
    echo 🚀 Starting full stack...
    docker-compose up -d
) else (
    echo ❌ Invalid option
    pause
    exit /b 1
)

echo.
echo ⏳ Waiting for services to be ready...
timeout /t 5 /nobreak >nul

REM Check service status
docker-compose ps

echo.
echo ✅ Setup complete!
echo.
echo 📊 Database Connection:
echo    Host: localhost
echo    Port: 5432
echo    Database: food_delivery
echo    User: postgres
echo    Password: postgres
echo.

if "%option%"=="2" (
    echo 🎨 Supabase Studio: http://localhost:3000
    echo.
) else if "%option%"=="3" (
    echo 🎨 Supabase Studio: http://localhost:3000
    echo 📱 Expo Dev Server: http://localhost:19000
    echo.
)

echo 📝 Useful commands:
echo    docker-compose logs -f          # View logs
echo    docker-compose down             # Stop services
echo    docker-compose restart postgres # Restart database
echo.
echo For more information, see DOCKER.md
echo.
pause
