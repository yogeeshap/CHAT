import * as React from "react";
import { Box} from "@mui/material";
import EditRoomForm from "./EditRoom";
import { useEffect, useRef } from "react";

export interface EditRoomModalProps {
  open: boolean;
  selectedValue: string;
  onClose: () => void;

}

function EditRoomModal(props: EditRoomModalProps) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose();
  };


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
  
const uniqueId = `box-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <>
      {open && (
        <Box id={uniqueId} ref={modalRef} sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: "100%",
              bgcolor: "white",
              border: "1px solid #ccc",
              p: 1,
              zIndex: 10,
              mr:10
            }}
          >
            <EditRoomForm
              roomId={selectedValue}
              onClose={handleClose}
              sx={{minWidth:320}}
            />
          </Box>
        </Box>
      )}
    </>
  );
}

export default EditRoomModal;
