import Loadable from '../components/Loadable'
import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const Login = Loadable(lazy(() => import('../components/login.compent')))
const Register = Loadable(lazy(() => import('../components/register.component')))

const authRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]

export default authRoutes
