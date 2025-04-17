import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import sequelize from './config/db';
import curationRoutes from './routes/curation.routes';

// Load environment variables
dotenv.config(); 

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3008;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/curations', curationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'curation-service' });
});

// Database connection and server startup
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync models with database (in production, use migrations instead)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
      console.log('Database models synchronized.');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Curation service is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer(); 