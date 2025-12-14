// ... existing imports ...
import { validateDto } from '../utils/validation';

export class AuthController {
  private authService = new AuthService();

  async register(req: Request, res: Response) {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await this.authService.login(req.body);
      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        status: 'error',
        message: error.message || 'Authentication failed',
      });
    }
  }
}

// Update the routes to use validation
export const authController = new AuthController();