import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import User from "./user.js";

const File = sequelize.define('File',{
    name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
    path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author_id:{
    type: DataTypes.INTEGER,
    references:{
      model:User,
      key:'id'
    },
    allowNull:false
}
})

export default File