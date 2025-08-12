import Loadable from '../components/Loadable'
import { lazy } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'

const Chat = Loadable(lazy(() => import('../pages/chat/index')))
const MediaControllerWrapper = Loadable(lazy(() => import('../pages/chat/mediaControllerWrapper')))

const chatRoutes: RouteObject[] = [
    {
    path: '/',
    element: <Navigate to="/chat" replace />,
  },
  {
    path: '/chat',
    element: <Chat />,
  },
  {
    path: '/meet-me/:roomId/:userId',
    element: <MediaControllerWrapper />,
  },
  // {
  //   path: '/create-room',
  //   element: <Room />,
  // },
]

export default chatRoutes
