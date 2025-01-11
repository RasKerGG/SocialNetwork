import Comment from "../models/comment.js";
import User from "../models/user.js";
import { validationResult } from "express-validator";

export const createComment = async(req,res) =>{
   try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const{content} = req.body;
    const {postId} = req.params;
    const {id: user_id} = req.user;

    const newComment = await Comment.create({
        content,
        post_id:postId,
        user_id:user_id
    })
    res.status(201).json({ message: "Comment created", comment:newComment });
   } catch (error) {
    res.status(500).json({ error: error.message });
    } 
}

export const removeComment = async(req,res) =>{
    try {
    const {commentId} = req.params;
    const {id: user_id} = req.user;

    const comment = await Comment.findOne({where:{id:commentId}});

    if(!comment){
        return res.status(404).json({message:"Comment not found"})
      }
    if(comment.user_id !== user_id){
        return res.status(403).json({message:"You are not the author of this comment"})
      }
    await comment.destroy()
    return res.status(200).json({message:"The comment was successfully deleted"})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateComment = async(req,res) =>{

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {commentId} = req.params;
      const {id: user_id} = req.user; 
      const {content} = req.body;
  
      const comment = await Comment.findOne({where:{id:commentId}});
  
      if(!comment){
        return res.status(404).json({message:"Comment not found"})
      }
      if(comment.user_id !== user_id ){
        return res.status(403).json({message:"You are not the author of this comment"})
      }
  
      comment.content = content || comment.content; 
     await comment.save()
     return res.status(200).json({message: "Comment updated",comment})
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
      
}

export const getComments = async(req,res) =>{
    try {
        const { postId } = req.params;  
        const comments = await Comment.findAll({
            where: { post_id: postId },  // убедись, что имя поля соответствует базе данных
            include: [
              {
                model: User,
                as: 'author',
                attributes: ['name', 'email']
              }
            ]
          });
        res.json(comments);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}