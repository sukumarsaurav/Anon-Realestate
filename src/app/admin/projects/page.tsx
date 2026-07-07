import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { deleteProject } from './actions'
import DeleteButton from '@/components/admin/DeleteButton'
import Pagination from '@/components/admin/Pagination'
import { PROJECT_STATUS_LABELS } from '@/types'

import { Pencil } from 'lucide-react'

export default async function AdminProjectsPage({
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
  const { data: projects, count } = await supabase
    .from('projects')
    .select('id, name, city, status, is_active, is_featured, developer:developers(name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  const totalPages = Math.ceil((count ?? 0) / pageSize)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{count ?? 0} total</p>
        <Link
          href="/admin/projects/new"
          className="bg-brand-900 text-white text-sm font-semibold rounded-lg px-4 py-2 hover:bg-brand-700 transition-colors"
        >
          + New project
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-gray-55 border-b border-gray-100 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">City</th>
              <th className="px-4 py-3 font-medium">Developer</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Active</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(projects ?? []).map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {p.name}
                  {p.is_featured && <span className="ml-2 px-1.5 py-0.5 bg-gold-100 text-gold-700 rounded text-xs">Featured</span>}
                </td>
                <td className="px-4 py-3 text-gray-600">{p.city}</td>
                <td className="px-4 py-3 text-gray-600">{(p.developer as unknown as { name: string } | null)?.name ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{PROJECT_STATUS_LABELS[p.status] ?? p.status}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.is_active ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-1.5">
                  <Link
                    href={`/admin/projects/${p.id}`}
                    className="text-brand-700 hover:text-brand-900 hover:bg-brand-50 p-1 rounded-lg transition-colors inline-flex items-center justify-center align-middle"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </Link>
                  <span className="inline-block align-middle">
                    <DeleteButton action={deleteProject.bind(null, p.id)} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(projects ?? []).length === 0 && (
          <p className="text-center text-sm text-gray-400 py-10">No projects yet.</p>
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
