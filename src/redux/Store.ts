import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/AuthSlice";
import adminReducer from "./slices/AdminSlice";
import userReducer from "./slices/UserSlice";
import problemReducer from "./slices/ProblemSlice";
import notificationReducer from "./slices/notificationSlice";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "isAuthenticated", "user"],
};

const notificationPersistConfig = {
  key: "notifications",
  storage,
  whitelist: ["notifications"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  admin: adminReducer,
  user: userReducer,
  problems: problemReducer,
  notifications: persistReducer(notificationPersistConfig, notificationReducer),
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;