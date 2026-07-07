import { createClient } from '@/lib/supabase/server'
import { updatePage } from '../actions'

export default async function EditPagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: page } = await supabase.from('pages').select('*').eq('slug', slug).maybeSingle()

  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">
        {page ? 'This page has CMS content.' : 'No CMS content yet — the page currently falls back to its code defaults. Save below to start managing it here.'}
      </p>

      <form action={updatePage.bind(null, slug)} className="max-w-2xl bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero eyebrow</label>
            <input name="hero_eyebrow" defaultValue={page?.hero_eyebrow ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero image URL</label>
            <input name="hero_image_url" defaultValue={page?.hero_image_url ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hero title</label>
          <input name="hero_title" defaultValue={page?.hero_title ?? ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hero subtitle</label>
          <input name="hero_subtitle" defaultValue={page?.hero_subtitle ?? ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content blocks (JSON)</label>
          <textarea
            name="blocks" rows={14} defaultValue={JSON.stringify(page?.blocks ?? {}, null, 2)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Structured content specific to this page (stats, values, initiatives, etc.) — edited as JSON for now.
          </p>
        </div>

        <hr className="border-gray-100" />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta title</label>
            <input name="meta_title" defaultValue={page?.meta_title ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta description</label>
            <input name="meta_description" defaultValue={page?.meta_description ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
        </div>

        <button type="submit" className="bg-brand-900 text-white text-sm font-semibold rounded-lg px-5 py-2.5 hover:bg-brand-700 transition-colors">
          Save page
        </button>
      </form>
    </div>
  )
}
