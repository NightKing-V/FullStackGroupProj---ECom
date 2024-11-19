const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Healthcheck endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello, Express API is running!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
