import express from 'express'
import dotenv from 'dotenv'
import sequelize  from './db.js'
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js'; 
import User from './models/user.js';
import Post from './models/post.js';
import Like from './models/like.js';
import Comment from './models/comment.js';
import './models/index.js';
dotenv.config()
const app = express()

const PORT = process.env.PORT || 3000;
const HOST = process.env.DB_HOST||'localhost';

app.use(express.json()); //чтобы тестить через постман
app.get('/',function(req,res){
    res.send("Главная страница");
})

app.use('/auth', authRoutes);
app.use('/posts',postRoutes);



const start = async () =>{
    try {
        await sequelize.authenticate()
        await sequelize.sync({alter: true,logging:false})
        app.listen(PORT,()=>{
            console.log(`Сервер работает на порте: http://${HOST}:${PORT}`)
        })   
    } catch (error) {
        console.log('Ошибка запуска сервера:', error.message)    
    }
}

start()

