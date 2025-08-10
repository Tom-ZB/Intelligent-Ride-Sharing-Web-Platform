const multer = require('multer');
const path = require('path');

// 设置存储位置和文件名
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname,'../public/image')); // 头像保存目录
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // 确保唯一文件名
    }
});

// 文件类型过滤（仅允许图片）
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};
//single：一次只允许上传一张 且前端上传的图片的参数名（key值）必须是avatar
const upload = multer({ storage, fileFilter });

module.exports = upload;
