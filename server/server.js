const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve the client-side files
app.use(express.static(path.join(__dirname, '..', 'client'), {
    extensions: ['html', 'css', 'js'],
    setHeaders: (res, path, stat) => {
      if (path.endsWith('.css')) {
        res.set('Content-Type', 'text/css');
      } else if (path.endsWith('.js')) {
        res.set('Content-Type', 'application/javascript');
      }
    }
  }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// Define the /api/roads endpoint
// app.get('/api/roads', async (req, res) => {
//     try {
//         const response = await fetch('http://localhost:3001/api/roads');
//         const roads = await response.json();
//         res.json(roads);
//     } catch (error) {
//         console.error('Error in /api/roads route:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// Forward API requests to the api.js file
app.use('/api', require('./api'));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});