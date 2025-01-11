import User from "../models/user.js";
import Post from "../models/post.js";
import { validationResult } from "express-validator";
export const createPost = async(req,res) =>{
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
            const { content } = req.body;
            const { id: user_id } = req.user;  // достаем из токена
        
            // Создаем пост с привязкой к пользователю
            const newPost = await Post.create({
              content,
              author_id: user_id,
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