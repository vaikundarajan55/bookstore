import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../Redux/slices/authSlice'

const notifications = [
  { id: 1, text: 'New user registered', time: '2m ago', unread: true },
  { id: 2, text: 'Server usage at 85%', time: '1h ago', unread: true },
  { id: 3, text: 'Monthly report ready', time: '3h ago', unread: false },
]

function Header({ sidebarOpen }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)

  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const profileRef = useRef(null)
  const notifRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = async () => {
    setProfileOpen(false)
    await dispatch(logoutUser())
    navigate('/admin')
  }

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1);   opacity: 1; }
          50%       { transform: scale(1.4); opacity: 0.7; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes badgePop {
          0%   { transform: scale(0); }
          70%  { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .header-dropdown {
          animation: slideDown 0.2s cubic-bezier(0.16,1,0.3,1) both;
        }
        .notif-badge {
          animation: badgePop 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }
        .pulse-dot {
          animation: pulse-dot 2s ease-in-out infinite;
        }
        .brand-shimmer {
          background: linear-gradient(90deg, #7c3aed, #6366f1, #a78bfa, #7c3aed);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .search-glow:focus-within {
          box-shadow: 0 0 0 3px rgba(139,92,246,0.15);
        }
        .nav-btn {
          position: relative;
          transition: all 0.2s ease;
        }
        .nav-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 10px;
          background: radial-gradient(circle at center, rgba(139,92,246,0.15) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .nav-btn:hover::after { opacity: 1; }
        .nav-btn:active { transform: scale(0.95); }
        .profile-ring {
          transition: box-shadow 0.2s ease;
        }
        .profile-ring:hover {
          box-shadow: 0 0 0 3px rgba(139,92,246,0.3);
        }
        .notif-item {
          transition: all 0.15s ease;
          border-left: 3px solid transparent;
        }
        .notif-item:hover {
          border-left-color: #7c3aed;
          background: linear-gradient(90deg, rgba(139,92,246,0.05), transparent);
        }
        .menu-item {
          position: relative;
          overflow: hidden;
          transition: all 0.15s ease;
        }
        .menu-item::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 0;
          background: linear-gradient(90deg, rgba(139,92,246,0.1), transparent);
          transition: width 0.2s ease;
        }
        .menu-item:hover::before { width: 100%; }
      `}</style>

      <header className={`
        fixed top-0 right-0 z-30 h-16
        flex items-center px-4 gap-3
        transition-all duration-300
        ${sidebarOpen ? 'left-56' : 'left-16'}
        ${scrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm'
          : 'bg-white border-b border-gray-100'
        }
      `}>

        {/* Brand */}
        <div className="flex items-center gap-2 mr-auto">
          <div className="relative w-8 h-8">
            <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 animate-[pulse_3s_ease-in-out_infinite] opacity-70" />
            <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </span>
          </div>
          <span className="font-extrabold text-base tracking-tight hidden sm:block brand-shimmer">
            Acme HQ
          </span>
        </div>

        {/* Search */}
        <div className={`relative hidden md:block search-glow rounded-xl transition-all duration-300 ${searchFocused ? 'w-64' : 'w-48'}`}>
          <svg
            className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${searchFocused ? 'text-violet-400' : 'text-gray-300'}`}
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search…"
            className="w-full pl-8 pr-4 py-1.5 text-sm rounded-xl bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-300 outline-none focus:border-violet-300 transition-all duration-300"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(o => !o); setProfileOpen(false) }}
            className="nav-btn relative p-2 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              className={notifOpen ? 'text-violet-500' : ''}
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unreadCount > 0 && (
              <span className="notif-badge absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center">
                <span className="text-white text-[9px] font-bold px-1">{unreadCount}</span>
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="header-dropdown absolute right-0 top-12 w-76 bg-white rounded-2xl shadow-2xl border border-gray-100/80 py-2 z-50 overflow-hidden"
              style={{ width: '300px' }}
            >
              {/* Header */}
              <div className="px-4 py-2 flex items-center justify-between border-b border-gray-50 mb-1">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Notifications</p>
                <span className="text-xs text-violet-500 font-semibold cursor-pointer hover:text-violet-700 transition-colors">
                  Mark all read
                </span>
              </div>

              {notifications.map((n, i) => (
                <div
                  key={n.id}
                  className={`notif-item px-4 py-3 cursor-pointer flex gap-3 items-start ${n.unread ? 'bg-violet-50/30' : ''}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${n.unread ? 'bg-violet-500 pulse-dot' : 'bg-gray-200'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 font-medium">{n.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                  {n.unread && (
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                  )}
                </div>
              ))}

              <div className="px-4 pt-2 pb-1 border-t border-gray-50 mt-1">
                <button className="w-full text-xs text-center text-violet-500 hover:text-violet-700 font-semibold py-1 transition-colors">
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false) }}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            <div className="relative">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="User avatar"
                className="profile-ring w-8 h-8 rounded-full bg-violet-100 object-cover border-2 border-violet-200"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-800 leading-none">
                {user?.emp_name || 'User'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                {user?.emp_role || 'Member'}
              </p>
            </div>
            <svg
              className={`text-gray-400 ml-1 hidden sm:block transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {profileOpen && (
            <div className="header-dropdown absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100/80 py-2 z-50 overflow-hidden">
              {/* User info */}
              <div className="px-4 py-3 border-b border-gray-50 mb-1">
                <div className="flex items-center gap-3">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                    alt=""
                    className="w-9 h-9 rounded-full border-2 border-violet-200"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 leading-none">
                      {user?.emp_name || 'User'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {user?.emp_email || ''}
                    </p>
                  </div>
                </div>
                <div className="mt-2.5 px-2 py-1 rounded-lg bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100">
                  <p className="text-xs text-violet-600 font-medium text-center">{user?.emp_role || 'Member'}</p>
                </div>
              </div>

              {[
                { icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', label: 'Profile', color: 'text-gray-600' },
                { icon: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', label: 'Settings', color: 'text-gray-600' },
                { icon: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9', label: 'Logout', color: 'text-red-500', danger: true },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={item.label === 'Logout' ? handleLogout : undefined}
                  className={`menu-item w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                    ${item.danger ? 'text-red-500 hover:bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
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
    </>
  )
}

export default Header