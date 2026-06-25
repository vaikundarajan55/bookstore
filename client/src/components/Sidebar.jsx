import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'   // ← add

const navItems = [
  { icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10', label: 'Dashboard',    path: '/dashboard' },
  { icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75', label: 'Users',         path: '/admin/userlist' },
  { icon: 'M18 20V10 M12 20V4 M6 20v-6',                                                           label: 'BookList',    path: '/admin/booklist' },
  { icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8', label: 'Reports', path: '/reports' },
  { icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',                       label: 'Messages',     path: '/messages',  badge: 3 },
  { icon: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z',                               label: 'Integrations', path: '/integrations' },
  { icon: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', label: 'Settings', path: '/settings' },
]

function InitialsAvatar({ name, size = 'w-8 h-8' }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'
  return (
    <div className={`${size} rounded-full bg-violet-100 border-2 border-violet-200 flex items-center justify-center flex-shrink-0`}>
      <span className="text-xs font-bold text-violet-600">{initials}</span>
    </div>
  )
}

function Sidebar({ open, setSidebarOpen }) {
  const navigate  = useNavigate()                         // ← add
  const location  = useLocation()                         // ← active state from URL
  const { user }  = useSelector(state => state.auth)

  const handleNavClick = (item) => {
    navigate(item.path)                                   // ← navigate on click
    // close sidebar on mobile after navigation (optional)
    // setSidebarOpen(false)
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 z-20
        flex flex-col bg-white border-r border-gray-100
        transition-all duration-300 ease-in-out overflow-hidden
        ${open ? 'w-56' : 'w-16'}
      `}>
        {/* Logo */}
        <div className={`h-16 flex-shrink-0 flex items-center border-b border-gray-100 transition-all duration-300 ${open ? 'px-4 gap-3' : 'justify-center'}`}>
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex-shrink-0 inline-block" />
          <span className={`font-bold text-gray-900 text-base tracking-tight whitespace-nowrap transition-all duration-300 overflow-hidden ${open ? 'opacity-100 max-w-[120px]' : 'opacity-0 max-w-0'}`}>
            Acme <span className="text-violet-500">HQ</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path   // ← URL-based active check

            return (
              <div
                key={item.label}
                className={`
                  relative group flex items-center rounded-xl transition-all duration-200
                  ${isActive ? 'bg-violet-50 text-violet-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}
                `}
              >
                {/* Icon — toggles sidebar open/close */}
                <button
                  onClick={() => setSidebarOpen(o => !o)}
                  className="flex-shrink-0 w-11 h-10 flex items-center justify-center rounded-xl transition-colors duration-200"
                  aria-label={`Toggle sidebar`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                </button>

                {/* Label — navigates to page */}
                <button
                  onClick={() => handleNavClick(item)}         // ← navigate here
                  className={`
                    flex-1 flex items-center gap-2 pr-3 py-2.5 text-sm font-medium text-left
                    transition-all duration-300 overflow-hidden whitespace-nowrap
                    ${open ? 'opacity-100 max-w-[160px]' : 'opacity-0 max-w-0 pointer-events-none'}
                  `}
                >
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto bg-violet-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* Tooltip when collapsed */}
                {!open && (
                  <div
                    onClick={() => handleNavClick(item)}       // ← also navigate from tooltip
                    className="
                      absolute left-14 top-1/2 -translate-y-1/2
                      bg-gray-900 text-white text-xs font-medium
                      px-2.5 py-1.5 rounded-lg whitespace-nowrap cursor-pointer
                      pointer-events-none
                      opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto
                      translate-x-1 group-hover:translate-x-0
                      transition-all duration-200 z-50
                    "
                  >
                    {item.label}
                    {item.badge && (
                      <span className="ml-1.5 bg-violet-400 text-white text-[9px] font-bold rounded-full px-1">
                        {item.badge}
                      </span>
                    )}
                    <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* User card */}
        <div className={`p-3 border-t border-gray-100 transition-all duration-300 ${open ? '' : 'flex justify-center'}`}>
          {open ? (
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl bg-gray-50">
              <InitialsAvatar name={user?.emp_name} />
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.emp_name || 'User'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.emp_email || ''}</p>
              </div>
            </div>
          ) : (
            <InitialsAvatar name={user?.emp_name} />
          )}
        </div>
      </aside>
    </>
  )
}

export default Sidebar