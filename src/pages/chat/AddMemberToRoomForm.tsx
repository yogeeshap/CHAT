"use client";
import {
  Autocomplete,
  Box,
  Chip,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useAppDispatch,
  useAppSelector,
} from "../../services/hooks/store-hooks";
import chatService from "../../services/chat.service";
import { useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";
import { setRoomAllUser } from "../../store/slice/chatSlice";
import authConfig from "../../authConfig";
// import { setRoomUser } from '../../store/slice/chatSlice'

const schema = yup.object().shape({
  // room_name: yup.string().required("Room is required"),
  users: yup
    .array()
    .min(1, "Select at least one user")
    .required("Username is required"),
});

type User = {
  user_id: number;
  username: string;
};

interface Room {
  roomId: string;
  onClose: () => void;
  sx?: SxProps<Theme>;
  userId: string;
}

type UserDetail = {
  user_id?: string;
  username?: string;
  email?: string;
  room_name?: string;
  room_id?: string;
};

const fetchUserOptions = async (query: string): Promise<User[]> => {
  if (!query) return [];
  // const res = await axios.get(`/api/search_users?q=${query}`);
  const roomResp = await chatService.findUser(query);
  return roomResp.data.users;
};

const AddMemberToRoomForm: React.FC<Room> = ({
  roomId,
  onClose,
  sx,
  userId
}: Room) => {
  // const navigate = useNavigate()
  const dispatch = useAppDispatch();

  const {
    // register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [selected, setSelected] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const allRoomUsers = useAppSelector<UserDetail[]>(
    (state) => state.chat.roomAllUser || []
  );

  useEffect(() => {
    const ws = new WebSocket(
      `${authConfig.auth.wsUrl}/chat/${roomId}/${userId}`
    );
    wsRef.current = ws;

    ws.onopen = () => {

    };

    ws.onclose = () => {

    };

    return () => {
      ws.close();
    };
  }, []);

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (data: any) => {
    const res = await chatService.addUserToRoom({ room_id: roomId, data });
    const data_str = res.data.room_user.map((usr: any) => { return usr.username }).toString();
    dispatch(
      setRoomAllUser({ roomAllUser: [...allRoomUsers, ...res.data.room_user] })
    );
    handleClose();
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current?.send(
        JSON.stringify({
          type: "message",
          content: `${data_str} Added to the Group`,
        })
      );
    }
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
          //  alignItems: 'center',
          gap: 2,
          //  p:8
        }}
      >
        <Stack
          spacing={2}
          component="form"
          direction="column"
          onSubmit={handleSubmit(onSubmit)}
        >
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
              // flexDirection:'row',
              flexWrap: "wrap",
              justifyContent: "end",
              gap: 3,
            }}
          >
            <Button type="submit" variant="contained">
              Add
            </Button>
            <Button variant="contained" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default AddMemberToRoomForm;
