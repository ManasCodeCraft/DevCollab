import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  title: null,
  text: null,
  show: false,
  acceptText: 'Accept',
  rejectText: 'Reject',
  acceptAction: null,
  rejectAction: null,
  acceptBtnColor: 'success'
};

const confirmModalSlice = createSlice({
  name: 'confirmSlice',
  initialState,
  reducers: {
    setConfirmParam(state, action){
      state.title= action.payload.title
      state.text = action.payload.text
      state.show = action.payload.show
      state.acceptAction = action.payload.acceptAction
      state.rejectAction = action.payload.rejectAction
      state.acceptBtnColor = action.payload.acceptBtnColor || 'success'
      state.acceptText = action.payload.acceptText || 'Accept'
      state.rejectText = action.payload.rejectText || 'Reject'
    },
    setConfirmShow(state){
      state.show = true
    },
    setConfirmHide(state){
      state.show = false
    }
  },
});

export const { setConfirmHide, setConfirmParam, setConfirmShow  } = confirmModalSlice.actions;
export default confirmModalSlice.reducer;
