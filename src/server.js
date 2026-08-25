require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const port = Number(process.env.PORT) || 5000;

const start = async () => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

  try {
    if (process.env.MONGO_URI) {
      await connectDB();
    } else {
      console.warn('MONGO_URI is not set; starting without a database connection');
    }

  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
};

start();