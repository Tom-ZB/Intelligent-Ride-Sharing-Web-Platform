import { request } from "../utils";

// 获取当前用户的未读消息
export function getUnreadMessagesAPI() {
    return request({
        url: "/chats/unread",
        method: "GET"
    });
}

// 标记消息为已读
export function markMessageAsReadAPI(otherUserId) {
    return request({
        url: "/chats/mark-read",
        method: "POST",
        data: { otherUserId } // request 内部会处理 JSON 序列化
    });
}

// 获取当前登录用户和指定用户的聊天历史
export function getChatHistoryAPI(userId) {
    return request({
        url: `/chats/${userId}`,
        method: 'GET',
    });
}
