'use client'

import { Box, Paper, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom';

// const AccessDeninedImg = '/assets/AccessDenied.jpg'

export function OopsError() {

    const navigate = useNavigate();
    const handleLogin = ()=>{
        navigate("/login");
    }

  return (
    <Box component="main" sx={{
        height: '100vh',              // Full viewport height
        width: '100vw',               // Full viewport width (optional)
        display: 'grid',
        placeItems: 'center',         // Center both horizontally and vertically
        p: 4,
        gap: 4,
    }}>
        <Paper 
        elevation={2}
        sx={{ display: 'flex',
             flexDirection: 'column', 
             alignItems: 'center', 
             gap: 2,
             p:8
             }}>
          <Typography className='text-2xl font-semibold md:text-3xl'>
            Access Denied !!!
          </Typography>
          <p className='mt-4 mb-8 dark:text-gray-400'>
            Contact the website administrator to resolve.
          </p>
          <Button
            onClick={() => handleLogin()}
            variant='contained'
          >
            Back To Login
          </Button>
        </Paper>
      </Box>
  
  )
}
