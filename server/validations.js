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

export const meetingValidation = [
  body("title","Название встречи должно содержать хотя бы 5 символов.").isLength({
    min: 5
  }),
  body("start_time","Необходимо указать время встречи").notEmpty(),
]
