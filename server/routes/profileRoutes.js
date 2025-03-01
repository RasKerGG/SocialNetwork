import express from 'express';
import { getUserProfile } from '../controllers/ProfileController.js';

const profile_router = express.Router();

// Маршрут для получения информации о пользователе
profile_router.get('/users/:id', getUserProfile);

export default profile_router;
