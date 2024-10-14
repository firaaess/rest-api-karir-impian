// multer.js
import multer from 'multer';

const storage = multer.memoryStorage();
export const singleUpload = multer({ storage }).single('file'); // 'file' is the field name
