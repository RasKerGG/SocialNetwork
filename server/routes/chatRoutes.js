import express from 'express';
import { checkAuth } from '../checkAuth.js';
import {createChat,deleteChat,getChatById,removeUserFromChat,addUsersToChat} from '../controllers/chatController.js'


const chat_router = express.Router();
//Создать чат(владелец = админ)
chat_router.post('/',checkAuth, createChat)

//Добавить пользователя в групповой чат(админ)
chat_router.post('/:chatId', checkAuth, addUsersToChat);

//Удалить пользователя из чата(админ)
chat_router.delete('/:chatId', checkAuth, removeUserFromChat);

//Удалить чат (только админ)
chat_router.delete('/:chatId', checkAuth, deleteChat);
//получить информацию о чате
chat_router.get('/:chatId',checkAuth,getChatById)

export default chat_router