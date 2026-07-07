import { createClient } from '@/lib/supabase/server'
import { uploadMedia, deleteMedia } from './actions'
import MediaGrid from '@/components/admin/MediaGrid'

export default async function AdminMediaPage() {
  const supabase = await createClient()
  const { data: files } = await supabase.storage.from('media').list('', {
    sortBy: { column: 'created_at', order: 'desc' },
  })

  const items = (files ?? [])
    .filter((f) => f.id) // skip placeholder/folder entries
    .map((f) => ({
      name: f.name,
      url: supabase.storage.from('media').getPublicUrl(f.name).data.publicUrl,
      size: f.metadata?.size ?? 0,
    }))

  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">Upload images here, then paste the copied URL into any content field.</p>

      <form action={uploadMedia} className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
        <input
          name="file" type="file" accept="image/*" required
          className="flex-1 text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-brand-900 file:text-white file:text-sm file:font-medium"
        />
        <button type="submit" className="bg-brand-900 text-white text-sm font-semibold rounded-lg px-4 py-2 hover:bg-brand-700">
          Upload
        </button>
      </form>

      <MediaGrid items={items} deleteMedia={deleteMedia} />
    </div>
  )
}
