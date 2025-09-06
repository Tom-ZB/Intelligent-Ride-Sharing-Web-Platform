const { expressjwt} = require("express-jwt");

const authMiddleware = expressjwt({
    secret: process.env.JWT_SECRET,      // 从 .env 中读取 JWT 密钥
    algorithms: ["HS256"],              // 使用的加密算法（默认 HS256）
    requestProperty: "user",            // 解码后的用户信息会挂载到 req.user
    getToken: (req) => {
        //console.log("authenticateToken执行了");
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1]; // 从 Bearer Token 中提取
        }
        return null;
    }
});
module.exports = authMiddleware;

