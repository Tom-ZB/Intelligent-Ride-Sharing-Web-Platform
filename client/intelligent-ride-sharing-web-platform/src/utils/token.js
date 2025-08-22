//封装token相关的方法，存，取，删除

const TOKEN_KEY = "token";
const EXPIRE_KEY = "token_expire";

export function setToken(token, expiresInSeconds = 600) { //60秒过期
    const expireAt = Date.now() + expiresInSeconds * 1000; // 过期时间戳
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXPIRE_KEY, expireAt);
}

export function getToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    const expireAt = localStorage.getItem(EXPIRE_KEY);

    if (!token || !expireAt) return null;

    if (Date.now() > parseInt(expireAt)) {
        removeToken(); // token 已过期
        return null;
    }

    return token;
}

export function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRE_KEY);
}
