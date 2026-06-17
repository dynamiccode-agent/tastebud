import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-gray-100 flex" style={{ maxWidth: '100%' }}>
      {/* Sidebar */}
      <div className="w-56 bg-white shadow-sm flex-shrink-0 flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <Logo size="xs" />
          <p className="text-xs text-gray-400 mt-1">Admin Dashboard</p>
        </div>
        <nav className="p-3 flex-1 space-y-1">
          {[
            { href: '/admin', label: 'Orders', emoji: '📋' },
            { href: '/admin/menu', label: 'Menu', emoji: '🍽️' },
            { href: '/admin/tables', label: 'Tables', emoji: '📍' },
          ].map(({ href, label, emoji }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors font-medium"
            >
              <span>{emoji}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">← Back to app</Link>
        </div>
      </div>
      {/* Main */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}
