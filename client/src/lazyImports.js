import { lazy } from 'react'

export const MainLayout = lazy(() => import('./layouts/MainLayout'))
export const Login    = lazy(() => import('./pages/admin/Login'))
export const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
export const UserList = lazy(() => import('./pages/admin/UserList'))
export const BookList = lazy(() => import('./pages/admin/BookList'))

/* export const Register = lazy(() => import('./pages/Register'))

export const Profile  = lazy(() => import('./pages/Profile')) */