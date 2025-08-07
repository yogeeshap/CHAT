import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { AnyAction, Middleware, ThunkDispatch } from '@reduxjs/toolkit'

import chatSliceReducer from './slice/chatSlice'
import authSliceReducer from './slice/authSlice'

const development: boolean = process.env.NODE_ENV === 'development'
const middleware: Middleware[] = [] // Add custom middleware if needed

const reducer = combineReducers({
  chat: chatSliceReducer,
  auth: authSliceReducer,
})

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(...middleware),
  devTools: development,
})

// Type exports
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type TypedDispatch<T> = ThunkDispatch<T, any, AnyAction>

export default store
