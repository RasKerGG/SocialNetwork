import { body } from "express-validator";

export const loginValidation = [
  body("email", "Неверный email или пароль.").isEmail(),
  body("password", "Неверный email или пароль.").isLength({
    min: 5,
  }),
];
export const postValidation = [
  body("content","Контент поста должен содержать хотя бы 1 символ.").isLength({
    min: 1,
  })
]

export const commentValidation = [
  body("content","Текст комментария должен содержать хотя бы 1 символ.").isLength({
    min: 1,
  })
]
