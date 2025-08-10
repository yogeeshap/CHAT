import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { ThemeProvider} from '@mui/material';
import {
  AppProvider,
  type Navigation,
  type Session,
} from "@toolpad/core/AppProvider";
import {
  DashboardLayout,
  ThemeSwitcher,
  type SidebarFooterProps,
} from "@toolpad/core/DashboardLayout";
import { Account } from "@toolpad/core/Account";
import { useDemoRouter } from "@toolpad/core/internal";
import { useNavigate } from "react-router-dom";
import Chat from "./chat";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../services/hooks/store-hooks";
import { Button } from "@mui/material";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import authService from "../../services/auth.service";
import CreateRoomModal from "./CreateRoomModel";
import { theme } from "../../theme/theme";


interface RoomProps {
  roomId: string;
  userId: string;
}

const chatBoxTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          textTransform: 'none',
          color: '#11c111 !important',
          backgroundColor: '#eded567d !important',
        },
        text: {
          fontWeight: 'bold',
          textTransform: 'none',
        },
        contained: {
          fontWeight: 'bold',
          textTransform: 'none',
        },
      },
    },

    // 🔧 ADD THIS
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#11c111 !important',
            backgroundColor: '#eded567d !important',
          },
          '&.Mui-selected:hover': {
            backgroundColor: '#eded567d !important',
          },
        },
      },
    },
  },
});


function ChatBoxPage({ pathname }: { pathname: string }) {
  const [, roomId, userId] = pathname.match(/[^\/]+/g) || [];

  const activeRoomUser = useAppSelector<RoomProps>(
    (state) => state.chat.activeRoomUser || {}
  );

  const activeRoomId = roomId || activeRoomUser.roomId
  const activeUserId = userId || activeRoomUser.userId

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "-webkit-fill-available",
      }}
    >
      <Chat roomId={activeRoomId} userId={activeUserId} />
    </Box>
  );
}

function ChatSearch() {
  return (
    <Stack direction="row">
      <Tooltip title="Search" enterDelay={1000}>
        <div>
          <IconButton
            type="button"
            aria-label="search"
            sx={{
              display: { xs: "inline", md: "none" },
            }}
          >
            <SearchIcon />
          </IconButton>
        </div>
      </Tooltip>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        slotProps={{
          input: {
            endAdornment: (
              <IconButton type="button" aria-label="search" size="small">
                <SearchIcon />
              </IconButton>
            ),
            sx: { pr: 0.5 },
          },
        }}
        sx={{ display: { xs: "none", md: "inline-block" }, mr: 1 }}
      />
      <ThemeSwitcher />
      <Account />
    </Stack>
  );
}

function SidebarFooter({ mini }: SidebarFooterProps) {
  return (
    <Typography
      variant="caption"
      sx={{ m: 1, whiteSpace: "nowrap", overflow: "hidden" }}
    >
      {mini ? "© W" : `© ${new Date().getFullYear()} Made with love by MUI`}
    </Typography>
  );
}

function CustomAppTitle() {
  const [openCreate, setOpenCreate] = useState(false);

  const handleCreateRoom = useCallback(() => {
    setOpenCreate(true);
  }, []);

  const handleCreateClose = () => {
    setOpenCreate(false);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Button variant="contained" onClick={handleCreateRoom}>
        CREATE ROOM
      </Button>
      <CreateRoomModal open={openCreate} onClose={handleCreateClose} />
    </Stack>
  );
}

interface DemoProps {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window?: () => Window;
}

type UserDetail = {
  user_id?: string;
  username?: string;
  email?: string;
  room_name?: string;
  room_id?: string;
};

const NavigationData = [
  {
    segment: "",
    title: "No Room",
    icon: <HourglassEmptyRoundedIcon />,
  },
];

export default function ChatBoxLayout(props: DemoProps) {
  
  const { window } = props;
  const router = useDemoRouter("/chat");
  // Remove this const when copying and pasting into your project.
  const chatBoxWindow = window !== undefined ? window() : undefined;
  const [navigation, setNavigation] = useState<Navigation>(NavigationData);

  const [session, setSession] = useState<Session | null>();
  const navigate = useNavigate();

  const roomUserDetails = useAppSelector<UserDetail[]>(
    (state) => state.chat.roomUser || []
  );

  const logedInUser = useAppSelector<UserDetail>((state) => state.auth.user);

  

  const authentication = useMemo(() => {
    return {
      signIn: () => {
        setSession({ user: logedInUser });
        navigate("/login");
      },
      signOut: async () => {
        await authService.logout();
        setSession(null);
        navigate("/login");
      },
    };
  }, [logedInUser, navigate]); // include dependencies!

  useEffect(() => {
    
      const roomUserDetailsData = roomUserDetails?.map((user: any) => {
        return {
          segment: `chat/${user["room_id"]}/${user["user_id"]}}`,
          title: user["room_name"],
          icon: <AccountCircleIcon />,
        };
      });
      setNavigation(roomUserDetailsData);
 

    if (logedInUser) {
      setSession({ user: logedInUser });
    }
  }, [roomUserDetails, logedInUser]);

  return (
    // Remove this provider when copying and pasting into your project.
    <Box sx={{position:"relative",width:'100%',height:'100%'}}>
    <AppProvider
      navigation={navigation}
      router={router}
      theme={chatBoxTheme}
      window={chatBoxWindow}
      authentication={authentication}
      session={session}
    >
      <DashboardLayout
        slots={{
          appTitle: CustomAppTitle,
          toolbarActions: ChatSearch,
          sidebarFooter: SidebarFooter,
        }}
      >
        <ThemeProvider theme={theme}>
        <ChatBoxPage pathname={router.pathname} />
        </ThemeProvider>
      </DashboardLayout>
    </AppProvider>
 
</Box>
  );
}
