import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    darkMode: true
}

const darkModeSlice = createSlice({
   name: 'config',
   initialState,
   reducers: {
      toggleDarkMode: state => {
         state.darkMode =!state.darkMode
      }
   }
})

export const { toggleDarkMode } = darkModeSlice.actions
export default darkModeSlice.reducer