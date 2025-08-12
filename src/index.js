const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Blog API',
            version: '1.0.0',
            description: 'A minimal backend blog application with Express.js, Prisma ORM, and JWT authentication',
            contact: {
                name: 'API Support',
                email: 'support@blogapi.com'
            }
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./src/routes/*.js'], // Path to the API files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Blog API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
    .topbar-wrapper { display: none; }
    .swagger-ui .topbar { display: none; }
  `
}));

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const a = require('./routes/posts');
app.use('/posts', a);
// Test route first
app.get('/', (req, res) => {
    res.json({
        message: 'Blog API is running!',
        version: '1.0.0',
        status: 'OK'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});