# Food Delivery App - Docker Setup

This project includes Docker configuration for easy database setup without manual migration running.

## 🐳 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed
- [Node.js 20+](https://nodejs.org/) installed (for running the app locally)

### Option 1: Database Only (Recommended for Development)

Run only the PostgreSQL database in Docker:

```bash
# Start database
docker-compose up postgres -d

# Check if database is ready
docker-compose ps
```

The database will be available at `localhost:5432` with:
- **Database**: `food_delivery`
- **User**: `postgres`
- **Password**: `postgres`

The database will automatically:
- ✅ Create all tables and schema
- ✅ Insert sample data (restaurants, dishes, users)
- ✅ Insert sample deals
- ✅ Setup auto-profile creation trigger

Then run the app locally:

```bash
npm install
npm start
```

### Option 2: Full Stack with Docker

Run both database and Expo dev server in Docker:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

Access points:
- **Expo Dev Server**: http://localhost:19000
- **Database**: localhost:5432
- **Supabase Studio** (optional): http://localhost:3000

### Option 3: Database with Supabase Studio UI

For a visual database management interface:

```bash
# Start database and studio
docker-compose up postgres supabase-studio -d
```

Access Supabase Studio at http://localhost:3000

## 📁 Database Initialization

Database is automatically initialized with files in `docker/init-db/`:

1. `01-schema.sql` - Complete database schema
2. `02-sample-data.sql` - Sample restaurants, dishes, users
3. `03-sample-deals.sql` - Sample deals and promotions
4. `04-auto-profile-trigger.sql` - Auto-create user profiles

## 🔧 Configuration

### Update Database Connection

Update your `.env` or Supabase config:

```env
# Local Docker Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/food_delivery
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your-anon-key
```

### Change Network IP (for mobile testing)

Edit `docker-compose.yml`:

```yaml
environment:
  - REACT_NATIVE_PACKAGER_HOSTNAME=YOUR_LOCAL_IP
```

Replace `YOUR_LOCAL_IP` with your machine's IP address (e.g., `192.168.1.100`).

## 🛠️ Useful Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove all data
docker-compose down -v

# View logs
docker-compose logs -f postgres

# Restart database
docker-compose restart postgres

# Access database CLI
docker-compose exec postgres psql -U postgres -d food_delivery

# Backup database
docker-compose exec postgres pg_dump -U postgres food_delivery > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres food_delivery < backup.sql
```

## 🔍 Troubleshooting

### Port Already in Use

If port 5432 is already in use, change it in `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"  # Use 5433 on host instead
```

### Database Not Initializing

```bash
# Remove volumes and restart
docker-compose down -v
docker-compose up postgres -d
docker-compose logs -f postgres
```

### Expo Dev Server Issues

Make sure your firewall allows connections on ports 19000-19002.

## 📊 Database Access

### Using psql

```bash
docker-compose exec postgres psql -U postgres -d food_delivery
```

### Using GUI Tools

Connect with tools like pgAdmin, DBeaver, or Supabase Studio:
- **Host**: localhost
- **Port**: 5432
- **Database**: food_delivery
- **Username**: postgres
- **Password**: postgres

## 🚀 Production Notes

For production, use proper Supabase cloud instance instead of local Docker database. Docker setup is designed for:
- Local development
- Testing
- Demo purposes
- CI/CD pipelines

## 📝 Customization

### Add Custom Init Scripts

Add `.sql` files to `docker/init-db/` with numeric prefixes:
- `05-custom-data.sql`
- `06-custom-functions.sql`

Files are executed in alphabetical order.

### Change Database Credentials

Edit `docker-compose.yml`:

```yaml
environment:
  POSTGRES_USER: myuser
  POSTGRES_PASSWORD: mypassword
  POSTGRES_DB: mydatabase
```

## 🆘 Need Help?

1. Check logs: `docker-compose logs -f`
2. Verify services: `docker-compose ps`
3. Test connection: `docker-compose exec postgres pg_isready`

For more information, see [SETUP.md](./SETUP.md) and [docs/SETUP_DATABASE_GUIDE.md](./docs/SETUP_DATABASE_GUIDE.md).
