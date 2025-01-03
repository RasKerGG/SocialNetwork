import express from 'express'
import dotenv from 'dotenv'
import sequelize  from './db.js'
import authRoutes from './routes/authRoutes.js'; 
dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json());//чтобы тестить через постман

app.get('/',function(req,res){
    res.send("Главная страница");
})

app.use('/auth', authRoutes); 



const start = async () =>{
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT,()=>{
            console.log(`Сервер работает на порте: ${PORT}`)
        })   
    } catch (e) {
        console.log('Ошибка запуска сервера:', error.message)    
    }
}

start()

