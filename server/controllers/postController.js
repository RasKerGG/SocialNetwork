import User from "../models/user.js";
import Post from "../models/post.js";

// export const getAllPosts = async(req,res) =>{
//     try {
//         res.send("Лента постов")
//     } catch (error) {
        
//     }
// }
export const createPost = async(req,res) =>{
        try {
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
export const getAllPosts = async (req, res) => {
    try {
      const posts = await Post.findAll({
        include: [{ model: User, as:'author', attributes: ['name', 'email'] }] // данные автора
      });
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };