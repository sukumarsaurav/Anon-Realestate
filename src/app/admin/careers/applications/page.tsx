import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Pagination from '@/components/admin/Pagination'

export default async function AdminCareerApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const resolvedParams = await searchParams
  const currentPage = Math.max(1, Number(resolvedParams.page) || 1)
  const pageSize = 15
  const from = (currentPage - 1) * pageSize
  const to = from + pageSize - 1

  const supabase = await createClient()
  const { data: applications, count } = await supabase
    .from('career_applications')
    .select('id, name, phone, email, stage, current_company, experience_years, created_at, listing_id, career_listings(title)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  const totalPages = Math.ceil((count ?? 0) / pageSize)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/careers" className="text-sm text-gray-500 hover:text-gray-700">← Careers</Link>
          <p className="text-sm text-gray-500 mt-1">{count ?? 0} total</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-gray-55 border-b border-gray-100 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Applicant</th>
              <th className="px-4 py-3 font-medium">Applied for</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Experience</th>
              <th className="px-4 py-3 font-medium">Stage</th>
              <th className="px-4 py-3 font-medium">Applied</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(applications ?? []).map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3 font-medium text-gray-900">{a.name}</td>
                <td className="px-4 py-3 text-gray-600">
                  {(a.career_listings as unknown as { title: string } | null)?.title ?? '—'}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  <div>{a.phone}</div>
                  {a.email && <div className="text-xs text-gray-400">{a.email}</div>}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {a.current_company ? `${a.current_company}` : '—'}
                  {a.experience_years ? ` (${a.experience_years}y)` : ''}
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                    {a.stage.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(applications ?? []).length === 0 && (
          <p className="text-center text-sm text-gray-400 py-10">No applications yet.</p>
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
