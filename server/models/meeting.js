import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Meeting = sequelize.define('Meeting',{
    title:{
        type: DataTypes.STRING,
        allowNull:false 
      },
    description:{
        type: DataTypes.STRING,
        allowNull:true
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull:false
    },
    date:{
        type: DataTypes.DATE,
        allowNull:false
    }
})

export default Meeting