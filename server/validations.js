import { body } from "express-validator";

export const loginValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
];
export const postValidation = [
  body("content","Контент поста должен быть минимум 1 символ").isLength({
    min: 1,
  })
]
