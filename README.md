# Knowledge Base - RAG System

A modern knowledge base system with RAG (Retrieval Augmented Generation) capabilities, powered by AI.

## Features

- **Dashboard**: Overview of your knowledge base statistics
- **Ask AI**: Interactive chat interface with AI-powered responses
- **File Upload**: S3-integrated file upload system
- **Real-time Streaming**: WebSocket-based streaming responses
- **PostgreSQL Database**: Persistent data storage with Prisma ORM

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TailwindCSS 4
- CopilotKit
- AWS SDK (S3)
- Lucide Icons

### Backend
- Python 3.13
- FastAPI
- Prisma (PostgreSQL)
- OpenAI API
- LangChain
- WebSockets

## Prerequisites

- Node.js 18+ and pnpm
- Python 3.10-3.12
- PostgreSQL database
- OpenAI API key
- AWS S3 bucket and credentials

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Knowladge-base
```

### 2. Setup Frontend

```bash
cd apps/frontend

# Install dependencies
pnpm install

# Create .env file
cp .env.example .env

# Edit .env and add your configuration:
# NEXT_PUBLIC_API_URL=http://localhost:8000
# NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your_access_key
# NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your_secret_key
# NEXT_PUBLIC_AWS_REGION=us-east-1
# NEXT_PUBLIC_S3_BUCKET_NAME=your_bucket_name
```

### 3. Setup Backend

```bash
cd apps/api

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your configuration:
# OPENAI_API_KEY=your_openai_api_key
# DATABASE_URL=postgresql://postgres:password@localhost:5432/knowledge_base
```

### 4. Setup Database

Make sure PostgreSQL is running, then:

```bash
cd apps/api

# Activate virtual environment (Windows)
venv\Scripts\activate

# Initialize database
python init_db.py
```

## Running the Application

### Option 1: Using batch scripts (Windows)

**Terminal 1 - Backend:**
```bash
cd apps/api
start.bat
```

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
start.bat
```

### Option 2: Manual start

**Terminal 1 - Backend:**
```bash
cd apps/api
venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
pnpm dev
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Environment Variables

### Frontend (.env)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your_access_key_id
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your_secret_access_key
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_S3_BUCKET_NAME=your_bucket_name
```

### Backend (.env)

```env
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=postgresql://postgres:password@localhost:5432/knowledge_base
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000
```

## Project Structure

```
Knowladge-base/
├── apps/
│   ├── frontend/          # Next.js frontend application
│   │   ├── app/           # Next.js app directory
│   │   │   ├── dashboard/ # Dashboard module
│   │   │   └── ask-ai/    # AI chat module
│   │   ├── components/    # React components
│   │   │   ├── ui/        # UI components
│   │   │   └── chat/      # Chat components
│   │   └── lib/           # Utilities
│   └── api/               # Python FastAPI backend
│       ├── main.py        # FastAPI application
│       ├── schema.prisma  # Prisma schema
│       └── init_db.py     # Database initialization
└── README.md
```

## API Endpoints

- `GET /` - Health check
- `GET /health` - Health status
- `POST /api/chat` - Chat with AI (streaming)
- `POST /api/copilotkit` - CopilotKit integration
- `WS /ws/chat` - WebSocket chat endpoint

## Features Overview

### Dashboard
- View statistics about documents, conversations, and knowledge items
- Simple and clean interface

### Ask AI
- Real-time chat with AI assistant
- Message history display
- File upload with S3 integration
- Streaming responses
- Beautiful UI with user/assistant message distinction

## Development

### Frontend Development
```bash
cd apps/frontend
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm lint     # Run linter
```

### Backend Development
```bash
cd apps/api
venv\Scripts\activate
uvicorn main:app --reload  # Start with auto-reload
```

### Database Migrations
```bash
cd apps/api
prisma db push      # Push schema changes
prisma generate     # Generate Prisma client
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists: `createdb knowledge_base`

### Port Already in Use
- Frontend (3000): Change port with `pnpm dev -- -p 3001`
- Backend (8000): Change PORT in .env or use `uvicorn main:app --port 8001`

### OpenAI API Errors
- Verify OPENAI_API_KEY is correct
- Check API key has sufficient credits
- Ensure API key has access to the model

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
