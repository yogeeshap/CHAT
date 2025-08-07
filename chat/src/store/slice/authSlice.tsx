import { createSlice } from '@reduxjs/toolkit'

type UserDetail = {
  user_id?: string
  username?: string
  email?: string,
  room_name?: string,
  room_id?: string
}
type InitialState = {
  user: UserDetail
}

const initialState: InitialState = {
  user: {},
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { user } = action.payload
      state.user = user
    },
  },
})

// Action creators are generated for each case reducer function
export const { setAuth } = authSlice.actions

export default authSlice.reducer
