import Like from '../models/like.js';
import Post from "../models/post.js";

export const addLike = async(req,res) => {
    try {
        const {postId} = req.params;
        const {id: user_id} = req.user;

        const existingLike =  await Like.findOne({where:{post_id:postId,user_id}});
        if(existingLike){
            return res.status(400).json({message:"You already liked this post"});
        } else{
            const like = await Like.create({post_id:postId,user_id});
            await Post.increment('likeCount', { by: 1, where: { id: postId } });
            res.status(201).json({message:"Liked success",like})
        }
       
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const removeLike = async(req,res) =>{
    const {postId} = req.params;
    const {id: user_id} = req.user;

    const like = await Like.findOne({where:{post_id:postId,user_id}});
    if(!like){
        return res.status(404).json({ message: "Like not found" });
    }
    await like.destroy()
    const post = await Post.findByPk(postId);
    if (post.likeCount > 0) {
      await Post.decrement('likeCount', { by: 1, where: { id: postId } });
    }
    res.status(200).json({message:"Like removed success"})
}