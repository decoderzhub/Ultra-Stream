# Netlify Deployment Guide for Ultra Stream Web

This document provides instructions for deploying the Ultra Stream web application to Netlify.

## Automatic Deployment from GitHub

The easiest way to deploy the Ultra Stream web application is to connect your Netlify account to the GitHub repository:

1. Log in to your Netlify account at [https://app.netlify.com/](https://app.netlify.com/)
2. Click "Add new site" > "Import an existing project"
3. Select "GitHub" as the Git provider
4. Authorize Netlify to access your GitHub account if prompted
5. Select the "Ultra-Stream" repository
6. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
7. Click "Deploy site"

Netlify will automatically detect the `netlify.toml` configuration file in the repository, which already contains the correct build settings.

## Manual Deployment

If you prefer to deploy manually:

1. Install the Netlify CLI:
   ```
   npm install netlify-cli -g
   ```

2. Log in to your Netlify account:
   ```
   netlify login
   ```

3. Navigate to the project directory:
   ```
   cd Ultra-Stream
   ```

4. Build the project:
   ```
   npm run build
   ```

5. Deploy to Netlify:
   ```
   netlify deploy --prod
   ```

## Environment Variables

You may need to set the following environment variables in your Netlify site settings:

- `REACT_APP_FIREBASE_API_KEY`: Firebase API key
- `REACT_APP_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `REACT_APP_FIREBASE_PROJECT_ID`: Firebase project ID
- `REACT_APP_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `REACT_APP_FIREBASE_APP_ID`: Firebase app ID
- `REACT_APP_FIREBASE_MEASUREMENT_ID`: Firebase measurement ID

To set these variables:
1. Go to your site dashboard in Netlify
2. Navigate to Site settings > Build & deploy > Environment
3. Add each variable and its value

## Custom Domain

To set up a custom domain:

1. Go to your site dashboard in Netlify
2. Navigate to Domain settings
3. Click "Add custom domain"
4. Follow the instructions to configure your DNS settings

## Continuous Deployment

Netlify automatically sets up continuous deployment from your GitHub repository. Any changes pushed to the main branch will trigger a new build and deployment.

To change this behavior:
1. Go to your site dashboard in Netlify
2. Navigate to Site settings > Build & deploy > Continuous Deployment
3. Modify the settings as needed

## Troubleshooting

If you encounter issues with your deployment:

1. Check the build logs in Netlify for errors
2. Verify that all environment variables are correctly set
3. Ensure the build command and publish directory are correctly configured
4. Check that the `netlify.toml` file is present in the repository

## Support

For additional help, refer to the [Netlify documentation](https://docs.netlify.com/) or contact the repository owner.