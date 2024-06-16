import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    darkMode: true,
    baseURL: process.env.NODE_ENV === 'production' ? 'https://devcollab-server.onrender.com' : ''
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
