import { ThunkAction } from "redux-thunk";
import { Action } from "@reduxjs/toolkit";
import { RootState } from "../redux/Store";

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;