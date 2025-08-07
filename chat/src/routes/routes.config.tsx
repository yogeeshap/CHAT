// import Layout from '../layout/layout'
// import AuthGuard from 'app/services/guards/AuthGuard'
import { Navigate, useRoutes,Outlet } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
// import templateHistoryRoutes from './templateHistory.routes'
// import templateConfigurationRoutes from './templateConfiguration.routes'
import chatRoutes from './chat.routs'
import Layout from '../layout/layout'

import authRoutes from './auth.routs'

// import faqRoutes from './faq.routes'

const routes: RouteObject[] = [
  {
    element: (
      <Outlet />
    ),
    children: [
      ...authRoutes,
      
    ]
  },
  {
    element: (
      <Layout />
    ),
    children: [
      ...chatRoutes,
      
    ],
  },
  { 
    path: '*', element: <Navigate to='/chat' /> 
  }
]

export const GlobalRoutes = () => useRoutes(routes)
