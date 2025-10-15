//和用户相关的状态管理

import {createSlice} from "@reduxjs/toolkit";
import {removeToken, request} from "../../utils";
import {setToken as _setToken,getToken} from "../../utils";
import {getProfileAPI, loginAPI} from "../../apis/user";


const userStore = createSlice({
    name: "user",
    initialState: {
        token: getToken() ||'',
        userInfo: JSON.parse(localStorage.getItem("userInfo")) || {}
    },

    reducers: {
        setToken(state,action) {
            state.token = action.payload
            //localstorage也存一份/Also store a copy in localStorage
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

//解构出actionCreator/Destructure the actionCreator
export const { setToken,setUserInfo,clearUserInfo} = userStore.actions

//获取reducer函数/Get reducer function
const userReducer = userStore.reducer

//异步方法/Asynchronous method

//完成登录获取token/complete login and obtain token
const fetchLogin = (loginForm) => {
    return async (dispatch) => {
        const res = await loginAPI(loginForm)
        //提交同步action进行token存入/Dispatch a synchronous action to store the token
        dispatch(setToken(res.token));
        dispatch(setUserInfo(res.user));
    }
}

//获取个人用户信息/Fetch personal user information
const fetchUserInfo = () => {
    return async (dispatch) => {
        const res = await getProfileAPI();
        //2提交同步action/Dispatch a synchronous action
        dispatch(setUserInfo(res))
    }
}


export {fetchLogin,fetchUserInfo}
export default userReducer
