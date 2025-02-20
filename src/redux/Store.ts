// C:\Users\vivek_laxvnt1\Desktop\JudgeXpert\Frontend\src\redux\store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import authReducer from './slices/AuthSlice'; // Only one slice

const persistConfig = {
  key: 'auth',
  storage, 
  whitelist: ['token', 'isAuthenticated', 'user'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { useDispatch } from 'react-redux';
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;