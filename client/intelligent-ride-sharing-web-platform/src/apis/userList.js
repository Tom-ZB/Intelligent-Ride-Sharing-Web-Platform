import { request } from "../utils";

// 获取所有用户（仅管理员可访问）/Fetch all users (accessible by admin only)
export function getAllUsersAPI() {
    return request({
        url: '/admin/users',
        method: 'GET'
    });
}

// 封禁用户（调用后端封禁接口，后端会处理 status 改为 inactive）/Ban user (call backend ban API, backend will set status to inactive)
export function banUserAPI(userId) {
    return request({
        url: `/admin/users/${userId}/ban`,
        method: 'PATCH'
    });
}

// 解封用户（调用后端解封接口，后端会处理 status 改为 active）/Unban user (call backend unban API, backend will set status to active)
export function unbanUserAPI(userId) {
    return request({
        url: `/admin/users/${userId}/unban`,
        method: 'PATCH'
    });
}

