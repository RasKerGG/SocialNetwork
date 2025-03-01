import express from 'express';
import { register, login } from '../controllers/authController.js';
// import { createRole } from '../controllers/roleController.js';
import {loginValidation} from '../validations.js';
import multer from 'multer';


//мультер для аватаров(вообще как это middleware,но я решил пойти костылем)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars/');  
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname); 
  },
});

const upload = multer({ storage: storage });

const router_auth = express.Router();

//auth

router_auth.post('/register',upload.single('avatar'), register);
router_auth.post('/login', loginValidation, login);
// router.post('/role',createRole)

export default router_auth;
