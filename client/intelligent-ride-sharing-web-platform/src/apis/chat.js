import { request } from "../utils";

// 获取当前用户的未读消息/Fetch the current user's unread messages
export function getUnreadMessagesAPI() {
    return request({
        url: "/chats/unread",
        method: "GET"
    });
}

// 标记消息为已读/Mark message as read
export function markMessageAsReadAPI(otherUserId) {
    return request({
        url: "/chats/mark-read",
        method: "POST",
        data: { otherUserId }
    });
}

// 获取当前登录用户和指定用户的聊天历史/Fetch the chat history between the current logged-in user and the specified user
export function getChatHistoryAPI(userId) {
    return request({
        url: `/chats/${userId}`,
        method: 'GET',
    });
}
