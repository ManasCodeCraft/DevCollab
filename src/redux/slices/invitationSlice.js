import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  invitations: [],
  loading: false,
  error: null,
};

const invitationSlice = createSlice({
  name: 'inviterequest',
  initialState,
  reducers: {
    setInvitations(state, action){
      state.invitations = action.payload
      state.loading = false;
      state.error = null;
    },
    pushInvitation(state, action){
        state.invitations.push(action.payload);
    },
    removeInvitation(state, action){
        let id = action.payload;
        state.invitations = state.invitations.filter(invitation => invitation._id != id)
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {removeInvitation ,pushInvitation ,setInvitations, setLoading, setError } = invitationSlice.actions;
export default invitationSlice.reducer;
