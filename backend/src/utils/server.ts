import app from './app';
import { createConnection } from 'typeorm';
import 'reflect-metadata';

const PORT = process.env.PORT || 5000;

// Initialize database connection and start server
createConnection()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed', error);
    process.exit(1);
  });