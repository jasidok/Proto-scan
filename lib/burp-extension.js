import http from 'http';

// This is a simple script to demonstrate how to send data from Burp to our validator
// In a real Burp extension, you would use the Burp Extender API in Java/Python

function sendToBurpExtension(requestData) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(requestData);
    
    const options = {
      hostname: 'localhost',
      port: 8090,
      path: '/scan',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve(parsedData);
        } catch (error) {
          reject(new Error('Failed to parse response: ' + error.message));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(data);
    req.end();
  });
}

// Example usage
async function testExample() {
  try {
    const results = await sendToBurpExtension({
      targetUrl: 'http://example.com/search?q=PAYLOAD',
      cookies: [
        { name: 'session', value: 'test-session', domain: 'example.com', path: '/' }
      ],
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      method: 'GET'
    });
    
    console.log('XSS Test Results:', results);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example if this file is executed directly
if (process.argv[1] === import.meta.url.substring(7)) {
  testExample();
}