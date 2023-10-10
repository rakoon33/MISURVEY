const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const db = require('./src/config/database');  // Import the database configuration

//import test
const test = require('./src/services/user.service');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Cấu hình thư mục public
app.use(express.static(path.join(__dirname, './public')));

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Your routes and other middlewares go here



// test functions
(async () => {
    try {
      const user = await test.getUserByUsername('john_doe');
      const email = user.dataValues.Email;
      console.log(email);
    } catch (error) {
      console.error('Error:', error.message);
    }
})();

// Test database connection and start the server
db.sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    });
