import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: [],
    reducers: {
        pushMessage: (state, action)=> {
            state.push(action.payload);
        },
        clearMessages: (state) => {
            return [];
        }
    }
});

export const { clearMessages, pushMessage } = chatSlice.actions;
export default chatSlice.reducer;
