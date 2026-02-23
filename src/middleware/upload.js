import multer from "multer";

// store file temporarily in memory
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10mb limit
});

export default upload;