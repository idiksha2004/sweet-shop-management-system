import { Router } from 'express';
import { AuthController, auth } from '../controllers/auth.controller';
import { RegisterDto, LoginDto } from '../types/auth';
import { validateDto } from '../utils/validation';

const router = Router();
const authController = new AuthController();

// Register a new user
router.post(
  '/register',
  validateDto(RegisterDto),
  authController.register.bind(authController)
);

// Login user
router.post(
  '/login',
  validateDto(LoginDto),
  authController.login.bind(authController)
);

// Protected route example
router.get('/me', auth, (req, res) => {
  res.json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});

export default router;