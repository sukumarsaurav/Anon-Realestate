import { createClient } from '@/lib/supabase/server'
import { createRedirect, toggleRedirectActive, deleteRedirect } from './actions'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function AdminRedirectsPage() {
  const supabase = await createClient()
  const { data: redirects } = await supabase.from('redirects').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">Takes effect within 5 minutes (cached at the edge).</p>

      <form action={createRedirect} className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 grid grid-cols-5 gap-3 items-end">
        <div>
          <label className="block text-xs text-gray-500 mb-1">From path</label>
          <input name="from_path" required placeholder="/old-page" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">To path</label>
          <input name="to_path" required placeholder="/new-page" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Status code</label>
          <select name="status_code" defaultValue="301" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
            <option value="301">301 (permanent)</option>
            <option value="302">302 (temporary)</option>
            <option value="307">307 (temporary)</option>
            <option value="308">308 (permanent)</option>
          </select>
        </div>
        <button type="submit" className="bg-brand-900 text-white text-sm font-medium rounded-lg px-4 py-2">Add redirect</button>
      </form>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-4 py-3 font-medium">To</th>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(redirects ?? []).map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-mono text-xs text-gray-900">{r.from_path}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.to_path}</td>
                <td className="px-4 py-3 text-gray-600">{r.status_code}</td>
                <td className="px-4 py-3">
                  <form action={toggleRedirectActive.bind(null, r.id, !r.is_active)}>
                    <button
                      type="submit"
                      className={`px-2 py-1 rounded-full text-xs font-medium ${r.is_active ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {r.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton action={deleteRedirect.bind(null, r.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(redirects ?? []).length === 0 && (
          <p className="text-center text-sm text-gray-400 py-10">No redirects yet.</p>
        )}
      </div>
    </div>
  )
}
