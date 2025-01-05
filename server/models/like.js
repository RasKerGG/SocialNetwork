import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import User from "./user.js";
import Post from "./post.js";

const Like = sequelize.define(
  "Like",
  {
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
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["user_id", "post_id"],
      },
    ],
  }
);

export default Like;
