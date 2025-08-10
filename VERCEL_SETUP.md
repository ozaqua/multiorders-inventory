# Vercel Database Setup Guide

## 🚨 Current Issue
The application deploys successfully but shows "Failed to load data" because the database is not configured on Vercel.

## ✅ Quick Fix - Option 1: Vercel Postgres (Recommended)

### Step 1: Add Vercel Postgres
1. Go to your Vercel dashboard
2. Open your `multiorders-inventory` project
3. Go to **Storage** tab
4. Click **Create Database** 
5. Select **Postgres**
6. Create the database (this automatically adds `DATABASE_URL` environment variable)

### Step 2: Set up the Database Schema
After the database is created, you need to run these commands:

```bash
# In your local project
npm run db:generate
npm run db:push    # This creates the tables
npm run db:seed    # This adds sample data
```

### Step 3: Redeploy
The next deployment will have access to the database and all pages should work.

---

## ✅ Alternative - Option 2: Use Another Database

### Set Environment Variable
In Vercel dashboard → Settings → Environment Variables, add:
- **Name:** `DATABASE_URL`
- **Value:** `postgresql://username:password@host:port/database_name`

### Run Setup Commands
```bash
npm run db:push    # Creates tables
npm run db:seed    # Adds sample data
```

---

## 🔍 Error Diagnosis

The app now shows detailed error messages. Check browser console to see:
- `DATABASE_URL environment variable is not configured` - Need to set up database
- Other errors will help identify specific issues

---

## 🎯 Expected Result

After database setup, all pages should show data:
- **Dashboard:** Sales metrics and analytics
- **Inventory:** Product catalog with eBay/Shopify/Etsy platforms
- **Orders:** Order management
- **Products:** Bundle management
- **Customers:** Customer data (already working)