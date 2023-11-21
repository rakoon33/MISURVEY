const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { database } = require('./src/config');
const cors = require('cors')
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')

dotenv.config();

const app = express();
app.use(cookieParser());

const swaggerDocs = require('./src/documents/swagger.js');

// Add CORS configuration 
app.use(cors({
  origin: 'http://localhost:8082', // Allow only this domain
  credentials: true, // This is important for sending cookies with CORS
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// routes
const indexRoute = require('./src/routes/index.js');
const authRoute = require('./src/routes/auth.route');
const companyRoute = require('./src/routes/company.route');
const userRoute = require('./src/routes/user.route');
const companyRoleRoute = require('./src/routes/companyRole.route.js');
const moduleRoute = require('./src/routes/module.route');
const individualPermissionRoute = require('./src/routes/individualPermission.route.js')

// view engine setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Use the consolidated routes
app.use('/', indexRoute);
app.use('/api', authRoute);
app.use('/api/companies', companyRoute);
app.use('/api/users', userRoute);
app.use('/api/companyRoles', companyRoleRoute);
app.use('/api/modules', moduleRoute);
app.use('/api/permissions', individualPermissionRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  swaggerDocs(app, PORT);
  database.sequelize.sync()
    .then(() => {
      console.log('Database synced');
    })
    .catch(err => {
      console.error('Database sync failed:', err);
    });
});

