import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        messages: [] // all messages
    },
    reducers: {
        // 收到新消息时调用/Invoke when a new message is received
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        //初始化消息列表， 拉取完整历史记录  （整体替换当前 messages 数组）/Initialize the message list and fetch the complete history (replace the current messages array entirely)
        setMessages: (state, action) => {
            state.messages = action.payload;
        }
    }
});

export const { addMessage, setMessages } = chatSlice.actions;
const chatReducer = chatSlice.reducer;
export default chatReducer;
