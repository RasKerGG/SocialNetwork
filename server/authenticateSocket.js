import jwt from 'jsonwebtoken';
import User from './models/user.js';  // Импортируем модель пользователя для поиска в БД

// Функция для аутентификации пользователя через Socket.IOimport jwt from 'jsonwebtoken';

export const authenticateSocket = (socket, next) => {
    const token = socket.handshake.auth?.token || 
                 socket.handshake.query?.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      
      socket.user = {
        id: decoded.id,
        email: decoded.email
      };
      
      next();
    });
};


