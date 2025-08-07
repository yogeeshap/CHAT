// chatThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import chatService from '../../services/chat.service';

export const fetchRoomUsers = createAsyncThunk(
  'chat/fetchRoomUsers',
  async (roomId: string) => {
    const response = await chatService.roomUsers({ room_id: roomId });
    return response.data.users;
  }
);

export const fetchRoom = createAsyncThunk(
  'chat/fetchRoom',
  async (roomId: string) => {
    const response = await chatService.room(roomId);
    return response.data.room;
  }
);
