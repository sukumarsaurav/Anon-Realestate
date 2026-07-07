import { createClient } from '@/lib/supabase/server'
import Pagination from '@/components/admin/Pagination'

const STAGE_COLORS: Record<string, string> = {
  new_lead: 'bg-gray-100 text-gray-600',
  contacted: 'bg-blue-100 text-blue-700',
  interested: 'bg-warning-100 text-warning-700',
  site_visit_scheduled: 'bg-warning-100 text-warning-700',
  site_visit_done: 'bg-warning-100 text-warning-700',
  negotiation: 'bg-gold-100 text-gold-700',
  token_paid: 'bg-success-100 text-success-700',
  closed_won: 'bg-success-100 text-success-700',
  not_interested: 'bg-danger-100 text-danger-700',
  future_followup: 'bg-gray-100 text-gray-600',
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string; q?: string; page?: string }>
}) {
  const resolvedParams = await searchParams
  const { stage, q, page } = resolvedParams
  const currentPage = Math.max(1, Number(page) || 1)
  const pageSize = 20
  const from = (currentPage - 1) * pageSize
  const to = from + pageSize - 1

  const supabase = await createClient()

  let dbQuery = supabase
    .from('leads')
    .select('id, full_name, phone, email, city, source, stage, temperature, score, created_at, project:projects(name)', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (stage) dbQuery = dbQuery.eq('stage', stage)
  if (q) dbQuery = dbQuery.or(`full_name.ilike.%${q}%,phone.ilike.%${q}%`)

  dbQuery = dbQuery.range(from, to)

  const { data: leads, count } = await dbQuery
  const totalPages = Math.ceil((count ?? 0) / pageSize)

  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">{count ?? 0} leads total (showing page {currentPage} of {totalPages || 1})</p>

      <form className="flex gap-3 mb-4">
        <input
          name="q" defaultValue={q} placeholder="Search name or phone…"
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <select name="stage" defaultValue={stage ?? ''} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">All stages</option>
          {Object.keys(STAGE_COLORS).map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
        <button type="submit" className="bg-brand-900 text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-brand-700 transition-colors">Filter</button>
      </form>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-gray-55 border-b border-gray-100 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Stage</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(leads ?? []).map((l) => (
              <tr key={l.id}>
                <td className="px-4 py-3 font-medium text-gray-900">{l.full_name}</td>
                <td className="px-4 py-3 text-gray-600">
                  <div>{l.phone}</div>
                  {l.email && <div className="text-xs text-gray-400">{l.email}</div>}
                </td>
                <td className="px-4 py-3 text-gray-600">{(l.project as unknown as { name: string } | null)?.name ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{l.source}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${STAGE_COLORS[l.stage] ?? 'bg-gray-100 text-gray-600'}`}>
                    {l.stage.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{l.score}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {new Date(l.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(leads ?? []).length === 0 && (
          <p className="text-center text-sm text-gray-400 py-10">No leads yet.</p>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          searchParams={resolvedParams}
        />
      </div>
    </div>
  )
}
