import { createClient } from '@/lib/supabase/server'
import { updateSiteSettings, updateSiteTheme } from './actions'
import ImageUploadField from '@/components/admin/ImageUploadField'
import StringListRepeater from '@/components/admin/StringListRepeater'
import ObjectListRepeater from '@/components/admin/ObjectListRepeater'
import type { SiteSettings } from '@/lib/queries'
import { THEME_PRESETS, DEFAULT_THEME_ID } from '@/lib/themes'
import ThemePicker from '@/components/admin/ThemePicker'

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single()
  const settings = data as SiteSettings | null
  const activeTheme = settings?.theme_name ?? DEFAULT_THEME_ID

  return (
    <div className="space-y-6">
      <div className="max-w-2xl bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Site theme</h2>
          <p className="text-xs text-gray-400 mt-1">Choose the color palette used across the public website.</p>
        </div>
        <ThemePicker themes={THEME_PRESETS} activeTheme={activeTheme} action={updateSiteTheme} />
      </div>

      <form action={updateSiteSettings} className="max-w-2xl bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Site name</label>
          <input name="site_name" required defaultValue={settings?.site_name}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title template</label>
          <input name="default_title_template" required defaultValue={settings?.default_title_template}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <p className="text-xs text-gray-400 mt-1">Use %s where the page title should appear.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Default meta description</label>
          <textarea name="default_meta_description" rows={2} defaultValue={settings?.default_meta_description ?? ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
        <ImageUploadField
          name="default_og_image_url"
          label="Default OG image"
          bucket="media"
          defaultValue={settings?.default_og_image_url}
          accept="image"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
          <input name="address" defaultValue={settings?.address ?? ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>

        <hr className="border-gray-100" />
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Social URLs</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
            <input name="facebook_url" defaultValue={settings?.facebook_url ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
            <input name="instagram_url" defaultValue={settings?.instagram_url ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">X (Twitter) URL</label>
            <input name="twitter_url" defaultValue={settings?.twitter_url ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
            <input name="youtube_url" defaultValue={settings?.youtube_url ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
            <input name="linkedin_url" defaultValue={settings?.linkedin_url ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
        </div>

        <hr className="border-gray-100" />
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Contact &amp; tracking</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact email</label>
            <input name="contact_email" defaultValue={settings?.contact_email ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact phone</label>
            <input name="contact_phone" defaultValue={settings?.contact_phone ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp number</label>
            <input name="whatsapp_number" defaultValue={settings?.whatsapp_number ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GA measurement ID</label>
            <input name="ga_measurement_id" defaultValue={settings?.ga_measurement_id ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Pixel ID</label>
            <input name="meta_pixel_id" defaultValue={settings?.meta_pixel_id ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
        </div>

        <hr className="border-gray-100" />
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Dynamic Content Lists</p>
        <div className="space-y-5">
          <StringListRepeater
            name="rera_registrations_json"
            label="RERA Registrations (Footer)"
            defaultValues={settings?.rera_registrations ?? []}
            placeholder="State — Registration Number"
          />

          <StringListRepeater
            name="lead_capture_bullets_json"
            label="Lead Capture Band Bullets"
            defaultValues={settings?.lead_capture_bullets ?? []}
            placeholder="Bullet point text"
          />

          <StringListRepeater
            name="team_levels_json"
            label="Valid Team Level Options"
            defaultValues={settings?.team_levels ?? []}
            placeholder="e.g. leadership"
          />

          <ObjectListRepeater
            name="why_choose_us_json"
            label="Why Choose Us Cards"
            fields={[
              { key: 'icon', placeholder: 'Icon name (ShieldCheck/Headphones/Cpu/Award)' },
              { key: 'title', placeholder: 'Card Title' },
              { key: 'description', placeholder: 'Card Description' }
            ]}
            defaultValues={(settings?.why_choose_us as Record<string, string>[]) ?? []}
          />

          <ObjectListRepeater
            name="instagram_reels_json"
            label="Instagram Reels Section"
            fields={[
              { key: 'image_url', placeholder: 'Reel cover image URL', type: 'upload' },
              { key: 'caption', placeholder: 'Reel caption text' }
            ]}
            defaultValues={(settings?.instagram_reels as Record<string, string>[]) ?? []}
          />

          <ObjectListRepeater
            name="city_images_json"
            label="Custom City Cover Images (Override)"
            fields={[
              { key: 'city', placeholder: 'City name (e.g. Gurugram)' },
              { key: 'image_url', placeholder: 'City image URL', type: 'upload' }
            ]}
            defaultValues={(settings?.city_images as Record<string, string>[]) ?? []}
          />
        </div>

        <button
          type="submit"
          className="bg-brand-900 text-white text-sm font-semibold rounded-lg px-5 py-2.5 hover:bg-brand-700 transition-colors"
        >
          Save settings
        </button>
      </form>
    </div>
  )
}
