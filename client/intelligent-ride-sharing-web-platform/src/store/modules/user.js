//和用户相关的状态管理

import {createSlice} from "@reduxjs/toolkit";
import {removeToken, request} from "../../utils";
import {setToken as _setToken,getToken} from "../../utils";
import {getProfileAPI, loginAPI} from "../../apis/user";


const userStore = createSlice({
    name: "user",
    //数据状态
    initialState: {
        token: getToken() ||'',
        userInfo: JSON.parse(localStorage.getItem("userInfo")) || {}
    },
    //同步修改方法
    reducers: {
        setToken(state,action) {
            state.token = action.payload
            //localstorage也存一份
            _setToken(action.payload)
        },
        setUserInfo(state,action) {
            state.userInfo = action.payload
            localStorage.setItem("userInfo", JSON.stringify(action.payload))
        },
        clearUserInfo(state,action){
            state.token = ''
            state.userInfo = {}
            removeToken()
        }
    }
})

//解构出actionCreator
export const { setToken,setUserInfo,clearUserInfo} = userStore.actions

//获取reducer函数
const userReducer = userStore.reducer

//异步方法 完成登录获取token
const fetchLogin = (loginForm) => {
    return async (dispatch) => {
        //1发送异步请求
        const res = await loginAPI(loginForm)
        //console.log("fetchUserInfo res.data:", res.data);

        //2提交同步action进行token存入
        dispatch(setToken(res.token));
        dispatch(setUserInfo(res.user));
    }
}

//异步方法 获取个人用户信息
const fetchUserInfo = () => {
    return async (dispatch) => {
        //1发送异步请求
        const res = await getProfileAPI();
        //2提交同步action进行token存入
        dispatch(setUserInfo(res))
    }
}

// const fetchUserInfo = () => {
//     return async (dispatch) => {
//         try {
//             const res = await getProfileAPI();
//             console.log("fetchUserInfo res.data:", res);
//             dispatch(setUserInfo(res));
//         } catch (err) {
//             console.error("fetchUserInfo error:", err);
//         }
//     }
// }


export {fetchLogin,fetchUserInfo}
export default userReducer
