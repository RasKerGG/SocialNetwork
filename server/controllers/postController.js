import User from "../models/user.js";
import Post from "../models/post.js";

export const getAllPosts = async(req,res) =>{
    try {
        res.send("Лента постов")
    } catch (error) {
        
    }
}