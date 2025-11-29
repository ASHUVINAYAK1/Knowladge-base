"""
Database initialization script
Run this to generate Prisma client and run migrations
"""

import subprocess
import sys
import os
from dotenv import load_dotenv

load_dotenv()

def run_command(command, description):
    print(f"\n{description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✓ {description} completed")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ {description} failed")
        if e.stderr:
            print(f"Error: {e.stderr}")
        return False

def main():
    print("=" * 60)
    print("Database Initialization")
    print("=" * 60)

    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("ERROR: DATABASE_URL not found in .env file")
        print("Please create a .env file with your database URL")
        return False

    print(f"\nDatabase URL: {db_url.split('@')[0]}@****")

    if not run_command("prisma db push", "Pushing database schema"):
        return False

    if not run_command("prisma generate", "Generating Prisma client"):
        return False

    print("\n" + "=" * 60)
    print("Database initialization completed successfully!")
    print("=" * 60)
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
