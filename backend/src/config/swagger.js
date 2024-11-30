// src/config/swagger.js

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: Express API
 *   description: This is a sample Express API with Swagger documentation
 *   version: 1.0.0
 * servers:
 *   - url: 'http://localhost:5000'
 */

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API',
      version: '1.0.0',
      description: 'This is a sample Express API with Swagger documentation',
    },
    servers: [
      {
        url: 'http://localhost:5000',  // You can change this depending on your environment
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/routes/**/*.js'],  // Path to the route files for auto-documentation
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Function to set up Swagger UI
const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = setupSwagger;
