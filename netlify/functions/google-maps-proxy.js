// Google Maps API proxy to protect API key
const https = require('https');
const url = require('url');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': process.env.URL || '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  try {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // Parse the querystring parameters
    const params = event.queryStringParameters || {};
    
    // Check for required parameters
    if (!params.endpoint || !params.address) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    // Validate endpoint to prevent abuse
    const allowedEndpoints = ['geocode', 'staticmap'];
    if (!allowedEndpoints.includes(params.endpoint)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid endpoint' })
      };
    }

    // Build the Google Maps API URL based on the endpoint
    let apiUrl;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    if (params.endpoint === 'geocode') {
      apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(params.address)}&key=${apiKey}`;
    } else if (params.endpoint === 'staticmap') {
      // For static maps, include optional zoom parameter
      const zoom = params.zoom || '15';
      apiUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(params.address)}&zoom=${zoom}&size=600x300&markers=color:red|${encodeURIComponent(params.address)}&key=${apiKey}`;
    }

    // Forward the request to Google Maps API
    const response = await new Promise((resolve, reject) => {
      const req = https.get(apiUrl, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            body: data,
            headers: res.headers
          });
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.end();
    });

    // Add CORS headers to the response
    return {
      statusCode: response.statusCode,
      headers: {
        ...headers,
        'Content-Type': response.headers['content-type'] || 'application/json'
      },
      body: response.body
    };
  } catch (error) {
    console.error('Error proxying Google Maps request:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
}; 