import express from 'express';
import { register, login } from '../controllers/authController.js';
// import { createRole } from '../controllers/roleController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
// router.post('/role',createRole)

export default router;
