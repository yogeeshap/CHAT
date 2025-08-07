import * as React from "react";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import AddMemberToRoomForm from "./AddMemberToRoomForm";
import { Box, ClickAwayListener, Paper, Popper } from "@mui/material";
import { forwardRef, useEffect, useRef, useState } from "react";

type UserDetail = {
  user_id?: string;
  username?: string;
  email?: string;
  room_name?: string;
  room_id?: string;
};

export interface AddMainModalProps {
  open: boolean;
  selectedValue: string;
  listOfValue: UserDetail[];
  onClose: () => void;
  userId: string;

}

export interface AddSubModalProps {
  open: boolean;
  selectedValue: string;
  userId: string;
  onClose: () => void;
  targetElementSize: number | null
}

const AddSubModal = forwardRef<HTMLDivElement, AddSubModalProps>(
  ({ open, selectedValue, onClose ,targetElementSize,userId}, ref) => {
    const handleClose = () => {
      onClose();
    };

    return (
          <Box
            ref={ref}
            sx={{
              position: "absolute",
              top: targetElementSize !== null ? `calc(100% + ${targetElementSize}px)` : 'auto',
              bgcolor: "white",
              border: "1px solid #ccc",
              p: 1,
              zIndex: 10,
              right: "10%",
            }}
          >
            {open && (<AddMemberToRoomForm
              roomId={selectedValue}
              onClose={handleClose}
              sx={{ minWidth: 320 }}
              userId={userId}
            />)}
          </Box>
        )}
 
);

function AddMainModal(props: AddMainModalProps) {
  const [isAdd, setAdd] = React.useState(false);
  const sourceRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [targetElementSize, setTargetElementSize] = useState<number | null>(50);
  const { onClose, selectedValue, listOfValue, open,userId } = props;

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
    setAdd(false);
  };


  const handleAddUser = () => {
    setAdd(true);
  };


  useEffect(() => {
  let animationFrameId: number;

  animationFrameId = requestAnimationFrame(() => {
    const element = sourceRef.current;
    
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        setTargetElementSize(height);
      }
    });

    observer.observe(element);

    return () => observer.disconnect();
  });

  return () => cancelAnimationFrame(animationFrameId);
}, [open]);


  useEffect(() => {
    if (targetRef.current) {
      targetRef.current.style.top = `calc(100% + ${targetElementSize}px)`;
    }
  }, [targetElementSize]);

  
const uniqueId = `box-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <>
      {open && (
        <Box id={uniqueId} ref={modalRef} sx={{ position: "relative" }}>
          <Box
            ref={sourceRef}
            sx={{
              position: "absolute",
              top: "100%", // just below the button
              right: "10%",
              bgcolor: "white",
              border: "1px solid #ccc",
              p: 1,
              zIndex: 10,
              minWidth:200
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
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleAddUser()}>
                    <ListItemAvatar>
                      <Avatar>
                        <AddIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Add User" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Paper>
          </Box>

          {isAdd && (
            <AddSubModal
              open={open}
              onClose={handleClose}
              selectedValue={selectedValue}
              ref={targetRef}
              targetElementSize={targetElementSize}
              userId={userId}
            />
          )}
        </Box>
      )}
    </>
  );
}

export default AddMainModal;
