import File from "../models/file.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';  // Для получения пути из import.meta.url

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFile = (req, res) => {
    const { file } = req;
    const { category } = req.body;
  
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
    const { fileId } = req.params;  // Получаем ID файла из параметров запроса

    try {
        // Ищем файл в базе данных по ID
        const fileRecord = await File.findByPk(fileId);

        if (!fileRecord) {
            return res.status(404).json({ error: 'File not found in database' });
        }

        // Строим путь к файлу, убираем лишний "uploads/knowledge/"
        const filePath = path.join(__dirname, '..', fileRecord.path);  // Путь без повторяющихся каталогов
        console.log('File path:', filePath);  // Логируем путь к файлу

        try {
            // Проверяем, существует ли файл на сервере
            await fs.promises.access(filePath, fs.constants.F_OK);  // Проверка на существование файла

            // Отдаем файл пользователю
            return res.download(filePath, fileRecord.name, (err) => {
                if (err) {
                    console.error("Download error:", err);  // Логируем ошибку
                    return res.status(500).json({ error: 'Error downloading file' });
                }
            });

        } catch (err) {
            console.error('File not found on server:', err);  // Логируем ошибку
            return res.status(404).json({ error: 'File not found on server' });
        }

    } catch (error) {
        console.error('Error retrieving file from database:', error);  // Логируем ошибку
        return res.status(500).json({ error: 'Error retrieving file from database' });
    }
};
