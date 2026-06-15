import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../Redux/slices/authSlice'

const notifications = [
  { id: 1, text: 'New user registered', time: '2m ago', unread: true },
  { id: 2, text: 'Server usage at 85%', time: '1h ago', unread: true },
  { id: 3, text: 'Monthly report ready', time: '3h ago', unread: false },
]

function Header({ sidebarOpen }) {
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const { user }   = useSelector(state => state.auth)   // ← pull real user from Redux

  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen,   setNotifOpen]   = useState(false)

  const handleLogout = async () => {
    setProfileOpen(false)
    await dispatch(logoutUser())
    navigate('/login')
  }

  return (
    <header className={`
      fixed top-0 right-0 z-30 h-16 bg-white border-b border-gray-100
      flex items-center px-4 gap-3 transition-all duration-300
      ${sidebarOpen ? 'left-56' : 'left-16'}
    `}>

      {/* Brand */}
      <div className="flex items-center gap-2 mr-auto">
        <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 inline-block" />
        <span className="font-bold text-gray-900 text-base tracking-tight hidden sm:block">
          Acme <span className="text-violet-500">HQ</span>
        </span>
      </div>

      {/* Search */}
      <div className="relative hidden md:block">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search…"
          className="pl-8 pr-4 py-1.5 text-sm rounded-lg bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 w-48 transition-all"
        />
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setNotifOpen(o => !o); setProfileOpen(false) }}
          className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        {notifOpen && (
          <div className="absolute right-0 top-11 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-[fadeUp_0.2s_ease-out_both]">
            <p className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">Notifications</p>
            {notifications.map(n => (
              <div key={n.id} className={`px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex gap-3 items-start transition-colors ${n.unread ? 'bg-violet-50/40' : ''}`}>
                <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${n.unread ? 'bg-violet-500' : 'bg-gray-200'}`} />
                <div>
                  <p className="text-sm text-gray-700">{n.text}</p>
                  <p className="text-xs text-gray-400">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="relative">
        <button
          onClick={() => { setProfileOpen(o => !o); setNotifOpen(false) }}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            alt="User avatar"
            className="w-8 h-8 rounded-full bg-violet-100 object-cover border-2 border-violet-200"
          />
          <div className="hidden sm:block text-left">
            {/* ── Real user data from Redux ── */}
            <p className="text-sm font-semibold text-gray-800 leading-none">
              {user?.emp_name || 'User'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {user?.emp_role || 'Member'}
            </p>
          </div>
          <svg className="text-gray-400 ml-1 hidden sm:block" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-[fadeUp_0.2s_ease-out_both]">
            <div className="px-4 py-2 border-b border-gray-100 mb-1">
              <p className="text-sm font-semibold text-gray-800">
                {user?.emp_name || 'User'}
              </p>
              <p className="text-xs text-gray-400">
                {user?.emp_email || ''}
              </p>
            </div>
            {[
              { icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', label: 'Profile' },
              { icon: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', label: 'Settings' },
              { icon: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9', label: 'Logout', danger: true },
            ].map(item => (
              <button
                key={item.label}
                onClick={item.label === 'Logout' ? handleLogout : undefined}  // ← only Logout is wired
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-gray-50 ${item.danger ? 'text-red-500 hover:bg-red-50' : 'text-gray-600'}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d={item.icon}/>
                </svg>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header