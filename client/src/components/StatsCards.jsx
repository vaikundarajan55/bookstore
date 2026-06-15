const cards = [
  {
    title: 'Total Revenue',
    value: '$84,254',
    change: '+12.5%',
    up: true,
    icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    color: 'violet',
  },
  {
    title: 'Active Users',
    value: '24,521',
    change: '+8.1%',
    up: true,
    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
    color: 'indigo',
  },
  {
    title: 'New Orders',
    value: '1,893',
    change: '-3.2%',
    up: false,
    icon: 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0',
    color: 'sky',
  },
  {
    title: 'Conversion Rate',
    value: '3.68%',
    change: '+1.4%',
    up: true,
    icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01l-3-3',
    color: 'emerald',
  },
]

const colorMap = {
  violet:  { bg: 'bg-violet-50',  icon: 'text-violet-500',  bar: 'bg-violet-400' },
  indigo:  { bg: 'bg-indigo-50',  icon: 'text-indigo-500',  bar: 'bg-indigo-400' },
  sky:     { bg: 'bg-sky-50',     icon: 'text-sky-500',     bar: 'bg-sky-400'    },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-500', bar: 'bg-emerald-400'},
}

function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const c = colorMap[card.color]
        return (
          <div
            key={card.title}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  className={c.icon}>
                  <path d={card.icon} />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`flex items-center gap-0.5 text-xs font-bold ${card.up ? 'text-emerald-500' : 'text-red-400'}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  {card.up
                    ? <polyline points="18 15 12 9 6 15" />
                    : <polyline points="6 9 12 15 18 9" />
                  }
                </svg>
                {card.change}
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
            {/* Mini bar */}
            <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${c.bar} rounded-full`} style={{ width: card.up ? '68%' : '35%' }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
export default StatsCards;
