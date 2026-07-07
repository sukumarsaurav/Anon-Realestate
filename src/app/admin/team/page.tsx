import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { deleteTeamMember } from './actions'
import DeleteButton from '@/components/admin/DeleteButton'
import Pagination from '@/components/admin/Pagination'

import { Pencil } from 'lucide-react'

export default async function AdminTeamPage({
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
  const { data: members, count } = await supabase
    .from('team_members')
    .select('id, name, designation, level, is_public, sort_order', { count: 'exact' })
    .order('sort_order')
    .range(from, to)

  const totalPages = Math.ceil((count ?? 0) / pageSize)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{count ?? 0} total</p>
        <Link
          href="/admin/team/new"
          className="bg-brand-900 text-white text-sm font-semibold rounded-lg px-4 py-2 hover:bg-brand-700 transition-colors"
        >
          + New team member
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-gray-55 border-b border-gray-100 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Designation</th>
              <th className="px-4 py-3 font-medium">Level</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(members ?? []).map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-3 font-medium text-gray-900">{m.name}</td>
                <td className="px-4 py-3 text-gray-600">{m.designation ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">{m.level ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${m.is_public ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-500'}`}>
                    {m.is_public ? 'Public' : 'Hidden'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-1.5">
                  <Link
                    href={`/admin/team/${m.id}`}
                    className="text-brand-700 hover:text-brand-900 hover:bg-brand-50 p-1 rounded-lg transition-colors inline-flex items-center justify-center align-middle"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </Link>
                  <span className="inline-block align-middle">
                    <DeleteButton action={deleteTeamMember.bind(null, m.id)} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(members ?? []).length === 0 && (
          <p className="text-center text-sm text-gray-400 py-10">No team members yet.</p>
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
