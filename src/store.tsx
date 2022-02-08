import { configureStore, ThunkAction, Action, getDefaultMiddleware } from '@reduxjs/toolkit'
import rootReducer from "./reducers/index";

const customizedMiddleware = getDefaultMiddleware({
    serializableCheck: false
 });

const store = configureStore({
  reducer: rootReducer,
  middleware: customizedMiddleware,
});

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>

export default store