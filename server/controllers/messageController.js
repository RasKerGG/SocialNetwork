import Message from "../models/message.js";
import Chat from "../models/chat.js";
import User from "../models/user.js";
import ChatParticipant from "../models/chatParticipant.js";

export const sendMessage = async (req, res) => {
    try {
        const {chat_id } = req.params;
        const {content} = req.body;
        const sender_id = req.user.id; // ID отправителя из `req.user`, если используешь auth middleware

        // Проверяем, существует ли чат
        const chat = await Chat.findByPk(chat_id);
        console.log(chat_id)
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Создаём сообщение
        const message = await Message.create({ chat_id, sender_id, content });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: "Error when sending a message", error });
    }
}

export const getChatMessages = async (req, res) => {
    try {
        const { chat_id } = req.params;
        const user_id = req.user.id;

        // Проверка участия в чате
        const isParticipant = await ChatParticipant.findOne({
            where: { 
                chatId: chat_id,
                userId: user_id 
            }
        });

        if (!isParticipant) {
            return res.status(403).json({ message: "Доступ запрещен" });
        }

        const messages = await Message.findAll({
            where: { chat_id: chat_id },
            include: [{ 
                model: User, 
                as: "sender", 
                attributes: ["id", "name","email"] 
            }],
            order: [['createdAt', 'ASC']] // Сортировка по времени
        });

        res.json(messages);
    } catch (error) {
        console.error('Ошибка получения сообщений:', error);
        res.status(500).json({ 
            message: "Ошибка сервера", 
            error: error.message 
        });
    }
};


