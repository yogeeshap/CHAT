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
import { useAppDispatch } from "../../services/hooks/store-hooks";
import chatService from "../../services/chat.service";
import { useEffect } from "react";

const schema = yup.object().shape({
  name: yup.string().required("Room is required")
});

interface Room {
  roomId: string;
  onClose: () => void;
  sx?: SxProps<Theme>;
}

const EditRoomForm: React.FC<Room> = ({ roomId, onClose, sx }: Room) => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });


  useEffect(() => {
    (async () => {})();
  }, [dispatch]);

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (data: any) => {
    await chatService.updateRoom({ room_id: roomId, data });
    handleClose();
  };


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
            label='Room Name'
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
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
              save
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

export default EditRoomForm;
