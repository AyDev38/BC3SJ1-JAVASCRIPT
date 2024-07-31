const express = require('express');
const server = require('./server');
const path = require('path');

const app = express();
const baseUrl = '';

// Utiliser les middlewares et les routes définies dans server.js
app.use(`${baseUrl}/`, server);

// app.get(`${baseUrl}/*`, (req, res) => {
//     res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
// });

app.listen(3000, () => {
    console.info('server démarré');
});

module.exports = app;
