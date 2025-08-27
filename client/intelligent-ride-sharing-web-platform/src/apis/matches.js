// apis/matches.js
import { request } from "../utils";

// 获取用户的匹配行程列表
export function getMatchesByUserAPI(userId) {
    return request({
        url: `/matches?userId=${userId}`,
        method: "GET"
    });
}

// 获取单个匹配详情
export function getMatchByIdAPI(id) {
    return request({
        url: `/matches/${id}`,
        method: "GET"
    });
}

// 创建匹配请求
export function createMatchAPI(formData) {
    return request({
        url: "/matches",
        method: "POST",
        data: formData
    });
}

// 更新匹配状态
export function updateMatchStatusAPI(id, status) {
    return request({
        url: `/matches/${id}/status`,
        method: "PATCH",
        data: { status }
    });
}

// 删除匹配（如果需要）
export function deleteMatchAPI(id) {
    return request({
        url: `/matches/${id}`,
        method: "DELETE"
    });
}
