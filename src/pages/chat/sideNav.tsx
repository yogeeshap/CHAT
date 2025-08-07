import React from 'react';
import { Drawer, List, Toolbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import ListItemLink  from '../../components/ListItemLink'

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <List>
        <ListItemLink to="/dashboard" primary="Dashboard" icon={<DashboardIcon />} />
        <ListItemLink to="/users" primary="Users" icon={<PeopleIcon />} />
        <ListItemLink to="/settings" primary="Settings" icon={<SettingsIcon />} />
      </List>
    </Drawer>
  );
};

export default Sidebar;
