const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { version } = require("../../package.json");

const path = require("path");

// Construct the absolute path to route files
const routeFilesPath = path.join(__dirname, "../routes/*.js");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API Docs",
      version,
    },
  },
  apis: [routeFilesPath], // sử dụng ký tự đại diện * để chỉ định tất cả các file có phần mở rộng là .route.js trong thư mục routes
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
  // Swagger page
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Docs available at http://localhost:${port}/api-docs`);
}

module.exports = swaggerDocs;
