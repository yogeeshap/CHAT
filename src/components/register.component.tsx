'use client'

import { Box, IconButton, InputAdornment, Paper, Stack, TextField } from '@mui/material'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import authService from '../services/auth.service'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useState } from 'react'

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required'),

  email: yup
    .string()
    .email('Invalid email')
    .required('Email is required'),

  password: yup
    .string()
    .min(8, 'Minimum 8 characters')
    .matches(/[A-Z]/, 'One uppercase required')
    .matches(/[a-z]/, 'One lowercase required')
    .matches(/[0-9]/, 'One number required')
    .matches(/[\W_]/, 'One special character required')
    .required('Password is required'),
})


const Register: React.FC=()=> {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data: any) => {
    await authService.register(data)
    navigate('/login') // Do your actual login here
  }

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
        sx={{ display: 'flex',
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
            label='UserName'
            {...register('username')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
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
            Sign Up
          </Button>
        </Stack>
     </Paper>
      </Box>
  )
}

export default Register
