import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/AuthSlice";
import adminReducer from "./slices/AdminSlice";
import userReducer from "./slices/UserSlice";
import problemReducer from "./slices/ProblemSlice";
import notificationReducer from "./slices/notificationSlice"

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "isAuthenticated", "user", "notifications"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    admin: adminReducer,
    user: userReducer,
    problems: problemReducer,
    notifications: notificationReducer,
  },
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