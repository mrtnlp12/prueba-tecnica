const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');

const app = express();

app.use(compression());
app.use(helmet());
app.use(cors()); 
app.use(express.json());

app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));

module.exports = app;