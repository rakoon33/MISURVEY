const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true, 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Route imports
const indexRoute = require('./src/routes/index');
const authRoute = require('./src/routes/auth.route');
// Add other routes similarly...

// Register routes
app.use('/', indexRoute);
app.use('/api', authRoute);
// Register other routes similarly...

// Error handling middlewares
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
