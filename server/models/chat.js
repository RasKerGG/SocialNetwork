import { DataTypes } from "sequelize";
import sequelize from "../db.js";


const Chat = sequelize.define("Chat",{
    type: {
        type: DataTypes.ENUM('group', 'private'),
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true, // Для личных чатов не нужен 
    },
})

export default Chat
