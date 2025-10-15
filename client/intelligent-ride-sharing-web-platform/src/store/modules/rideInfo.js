// 和行程（ride_info）相关的状态管理

import { createSlice } from "@reduxjs/toolkit";
import {createRideAPI, deleteRideAPI, getRideByIdAPI, getRidesAPI, updateRideAPI} from "../../apis/rideInfo";

// slice 定义
const rideInfoStore = createSlice({
    name: "rideInfo",
    // 数据状态
    initialState: {
        rides: [],          // 所有行程列表/All trips list
        currentRide: null,  // 当前选中的行程/Currently selected trip
    },

    reducers: {
        setRides(state, action) {
            state.rides = action.payload;
        },
        setCurrentRide(state, action) {
            state.currentRide = action.payload;
        },
        addRide(state, action) {
            state.rides.push(action.payload);
        },
        updateRide(state, action) {
            const updated = action.payload;
            //遍历所有的ride 如果true就将updated赋值给 如果false就保持不变/Iterate over all rides: if true, assign updated; if false, keep unchanged
            state.rides = state.rides.map(ride =>
                ride.id === updated.id ? updated : ride
            );
        },
        removeRide(state, action) {
            state.rides = state.rides.filter(ride => ride.id !== action.payload);
        }
    }
});

// 解构出 actionCreator/Destructure the actionCreator
export const { setRides, setCurrentRide, addRide, updateRide, removeRide } = rideInfoStore.actions;


const rideInfoReducer = rideInfoStore.reducer;

//
// ============== 异步方法/Asynchronous method ==============
//

// 获取所有行程/Fetch all trips
const fetchRides = () => {
    return async (dispatch) => {
        const res = await getRidesAPI();
       // console.log("fetchRides API res:", res);
        dispatch(setRides(res));
    };
};

// 根据 ID 获取某个行程/Fetch a trip by ID
const fetchRideById = (id) => {
    return async (dispatch) => {
        const res = await getRideByIdAPI(id);
        dispatch(setCurrentRide(res.data));
    };
};

// 创建行程/create trip
const createRide = (formData) => {
    return async (dispatch) => {
        const res = await createRideAPI(formData);
        dispatch(addRide(res.data));
    };
};

// 更新行程/update trip
const editRide = (id, formData) => {
    return async (dispatch) => {
        const res = await updateRideAPI(id, formData);
        dispatch(updateRide(res.data));
    };
};

// 删除行程/delete trip
const deleteRide = (id) => {
    return async (dispatch) => {
        await deleteRideAPI(id);
        dispatch(removeRide(id));
    };
};

export {
    fetchRides,
    fetchRideById,
    createRide,
    editRide,
    deleteRide
};
export default rideInfoReducer;
