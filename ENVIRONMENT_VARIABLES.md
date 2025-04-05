# Netlify Environment Variables Guide

This document explains how to properly set up environment variables for the Ultra Stream web application on Netlify.

## Required Environment Variables

The following environment variables must be set in your Netlify site settings:

- `REACT_APP_API_KEY`: Firebase API key
- `REACT_APP_AUTHDOMAIN`: Firebase auth domain
- `REACT_APP_PROJECTID`: Firebase project ID
- `REACT_APP_STORAGEBUCKET`: Firebase storage bucket
- `REACT_APP_MESSAGINGSENDERID`: Firebase messaging sender ID
- `REACT_APP_APPID`: Firebase app ID
- `REACT_APP_MEASUREMENTID`: Firebase measurement ID

## Setting Environment Variables in Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** > **Build & deploy** > **Environment**
3. Add each variable with its corresponding value
4. Make sure to click **Save** after adding each variable

## Important Notes

- Environment variable names are case-sensitive
- The `REACT_APP_` prefix is required for Create React App to recognize these variables
- Environment variables are only available at build time, not runtime
- The application has been updated to handle missing environment variables gracefully during build

## Verifying Environment Variables

After setting the environment variables, trigger a new build by:

1. Going to the **Deploys** tab in your Netlify dashboard
2. Clicking **Trigger deploy** > **Deploy site**

Check the build logs to ensure the environment variables are being properly accessed.

## Troubleshooting

If you encounter issues with environment variables:

1. Verify that all variable names match exactly (including the `REACT_APP_` prefix)
2. Check the build logs for any error messages related to environment variables
3. Ensure you've saved the environment variables in Netlify
4. Try clearing the build cache and redeploying

## Local Development

For local development:

1. Copy `.env.example` to `.env.local`
2. Fill in your Firebase configuration values
3. Run `npm start` to start the development server

The `.env.local` file should not be committed to version control.