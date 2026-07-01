// AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Suspense } from 'react'
import { Login, Dashboard, UserList ,MainLayout,WebLayout, BookList, Home, SignIn, SignUp, Cart} from '../lazyImports'


const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-500 rounded-full animate-spin" />
  </div>
)

function AppRoutes() {
  const isLoggedIn = useSelector(state => state.auth.isAuthenticated) // from Redux

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        
         {/* Public Web Routes with WebLayout */}
        <Route element={<WebLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/cart" element={<Cart />} />
        </Route>

        <Route path="/admin"  element={isLoggedIn ? (<Navigate to="/admin/dashboard" replace/>) : (<Login />) } />
        {/* Protected Routes with MainLayout */}
        <Route element={ isLoggedIn ? <MainLayout /> : <Navigate to="/admin" replace />} >
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/userlist" element={<UserList />} />
          <Route path="/admin/booklist" element={<BookList />} />
        </Route>
        {/* Default Redirect */}
        <Route path="*" element={ <Navigate to="/" replace /> } />

      </Routes>
    </Suspense>
  )
}

export default AppRoutes