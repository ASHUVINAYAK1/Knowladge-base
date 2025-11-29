# Quick Start Guide

## Current Status

Your environment variables are configured! Now let's get the system running.

## Option 1: Run Without Database (Quick Test)

You can test the chat functionality without setting up PostgreSQL first.

### Step 1: Start the Backend

Open a terminal and run:

```bash
cd "c:\Users\Admin\Downloads\my-projects\Knowladge-base\apps\api"
venv\Scripts\activate
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will start even without database connection (database is only used for storing conversations, not required for chat to work).

### Step 2: Start the Frontend

Open a **new terminal** and run:

```bash
cd "c:\Users\Admin\Downloads\my-projects\Knowladge-base\apps\frontend"
pnpm dev
```

### Step 3: Test It!

Open your browser to: http://localhost:3000

1. Click on "Ask AI" in the sidebar
2. Type a message like "Hello, how are you?"
3. You should see the AI respond with streaming text!

## Option 2: Full Setup with Database

If you want to store conversations in the database:

### Step 1: Update Database Credentials

You need to update the PostgreSQL password in:
`apps/api/.env`

Change line 2 from:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/knowledge_base
```

To (replace `YOUR_ACTUAL_PASSWORD` with your PostgreSQL password):
```
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/knowledge_base
```

### Step 2: Create the Database

Open PostgreSQL (pgAdmin or psql) and run:
```sql
CREATE DATABASE knowledge_base;
```

### Step 3: Initialize Database Schema

```bash
cd "c:\Users\Admin\Downloads\my-projects\Knowladge-base\apps\api"
venv\Scripts\activate
venv\Scripts\prisma db push
venv\Scripts\prisma generate
```

### Step 4: Start Everything

Now follow Option 1 steps to start backend and frontend.

## What's Already Configured

✅ OpenAI API Key - Configured
✅ AWS S3 Credentials - Configured (Asia Pacific Hyderabad region)
✅ Frontend Environment - Ready
✅ Backend Environment - Ready

## Quick Test Checklist

- [ ] Backend running at http://localhost:8000
- [ ] Frontend running at http://localhost:3000
- [ ] Can navigate to Ask AI page
- [ ] Can send messages and get AI responses
- [ ] File upload button appears (S3 upload ready)

## Troubleshooting

### Backend won't start
- Make sure virtual environment is activated: `venv\Scripts\activate`
- Check if port 8000 is available
- Look at the error message in the terminal

### Frontend won't start
- Run `pnpm install` in the frontend directory
- Check if port 3000 is available
- Try `pnpm dev -- -p 3001` to use a different port

### Chat not responding
- Check that backend is running (http://localhost:8000 should show a JSON message)
- Open browser DevTools and check Console for errors
- Verify OpenAI API key is valid

### File upload not working
- File upload UI will appear but needs database to store file references
- You can still test the upload - it will upload to S3 but won't save to database

## Next Steps

Once everything is running:

1. **Test the chat** - Send messages and see AI responses
2. **Try file upload** - Upload a file to your S3 bucket
3. **Setup database** - Follow Option 2 to enable conversation storage

## Need Help?

Check the detailed guides:
- [README.md](README.md) - Full documentation
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup instructions
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Technical details

Happy coding! 🚀
