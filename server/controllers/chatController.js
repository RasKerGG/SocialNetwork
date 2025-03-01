import Chat from '../models/chat.js';
import ChatParticipant from '../models/chatParticipant.js';
import User from '../models/user.js';

export const createChat = async (req, res) => {
    const { type, name, userIds } = req.body;
    const { id: user_id } = req.user;

    try {
        if (type === 'private' && userIds.length !== 2) {
            return res.status(400).json({ message: 'A private chat must contain exactly two participants' });
        }
        if (type === 'group' && (!name || userIds.length < 2)) {
            return res.status(400).json({ message: 'A group chat must have a name and at least two participants' });
        }

        // Для личного чата проверка на существование
        if (type === 'private') {
            const existingChat = await Chat.findOne({
                where: { type: 'private' },
                include: [
                    {
                        model: ChatParticipant,
                        as: 'participants',
                        where: { userId: userIds[0] },
                    },
                    {
                        model: ChatParticipant,
                        as: 'participants',
                        where: { userId: userIds[1] },
                    },
                ],
            });

            if (existingChat) {
                return res.status(400).json({ message: 'A private chat between these users already exists' });
            }
        }

        // Создание чата
        const chat = await Chat.create({
            type,
            name: type === 'group' ? name : null, // имя будет только для группового чата
        });

        // Массив участников
        const participants = userIds.map(userId => ({
            chatId: chat.id,
            userId,
            role: 'member', // У всех участников роль "member"
        }));

        // Если это групповой чат, то добавляем создателя как админа
        if (type === 'group') {
            // Проверим, есть ли создатель чата в списке участников
            const adminAlreadyAdded = participants.some(p => p.userId === user_id);
            
            if (!adminAlreadyAdded) {
                participants.push({
                    chatId: chat.id,
                    userId: user_id, // создающий чат всегда становится администратором
                    role: 'admin',
                });
            } else {
                // Если создатель уже в списке участников, то его роль меняем на "admin"
                const adminParticipant = participants.find(p => p.userId === user_id);
                adminParticipant.role = 'admin';
            }
        }

        // Добавляем участников в базу данных
        await ChatParticipant.bulkCreate(participants); 

        res.status(201).json(chat); // Ответ с созданным чатом
    } catch (error) {
        res.status(500).json({ message: 'Error when creating a chat', error });
    }
};


export const deleteChat = async (req, res) => {
    const { chatId } = req.params;  // Получаем chatId из параметров
    const { id: user_id } = req.user;  // Получаем id пользователя из токена

    try {
        // Находим чат по ID
        const chat = await Chat.findByPk(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Проверяем, если это групповой чат, то ищем администратора
        if (chat.type === 'group') {
            const admin = await ChatParticipant.findOne({ 
                where: { chatId, userId: user_id, role: 'admin' }
            });

            // Если администратор не найден, то возвращаем ошибку
            if (!admin) {
                return res.status(403).json({ message: 'Only admins can delete group chats' });
            }
        }

        // Удаляем чат и всех его участников
        await ChatParticipant.destroy({ where: { chatId } });  // Удаляем всех участников
        await Chat.destroy({ where: { id: chatId } });  // Удаляем сам чат

        // Отправляем успешный ответ
        res.json({ message: 'Chat deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting chat', error });
    }
};

export const addUsersToChat = async (req, res) => {
    const { chatId } = req.params
    const {userIdsToAdd} = req.body; // chatId — ID чата, userIdsToAdd — массив пользователей
    const { id: user_id } = req.user; // получаем ID текущего пользователя (администратора)

    try {
        // Ищем чат по ID
        const chat = await Chat.findByPk(chatId);
        
        // Если чат не найден
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Проверка, что чат групповой
        if (chat.type !== 'group') {
            return res.status(400).json({ message: 'This action is only allowed for group chats' });
        }

        // Проверка, что текущий пользователь — администратор чата
        const admin = await ChatParticipant.findOne({
            where: { chatId, userId: user_id, role: 'admin' }
        });

        if (!admin) {
            return res.status(403).json({ message: 'Only admins can add users to the chat' });
        }

        // Для каждого пользователя из массива проверяем, не является ли он уже участником чата
        const usersAlreadyInChat = [];
        const usersToAdd = [];

        for (let userId of userIdsToAdd) {
            const existingParticipant = await ChatParticipant.findOne({
                where: { chatId, userId }
            });

            if (existingParticipant) {
                usersAlreadyInChat.push(userId); // если пользователь уже участник, добавляем в массив для отчета
            } else {
                usersToAdd.push(userId); // если пользователя нет, добавляем в очередь на добавление
            }
        }

        if (usersToAdd.length > 0) {
            // Добавляем новых пользователей в чат
            await ChatParticipant.bulkCreate(
                usersToAdd.map(userId => ({
                    chatId,
                    userId,
                    role: 'member',
                }))
            );
        }

        // Отправляем ответ с результатами
        res.status(200).json({
            message: 'Users added to the chat successfully',
            usersAlreadyInChat, // Возвращаем список пользователей, которые уже были участниками
            usersToAdd, // Возвращаем список пользователей, которые были успешно добавлены
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding users to chat', error });
    }
};


export const removeUserFromChat = async (req, res) => {
    const { chatId } = req.params 
    const {userIdToRemove } = req.body;
    const { id: user_id } = req.user; 

    try {
        // Ищем чат по ID
        const chat = await Chat.findByPk(chatId);
        
        // Если чат не найден
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Проверяем, что чат групповой
        if (chat.type !== 'group') {
            return res.status(400).json({ message: 'This action is only allowed for group chats' });
        }

        // Проверяем, что текущий пользователь — администратор чата
        const admin = await ChatParticipant.findOne({
            where: { chatId, userId: user_id, role: 'admin' }
        });

        if (!admin) {
            return res.status(403).json({ message: 'Only admins can remove users from group chats' });
        }

        // Проверяем, что администратор не пытается удалить себя
        if (userIdToRemove === user_id) {
            return res.status(400).json({ message: 'Admin cannot remove themselves from the chat' });
        }

        // Проверяем, что пользователь, которого нужно удалить, действительно является участником чата
        const participant = await ChatParticipant.findOne({
            where: { chatId, userId: userIdToRemove }
        });

        if (!participant) {
            return res.status(404).json({ message: 'User is not a participant in this chat' });
        }

        // Удаляем пользователя из чата
        await ChatParticipant.destroy({
            where: { chatId, userId: userIdToRemove }
        });

        res.json({ message: 'User removed from chat' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing user from chat', error });
    }
};



export const getChatById = async (req, res) => {
    const { chatId } = req.params;

    try {
        const chat = await Chat.findByPk(chatId, {
            include: [
                {
                    model: ChatParticipant,
                    as: 'participants', // Используем alias
                    attributes: ['id','role'],
                    include: [
                        {
                            model: User, // Добавляем модель User
                            as: 'user',  // Предполагаем, что у ChatParticipant есть связь с User
                            attributes: ['name', 'email'], // Выбираем нужные атрибуты
                        }
                    ]
                },
            ],
        });

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        res.json(chat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching chat', error });
    }
};


export const getUserChats = async (req, res) => {
    const { id: user_id } = req.user; 

    try {
        // Получаем все чаты, c отбором по пользователю
        const chats = await Chat.findAll({
            include: [
                {
                    model: ChatParticipant,
                    as: 'participants',
                    where: { userId: user_id }, // Фильтр по пользователю
                    attributes: [], // Исключаем ненужные поля
                },
            ],
        });

        res.json(chats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user chats', error });
    }
};



