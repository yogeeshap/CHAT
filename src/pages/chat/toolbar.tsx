import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const AppToolbar: React.FC = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          My App Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;
