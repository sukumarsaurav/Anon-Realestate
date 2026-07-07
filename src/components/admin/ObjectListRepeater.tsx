'use client'

import { useRef, useState } from 'react'
import { Plus, X, Upload } from 'lucide-react'
import { uploadToStorage } from '@/app/admin/_actions/upload'

interface RepeaterField {
  key: string
  placeholder: string
  /** 'upload' renders a file-upload button (image bucket) next to the text input. */
  type?: 'text' | 'upload'
  /** Storage bucket to upload into when type is 'upload'. Defaults to 'media'. */
  bucket?: string
}

export default function ObjectListRepeater({
  name,
  label,
  fields,
  defaultValues,
}: {
  name: string
  label: string
  fields: RepeaterField[]
  defaultValues: Record<string, string>[]
}) {
  const empty = Object.fromEntries(fields.map((f) => [f.key, '']))
  const [items, setItems] = useState<Record<string, string>[]>(defaultValues.length ? defaultValues : [empty])
  const [uploadingCell, setUploadingCell] = useState<string | null>(null)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  function update(i: number, key: string, value: string) {
    setItems((prev) => prev.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)))
  }
  function remove(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function handleUpload(i: number, field: RepeaterField, file: File | undefined) {
    if (!file) return
    const cellId = `${i}-${field.key}`
    setUploadingCell(cellId)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const publicUrl = await uploadToStorage(field.bucket ?? 'media', fd)
      update(i, field.key, publicUrl)
    } catch (err) {
      alert((err as Error).message)
    } finally {
      setUploadingCell(null)
      const input = fileRefs.current[cellId]
      if (input) input.value = ''
    }
  }

  const cleaned = items.filter((row) => Object.values(row).some((v) => v.trim()))

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input type="hidden" name={name} value={JSON.stringify(cleaned)} />
      <div className="space-y-2">
        {items.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            {fields.map((f) => {
              const cellId = `${i}-${f.key}`
              return f.type === 'upload' ? (
                <div key={f.key} className="flex-1 flex items-center gap-1.5">
                  <input
                    value={row[f.key] ?? ''} placeholder={f.placeholder}
                    onChange={(e) => update(i, f.key, e.target.value)}
                    className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <input
                    ref={(el) => { fileRefs.current[cellId] = el }}
                    type="file" accept="image/*" className="hidden"
                    onChange={(e) => handleUpload(i, f, e.target.files?.[0])}
                  />
                  <button
                    type="button"
                    onClick={() => fileRefs.current[cellId]?.click()}
                    disabled={uploadingCell === cellId}
                    className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-lg px-2.5 py-2 transition-colors disabled:opacity-50"
                  >
                    <Upload size={13} strokeWidth={2} />
                    {uploadingCell === cellId ? 'Uploading…' : 'Upload'}
                  </button>
                </div>
              ) : (
                <input
                  key={f.key} value={row[f.key] ?? ''} placeholder={f.placeholder}
                  onChange={(e) => update(i, f.key, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              )
            })}
            <button type="button" onClick={() => remove(i)} className="p-1.5 text-gray-400 hover:text-danger-600">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button" onClick={() => setItems((prev) => [...prev, { ...empty }])}
        className="mt-2 flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-900"
      >
        <Plus size={14} /> Add
      </button>
    </div>
  )
}
