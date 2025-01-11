import File from "../models/file.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';  // Для получения пути из import.meta.url
import { Model } from "sequelize";
import User from "../models/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFile = (req, res) => {
    const { file } = req;
  
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  
    const newFile = {
      name: file.originalname,
      path: file.path,
      author_id: req.user.id, 
    };

    File.create(newFile)
      .then((fileRecord) => {
        res.status(201).json({ message: 'File uploaded successfully', file: fileRecord });
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error saving file to the database' });
      });
  };

  export const downloadFile = async (req, res) => {
    const { fileId } = req.params;  

    try {
        // Ищем файл в базе данных по ID
        const fileRecord = await File.findByPk(fileId);

        if (!fileRecord) {
            return res.status(404).json({ error: 'File not found in database' });
        }

       
        const filePath = path.join(__dirname, '..', fileRecord.path);  
        console.log('File path:', filePath);  

        try {
         
            await fs.promises.access(filePath, fs.constants.F_OK);  

            // Отдаем файл пользователю
            return res.download(filePath, fileRecord.name, (err) => {
                if (err) {
                    console.error("Download error:", err);  
                    return res.status(500).json({ error: 'Error downloading file' });
                }
            });

        } catch (err) {
            console.error('File not found on server:', err); 
            return res.status(404).json({ error: 'File not found on server' });
        }

    } catch (error) {
        console.error('Error retrieving file from database:', error);  
        return res.status(500).json({ error: 'Error retrieving file from database' });
    }
};

export const getAllFiles = async(req,res) =>{
    try {
      const files = await File.findAll({})
      res.json(files);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

export const getOneFile = async(req,res) =>{
  try {
    const {fileId} = req.params;
    const file = await File.findOne({
      where:{id:fileId},
      include:{
        model:User,
        as:'author',
        attributes: ['id','name','email']
      }
    
    })
    if(!file){
      return res.status(404).json({message:"file not found"})
    }

    const fileResponse = {
      id: file.id,
      name: file.name,
      path: file.path,
      author: file.author ? {  
        name: file.author.name,
        email: file.author.email,
      } : null,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,                  
    };
    res.json(fileResponse)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
