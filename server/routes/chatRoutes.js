import express from 'express';
import { checkAuth } from '../checkAuth.js';
import { createChat, deleteChat, getChatById, removeUserFromChat, addUsersToChat,getUserChats } from '../controllers/chatController.js';
import router_message from "./messageRoutes.js";

const chat_router = express.Router();

// Создать чат (владелец = админ)
chat_router.post('/', checkAuth, createChat);

// Добавить пользователя в групповой чат (админ)
chat_router.post('/:chatId', checkAuth, addUsersToChat);

// Удалить пользователя из чата (админ)
chat_router.delete('/:chatId', checkAuth, removeUserFromChat);

// Удалить чат (только админ)
chat_router.delete('/:chatId', checkAuth, deleteChat);

// Получить информацию о чате
chat_router.get('/:chatId', checkAuth, getChatById);

// Подключаем маршруты сообщений с правильным путем
chat_router.use("/:chat_id/messages", router_message);

//получение чатов пользователя
chat_router.get('/',checkAuth,getUserChats)

export default chat_router;
