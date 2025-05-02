# Google Maps Integration Setup Guide

This document explains how to set up Google Maps integration for montessorifind.com.

## Prerequisites

- A Google Cloud Platform account
- Google Maps API key with the following APIs enabled:
  - Maps JavaScript API
  - Geocoding API
  - Maps Embed API

## Getting Your API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials** and select **API Key**
5. Restrict your API key to only the necessary APIs for better security

## Setting Up for Local Development

1. Create a `.env.local` file in the root of your project (do not commit this file)
2. Add your Google Maps API key:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

## Setting Up for Netlify Deployment

1. Log in to your Netlify dashboard
2. Go to your site settings
3. Navigate to **Build & deploy > Environment variables**
4. Add a new variable:
   - Key: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - Value: Your Google Maps API key
5. Deploy your site after adding the variable

## Enhanced Security with Netlify Functions

We've implemented a Netlify Function proxy (`google-maps-proxy.js`) to add an extra layer of security for your Google Maps API key. This proxy:

1. Prevents direct exposure of your API key in client-side code
2. Validates requests before forwarding them to Google Maps
3. Restricts the types of API requests that can be made

### Using the Proxy Function

Instead of calling Google Maps API directly from the client, you can use the proxy:

```javascript
// Instead of calling Google Maps API directly
fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`)

// Use the proxy function
fetch(`/.netlify/functions/google-maps-proxy?endpoint=geocode&address=${address}`)
```

The proxy supports the following endpoints:
- `geocode`: For geocoding addresses
- `staticmap`: For generating static map images

## Troubleshooting

If maps are not displaying correctly, check:

1. The API key is correctly set up in Netlify environment variables
2. Your API key has the required APIs enabled
3. The API key restrictions (if any) allow your domain to access the Maps API
4. Check browser console for any error messages related to Google Maps
5. Check the Netlify function logs for any errors related to the proxy function

## Fallback Mechanism

Our implementation includes a fallback to a static map if the JavaScript API fails to load. This ensures users still see a map even if there are issues with the JavaScript API.

## API Key Security

- Never commit your API key to your Git repository
- Always use environment variables
- Consider restricting your API key by:
  - HTTP referrers (your domain)
  - IP addresses
  - Specific APIs
- Use the provided Netlify Function proxy for enhanced security

For more information, see the [Google Maps API documentation](https://developers.google.com/maps/documentation). 