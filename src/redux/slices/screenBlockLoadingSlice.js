import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    show: false,
    text: 'Loading... Please wait'
}

const screenBlockLoadingSlice = createSlice({
    name: 'ScreenBlockLoading',
    initialState: initialState,
    reducers: {
        screenBlockLoading(state,action){
            state.show = true;
            state.text = action.payload;
        },
        screenBlockLoadingClose(state){
            state.show = false;
        }
    }
})

export const { screenBlockLoading, screenBlockLoadingClose } = screenBlockLoadingSlice.actions;
export default screenBlockLoadingSlice.reducer;