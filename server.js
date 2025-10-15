const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const SAFETYCULTURE_TOKEN = 'ff2c033264f7579db1aebaa402ece3f89c1b5d0871d293022e8394934d61706d';

// GET audit
app.get('/api/audit/:id', async (req, res) => {
  const auditId = req.params.id;
  try {
    const response = await fetch(`https://api.safetyculture.io/audits/${auditId}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${SAFETYCULTURE_TOKEN}`
      }
    });

    if (!response.ok) return res.status(response.status).json({ error: 'Failed to fetch audit data' });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching audit:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST audit
app.post('/api/audit', async (req, res) => {
  const auditItems = req.body.items; 
  const auditData = {
    template_id: 'a5715a03c5fc454082b4eaf260e3bc61', 
    items: auditItems
  };

  try {
    const response = await fetch('https://api.safetyculture.io/audits', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': `Bearer ${SAFETYCULTURE_TOKEN}`
      },
      body: JSON.stringify(auditData)
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to create audit' });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error posting audit:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
