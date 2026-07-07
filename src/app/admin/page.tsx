import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Building2, Newspaper, Contact, Star, Plus, ArrowRight, Phone, Mail, Sparkles } from 'lucide-react'

export const revalidate = 0 // Dynamic admin page

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Parallel data fetching for stats and feeds
  const [projectsRes, blogsRes, leadsRes, testimonialsRes, recentLeadsRes] = await Promise.all([
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
    supabase.from('leads').select('id', { count: 'exact', head: true }),
    supabase.from('testimonials').select('id', { count: 'exact', head: true }),
    supabase
      .from('leads')
      .select('id, full_name, phone, email, source, stage, created_at, project:projects(name)')
      .order('created_at', { ascending: false })
      .limit(5)
  ])

  const projectsCount = projectsRes.count ?? 0
  const blogsCount = blogsRes.count ?? 0
  const leadsCount = leadsRes.count ?? 0
  const testimonialsCount = testimonialsRes.count ?? 0
  const recentLeads = recentLeadsRes.data ?? []

  const STAGE_BADGES: Record<string, string> = {
    new_lead: 'bg-blue-50 text-blue-700 border-blue-100',
    contacted: 'bg-orange-50 text-orange-700 border-orange-100',
    interested: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    site_visit_scheduled: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    site_visit_done: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    negotiation: 'bg-purple-50 text-purple-700 border-purple-100',
    token_paid: 'bg-green-50 text-green-700 border-green-100',
    closed_won: 'bg-green-50 text-green-700 border-green-100',
    not_interested: 'bg-red-50 text-red-700 border-red-100',
    future_followup: 'bg-gray-50 text-gray-700 border-gray-100',
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-display">Workspace Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time statistics, lead activity, and site settings for anonindia.com.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Projects', count: projectsCount, icon: Building2, color: 'text-blue-600 bg-blue-50', link: '/admin/projects' },
          { label: 'Leads Received', count: leadsCount, icon: Contact, color: 'text-amber-600 bg-amber-50', link: '/admin/leads' },
          { label: 'Blog Posts', count: blogsCount, icon: Newspaper, color: 'text-emerald-600 bg-emerald-50', link: '/admin/blog' },
          { label: 'Testimonials', count: testimonialsCount, icon: Star, color: 'text-purple-600 bg-purple-50', link: '/admin/testimonials' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.link} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-soft hover:shadow-lift transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2 font-display">{stat.count}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color} transition-transform group-hover:scale-105`}>
                  <Icon size={22} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Recent Leads Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles size={18} className="text-gold-700" /> Recent Leads
            </h2>
            <Link href="/admin/leads" className="text-xs font-semibold text-gold-700 hover:text-brand-900 flex items-center gap-0.5 transition-colors">
              View all leads <ArrowRight size={12} />
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Client Name</th>
                    <th className="px-5 py-3.5 font-semibold">Project / Source</th>
                    <th className="px-5 py-3.5 font-semibold">Stage</th>
                    <th className="px-5 py-3.5 font-semibold">Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentLeads.map((lead) => {
                    const initials = lead.full_name ? lead.full_name.charAt(0).toUpperCase() : 'L'
                    return (
                      <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 font-bold text-xs font-display">
                              {initials}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{lead.full_name}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                                <span className="flex items-center gap-0.5"><Phone size={10} /> {lead.phone}</span>
                                {lead.email && <span className="flex items-center gap-0.5"><Mail size={10} /> {lead.email}</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-gray-700 font-medium truncate max-w-[150px]">
                            {(lead.project as unknown as { name: string } | null)?.name ?? 'General Callback'}
                          </p>
                          <p className="text-xs text-gray-400 capitalize mt-0.5">{lead.source}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${STAGE_BADGES[lead.stage] ?? 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                            {lead.stage.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-500">
                          {new Date(lead.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </td>
                      </tr>
                    )
                  })}
                  {recentLeads.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-sm text-gray-400 py-12">
                        No incoming leads recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Actions Panel */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-soft space-y-3.5">
            {[
              { label: 'Create New Project', desc: 'Add RERA verified real estate listings', href: '/admin/projects/new', icon: Building2 },
              { label: 'Write New Blog Post', desc: 'Publish property guides & updates', href: '/admin/blog/new', icon: Newspaper },
              { label: 'Add Testimonial', desc: 'Feature reviews from homeowners', href: '/admin/testimonials/new', icon: Star },
            ].map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.label} href={action.href} className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-gold-200 hover:bg-gold-50/10 transition-all group text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center shrink-0 transition-colors group-hover:bg-gold-50 group-hover:text-gold-700">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{action.label}</p>
                      <p className="text-[11px] text-gray-400 truncate">{action.desc}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 transition-colors group-hover:bg-brand-50 group-hover:text-brand-700 shrink-0">
                    <Plus size={16} />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
