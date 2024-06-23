import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  waiting_text: null,
  after_text: null,
  show: false,
  autoClose: false,
  progress: null,
  status: 'waiting', // waiting, completed, error
};

const waitingModalSlice = createSlice({
  name: 'waitingSlice',
  initialState,
  reducers: {
    setWaitingModalParam(state, action){
      state.waiting_text = action.payload.waiting_text || '';
      state.after_text = action.payload.after_text || '';
      state.show = action.payload.show || false;
      state.autoClose = action.payload.autoClose || false;
      state.status = action.payload.status || 'waiting';
      state.progress = action.payload.progress || null;
    },
    launchAutoCloseWaitingModal(state, action){
       state.show = true;
       state.waiting_text = action.payload;
       state.autoClose = true;
       state.status = 'waiting';
    },
    setWaitingModalProgress(state, action){
      state.progress = action.payload;
    },
    setModalWaitingText(state, action){
        state.waiting_text = action.payload;
    },
    setModalAfterText(state, action){
        state.after_text = action.payload
    },
    setWaitingCompleted(state){
        state.status = 'completed'
        if(state.autoClose){
           state.show = false;
        }
    },
    ShowWaitingModal(state){
      state.show = true
    },
    HideWaitingModal(state){
      state.show = false
    }
  },
});

export const {setWaitingModalProgress , launchAutoCloseWaitingModal ,setWaitingModalParam, ShowWaitingModal, HideWaitingModal, setModalAfterText, setModalWaitingText, setWaitingCompleted } = waitingModalSlice.actions;
export default waitingModalSlice.reducer;
