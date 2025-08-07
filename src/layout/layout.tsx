'use client'

import { Container } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '../services/hooks/store-hooks'
import { setRoomUser } from '../store/slice/chatSlice'
import chatService from '../services/chat.service'
import { AccessDenied } from '../components/unauthorize.component'
import { Loading } from '../components/Loading'

function Layout() {
  const [isAuthorised, setAuthorised] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(true)
  // const { errorNotification } = useNotification()
  const dispatch = useAppDispatch()
  useEffect(() => {
    ; (async () => {
      try {
        const res = await chatService.roomUsers({})
        dispatch(setRoomUser({ roomUser: res.data.users }))
     
      } catch (err: any) {
        if (err.response.status === 401) {
          setAuthorised(false)
          // window.alert("error occuered")
          // errorNotification('Un-Authorized')
        } else {
          // errorNotification()
          window.alert("error occuered")
        }
        console.error(err)
      } finally {
        setLoading(false)
      }
    })()
  }, [dispatch])

  if (loading) {
    return <Loading />
  }

  if (!isAuthorised) {
    return <AccessDenied />
  }

  return (
    <>
      <Container
        maxWidth='xl'
        disableGutters
        sx={{ height: '-webkit-fill-available' }} // TODO: padding bottom not working
      >
        <Outlet />
      </Container>
    </>
  )
}

export default Layout
