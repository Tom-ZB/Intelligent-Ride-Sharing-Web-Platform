// apis/matches.js
import { request } from "../utils";

// 获取用户的匹配行程列表/Fetch the user's matched trip list
export function getMatchesByUserAPI(userId) {
    return request({
        url: `/matches?userId=${userId}`,
        method: "GET"
    });
}

// 获取单个匹配详情/Fetch single match detail
export function getMatchByIdAPI(id) {
    return request({
        url: `/matches/${id}`,
        method: "GET"
    });
}

// 创建匹配请求/Create match request
export function createMatchAPI(formData) {
    return request({
        url: "/matches",
        method: "POST",
        data: formData
    });
}

// 更新匹配状态/Update match status
export function updateMatchStatusAPI(id, status) {
    return request({
        url: `/matches/${id}/status`,
        method: "PATCH",
        data: { status }
    });
}

// 删除匹配/Delete match
export function deleteMatchAPI(id) {
    return request({
        url: `/matches/${id}`,
        method: "DELETE"
    });
}

// 获取全部匹配数据/Fetch all match data
export function getAllMatchesAPI() {
    return request({
        url: "/matches/all",
        method: "GET"
    });
}
