"use client";

import {
  Autocomplete,
  Box,
  Chip,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import type { SxProps, Theme } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../../services/hooks/store-hooks";
import chatService from "../../services/chat.service";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { setRoomUser } from "../../store/slice/chatSlice";

const schema = yup.object().shape({
  room_name: yup.string().required("Room is required"),
  users: yup
    .array()
    .min(1, "Select at least one user")
    .required("Username is required"),
});

type User = {
  user_id: number;
  username: string;
};

type RoomResp = {
  user_id: number;
  room_name: string;
  room_id: number;
};

type UserDetail = {
  user_id?: string;
  username?: string;
  email?: string;
  room_name?: string;
  room_id?: string;
};


interface Room {
  onClose: () => void;
  sx?: SxProps<Theme>;
}

const fetchUserOptions = async (query: string): Promise<User[]> => {
  if (!query) return [];
  const roomResp = await chatService.findUser(query)
  return roomResp.data.users;
};

const RoomCreatorForm: React.FC<Room> = ({ onClose, sx }: Room) => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [selected, setSelected] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const roomUserDetails = useAppSelector<UserDetail[]>(
      (state) => state.chat.roomUser || []
    );

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (data: any) => {
    const res = await chatService.createRoom(data);
    dispatch(setRoomUser({ roomUser: [...roomUserDetails,res.data.room] }))
    handleClose();
  };

  const debouncedFetch = useMemo(
    () =>
      debounce(async (value: string) => {
        const users_data = await fetchUserOptions(value);
        
        setUsers(users_data);
      }, 300),
    []
  );

  const handleInputChange = (_: any, value: string) => {
    debouncedFetch(value);
  };

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  useEffect(() => {

    setValue(
      "users",
      selected.map((user) => user.user_id)
    ); // store only IDs
  }, [selected, setValue]);

  return (
    <Box sx={{ ...sx, p: 2 }} onClick={(e) => e.stopPropagation()}>
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Stack
          spacing={2}
          component="form"
          direction="column"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            label="Room Name"
            {...register("room_name")}
            error={!!errors.room_name}
            helperText={errors.room_name?.message}
          />
          <Autocomplete
          disablePortal
            multiple
            options={users}
            value={selected}
            filterSelectedOptions
            getOptionLabel={(option) => option.username}
            isOptionEqualToValue={(option, value) =>
              option.user_id === value.user_id
            }
            onChange={(_, newValue) => setSelected(newValue)}
            onInputChange={handleInputChange}
            renderTags={(value: readonly User[], getTagProps) => (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  maxWidth: "100%",
                  "& > .MuiChip-root": {
                    flex: "1 0 calc(50% - 8px)",
                    maxWidth: "calc(50% - 8px)",
                  },
                }}
              >
                {value.map((option: User, index: number) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip key={key} label={option.username} {...tagProps} />
                  );
                })}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                // {...register("users")}
                variant="outlined"
                label="Select Users"
                placeholder="Search"
                error={!!errors.users}
                helperText={errors.users?.message}
              />
            )}
            fullWidth
          />
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "end",
              gap: 3,
            }}
          >
            <Button type="submit" variant="contained">
              Create Room
            </Button>
            <Button variant="contained" onClick={handleClose}>
              cancel
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default RoomCreatorForm;
