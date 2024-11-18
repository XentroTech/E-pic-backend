const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Epic API Documentation",
      version: "1.0.0",
      description: "This is the API documentation for the Epic application.",
      contact: {
        name: "Support Team",
        email: "support@e-pic.co",
      },
    },
    tags: [
      {
        name: "Cart Routes",
        description: "Routes for managing the shopping cart.",
      },
      {
        name: "Category Routes",
        description: "Routes for managing categories.",
      },
      {
        name: "Coin Routes",
        description: "Routes for managing coins.",
      },
    ],
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Development server",
      },
      {
        url: "https://e-pic.co/api/v1",
        description: "Production server",
      },
    ],
  },
  apis: [
    "./Routes/cartRoutes.js",
    "./Routes/categoryRoutes.js",
    "./Routes/coinRoutes.js",
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
