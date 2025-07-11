const express = require('express');
const { PythonShell } = require('python-shell');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;

// 🧠 POST /predict - Predict price
app.post('/predict', (req, res) => {
  const input = req.body;
  console.log('📥 Request received:', input);

  const options = {
    mode: 'text',
    pythonOptions: ['-u'],
    scriptPath: '../python',
    args: [JSON.stringify(input)]
  };

  console.log('🚀 Sending input to Python:', options.args[0]);

  let output = '';

  const pyshell = new PythonShell('predict.py', options);

  pyshell.on('message', (message) => {
    output += message;
  });

  pyshell.end((err) => {
    if (err) {
      console.error('❌ Python error:', err);
      return res.status(500).json({ error: 'Python script failed' });
    }

    const estimated_price = parseFloat(output);
    if (isNaN(estimated_price)) {
      return res.status(500).json({ error: 'Invalid model output' });
    }

    console.log('✅ Prediction from Python:', estimated_price);
    res.json({ estimated_price });
  });
});

// 🌍 GET /get_locations - Send location list from columns.json
app.get('/get_locations', (req, res) => {
  const filePath = path.join(__dirname, '../ml_model/columns.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Failed to read columns.json:', err);
      return res.status(500).json({ error: 'Unable to load locations' });
    }

    try {
      const parsed = JSON.parse(data);
      const locations = parsed.data_columns.slice(3); // Skip sqft, bath, bhk
      res.json({ locations });
    } catch (parseErr) {
      console.error('❌ JSON parse error:', parseErr);
      res.status(500).json({ error: 'Malformed columns.json' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Node server running at http://localhost:${PORT}`);
});
