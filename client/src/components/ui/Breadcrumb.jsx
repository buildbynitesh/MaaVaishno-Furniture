import { Link } from 'react-router-dom'
import { FiChevronRight, FiHome } from 'react-icons/fi'

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 font-body text-sm text-sand mb-6 flex-wrap">
      <Link to="/" className="flex items-center gap-1 hover:text-wood transition-colors">
        <FiHome className="w-3.5 h-3.5" />
        Home
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <FiChevronRight className="w-3.5 h-3.5 text-sand/50" />
          {item.to ? (
            <Link to={item.to} className="hover:text-wood transition-colors">{item.label}</Link>
          ) : (
            <span className="text-bark font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
