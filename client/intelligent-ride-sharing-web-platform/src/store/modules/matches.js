// store/modules/matches.js
import { createSlice } from "@reduxjs/toolkit";
import {
    getMatchesByUserAPI,
    getMatchByIdAPI,
    createMatchAPI,
    updateMatchStatusAPI,
    deleteMatchAPI, getAllMatchesAPI
} from "../../apis/matches";

const matchesStore = createSlice({
    name: "matches",
    initialState: {
        matches: [],       // 用户的所有匹配行程 /All matched trips of the user
        currentMatch: null // 当前查看的匹配详情 /Currently viewed match details
    },
    reducers: {
        setMatches(state, action) {
            state.matches = action.payload;
        },
        setCurrentMatch(state, action) {
            state.currentMatch = action.payload;
        },
        addMatch(state, action) {
            state.matches.push(action.payload);
        },
        updateMatch(state, action) {
            const updated = action.payload;
            state.matches = state.matches.map(match =>
                match.id === updated.id ? updated : match
            );
        },
        removeMatch(state, action) {
            state.matches = state.matches.filter(match => match.id !== action.payload);
        }
    }
});

export const { setMatches, setCurrentMatch, addMatch, updateMatch, removeMatch } = matchesStore.actions;
const matchesReducer = matchesStore.reducer;

// ================= 异步方法/Asynchronous method =================

//获取全部匹配数据/Fetch all matched data
export const fetchAllMatches = () => {
    return async (dispatch) => {
        try {
            const res = await getAllMatchesAPI();
            dispatch(setMatches(res));
        } catch (err) {
            console.error("failed to load matches info:", err);
        }
    };
};

// 获取用户所有匹配行程/Fetch all matched trips of the user
export const fetchMatchesByUser = (userId) => {
    return async (dispatch) => {
        const res = await getMatchesByUserAPI(userId);
        dispatch(setMatches(res));
    };
};

// 获取单个匹配详情/Fetch details of a single match
export const fetchMatchById = (id) => {
    return async (dispatch) => {
        const res = await getMatchByIdAPI(id);
        dispatch(setCurrentMatch(res));
    };
};

// 创建新匹配/Create a new match
export const createMatch = (formData) => {
    return async (dispatch) => {
        const res = await createMatchAPI(formData);
        dispatch(addMatch(res));
        return res;
    };
};

// 更新匹配状态/Update match status
export const changeMatchStatus = (id, status) => {
    return async (dispatch) => {
        const res = await updateMatchStatusAPI(id, status);
        console.log(res)
        dispatch(updateMatch(res));
        return res;
    };
};

// 删除匹配/delete match
export const deleteMatch = (id) => {
    return async (dispatch) => {
        await deleteMatchAPI(id);
        dispatch(removeMatch(id));
    };
};

export default matchesReducer;
