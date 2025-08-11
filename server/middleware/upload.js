const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 设置存储位置和文件名
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../public/image');
        // 自动创建目录（递归方式）
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // 确保唯一文件名
    }
});

// 文件类型过滤（仅允许图片，不阻断路由）
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true); // 接收文件
    } else {
        // 不接收文件，但不中断路由
        cb(null, false);
        // 你也可以在 req 上加个标记，方便后面判断
        req.fileValidationError = 'Only image files are allowed!';
    }
};

// single：一次只允许上传一张 且前端上传的图片的参数名（key值）必须是 avatar
const upload = multer({ storage, fileFilter });

module.exports = upload;
