import { request } from "../utils";

// 获取所有用户（仅管理员可访问）
export function getAllUsersAPI() {
    return request({
        url: '/admin/users',
        method: 'GET'
    });
}

// 封禁用户（调用后端封禁接口，后端会处理 status 改为 inactive）
export function banUserAPI(userId) {
    return request({
        url: `/admin/users/${userId}/ban`,
        method: 'PATCH'
    });
}

// 解封用户（调用后端解封接口，后端会处理 status 改为 active）
export function unbanUserAPI(userId) {
    return request({
        url: `/admin/users/${userId}/unban`,
        method: 'PATCH'
    });
}

