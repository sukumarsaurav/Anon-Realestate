'use client'

import { useState } from 'react'
import Link from 'next/link'
import SeoFields from './SeoFields'
import StringListRepeater from './StringListRepeater'
import ObjectListRepeater from './ObjectListRepeater'
import ImageUploadField from './ImageUploadField'
import { PROJECT_STATUS_LABELS, PROJECT_TYPE_LABELS } from '@/types'

type Developer = { id: string; name: string }

type Project = {
  id: string
  name: string
  type: string
  city: string
  locality: string | null
  address: string | null
  status: string
  description: string | null
  google_maps_pin: string | null
  rera_number: string | null
  rera_registration_date: string | null
  rera_expiry_date: string | null
  rera_authority_name: string | null
  rera_website_url: string | null
  total_units: number | null
  launch_date: string | null
  expected_completion_date: string | null
  developer_id: string | null
  starting_price: number | null
  price_per_sqft: number | null
  bhk_config: string | null
  website_category: string | null
  is_featured: boolean
  is_active: boolean
  developer_about: string | null
  amenities: string[]
  usp: string[]
  connectivity: { place: string; distance: string }[]
  faqs: { q: string; a: string }[]
  hero_image_url: string | null
  gallery_urls: string[]
  video_url: string | null
  virtual_tour_url: string | null
  layout_image_url: string | null
  brochure_url: string | null
  meta_title: string | null
  meta_description: string | null
  canonical_url: string | null
  og_image_url: string | null
  noindex: boolean
}

const TABS = ['Core Content', 'Media', 'SEO', 'Publish'] as const

