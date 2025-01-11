import express from 'express';
import { uploadFile,downloadFile,getAllFiles,getOneFile } from '../controllers/fileController.js';
import multer from 'multer';
import path from 'path';
import { checkAuth } from '../checkAuth.js';



//multer для загрузки на сервер
const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,`uploads/knowledge`); 
    },
    filename:(req,file,cb) =>{
        cb(null,Date.now()+ '-'+file.originalname);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 },// 100 мб ограничение
});

const router_file = express.Router();

router_file.post('/upload',checkAuth, upload.single('file'), uploadFile);

router_file.get('/download/:fileId',checkAuth,downloadFile);

router_file.get('',getAllFiles)

router_file.get('/file/:fileId',getOneFile);

export default router_file;