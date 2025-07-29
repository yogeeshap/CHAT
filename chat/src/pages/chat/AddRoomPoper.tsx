// import * as React from 'react';
// import Button from '@mui/material/Button';
// import Avatar from '@mui/material/Avatar';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemText from '@mui/material/ListItemText';
// import DialogTitle from '@mui/material/DialogTitle';
// import Dialog from '@mui/material/Dialog';
// import PersonIcon from '@mui/icons-material/Person';
// import AddIcon from '@mui/icons-material/Add';
// import Typography from '@mui/material/Typography';
// import { blue } from '@mui/material/colors';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import TextField from '@mui/material/TextField';
// import AddMemberToRoomForm from './AddMemberToRoomForm';
// // import RoomCreatorForm  from './RoomCreator';

// // const emails = ['username@gmail.com', 'user02@gmail.com'];

// type UserDetail = {
//   user_id?: string
//   username?: string
//   email?: string,
//   room_name?: string,
//   room_id?: string
// }

// export interface AddMainModalProps {
//   open: boolean;
//   selectedValue: string;
//   listOfValue: UserDetail[];
//   onClose: () => void;
// }

// export interface AddSubModalProps {
//   open: boolean;
//   selectedValue: string;
//   onClose: () => void;
// }

// // export interface FormGroupProps {
// //   open: boolean;
// //   selectedValue: string;
// //   onClose: (value: string) => void;
// // }


// function AddSubModal(props: AddSubModalProps) {
// //   const [open, setOpen] = React.useState(false);
// const { onClose, selectedValue,open} = props;

//   const handleClose = () => {
//     onClose();
//   };

//   return (
//     <React.Fragment>
//       <Dialog open={open} onClose={handleClose}>
//         <DialogTitle>Subscribe</DialogTitle>
//         <DialogContent sx={{ paddingBottom: 0 }}>
//           <DialogContentText>
//             To subscribe to this website, please enter your email address here. We
//             will send updates occasionally.
//           </DialogContentText>

//           <AddMemberToRoomForm 
//           roomId={selectedValue}
//           onClose={handleClose}
//           />
//         </DialogContent>
//       </Dialog>
//     </React.Fragment>
//   );
// }


// function AddMainModal(props: AddMainModalProps) {
//   const [isAdd, setAdd] = React.useState(false);
  
//   const { onClose, selectedValue,listOfValue,open } = props;

//   const handleClose = () => {
//     onClose();
//   };

//   const handleAddUser = () => {
//     setAdd(true);
//   };

//   

//   return (
//     <React.Fragment>
//     <Dialog onClose={handleClose} open={open}>
//       <DialogTitle>Set backup account</DialogTitle>
//       <List sx={{ pt: 0 }}>
//         {listOfValue.map((val:UserDetail) => (
//           <ListItem disablePadding key={val.email}>
//             <ListItemButton >
//               <ListItemAvatar>
//                 <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
//                   <PersonIcon />
//                 </Avatar>
//               </ListItemAvatar>
//               <ListItemText primary={val.email} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//         <ListItem disablePadding>
//           <ListItemButton
//             autoFocus
//             onClick={() => handleAddUser()}
//           >
//             <ListItemAvatar>
//               <Avatar>
//                 <AddIcon />
//               </Avatar>
//             </ListItemAvatar>
//             <ListItemText primary="Add User" />
//           </ListItemButton>
//         </ListItem>
//       </List>
//     </Dialog>
//     {isAdd &&<AddSubModal
//         open={open}
//         onClose={handleClose}
//         selectedValue={selectedValue}
//     />}
//     </React.Fragment>
//   );
// }

// export default AddMainModal
