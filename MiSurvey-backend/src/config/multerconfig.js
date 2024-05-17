const multer = require('multer');

// Cấu hình lưu trữ tạm thời cho Multer
const storage = multer.memoryStorage();

// Khởi tạo Multer với cấu hình lưu trữ tạm thời
const upload = multer({ storage: storage });

module.exports = upload;

