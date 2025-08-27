// 行程相关的所有请求
import { request } from "../utils";

// 获取所有行程
export function getRidesAPI() {
    return request({
        url: "/rides",
        method: "GET"
    });
}

// 根据 ID 获取行程
export function getRideByIdAPI(id) {
    return request({
        url: `/rides/${id}`,
        method: "GET"
    });
}

// 创建行程
export function createRideAPI(formData) {
    return request({
        url: "/rides",
        method: "POST",
        data: formData,
    });
}

// 更新行程
export function updateRideAPI(id, formData) {
    return request({
        url: `/rides/${id}`,
        method: "PUT",
        data: formData,
    });
}

// 删除行程
export function deleteRideAPI(id) {
    return request({
        url: `/rides/${id}`,
        method: "DELETE"
    });
}
