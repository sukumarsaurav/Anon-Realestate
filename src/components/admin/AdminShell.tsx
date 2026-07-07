'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Building2, Newspaper, Star, Handshake, Users, Briefcase,
  FileText, Settings, Route, Image as ImageIcon, Contact, Menu, X, LogOut,
  Globe, ChevronRight, User,
} from 'lucide-react'
import { signOut } from '@/app/admin/actions'

const NAV: { group: string; items: { href: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] }[] = [
  { group: 'Overview', items: [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  ] },
  { group: 'Content', items: [
    { href: '/admin/projects', label: 'Projects', icon: Building2 },
    { href: '/admin/blog', label: 'Blog', icon: Newspaper },
    { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
    { href: '/admin/pages', label: 'Pages', icon: FileText },
  ] },
  { group: 'Directory', items: [
    { href: '/admin/developers', label: 'Developers', icon: Handshake },
    { href: '/admin/team', label: 'Team', icon: Users },
    { href: '/admin/careers', label: 'Careers', icon: Briefcase },
  ] },
  { group: 'Leads', items: [
    { href: '/admin/leads', label: 'Leads', icon: Contact },
  ] },
  { group: 'Site', items: [
    { href: '/admin/settings', label: 'Settings', icon: Settings },
    { href: '/admin/redirects', label: 'Redirects', icon: Route },
    { href: '/admin/media', label: 'Media', icon: ImageIcon },
  ] },
]

/** Derive a human-readable breadcrumb from the current pathname. */
function useBreadcrumb(pathname: string) {
  // Find the active nav item label
  for (const section of NAV) {
    for (const item of section.items) {
      const match = item.exact
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(item.href + '/')
      if (match) {
        // Check for sub-pages (e.g. /admin/projects/new → "Projects > New")
        const remainder = pathname.slice(item.href.length).replace(/^\//, '')
        if (remainder && remainder !== '') {
          const subLabel = remainder
            .split('/')[0]
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase())
          return { section: item.label, sectionHref: item.href, sub: subLabel }
        }
        return { section: item.label, sectionHref: item.href, sub: null }
      }
    }
  }
  return { section: 'Admin', sectionHref: '/admin', sub: null }
}

export default function AdminShell({
  children,
  userEmail,
  siteName = 'ANON INDIA',
  roleLabel = 'Administrator',
  userFullName,
}: {
  children: React.ReactNode
  userEmail: string
  siteName?: string
  roleLabel?: string
  userFullName?: string | null
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const breadcrumb = useBreadcrumb(pathname)

  // Close profile popover on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [profileOpen])

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

  // Extract initials for the avatar
  const initials = userFullName
    ? userFullName.charAt(0).toUpperCase()
    : userEmail.charAt(0).toUpperCase()

  const displayName = userFullName || userEmail

  const sidebarNav = (
    <>
      {/* Logo + brand header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-brand-900 flex items-center justify-center shrink-0 overflow-hidden">
          <Image
            src="/logo-symbol-white.png"
            alt={siteName}
            width={22}
            height={22}
            className="size-[22px] object-contain"
          />
        </div>
        <div className="min-w-0">
          <span className="font-display font-bold text-[15px] text-brand-900 block leading-tight truncate">{siteName}</span>
          <span className="text-[11px] text-gray-400 font-medium">Admin Panel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV.map((section) => (
          <div key={section.group}>
            <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">{section.group}</p>
            <div className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon, exact }) => {
                const active = isActive(href, exact)
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`group flex items-center gap-2.5 pl-3 pr-3 py-2 rounded-lg text-sm font-medium transition-all relative ${
                      active
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {/* Active left accent bar */}
                    {active && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-brand-700" />
                    )}
                    <Icon size={17} strokeWidth={active ? 2.2 : 1.8} className={active ? 'text-brand-700' : 'text-gray-400 group-hover:text-gray-600'} />
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* View site link */}
      <div className="px-3 pb-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 pl-3 pr-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
        >
          <Globe size={17} strokeWidth={1.8} className="text-gray-400" />
          View site
        </a>
      </div>

      {/* User profile at bottom */}
      <div className="border-t border-gray-100 relative" ref={profileRef}>
        {/* Profile popover */}
        {profileOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-xl border border-gray-200 shadow-lift overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-400 mt-0.5 capitalize">{roleLabel}</p>
            </div>
            <div className="py-1">
              <Link
                href="/admin/settings"
                onClick={() => { setProfileOpen(false); setMobileOpen(false) }}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <Settings size={15} strokeWidth={1.8} className="text-gray-400" />
                Settings
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 transition-colors"
                >
                  <LogOut size={15} strokeWidth={1.8} />
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Avatar button */}
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold font-display">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
            <p className="text-[11px] text-gray-400 capitalize">{roleLabel}</p>
          </div>
        </button>
      </div>
    </>
  )

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Desktop sidebar — fixed height, independently scrollable */}
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r border-gray-200 bg-white h-screen sticky top-0">
        {sidebarNav}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-50 flex flex-col w-72 bg-white h-full shadow-lift">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
            {sidebarNav}
          </aside>
        </div>
      )}

      {/* Main content column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top header bar with breadcrumb */}
        <header className="flex items-center justify-between gap-4 px-4 lg:px-8 h-14 border-b border-gray-200 bg-white shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm">
              <Link
                href="/admin"
                className="text-gray-400 hover:text-brand-900 font-medium transition-colors hidden sm:inline"
              >
                Admin
              </Link>
              <ChevronRight size={14} className="text-gray-300 hidden sm:block" />
              {breadcrumb.sub ? (
                <>
                  <Link
                    href={breadcrumb.sectionHref}
                    className="text-gray-400 hover:text-brand-900 font-medium transition-colors"
                  >
                    {breadcrumb.section}
                  </Link>
                  <ChevronRight size={14} className="text-gray-300" />
                  <span className="font-semibold text-gray-900 truncate max-w-[150px] sm:max-w-[300px]">
                    {breadcrumb.sub}
                  </span>
                </>
              ) : (
                <span className="font-semibold text-gray-900">
                  {breadcrumb.section}
                </span>
              )}
            </nav>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
