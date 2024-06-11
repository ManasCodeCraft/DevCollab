import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  title: null,
  text: null,
  show: false,
};

const messageModalSlice = createSlice({
  name: 'messageSlice',
  initialState,
  reducers: {
    setMessageParam(state, action){
      state.title= action.payload.title
      state.text = action.payload.text
      state.show = action.payload.show
    },
    setMessageShow(state){
      state.show = true
    },
    setMessageHide(state){
      state.show = false
    }
  },
});

export const { setMessageParam, setMessageShow, setMessageHide  } = messageModalSlice.actions;
export default messageModalSlice.reducer;
