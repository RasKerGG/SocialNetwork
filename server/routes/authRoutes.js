import express from 'express';
import { register, login } from '../controllers/authController.js';
// import { createRole } from '../controllers/roleController.js';
import {loginValidation} from '../validations.js';

const router_auth = express.Router();

//auth

router_auth.post('/register', register);
router_auth.post('/login', loginValidation, login);
// router.post('/role',createRole)

export default router_auth;
