const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('/api', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Handle any requests that don't match the above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
