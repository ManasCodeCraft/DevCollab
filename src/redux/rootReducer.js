import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'
import projectReducer from './slices/projectSlice'
import inviteReducer from './slices/invitationSlice'
import messageReducer from './slices/messageModalSlice'
import confirmReducer from './slices/confirmationSlice'
import waitReducer from './slices/waitingModalSlice'
import configReducer from './slices/configSlice'
import screenBlockLoadingReducer from './slices/screenBlockLoadingSlice'
import chatReducer from './slices/chatSlice'
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 

const persistConfig = {
     key: 'root',
     storage,
};   

const rootReducer = combineReducers({
     auth: authReducer,
     project: projectReducer,
     invite: inviteReducer,
     message: messageReducer,
     confirm: confirmReducer,
     wait: waitReducer,
     config: configReducer,
     loading: screenBlockLoadingReducer,
     chat: chatReducer,
});

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export default persistedReducer;

export default rootReducer;
