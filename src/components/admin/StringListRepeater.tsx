'use client'

import { useState, useRef } from 'react'
import { Plus, X, Upload } from 'lucide-react'
import { uploadToStorage } from '@/app/admin/_actions/upload'

export default function StringListRepeater({
  name,
  label,
  defaultValues,
  placeholder,
  bucket,
  active = true,
}: {
  name: string
  label: string
  defaultValues: string[]
  placeholder?: string
  bucket?: string
  active?: boolean
}) {
  const [items, setItems] = useState(defaultValues.length ? defaultValues : [''])
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const fileRefs = useRef<(HTMLInputElement | null)[]>([])

  function update(i: number, value: string) {
    setItems((prev) => prev.map((v, idx) => (idx === i ? value : v)))
  }
  function remove(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function handleUpload(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !bucket) return
    setUploadingIndex(i)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const publicUrl = await uploadToStorage(bucket, fd)
      update(i, publicUrl)
    } catch (err) {
      alert((err as Error).message)
    } finally {
      setUploadingIndex(null)
      if (fileRefs.current[i]) fileRefs.current[i]!.value = ''
    }
  }

  const cleaned = items.map((v) => v.trim()).filter(Boolean)

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input type="hidden" name={name} value={JSON.stringify(cleaned)} />
      <div className="space-y-3">
        {items.map((value, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex items-center gap-2">
              <input
                value={value} placeholder={placeholder} onChange={(e) => update(i, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              />
              {bucket && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => { fileRefs.current[i] = el }}
                    className="hidden"
                    onChange={(e) => handleUpload(i, e)}
                  />
                  <button
                    type="button"
                    onClick={() => fileRefs.current[i]?.click()}
                    disabled={uploadingIndex !== null}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-55 hover:bg-brand-100 border border-brand-200 rounded-lg px-2.5 py-2 transition-colors disabled:opacity-50 shrink-0"
                  >
                    <Upload size={13} />
                    {uploadingIndex === i ? 'Uploading…' : 'Upload'}
                  </button>
                </>
              )}
              <button type="button" onClick={() => remove(i)} className="p-1.5 text-gray-400 hover:text-danger-600 shrink-0">
                <X size={16} />
              </button>
            </div>
            {active && value && bucket && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={value}
                alt={`Preview ${i}`}
                loading="lazy"
                decoding="async"
                className="h-16 w-auto object-contain rounded border border-gray-200 bg-gray-50 ml-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            )}
          </div>
        ))}
      </div>
      <button
        type="button" onClick={() => setItems((prev) => [...prev, ''])}
        className="mt-2 flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-900"
      >
        <Plus size={14} /> Add
      </button>
    </div>
  )
}
