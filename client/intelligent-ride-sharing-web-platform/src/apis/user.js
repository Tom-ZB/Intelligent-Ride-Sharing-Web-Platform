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


// 注册用户
export function registerAPI(formData) {
    return request({
        url: '/auth/register',
        method: 'POST',
        data: formData, // 注意这里是 FormData，因为包含文件
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}


//获取用户信息后进行修改
export function getProfileAPI() {
    return request({
        url: '/users/:id',
        method: 'GET',
    })
}