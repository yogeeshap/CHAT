
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import { blue } from "@mui/material/colors";

import { Box,Paper } from "@mui/material";
import { useEffect, useRef } from "react";

type UserDetail = {
  user_id?: string;
  username?: string;
  email?: string;
  room_name?: string;
  room_id?: string;
};

export interface ParticipantsModalProps {
  open: boolean;
  listOfValue: UserDetail[];
  onClose: () => void;

}


function ParticipantsModal(props: ParticipantsModalProps) {
  const { onClose, listOfValue, open } = props;

  const modalRef = useRef<HTMLDivElement | null>(null);
 
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleClose = () => {
    onClose();
  };

const uniqueId = `box-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <>
      {open && (
        <Box id={uniqueId} ref={modalRef} sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: "100%", // just below the button
              right: "10%",
              bgcolor: "white",
              border: "1px solid #ccc",
              p: 1,
              zIndex: 10,
              minWidth:300
            }}
          >
            <Paper elevation={0} sx={{ p: 1, boxShadow: "none" }}>
              <List sx={{ pt: 0 }}>
                {listOfValue.map((val: UserDetail) => (
                  <ListItem disablePadding key={val.email}>
                    <ListItemButton>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={val.email} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </Box>
      )}
    </>
  );
}

export default ParticipantsModal;
