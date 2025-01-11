import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import User from './user.js';


const Post = sequelize.define('Post',{
    content:{
      type: DataTypes.STRING,
      allowNull:false
      
    },
    author_id:{
        type: DataTypes.INTEGER,
        references:{
          model:User,
          key:'id'
        },
        allowNull:false
    },
    likeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0, 
    },
})

export default Post