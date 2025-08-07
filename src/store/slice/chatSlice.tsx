import { createSlice } from '@reduxjs/toolkit'
import { fetchRoomUsers, fetchRoom } from './thunk';

type InitialState = {
  chatHistory: [],
  users:[],
  room:{
    room_id: string,
  name:string
  },
  roomUser:[],
  roomAllUser:[]
}

const initialState: InitialState = {
  chatHistory: [],
  users:[],
  room:{
    room_id: '',
    name:''
  },
  roomUser:[],
  roomAllUser:[]
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    getChatHistory: (state, action) => {
      const { chatHistory } = action.payload
      state.chatHistory = chatHistory
    },

    setRoom: (state, action) => {
      const { room } = action.payload
      state.room = room
    },

    setRoomUser: (state, action) => {
      const { roomUser } = action.payload
      state.roomUser = roomUser
    },

    setRoomAllUser: (state, action) => {
      const { roomAllUser } = action.payload
      state.roomAllUser = roomAllUser
    },

    findUser: (state, action) => {
      const { users } = action.payload
      state.users = users
    }
  },
   extraReducers: (builder) => {
    builder
      .addCase(fetchRoomUsers.fulfilled, (state, action) => {
        state.roomAllUser = action.payload;
      })
      .addCase(fetchRoom.fulfilled, (state, action) => {
        state.room = action.payload;
      });
  },
 
})

// Action creators are generated for each case reducer function
export const { getChatHistory,
                setRoom,
                findUser,
                setRoomUser,
                setRoomAllUser} = chatSlice.actions

export default chatSlice.reducer
