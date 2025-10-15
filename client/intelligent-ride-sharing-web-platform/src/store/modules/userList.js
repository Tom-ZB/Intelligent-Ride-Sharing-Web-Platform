// src/redux/userListSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { getAllUsersAPI, banUserAPI, unbanUserAPI } from "../../apis/userList";

const userListSlice = createSlice({
    name: "userList",
    initialState: {
        users: [] // 存储所有用户信息/Store all user information
    },
    reducers: {
        setUsers(state, action) {
            state.users = action.payload;
        }
    }
});

export const { setUsers } = userListSlice.actions;


//获取所有用户列表/Fetch all user list
export const fetchUserList = () => {
    return async (dispatch) => {
        try {
            const res = await getAllUsersAPI();
            dispatch(setUsers(res));
        } catch (err) {
            console.error("failed to get user list:", err);
        }
    };
};

// 封禁用户/ban user
export const deactivateUser = (userId) => {
    return async (dispatch) => {
        try {
            await banUserAPI(userId);
            // 调用接口后重新拉取列表，保证前端数据与后端一致/fetch the list after calling the API to ensure frontend data is consistent with the backend
            dispatch(fetchUserList());
        } catch (err) {
            console.error("failed to ban user:", err);
        }
    };
};

// 恢复用户/unban user
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
