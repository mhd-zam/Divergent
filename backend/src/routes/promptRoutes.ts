import { Router } from 'express';
import { handlePrompt } from '../controllers/promptController';

const router = Router();

router.post('/prompt', handlePrompt);

export default router;
