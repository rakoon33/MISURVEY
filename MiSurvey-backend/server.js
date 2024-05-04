const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { database } = require('./src/config');
const cors = require('cors')
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const swaggerDocs = require('./src/documents/swagger.js');
const PORT = process.env.PORT || 3000;
const app = express();


dotenv.config();

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:8082',
  credentials: true, 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"]
}));

const indexRoute = require('./src/routes/index.js');
const authRoute = require('./src/routes/auth.route');
const companyRoute = require('./src/routes/company.route');
const userRoute = require('./src/routes/user.route');
const companyRoleRoute = require('./src/routes/companyrole.route.js');
const moduleRoute = require('./src/routes/module.route');
const individualPermissionRoute = require('./src/routes/individualPermission.route.js')
const companyUserRoute = require('./src/routes/companyUser.route.js');
const surveyRoute = require('./src/routes/survey.route.js');
const surveyResponseRoute = require('./src/routes/surveyResponse.route.js');
const surveyQuestionRoute = require('./src/routes/surveyQuestion.route.js');
const customerRoute = require('./src/routes/customer.route.js');
const questionTemplateRoute = require('./src/routes/questionTemplate.route.js');
const reportRoute = require('./src/routes/report.route.js');
const userActivityLogRoute = require('./src/routes/userActivityLog.route.js');
const servicePackageRoute = require('./src/routes/servicePackage.route.js');
const userPackageRoute = require('./src/routes/userPackage.route.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRoute);
app.use('/api', authRoute);
app.use('/api/companies', companyRoute);
app.use('/api/users', userRoute);
app.use('/api/companyRoles', companyRoleRoute);
app.use('/api/modules', moduleRoute);
app.use('/api/permissions', individualPermissionRoute);
app.use('/api/companyusers', companyUserRoute);
app.use('/api/survey', surveyRoute);
app.use('/api/responses', surveyResponseRoute);
app.use('/api/questions', surveyQuestionRoute);
app.use('/api/customers', customerRoute);
app.use('/api/questionTemplate', questionTemplateRoute);
app.use('/api/dashboard', reportRoute);
app.use('/api/useractivitylogs', userActivityLogRoute);
app.use('/api/servicepackages', servicePackageRoute);
app.use('/api/userpackages', userPackageRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Set up Swagger documentation
swaggerDocs(app, PORT);

// Start the server and sync database
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  database.sequelize.sync()
    .then(() => {
      console.log('Database synced');
    })
    .catch(err => {
      console.error('Database sync failed:', err);
    });
});

