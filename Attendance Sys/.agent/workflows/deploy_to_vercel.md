---
description: Guide to deploying the Attendance System to Vercel
---

# Deploying to Vercel

This workflow guides you through deploying your MERN stack application to Vercel.

## Prerequisites

1.  **MongoDB Atlas URI**: You cannot use the local/embedded database on Vercel. You must have a connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  **GitHub Repository**: Your code needs to be pushed to GitHub.

## Step 1: specific Vercel Configuration Check

We have verified that your `vercel.json` is configured to:
- Build the frontend using `@vercel/static-build`.
- Deploy the backend as a Serverless Function via `@vercel/node`.

## Step 2: Push Code to GitHub

You mentioned issues with "large files". This usually happens when uploading manually. Using Git directly solves this.

Run the following commands in your terminal (one by one):

```powershell
# 1. Check status (ensure node_modules is not listed)
git status

# 2. Add all changes
git add .

# 3. Commit changes
git commit -m "Prepare for Vercel deployment"

# 4. Push to GitHub (ensure you have added the remote origin)
# If you haven't linked your repo yet, run:
# git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin master
```

## Step 3: Import Project in Vercel

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Select your GitHub repository (`Attendance Sys` or whatever you named it).
4.  **Framework Preset**: It might auto-detect `Vite` or `Other`. If it selects Vite, that's fine for the frontend, but we have a custom `vercel.json` that usually takes precedence.
5.  **Root Directory**: Leave as `./`.

## Step 4: Environment Variables (CRITICAL)

In the Vercel Project content configuration scan:
1.  Expand the **"Environment Variables"** section.
2.  Add the key: `MONGODB_URI`
3.  Add the value: Your MongoDB Atlas Connection String (e.g., `mongodb+srv://user:pass@cluster...`).
4.  (Optional) Add `JWT_SECRET` if you use it for authentication.

## Step 5: Deploy

Click **Deploy**.

## Troubleshooting

- **500 Errors on API**: Check Vercel Logs. It heavily implies a database connection failure. Ensure `MONGODB_URI` is correct and your IP Access List in MongoDB Atlas allows `0.0.0.0/0` (Access from Anywhere).
