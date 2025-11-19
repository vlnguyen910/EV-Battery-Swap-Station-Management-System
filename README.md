# AI Station Project

A full-stack application with a NestJS backend and a modern frontend, featuring AI chat capabilities and payment processing.

## Project Structure

```
├── backend/              # NestJS backend application
├── frontend/             # Frontend application
└── ai-chat-log/         # AI chat logs and usage tracking
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (for backend)

## Getting Started

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

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:

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

The frontend will be available at the configured port (typically `http://localhost:5173` or `http://localhost:3000`)

## Features

- **AI Chat Integration** - AI-powered chat functionality with conversation logging
- **Payment Processing** - VNPAY integration for payment handling
- **User Authentication** - Secure login and password reset functionality
- **Station Analysis** - AI-based analysis tools for stations

## Development

### Backend

- Framework: NestJS
- Database: Prisma ORM
- Code Quality: ESLint, Prettier

**Useful scripts:**

```bash
npm run start:dev       # Development mode with hot reload
npm run build          # Build for production
npm run test           # Run tests
```

### Frontend

- Styling: Tailwind CSS
- Code Quality: ESLint
- Build Tool: Vite (inferred from config structure)

## Testing

The backend includes several test scripts:

```bash
./test-ai-station-analysis.sh     # Test AI station analysis
./test-payment-fees.sh            # Test payment fee calculation
./test-payment-with-fees.sh       # Test payment with fees
```

## Configuration

- **Backend**: See [backend/.env.example](backend/.env.example) for required environment variables
- **Frontend**: Configuration in [frontend/jsconfig.json](frontend/jsconfig.json)
- **Styling**: See [frontend/tailwind.config.js](frontend/tailwind.config.js)

## Documentation

- Backend documentation: [backend/README.md](backend/README.md)
- Frontend documentation: [frontend/README.md](frontend/README.md)
- Payment credentials guide: [backend/VNPAY_CREDENTIALS_FIX.md](backend/VNPAY_CREDENTIALS_FIX.md)

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
