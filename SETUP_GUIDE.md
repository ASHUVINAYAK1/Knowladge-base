# Setup Guide - Knowledge Base RAG System

This guide will walk you through setting up and running the Knowledge Base system.

## Required Environment Variables

You need to configure the following environment variables before running the application:

### Frontend Environment Variables

Edit `apps/frontend/.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# AWS S3 Configuration (for file uploads)
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your_aws_access_key_id_here
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_S3_BUCKET_NAME=your_s3_bucket_name_here
```

**How to get AWS credentials:**
1. Log in to AWS Console
2. Go to IAM → Users → Create User
3. Attach policy: `AmazonS3FullAccess`
4. Create access key and copy the credentials
5. Create an S3 bucket and copy its name

### Backend Environment Variables

Edit `apps/api/.env`:

```env
# OpenAI API Key (REQUIRED)
OPENAI_API_KEY=sk-your_openai_api_key_here

# PostgreSQL Database URL
DATABASE_URL=postgresql://postgres:password@localhost:5432/knowledge_base

# Server Configuration
HOST=0.0.0.0
PORT=8000

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000
```

**How to get OpenAI API Key:**
1. Go to https://platform.openai.com
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it in the .env file

**Database URL Format:**
```
postgresql://[username]:[password]@[host]:[port]/[database_name]
```

For local development with default PostgreSQL:
```
postgresql://postgres:your_postgres_password@localhost:5432/knowledge_base
```

## Step-by-Step Setup

### Step 1: Install PostgreSQL

1. Download PostgreSQL from https://www.postgresql.org/download/
2. Install and remember your postgres user password
3. Open pgAdmin or command line
4. Create database:
   ```sql
   CREATE DATABASE knowledge_base;
   ```

### Step 2: Configure Environment Files

1. Open `apps/api/.env` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=sk-your_actual_key_here
   ```

2. Update DATABASE_URL with your PostgreSQL password:
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/knowledge_base
   ```

3. Open `apps/frontend/.env.local` and add your AWS credentials:
   ```env
   NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your_key
   NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your_secret
   NEXT_PUBLIC_S3_BUCKET_NAME=your_bucket
   ```

### Step 3: Initialize Database

Open a terminal in `apps/api`:

```bash
# Activate virtual environment
venv\Scripts\activate

# Run database initialization
python init_db.py
```

This will:
- Push the Prisma schema to your PostgreSQL database
- Generate the Prisma Python client
- Create all necessary tables

### Step 4: Start the Backend

Open Terminal 1 in `apps/api`:

```bash
# Option 1: Use the batch script
start.bat

# Option 2: Manual start
venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

Test it by visiting: http://localhost:8000
You should see: `{"message": "Knowledge Base API is running"}`

### Step 5: Start the Frontend

Open Terminal 2 in `apps/frontend`:

```bash
# Option 1: Use the batch script
start.bat

# Option 2: Manual start
pnpm dev
```

You should see:
```
  ▲ Next.js 16.0.5
  - Local:        http://localhost:3000
```

### Step 6: Access the Application

Open your browser and go to:
- **Frontend**: http://localhost:3000
- **Backend API Docs**: http://localhost:8000/docs

You will be automatically redirected to the Dashboard page.

## Testing the Integration

### Test 1: Dashboard
1. Navigate to http://localhost:3000
2. You should see the Dashboard with statistics (all showing 0 initially)

### Test 2: Ask AI Chat
1. Click on "Ask AI" in the sidebar
2. Type a message in the chat input (e.g., "Hello, how are you?")
3. Press Enter or click Send
4. You should see:
   - Your message appears on the right (blue bubble)
   - AI response streams in on the left (gray bubble)

### Test 3: File Upload (Optional - requires S3 setup)
1. In the Ask AI page, click "Attach File"
2. Select a file
3. Click "Upload"
4. The file will be uploaded to your S3 bucket
5. A message with the file URL will be sent

## Troubleshooting

### Backend won't start

**Error: `ModuleNotFoundError: No module named 'fastapi'`**
- Solution: Make sure virtual environment is activated
  ```bash
  cd apps/api
  venv\Scripts\activate
  pip install -r requirements.txt
  ```

**Error: `Could not connect to database`**
- Solution: Check PostgreSQL is running
- Verify DATABASE_URL in `.env` is correct
- Test connection: `psql -U postgres -d knowledge_base`

**Error: `Invalid API key`**
- Solution: Check OPENAI_API_KEY in `.env`
- Make sure there are no extra spaces
- Verify the key works at https://platform.openai.com

### Frontend won't start

**Error: `Cannot find module`**
- Solution: Install dependencies
  ```bash
  cd apps/frontend
  pnpm install
  ```

**Error: `Port 3000 already in use`**
- Solution: Kill the process or use a different port
  ```bash
  pnpm dev -- -p 3001
  ```

### Chat not working

**Error: `Failed to get response`**
1. Check backend is running (http://localhost:8000)
2. Check browser console for errors
3. Verify NEXT_PUBLIC_API_URL in frontend/.env.local
4. Check CORS settings in backend

**AI not responding:**
1. Check OpenAI API key is valid
2. Check you have credits in your OpenAI account
3. Look at backend terminal for error messages

### File upload not working

1. Verify AWS credentials are correct
2. Check S3 bucket exists and is accessible
3. Verify bucket permissions allow uploads
4. Check browser console for errors

## Environment Variables Checklist

Before running the application, make sure you have configured:

**Backend (`apps/api/.env`):**
- ✅ OPENAI_API_KEY (get from https://platform.openai.com)
- ✅ DATABASE_URL (your PostgreSQL connection string)
- ✅ PORT (default: 8000)
- ✅ ALLOWED_ORIGINS (default: http://localhost:3000)

**Frontend (`apps/frontend/.env.local`):**
- ✅ NEXT_PUBLIC_API_URL (default: http://localhost:8000)
- ⚠️ NEXT_PUBLIC_AWS_ACCESS_KEY_ID (optional - only for file uploads)
- ⚠️ NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY (optional - only for file uploads)
- ⚠️ NEXT_PUBLIC_AWS_REGION (optional - only for file uploads)
- ⚠️ NEXT_PUBLIC_S3_BUCKET_NAME (optional - only for file uploads)

## Quick Start Commands

```bash
# Terminal 1 - Backend
cd apps/api
venv\Scripts\activate
python init_db.py    # First time only
uvicorn main:app --reload

# Terminal 2 - Frontend
cd apps/frontend
pnpm dev
```

## Next Steps

Once everything is running:

1. **Explore the Dashboard**: See the overview of your knowledge base
2. **Chat with AI**: Go to Ask AI and start asking questions
3. **Upload Files**: Use the file upload feature to add documents (requires S3)
4. **Customize**: Modify the code to fit your specific needs

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the error messages in the terminal
3. Check the browser console for frontend errors
4. Verify all environment variables are set correctly

Happy coding! 🚀
