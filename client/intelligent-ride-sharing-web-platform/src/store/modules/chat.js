import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        messages: [] // 所有消息
    },
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        }
    }
});

export const { addMessage, setMessages } = chatSlice.actions;
const chatReducer = chatSlice.reducer;
export default chatReducer;
