import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    darkMode: true,
    baseURL: process.env.NODE_ENV === 'production' ? 'https://devcollab-server.onrender.com' : 'http://localhost:7000',
    executionServerURL: process.env.NODE_ENV === 'production' ? 'https://devcollab-execution-server.onrender.com' : 'http://localhost:7500'
};

const darkModeSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        toggleDarkMode: state => {
            state.darkMode = !state.darkMode;
        }
    }
});

export const { toggleDarkMode } = darkModeSlice.actions;
export default darkModeSlice.reducer;
