import { useState } from 'react'

const allRows = [
  { id: '#10821', customer: 'Sara Wilson',   email: 'sara@mail.com',  amount: '$240.00', status: 'Paid',    date: 'Dec 12, 2024' },
  { id: '#10820', customer: 'James Park',    email: 'james@mail.com', amount: '$89.00',  status: 'Pending', date: 'Dec 12, 2024' },
  { id: '#10819', customer: 'Mia Chen',      email: 'mia@mail.com',   amount: '$550.00', status: 'Paid',    date: 'Dec 11, 2024' },
  { id: '#10818', customer: 'Noah Williams', email: 'noah@mail.com',  amount: '$130.00', status: 'Failed',  date: 'Dec 11, 2024' },
  { id: '#10817', customer: 'Emma Davis',    email: 'emma@mail.com',  amount: '$320.00', status: 'Paid',    date: 'Dec 10, 2024' },
  { id: '#10816', customer: 'Liam Johnson',  email: 'liam@mail.com',  amount: '$75.00',  status: 'Pending', date: 'Dec 10, 2024' },
  { id: '#10815', customer: 'Olivia Brown',  email: 'oli@mail.com',   amount: '$410.00', status: 'Paid',    date: 'Dec 09, 2024' },
]

const statusStyle = {
  Paid:    'bg-emerald-50 text-emerald-600',
  Pending: 'bg-amber-50   text-amber-600',
  Failed:  'bg-red-50     text-red-500',
}

function DataTable() {
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('All')
  const statuses = ['All', 'Paid', 'Pending', 'Failed']

  const rows = allRows.filter(r =>
    (filter === 'All' || r.status === filter) &&
    (r.customer.toLowerCase().includes(search.toLowerCase()) ||
     r.id.includes(search))
  )

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Table header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-bold text-gray-900">Recent Transactions</h2>
          <p className="text-xs text-gray-400 mt-0.5">{rows.length} orders found</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter tabs */}
          <div className="flex gap-1 bg-gray-50 rounded-lg p-1">
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${filter === s ? 'bg-white shadow-sm text-violet-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {s}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 w-36 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {['Order ID','Customer','Amount','Status','Date',''].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{row.id}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-xs font-bold text-violet-600 flex-shrink-0">
                      {row.customer.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-xs">{row.customer}</p>
                      <p className="text-gray-400 text-[11px]">{row.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 font-semibold text-gray-800">{row.amount}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusStyle[row.status]}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-gray-400 text-xs">{row.date}</td>
                <td className="px-5 py-3.5">
                  <button className="text-gray-300 hover:text-violet-500 transition-colors">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-400">Showing {rows.length} of {allRows.length} results</p>
        <div className="flex gap-1">
          {['‹', '1', '2', '3', '›'].map((p, i) => (
            <button key={i} className={`w-7 h-7 text-xs rounded-lg font-medium transition-colors ${p === '1' ? 'bg-violet-500 text-white' : 'text-gray-400 hover:bg-gray-100'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DataTable;