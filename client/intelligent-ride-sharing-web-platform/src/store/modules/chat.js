import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        messages: [] // 所有消息
    },
    reducers: {
        // 收到 新消息 时调用
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        //初始化消息列表， 拉取完整历史记录  （整体替换当前 messages 数组）
        setMessages: (state, action) => {
            state.messages = action.payload;
        }
    }
});

export const { addMessage, setMessages } = chatSlice.actions;
const chatReducer = chatSlice.reducer;
export default chatReducer;
