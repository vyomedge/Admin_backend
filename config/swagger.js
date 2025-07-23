// swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0", // or swagger: "2.0"
    info: {
      title: "Admin API",
      version: "1.0.0",
      description: "API documentation for Admin Panel",
    },
    servers: [
      {
        url: "http://localhost:3000", // change to your server URL
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // adjust this path to where your route files are
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
