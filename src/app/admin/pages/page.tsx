import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const KNOWN_PAGES = [
  { slug: 'about', label: 'About' },
  { slug: 'vision', label: 'Vision' },
  { slug: 'csr', label: 'CSR' },
  { slug: 'awards', label: 'Awards' },
  { slug: 'events', label: 'Events' },
  { slug: 'gallery', label: 'Gallery' },
]

export default async function AdminPagesPage() {
  const supabase = await createClient()
  const { data: pages } = await supabase.from('pages').select('slug, updated_at')
  const bySlug = new Map((pages ?? []).map((p) => [p.slug, p]))

  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">Edit content blocks for static marketing pages.</p>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Page</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {KNOWN_PAGES.map((p) => {
              const row = bySlug.get(p.slug)
              return (
                <tr key={p.slug}>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.label}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${row ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-500'}`}>
                      {row ? 'CMS content set' : 'Using code defaults'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/pages/${p.slug}`} className="text-brand-700 hover:text-brand-900 font-medium">Edit</Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
