import Post from "./post.js";
import User from "./user.js";
import Role from "./role.js";
import Like from "./like.js";
import File from "./file.js";
import Meeting from "./meeting.js";
import UserMeetings from './userMeetings.js'; 
import Comment from "./comment.js";
import Chat from "./chat.js";
import ChatParticipant from "./chatParticipant.js"

// Связь пользователя с ролью (один ко многим)
User.belongsTo(Role,{
    foreignKey: 'role_id',
    as: 'role'
  })

Role.hasMany(User,{
    foreignKey: 'role_id',
    as: 'users'
})
//  ПОСТЫ
//Связь пользователя с постом (один ко многим)
User.hasMany(Post,{
  foreignKey: 'author_id',
  as: 'posts'
})

Post.belongsTo(User,{
  foreignKey: 'author_id',
  as: 'author'
})

// связь лайков
Like.belongsTo(User,{ 
    foreignKey: 'user_id', 
    as: 'user' 
});  

Like.belongsTo(Post, { 
  foreignKey: 'post_id', 
  as: 'post' 
});

// связь с комментариями
Comment.belongsTo(User, { 
  foreignKey: 'user_id', 
  as: 'author' 
});
Comment.belongsTo(Post, { 
  foreignKey: 'post_id', 
  as: 'post' 
});   

//связь с файлами
User.hasMany(File,{
  foreignKey: 'author_id',
  as: 'files'
})

File.belongsTo(User,{
  foreignKey: 'author_id',
  as: 'author'
})
// связь с встречей(или ивентом) и промежуточная таблица для встреч, потому что может быть несколько пользователей
User.belongsToMany(Meeting,{
  through: UserMeetings,
  as: 'meetings',
  foreignKey: 'user_id',
})

Meeting.belongsToMany(User,{
  through: UserMeetings,
  as: 'participants',
  foreignKey: 'meeting_id'
})

//связи для мессенджера

Chat.hasMany(ChatParticipant, { 
    foreignKey: 'chatId', 
    as: 'participants' 
});
ChatParticipant.belongsTo(Chat, { 
  foreignKey: 'chatId', 
  as: 'chat'
});
ChatParticipant.belongsTo(User, {  // связь с моделью User
  foreignKey: 'userId', // поле userId, которое ссылается на модель User
  as: 'user',
});


//другие связи
