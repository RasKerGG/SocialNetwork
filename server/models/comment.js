import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import User from "./user.js";
import Post from "./post.js";

const Comment = sequelize.define("Comment", {
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
    allowNull: false,
  },
  post_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Post,
      key: "id",
    },
    allowNull: false,
  },
});

export default Comment
