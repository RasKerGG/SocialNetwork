import User from "../models/user.js";
import bcrypt from "bcrypt"; //модель и bcrypt
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()
const JWT_SECRET_KEY = process.env.JWT_SECRET


const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET_KEY, {
    expiresIn: '1h', // время работы токена
  });
};

// Регистрация пользователя
export const register = async (req, res) => {
  try {
    const { name, surname, email, password, departament, position, skills } =
      req.body;

    // Проверка существования email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const defaultRole = 1; // 1 - пользователь

    // Хэширование пароля
    const password_hash = await bcrypt.hash(password, 10);

    // Создание пользователя
    const user = await User.create({
      name,
      surname,
      email,
      password_hash,
      departament,
      position,
      skills,
      role_id: defaultRole,
    });

    // Генерация токена
    const token = generateToken(user);

   
    const { password_hash:_, ...userData } = user.dataValues; 

    // Отправка успешного ответа
    res
      .status(201)
      .json({ message: "Registration was successful", user: userData, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Логин пользователя
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверка существования пользователя
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    const { password_hash:_, ...userData } = user.dataValues; 

    res.json({ message: "Login successful", user:userData, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
