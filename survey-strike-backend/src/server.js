const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Cấu hình thư mục public
app.use(express.static(path.join(__dirname, '../public')));

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Your routes and other middlewares go here

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});