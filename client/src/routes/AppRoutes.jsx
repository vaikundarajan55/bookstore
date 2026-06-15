// AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Suspense } from 'react'
import { Login, Dashboard, UserList ,MainLayout, BookList} from '../lazyImports'

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
        <Route path="/login"  element={isLoggedIn ? <Navigate to="/dashboard" replace/> : <Login />} />
        {/* Protected Routes with MainLayout */}
        <Route element={ isLoggedIn ? <MainLayout /> : <Navigate to="/login" replace />} >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/userlist" element={<UserList />} />
          <Route path="/booklist" element={<BookList />} />

        </Route>
        {/* Default Redirect */}
        <Route path="*" element={ <Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace /> } />

      </Routes>
    </Suspense>
  )
}

export default AppRoutes