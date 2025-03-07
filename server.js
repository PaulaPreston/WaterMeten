const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;
const app = express();
const port = 3000;

// Add CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://script.google.com');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

app.use(bodyParser.json());
// ...existing code...

// Serve the index.html file for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/saveMeasurement', async (req, res) => {
  const data = req.body.data;
  try {
    // Read existing data
    const jsonData = await fs.readFile('data.json', 'utf8');
    const measurements = JSON.parse(jsonData);
    
    // Add new measurement
    measurements.measurements.push(data);
    
    // Write updated data back to file
    await fs.writeFile('data.json', JSON.stringify(measurements, null, 2));
    
    res.send('Opgeslagen!');
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Fout bij het opslaan van de meting.');
  }
});
// ...existing code...
app.get('/getData', async (req, res) => {
    try {
      const jsonData = await fs.readFile('data.json', 'utf8');
      res.json(JSON.parse(jsonData));
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Error reading data' });
    }
  });
  // ...existing code...
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

