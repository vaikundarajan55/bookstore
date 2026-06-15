import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const data = [
  { month: 'Jan', revenue: 30000, users: 4200 },
  { month: 'Feb', revenue: 42000, users: 5800 },
  { month: 'Mar', revenue: 38000, users: 5100 },
  { month: 'Apr', revenue: 55000, users: 7400 },
  { month: 'May', revenue: 48000, users: 6600 },
  { month: 'Jun', revenue: 67000, users: 9200 },
  { month: 'Jul', revenue: 72000, users: 10100 },
  { month: 'Aug', revenue: 61000, users: 8700 },
  { month: 'Sep', revenue: 84000, users: 11500 },
  { month: 'Oct', revenue: 79000, users: 10800 },
  { month: 'Nov', revenue: 91000, users: 12400 },
  { month: 'Dec', revenue: 84254, users: 13200 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }} className="font-medium">
            {p.name === 'revenue' ? '$' : ''}{p.value.toLocaleString()}
            {p.name === 'users' ? ' users' : ''}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function Chart() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-gray-900">Revenue & Growth</h2>
          <p className="text-xs text-gray-400 mt-0.5">12-month performance overview</p>
        </div>
        <div className="flex gap-2">
          {['1M','3M','6M','1Y'].map((t, i) => (
            <button key={t} className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${i === 3 ? 'bg-violet-500 text-white' : 'text-gray-400 hover:bg-gray-100'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(v) => <span style={{ fontSize: 12, color: '#6b7280', textTransform: 'capitalize' }}>{v}</span>}
          />
          <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} fill="url(#gradRevenue)" dot={false} activeDot={{ r: 5, fill: '#8b5cf6' }} />
          <Area type="monotone" dataKey="users"   stroke="#6366f1" strokeWidth={2} fill="url(#gradUsers)"   dot={false} activeDot={{ r: 5, fill: '#6366f1' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
export default Chart;