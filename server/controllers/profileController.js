import User from "../models/user.js"

export const getUserProfile = async (req, res) => {
    try {
      const userId = req.params.id; // Получаем ID пользователя из параметров запроса
  
      // Ищем пользователя в базе данных
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password_hash'] }, 
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
        res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };