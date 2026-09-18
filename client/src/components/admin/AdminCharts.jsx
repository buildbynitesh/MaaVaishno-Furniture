import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts'

const salesData = [
  { month: 'Jan', revenue: 184000, orders: 48 },
  { month: 'Feb', revenue: 156000, orders: 39 },
  { month: 'Mar', revenue: 232000, orders: 62 },
  { month: 'Apr', revenue: 198000, orders: 54 },
  { month: 'May', revenue: 285000, orders: 78 },
  { month: 'Jun', revenue: 245000, orders: 66 },
  { month: 'Jul', revenue: 310000, orders: 89 },
]

const categoryData = [
  { name: 'Bedroom', value: 38 },
  { name: 'Living Room', value: 32 },
  { name: 'Dining', value: 18 },
  { name: 'Office', value: 12 },
]

const COLORS = ['#8B6914', '#C4A35A', '#3D2B1F', '#D4C5B0']

const formatINR = (val) => `₹${(val / 1000).toFixed(0)}K`

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-sand/30 rounded-xl p-3 shadow-luxury">
      <p className="font-body text-xs text-sand mb-2">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="font-body text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {entry.name === 'revenue' ? `₹${entry.value.toLocaleString('en-IN')}` : entry.value}
        </p>
      ))}
    </div>
  )
}

export function RevenueChart() {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <h3 className="font-display text-lg text-bark font-semibold mb-5">Revenue Overview</h3>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={salesData}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B6914" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#8B6914" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" vertical={false} />
          <XAxis dataKey="month" tick={{ fontFamily: 'DM Sans', fontSize: 12, fill: '#D4C5B0' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={formatINR} tick={{ fontFamily: 'DM Sans', fontSize: 12, fill: '#D4C5B0' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone" dataKey="revenue" stroke="#8B6914" strokeWidth={2.5}
            fill="url(#revenueGrad)" dot={{ fill: '#8B6914', r: 4 }} activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function OrdersBarChart() {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <h3 className="font-display text-lg text-bark font-semibold mb-5">Monthly Orders</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={salesData} barSize={24}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" vertical={false} />
          <XAxis dataKey="month" tick={{ fontFamily: 'DM Sans', fontSize: 12, fill: '#D4C5B0' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontFamily: 'DM Sans', fontSize: 12, fill: '#D4C5B0' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="orders" fill="#C4A35A" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CategoryPieChart() {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <h3 className="font-display text-lg text-bark font-semibold mb-5">Sales by Category</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
            {categoryData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(val) => `${val}%`} />
          <Legend formatter={(val) => <span style={{ fontFamily: 'DM Sans', fontSize: '12px', color: '#3D2B1F' }}>{val}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
