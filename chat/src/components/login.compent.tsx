'use client'

import { Box, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAppDispatch } from '../services/hooks/store-hooks'
// import authenticationService from '../services/authentication/authentication.service'
import { setAuth } from '../store/slice/authSlice'
import authService from '../services/auth.service'
import { useCallback, useState } from 'react'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Minimum 8 characters')
    .matches(/[A-Z]/, 'One uppercase required')
    .matches(/[a-z]/, 'One lowercase required')
    .matches(/[0-9]/, 'One number required')
    .matches(/[\W_]/, 'One special character required')
    .required('Password is required'),
})

const Login: React.FC  =()=>{

 
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const [showPassword, setShowPassword] = useState(false)
  
  const dispatch = useAppDispatch()

  const onSubmit = useCallback(async (data: any) => {
    

    const res = await authService.login(data)
    dispatch(setAuth({ user: res.data.user }))
    
    navigate('/') // Do your actual login here
  },[])

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev)
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
        sx={{ 
             display: 'flex',
             flexDirection: 'column', 
             alignItems: 'center', 
             gap: 2,
             p:8
             }}>
        <Stack
          spacing={2}
          component='form'
          direction='column'
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            label='Email'
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label='Password'
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
            endAdornment: (
            <InputAdornment position="end">
                <IconButton
                onClick={handleTogglePassword}
                edge="end"
                aria-label="toggle password visibility"
                >
                {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
            </InputAdornment>
            ),
        }}
          />

          <Button type='submit' variant='contained'>
            Sign In
          </Button>
        </Stack>

        <Box sx={{ 
            display: 'flex',
            gap: 1, 
            flexWrap: 'wrap', 
            justifyContent: 'center' 
        }}>
        <Typography 
            variant="h6" 
            component={Link}
            to="/register"
            sx={{
                fontSize: '1rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                color: 'primary.main'
            }}
            >
            Sign Up
            </Typography>
        </Box>
      </Paper>
      </Box>
  )
}

export default Login
