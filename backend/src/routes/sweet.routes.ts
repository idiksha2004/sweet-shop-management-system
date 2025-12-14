// ... existing imports ...
import { 
  validateDto, 
  validateQueryParams,
  SweetQueryParams
} from '../utils/validation';

const router = Router();
const sweetController = new SweetController();

// Public routes
router.get(
  '/', 
  validateQueryParams(SweetQueryParams),
  sweetController.getAllSweets.bind(sweetController)
);

// ... rest of the routes ...