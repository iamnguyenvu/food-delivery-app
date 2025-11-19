#!/bin/bash

# Food Delivery App - Quick Start Script
# This script helps you get started quickly with Docker

set -e

echo "🍔 Food Delivery App - Docker Setup"
echo "===================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop first."
    echo "   Download from: https://www.docker.com/products/docker-desktop/"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is installed and running"
echo ""

# Prompt user for setup option
echo "Choose setup option:"
echo "1. Database only (recommended for development)"
echo "2. Database + Supabase Studio (with UI)"
echo "3. Full stack (database + Expo dev server)"
echo ""
read -p "Enter option (1-3): " option

case $option in
    1)
        echo ""
        echo "🚀 Starting database only..."
        docker-compose up postgres -d
        ;;
    2)
        echo ""
        echo "🚀 Starting database + Supabase Studio..."
        docker-compose up postgres supabase-studio -d
        ;;
    3)
        echo ""
        echo "🚀 Starting full stack..."
        docker-compose up -d
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check service status
docker-compose ps

echo ""
echo "✅ Setup complete!"
echo ""
echo "📊 Database Connection:"
echo "   Host: localhost"
echo "   Port: 5432"
echo "   Database: food_delivery"
echo "   User: postgres"
echo "   Password: postgres"
echo ""

if [ "$option" = "2" ] || [ "$option" = "3" ]; then
    echo "🎨 Supabase Studio: http://localhost:3000"
    echo ""
fi

if [ "$option" = "3" ]; then
    echo "📱 Expo Dev Server: http://localhost:19000"
    echo ""
fi

echo "📝 Useful commands:"
echo "   docker-compose logs -f          # View logs"
echo "   docker-compose down             # Stop services"
echo "   docker-compose restart postgres # Restart database"
echo ""
echo "For more information, see DOCKER.md"
