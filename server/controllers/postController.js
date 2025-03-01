import User from "../models/user.js";
import Post from "../models/post.js";
import { validationResult } from "express-validator";
import path from 'path';
import { fileURLToPath } from 'url'; 
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url); // Полный путь к текущему файлу
const __dirname = path.dirname(__filename); // Директория текущего файла

export const createPost = async(req,res) =>{
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
            const { content } = req.body;
            const { id: user_id } = req.user;  // достаем из токена
        
            let imagePath = null;
            if (req.file) {
              imagePath = req.file.path;
              console.log(imagePath)
            }
            // Создаем пост с привязкой к пользователю
            const newPost = await Post.create({
              content,
              author_id: user_id,
              image: imagePath
            });
        
            res.status(201).json({ message: "Post created", post: newPost });
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
}
export const getAllPosts = async (req, res) => { // лента постов
    try {
      const posts = await Post.findAll({
        include: [{ model: User, as:'author', attributes: ['name', 'email'] }] // данные автора
      });
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
export const getOnePost = async(req,res) =>{
    try {
      const {id} = req.params;
      const post = await Post.findOne({ where: {id}})

      if(!post){
        return res.status(404).json({message:"Post not found"})
      }

      return res.status(200).json({post})
    } catch (error) {
      res.status(500).json({ error: error.message });

    }
}
export const updatePost = async(req,res) =>{

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {id} = req.params;
    const { id: user_id } = req.user;  // достаем из токена
    const {content} = req.body;

    const post = await Post.findOne({ where: {id}});

    if(!post){
      return res.status(404).json({message:"Post not found"})
    }
    if(post.author_id !== user_id ){
      return res.status(403).json({message:"You are not the author of this post"})
    }

   post.content = content || post.content; 

   // Если загружено новое изображение
   if (req.file) {
    // Удаляем старое изображение, если оно существует
    if (post.image) {
      const oldImagePath = path.join(__dirname, '..', post.image); // Полный путь к старому изображению
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error('Failed to delete old image:', err);
        }
      });
    }
    post.image = req.file.path;
  }

   await post.save()

   return res.status(200).json(post)

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
    
}
export const removePost = async(req,res) => {
  try {
    const {id} = req.params;
    const { id: user_id } = req.user;
  
    const post = await Post.findOne({where:{id}});
  
    if(!post){
      return res.status(404).json({message:"Post not found"})
    }
    if(post.author_id !== user_id){
      return res.status(403).json({message:"You are not the author of this post"})
    }
  
    await post.destroy()
    return res.status(200).json({message:"The post was successfully deleted"})

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
 
} 