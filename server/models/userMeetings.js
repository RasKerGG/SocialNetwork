import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const UserMeetings = sequelize.define('UserMeetings', {}); // ПРОМЕЖУТОЧНАЯ ТАБЛИЦА, ключи user_id, meeting_id

export default UserMeetings;