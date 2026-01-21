const express = require('express');
const QRCode = require('qrcode');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (index.html, script.js, style.css, etc.)
app.use(express.static(__dirname));

// API endpoint: any path starting with / (except static files) will generate a QR code
app.get('/*', async (req, res) => {
  // Get the full path after the domain, excluding the leading slash
  const urlToEncode = req.path.substring(1); // Remove leading '/'

  // If no path provided, serve the index.html
  if (!urlToEncode || urlToEncode === '') {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }

  // Check if this is a request for a static file
  const staticExtensions = ['.html', '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico'];
  const hasStaticExtension = staticExtensions.some(ext => urlToEncode.endsWith(ext));

  if (hasStaticExtension) {
    // Let express.static handle it
    return res.sendFile(path.join(__dirname, urlToEncode));
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

    // Set appropriate headers
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', qrBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

    // Send the PNG buffer
    res.send(qrBuffer);
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).send('Error generating QR code');
  }
});

app.listen(PORT, () => {
  console.log(`QR Generator API running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} for the web interface`);
  console.log(`API: http://localhost:${PORT}/<your-url> to get QR code PNG`);
});
