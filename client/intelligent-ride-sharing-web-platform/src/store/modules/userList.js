// src/redux/userListSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { getAllUsersAPI, banUserAPI, unbanUserAPI } from "../../apis/userList";

const userListSlice = createSlice({
    name: "userList",
    initialState: {
        users: [] // 存储所有用户信息
    },
    reducers: {
        setUsers(state, action) {
            state.users = action.payload;
        }
    }
});

export const { setUsers } = userListSlice.actions;


// 异步方法：获取所有用户列表
export const fetchUserList = () => {
    return async (dispatch) => {
        try {
            const res = await getAllUsersAPI(); // 获取后端返回的用户数组
            dispatch(setUsers(res));
        } catch (err) {
            console.error("failed to get user list:", err);
        }
    };
};

// 异步方法：封禁用户
export const deactivateUser = (userId) => {
    return async (dispatch) => {
        try {
            await banUserAPI(userId);
            // 调用接口后重新拉取列表，保证前端数据与后端一致
            dispatch(fetchUserList());
        } catch (err) {
            console.error("failed to ban user:", err);
        }
    };
};

// 异步方法：恢复用户
export const activateUser = (userId) => {
    return async (dispatch) => {
        try {
            await unbanUserAPI(userId);
            dispatch(fetchUserList());
        } catch (err) {
            console.error("failed to unban user:", err);
        }
    };
};

export default userListSlice.reducer;
