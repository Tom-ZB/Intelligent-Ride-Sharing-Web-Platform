//用户相关的所有请求
//1登录请求

import {request} from "../utils";

export function loginAPI(formData) {
    return request({
        url: '/auth/login',
        method: 'POST',
        data: formData
    })
}


// 注册用户/register user
export function registerAPI(formData) {
    return request({
        url: '/auth/register',
        method: 'POST',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}


//获取用户账户信息/get user account info
// api/user.js
export function getProfileAPI() {
    return request({
        url: `/users/me`,
        method: 'GET',
    });
}


// 更新用户信息/update account info
export function updateUserAPI(userId, formData) {
    return request({
        url: `/users/${userId}`,
        method: "PUT",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

// 注销用户/disable account
export function deactivateUserAPI(userId) {
    return request({
        url: `/users/${userId}/deactivate`,
        method: "PATCH",
    });
}