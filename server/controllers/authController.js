import User from "../models/user.js";
import bcrypt from "bcrypt";

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
    });

    res
      .status(201)
      .json({ message: "Пользователь успешно зарегистрирован", user });
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

    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
