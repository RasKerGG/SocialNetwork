import express from 'express';
import { sendMessage, getChatMessages } from '../controllers/messageController.js';
import { checkAuth } from '../checkAuth.js';

const router_message = express.Router({ mergeParams: true });

// Отправка сообщения
router_message.post("/", checkAuth, sendMessage); 

// Получение сообщений чата
router_message.get("/", checkAuth, getChatMessages); 

export default router_message;
