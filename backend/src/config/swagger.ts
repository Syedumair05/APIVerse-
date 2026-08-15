import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'APIVerse Backend REST API',
      version: '1.0.0',
      description: 'Production-ready REST API gateway for REST Countries API, caching, analytics, and MongoDB user favorites.',
      contact: {
        name: 'APIVerse Developer Team',
        url: 'https://github.com/Syedumair05/APIVerse-',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server',
      },
    ],
    components: {
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
            message: { type: 'string', example: 'Operation completed successfully' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'COUNTRY_NOT_FOUND' },
                message: { type: 'string', example: 'Country with code XYZ was not found.' },
              },
            },
          },
        },
        Favorite: {
          type: 'object',
          properties: {
            countryCode: { type: 'string', example: 'IND' },
            countryName: { type: 'string', example: 'India' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
