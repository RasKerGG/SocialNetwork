import express from 'express';
import dotenv from 'dotenv';
import sequelize from './db.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import User from './models/user.js';
import Post from './models/post.js';
import Like from './models/like.js';
import Comment from './models/comment.js';
import Message from './models/message.js';  // Импортируем модель Message
import './models/index.js';
import { Server } from "socket.io"; 
import http from "http"; // Добавляем http-сервер
import jwt from 'jsonwebtoken'
import {authenticateSocket} from './authenticateSocket.js'
import ChatParticipant from './models/chatParticipant.js'

dotenv.config();

const app = express();
// константы для сервера
const PORT = process.env.PORT || 3000;
const HOST = process.env.DB_HOST || 'localhost';
const JWT_SECRET = process.env.JWT_SECRET;
app.use(express.json()); // Чтобы тестить через Postman

// роуты
app.get('/', function(req, res) {
    res.send("Главная страница");
});

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/files', fileRoutes);
app.use('/meetings', meetingRoutes);
app.use('/messenger', chatRoutes); // чаты+сообщения в одном роуте


//функционал мессенджера
// После создания HTTP сервера
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Настройте правильно для production
    methods: ["GET", "POST"]
  }
});

// Аутентификация подключения
io.use(authenticateSocket);

// Обработка подключений
io.on('connection', (socket) => {
  console.log(`User ${socket.user.id} connected`);

  // Присоединяем пользователя к комнатам его чатов
  socket.on('joinChats', async () => {
    try {
      const userChats = await ChatParticipant.findAll({
        where: { userId: socket.user.id },
        attributes: ['chatId']
      });
      
      userChats.forEach(({ chatId }) => {
        socket.join(`chat_${chatId}`);
      });
    } catch (error) {
      console.error('Error joining chats:', error);
    }
  });

  // Обработка отправки сообщения
  socket.on('sendMessage', async ({ chatId, content }, callback) => {
    try {
      // Проверка прав доступа
      const isParticipant = await ChatParticipant.findOne({
        where: { chatId, userId: socket.user.id }
      });
      
      if (!isParticipant) {
        return callback({ error: 'Access denied' });
      }

      // Создание сообщения
      const message = await Message.create({
        chat_id: chatId,
        sender_id: socket.user.id,
        content
      });

      // Получаем полные данные сообщения с отправителем
      const fullMessage = await Message.findByPk(message.id, {
        include: [{ model: User, as: "sender", attributes: ["id", "name","email"]}]
      });

      // Рассылаем сообщение участникам чата
      io.to(`chat_${chatId}`).emit('newMessage', fullMessage);
      callback({ status: 'OK' });
    } catch (error) {
      console.error(error);
      callback({ error: 'Message sending failed' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.user.id} disconnected`);
  });
});



// запуск сервера
const start = async () => { // БД + сервер
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true, logging: false });
        server.listen(PORT, () => {
            console.log(`Сервер работает на порте: http://${HOST}:${PORT}`);
        });
    } catch (error) {
        console.log('Ошибка запуска сервера:', error.message);
    }
};

start()
