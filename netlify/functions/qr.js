const QRCode = require('qrcode');

exports.handler = async (event, context) => {
  // Get the URL from the path parameter (splat from redirect)
  // The path comes from the :splat in the redirect rule
  const urlToEncode = event.path.replace('/.netlify/functions/qr/', '');

  // If no URL provided, return error
  if (!urlToEncode || urlToEncode === '' || urlToEncode === '/') {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No URL provided' }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }

  try {
    // Generate QR code as PNG buffer
    const qrBuffer = await QRCode.toBuffer(urlToEncode, {
      type: 'png',
      width: 1200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H' // High error correction for better quality
    });

    // Return the PNG image
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': qrBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000'
      },
      body: qrBuffer.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error('Error generating QR code:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error generating QR code' }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }
};
