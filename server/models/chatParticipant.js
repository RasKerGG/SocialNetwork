import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const ChatParticipant = sequelize.define('ChatParticipant', {
    role: {
        type: DataTypes.ENUM('admin','member'),// роли для групповых чатов
        defaultValue: 'member',// по дефолту просто участник
    },
    joined_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    userId: {  // Добавляем userId для связи с пользователем
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default ChatParticipant
