import { lazy } from 'react'

export const Home = lazy(() => import("./pages/website/Home"));
export const MainLayout = lazy(() => import('./layouts/MainLayout'))
export const WebLayout = lazy(() => import('./layouts/WebLayout'))
export const Login    = lazy(() => import('./pages/admin/Login'))
export const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
export const UserList = lazy(() => import('./pages/admin/UserList'))
export const BookList = lazy(() => import('./pages/admin/BookList'))
export const SignIn = lazy(() => import('./pages/website/SignIn'))
export const SignUp = lazy(() => import('./pages/website/SignUp'))
export const Cart = lazy(() => import('./pages/website/Cart'))
export const Checkout = lazy(() => import('./pages/website/Checkout'))
export const ShopList = lazy(() => import('./pages/website/ShopList'))

/* export const Register = lazy(() => import('./pages/Register'))

export const Profile  = lazy(() => import('./pages/Profile')) */