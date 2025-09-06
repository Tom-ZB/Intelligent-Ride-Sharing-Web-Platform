//组合redux子模块+导出store实例

import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./modules/user";
import rideInfoReducer from "./modules/rideInfo";
import matchesReducer from "./modules/matches";
import chatReducer from "./modules/chat"
import userListReducer from './modules/userList';


export default configureStore({
    reducer: {
        user: userReducer,
        rideInfo: rideInfoReducer,
        matches:matchesReducer,
        chat:chatReducer,
        userList:userListReducer
    }
})