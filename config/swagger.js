// config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Admin Backend API',
      version: '1.0.0',
      description: 'Swagger documentation for Admin Backend APIs',
    },
    servers: [
      {
        url: 'http://localhost:5000', // change if needed
      },
    ],
  },
  apis: ['./routes/*.js'], // where Swagger will read comments
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
