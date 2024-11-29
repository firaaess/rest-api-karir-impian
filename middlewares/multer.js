import multer from "multer";

const storage = multer.memoryStorage();

// Konfigurasi untuk mendukung multiple fields
export const singleUpload = multer({ storage }).fields([
  { name: "profilePhoto", maxCount: 1 }, // Field untuk foto profil
  { name: "resume", maxCount: 1 }, // Field untuk resume
]);
