//组合redux子模块+导出store实例

import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./modules/user";
import rideInfoReducer from "./modules/rideInfo";

export default configureStore({
    reducer: {
        user: userReducer,
        rideInfo: rideInfoReducer
    }
})