export default function ProjectForm({
  project,
  developers,
  action,
  extraTabs,
}: {
  project?: Project
  developers: Developer[]
  action: (formData: FormData) => Promise<void>
  extraTabs?: { label: string; content: React.ReactNode }[]
}) {
  const [tab, setTab] = useState<string>('Core Content')
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState(project?.name ?? '')

  const allTabs = [...TABS, ...(extraTabs?.map((t) => t.label) ?? [])]

  return (
    <div className="max-w-3xl">
      <div className="flex gap-1 mb-4 border-b border-gray-200 overflow-x-auto">
        {allTabs.map((t) => (
          <button
            key={t} type="button" onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
              tab === t ? 'border-brand-900 text-brand-900' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Plots (and any other extraTabs) render their own <form>s, so they
          live outside this form to avoid invalid nested <form> elements. */}
      {extraTabs?.map((t) => (
        <div key={t.label} className={tab === t.label ? '' : 'hidden'}>{t.content}</div>
      ))}

      <form action={action} onSubmit={() => setSubmitting(true)} className={extraTabs?.some((t) => t.label === tab) ? 'hidden' : ''}>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
        <div className={tab === 'Core Content' ? 'space-y-5' : 'hidden'}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project name</label>
            <input
              name="name" required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select name="type" defaultValue={project?.type ?? 'plotted_development'} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                {Object.entries(PROJECT_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" defaultValue={project?.status ?? 'pre_launch'} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                {Object.entries(PROJECT_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Developer</label>
              <select name="developer_id" defaultValue={project?.developer_id ?? ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="">—</option>
                {developers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input name="city" required defaultValue={project?.city}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Locality</label>
              <input name="locality" defaultValue={project?.locality ?? ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input name="address" defaultValue={project?.address ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" rows={4} defaultValue={project?.description ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Starting price (₹)</label>
              <input name="starting_price" type="number" defaultValue={project?.starting_price ?? ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per sqft (₹)</label>
              <input name="price_per_sqft" type="number" defaultValue={project?.price_per_sqft ?? ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BHK config</label>
              <input name="bhk_config" defaultValue={project?.bhk_config ?? ''} placeholder="2,3,4 BHK"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website category</label>
              <input name="website_category" defaultValue={project?.website_category ?? ''} placeholder="residential / luxury / commercial"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total units</label>
              <input name="total_units" type="number" defaultValue={project?.total_units ?? ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Launch date</label>
              <input name="launch_date" type="date" defaultValue={project?.launch_date?.slice(0, 10) ?? ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected completion</label>
              <input name="expected_completion_date" type="date" defaultValue={project?.expected_completion_date?.slice(0, 10) ?? ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>

          <hr className="border-gray-100" />
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">RERA</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RERA number</label>
              <input name="rera_number" defaultValue={project?.rera_number ?? ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RERA authority</label>
              <input name="rera_authority_name" defaultValue={project?.rera_authority_name ?? ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration date</label>
              <input name="rera_registration_date" type="date" defaultValue={project?.rera_registration_date?.slice(0, 10) ?? ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry date</label>
              <input name="rera_expiry_date" type="date" defaultValue={project?.rera_expiry_date?.slice(0, 10) ?? ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RERA verification URL</label>
            <input name="rera_website_url" defaultValue={project?.rera_website_url ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps pin (embed URL)</label>
            <input name="google_maps_pin" defaultValue={project?.google_maps_pin ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>

          <hr className="border-gray-100" />
          <StringListRepeater name="amenities_json" label="Amenities" defaultValues={project?.amenities ?? []} placeholder="Club House" active={tab === 'Core Content'} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About the developer</label>
            <textarea name="developer_about" rows={3} defaultValue={project?.developer_about ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <StringListRepeater name="usp_json" label="Why invest (USPs)" defaultValues={project?.usp ?? []} placeholder="0% pre-EMI till possession" active={tab === 'Core Content'} />
          <ObjectListRepeater
            name="connectivity_json" label="Connectivity"
            fields={[{ key: 'place', placeholder: 'Airport' }, { key: 'distance', placeholder: '18 km' }]}
            defaultValues={project?.connectivity ?? []}
          />
          <ObjectListRepeater
            name="faqs_json" label="FAQs (overrides auto-generated ones)"
            fields={[{ key: 'q', placeholder: 'Question' }, { key: 'a', placeholder: 'Answer' }]}
            defaultValues={project?.faqs ?? []}
          />
        </div>

        <div className={tab === 'Media' ? 'space-y-5' : 'hidden'}>
          <ImageUploadField
            name="hero_image_url"
            label="Hero image"
            bucket="projects"
            defaultValue={project?.hero_image_url}
            accept="image"
            active={tab === 'Media'}
          />
          <StringListRepeater name="gallery_urls_json" label="Gallery images" defaultValues={project?.gallery_urls ?? []} placeholder="https://…" bucket="projects" active={tab === 'Media'} />
          <div className="grid grid-cols-2 gap-4">
            <ImageUploadField
              name="video_url"
              label="Project video"
              bucket="projects"
              defaultValue={project?.video_url}
              accept="video"
              active={tab === 'Media'}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Virtual tour URL <span className="text-gray-400 font-normal">(optional)</span></label>
              <input name="virtual_tour_url" defaultValue={project?.virtual_tour_url ?? ''}
                placeholder="Paste virtual tour embed URL"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ImageUploadField
              name="layout_image_url"
              label="Layout / floor plan"
              bucket="projects"
              defaultValue={project?.layout_image_url}
              accept="image+pdf"
              active={tab === 'Media'}
            />
            <ImageUploadField
              name="brochure_url"
              label="Brochure (PDF)"
              bucket="projects"
              defaultValue={project?.brochure_url}
              accept="pdf"
              active={tab === 'Media'}
            />
          </div>
        </div>

        <div className={tab === 'SEO' ? 'space-y-5' : 'hidden'}>
          <SeoFields
            defaultMetaTitle={project?.meta_title}
            defaultMetaDescription={project?.meta_description}
            defaultCanonicalUrl={project?.canonical_url}
            defaultOgImageUrl={project?.og_image_url}
            defaultNoindex={project?.noindex}
            fallbackTitle={name || 'Untitled project'}
            urlPreview={`anonindia.com › projects › ${project?.id ?? 'id'}`}
          />
          <ImageUploadField
            name="og_image_url"
            label="OG / social share image"
            bucket="projects"
            defaultValue={project?.og_image_url}
            accept="image"
            active={tab === 'SEO'}
          />
        </div>

        <div className={tab === 'Publish' ? 'space-y-4' : 'hidden'}>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input name="is_active" type="checkbox" defaultChecked={project?.is_active ?? true} className="rounded" />
            Active (visible on the public site)
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input name="is_featured" type="checkbox" defaultChecked={project?.is_featured ?? false} className="rounded" />
            Featured (shown in homepage carousel)
          </label>
        </div>

      </div>

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit" disabled={submitting}
          className="bg-brand-900 text-white text-sm font-semibold rounded-lg px-5 py-2.5 hover:bg-brand-700 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Saving…' : 'Save'}
        </button>
        <Link href="/admin/projects" className="text-sm text-gray-500 hover:text-gray-700">Back to list</Link>
      </div>
      </form>
    </div>
  )
}
