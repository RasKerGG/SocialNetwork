import User from "./user.js";
import Role from "./user.js";

// Связь пользователя с ролью
User.BelongsTo(Role,{
    foreignkey: 'role_id',
    as: 'role_id'
  })

Role.hasMany(User,{
    foreignKey: 'role_id',
    as: 'users'
})

//другие связи
