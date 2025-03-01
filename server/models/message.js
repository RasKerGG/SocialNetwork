import { DataTypes } from "sequelize";
import sequelize from "../db.js";


const Message = sequelize.define("Message",{
    chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false, 
    },
    content:{
        type:DataTypes.STRING,
        allowNull: false
    }
})

export default Message