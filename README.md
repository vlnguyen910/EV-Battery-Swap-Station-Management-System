# AI Station Project

A full-stack application with a NestJS backend and a modern frontend, featuring AI chat capabilities and payment processing.

## Team

- **Lead Developer:** Ngo Phan Gia Bao
- **Backend Developer:** Vo Lam Nguyen
- **Frontend Developer:** Le Nhut Anh
- **Frontend Developer:** Lam Huynh Hue Man

---


## Project Structure

```
├── backend/              # NestJS backend application
├── frontend/             # Frontend application
├── ai-chat-log/         # AI chat logs and usage tracking
├── Dockerfile           # Multi-stage Docker build
├── docker-compose.yml   # Docker Compose configuration
└── Makefile            # Docker convenience commands
```

## Quick Start with Docker 

The easiest way to run the entire application is with Docker:

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f
```

**Access the application:**

- Frontend: <http://localhost:5173>
- Backend API: <http://localhost:8080>
- Database: localhost:5432

For detailed Docker instructions, see [DOCKER_SETUP.md](DOCKER_SETUP.md)

## Prerequisites

### For Docker Setup

- Docker & Docker Compose

### For Local Development

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (v16 or higher)

## Local Development Setup

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Configure your `.env` file with database credentials and API keys

5. Run database migrations:

```bash
npx prisma migrate dev
```

6. (Optional) Seed the database:

```bash
npx prisma db seed
```

7. Start the development server:

```bash
npm run start:dev
```

The backend will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will be available at <http://localhost:5173>

## Features

- **AI Chat Integration** - AI-powered chat functionality with conversation logging
- **Payment Processing** - VNPAY integration for secure payment handling
- **User Authentication** - Secure login and password reset functionality
- **Station Analysis** - AI-based analysis tools for EV battery swap stations
- **Real-time Updates** - Live station status and battery availability tracking

## Development

### Backend

- **Framework:** NestJS with TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **API:** RESTful API with Swagger documentation
- **Code Quality:** ESLint, Prettier

**Useful scripts:**

```bash
cd backend
npm run start:dev       # Development mode with hot reload
npm run build          # Build for production
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
```

### Frontend

- **Framework:** React/Vue (based on your setup)
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Code Quality:** ESLint

**Useful scripts:**

```bash
cd frontend
npm run dev            # Development server with hot reload
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
```

## Testing

Run the included test scripts:

```bash
./test-ai-station-analysis.sh     # Test AI station analysis
./test-payment-fees.sh            # Test payment fee calculation
./test-payment-with-fees.sh       # Test payment with fees
```

## Configuration

### Environment Variables

- **Backend**: See [backend/.env.example](backend/.env.example)
- **Frontend**: Configuration in [frontend/vite.config.js](frontend/vite.config.js)

### Key Configuration Files

- **Backend:**
  - `backend/prisma/schema.prisma` - Database schema
  - `backend/src/config/` - Application configuration
  - `backend/.env` - Environment variables

- **Frontend:**
  - `frontend/vite.config.js` - Build configuration
  - `frontend/tailwind.config.js` - Styling configuration
  - `frontend/.env` - Environment variables

## Database

### Schema

The application uses Prisma ORM with the following main entities:

- Users (authentication & profiles)
- Stations (EV battery swap stations)
- Batteries (battery inventory)
- Transactions (payment & swap records)
- Chat Logs (AI conversation history)

### Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply pending migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## API Documentation

Backend API documentation is available at:

```
http://localhost:8080/api/docs
```

## Logging

AI chat logs and usage statistics are organized in:

```
ai-chat-log/
├── user-[id]/
│   ├── conversations.json
│   └── analytics.json
```

## Payment Integration (VNPAY)

The application integrates with VNPAY for payment processing.

**Configuration required:**

- `VNPAY_MERCHANT_ID` - Your merchant ID
- `VNPAY_HASH_SECRET` - Your hash secret
- `VNPAY_RETURN_URL` - Return URL for payments

See [backend/VNPAY_CREDENTIALS_FIX.md](backend/VNPAY_CREDENTIALS_FIX.md) for detailed setup.

## Docker Commands

Using Docker Compose makes deployment simple:

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service_name]

# Rebuild images
docker-compose build

# Execute commands in container
docker-compose exec app npm run migrate
docker-compose exec db psql -U postgres -d ai_station
```

### Using Makefile

```bash
make build       # Build Docker images
make up          # Start containers
make down        # Stop containers
make logs        # View application logs
make shell       # Open app container shell
make db-shell    # Open database shell
make restart     # Restart all containers
make clean       # Remove containers and volumes (⚠️ deletes data)
make ps          # Show running containers
```

## Deployment

### Docker Production Build

```bash
docker-compose -f docker-compose.yml up -d --build
```

### Environment Configuration

Update `.env.docker` with production values before deploying.

## Contributing

Please follow these guidelines:

1. **Code Quality:**

   ```bash
   npm run lint      # Check code style
   npm run format    # Format code
   npm run test      # Run tests
   ```

2. **Commit Messages:**
   - Use clear, descriptive commit messages
   - Reference issue numbers when applicable

3. **Pull Requests:**
   - Provide detailed description of changes
   - Include screenshots for UI changes
   - Ensure all tests pass

## Project Documentation

- [Docker Setup Guide](DOCKER_SETUP.md)
- [Backend Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)
- [Payment Setup Guide](backend/VNPAY_CREDENTIALS_FIX.md)

## Troubleshooting

### Docker Issues

```bash
# Check service status
docker-compose ps

# View detailed logs
docker-compose logs -f [service_name]

# Restart services
docker-compose restart

# Reset everything
docker-compose down -v && docker-compose up -d --build
```

### Database Connection Failed

```bash
# Check database is running
docker-compose logs db

# Test connection
docker-compose exec db pg_isready
```

### Port Already in Use

Change ports in `docker-compose.yml`:

- Frontend: Change `5173:5173` to `PORT:5173`
- Backend: Change `3000:3000` to `PORT:3000`
- Database: Change `5432:5432` to `PORT:5432`

## Performance Tips

- Use `docker-compose -d` to run in background
- Enable Docker BuildKit: `export DOCKER_BUILDKIT=1`
- Clean up unused Docker resources: `docker system prune`

## Security

⚠️ **Important Security Notes:**

1. **Never commit `.env` files** with sensitive data
2. **Use strong database passwords** in production
3. **Enable HTTPS** in production
4. **Validate all user inputs** on both frontend and backend
5. **Keep dependencies updated**: `npm audit` and `npm update`

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Support & Contact

For issues, questions, or suggestions:

- Open an issue on the repository
- Contact the development team
- Check existing documentation

## Logging

AI chat logs and usage statistics are tracked in the [ai-chat-log/](ai-chat-log/) directory organized by user.

## Contributing

Please ensure code quality by:

1. Running ESLint: `npm run lint`
2. Formatting with Prettier: `npm run format`
3. Writing tests for new features

## License

[Add your license information here]

## Support

For issues or questions, please open an issue in the repository.
