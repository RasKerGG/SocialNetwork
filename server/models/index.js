import Post from "./post.js";
import User from "./user.js";
import Role from "./user.js";

// Связь пользователя с ролью (один ко многим)
User.BelongsTo(Role,{
    foreignkey: 'role_id',
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



//другие связи
