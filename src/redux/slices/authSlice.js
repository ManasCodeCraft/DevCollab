import { createSlice } from '@reduxjs/toolkit';

const defProfile = 'https://res.cloudinary.com/dgidrmdqz/image/upload/v1713376923/defaultprofile_kwree3.jpg'

const initialState = {
  user: {
    userid: null,
    username: null,
    profilePic: defProfile,
  },
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action){
      state.user.userid = action.payload.userid
      state.user.username = action.payload.username
      state.user.profilePic = action.payload.profilePic
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    setProfilePic(state,action){
      state.user.profilePic = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    logout(state) {
      state.user = {
        username: null,
        profilePic: defProfile,
      };
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    setUserInfo(state, action) {
      const userInfo = action.payload;
      state.user = { ...state.user, ...userInfo };
    },
  },
});

export const {setProfilePic ,setUser, setLoading, setError, logout, setUserInfo } = authSlice.actions;
export default authSlice.reducer;
