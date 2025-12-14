// ... existing imports ...
import authRoutes from './routes/auth.routes';
import sweetRoutes from './routes/sweet.routes';

class App {
  // ... existing code ...

  private initializeRoutes() {
    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({ status: 'ok', timestamp: new Date() });
    });

    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/sweets', sweetRoutes);
  }

  // ... rest of the code ...
}