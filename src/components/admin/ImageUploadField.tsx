'use client'

import { useRef, useState } from 'react'
import { Upload, X, FileText } from 'lucide-react'
import { uploadToStorage } from '@/app/admin/_actions/upload'

type AcceptType = 'image' | 'video' | 'pdf' | 'image+pdf'

const ACCEPT_MAP: Record<AcceptType, string> = {
  image: 'image/*',
  video: 'video/*',
  pdf: 'application/pdf',
  'image+pdf': 'image/*,application/pdf',
}

interface ImageUploadFieldProps {
  /** The hidden <input> name that will hold the final URL (submitted with the parent form) */
  name: string
  /** Human-readable label shown above the field */
  label: string
  /** Supabase Storage bucket to upload into */
  bucket: string
  /** Current value (existing URL from the database) */
  defaultValue?: string | null
  /** Which file types to accept; defaults to "image" */
  accept?: AcceptType
  /** Whether the field is optional */
  optional?: boolean
  /** Whether the preview media should be rendered */
  active?: boolean
}

function isImageUrl(url: string) {
  return /\.(png|jpe?g|gif|webp|svg|avif)(\?|$)/i.test(url)
}

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url)
}

export default function ImageUploadField({
  name,
  label,
  bucket,
  defaultValue,
  accept = 'image',
  optional = true,
  active = true,
}: ImageUploadFieldProps) {
  const [url, setUrl] = useState<string>(defaultValue ?? '')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const publicUrl = await uploadToStorage(bucket, fd)
      setUrl(publicUrl)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setUploading(false)
      // reset file input so the same file can be re-uploaded if needed
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function handleClear() {
    setUrl('')
    setError(null)
  }

  const acceptStr = ACCEPT_MAP[accept]

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {optional && <span className="ml-1 text-gray-400 font-normal">(optional)</span>}
        </label>
        <div className="flex items-center gap-2">
          {/* Upload button */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
          >
            <Upload size={13} strokeWidth={2} />
            {uploading ? 'Uploading…' : 'Upload file'}
          </button>
          {url && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-danger-500 transition-colors"
              aria-label="Clear"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept={acceptStr}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Hidden field submitted with the form */}
      <input type="hidden" name={name} value={url} />

      {/* URL text input — allows manual paste as well */}
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={`Paste URL or upload a file above`}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 text-gray-600"
      />

      {/* Error */}
      {error && (
        <p className="text-xs text-danger-600 flex items-center gap-1">
          <X size={12} /> {error}
        </p>
      )}

      {/* Preview */}
      {active && url && (
        <div className="relative mt-1 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          {isVideoUrl(url) ? (
            <video
              src={url}
              controls
              className="w-full max-h-52 object-contain bg-black"
            />
          ) : isImageUrl(url) || accept === 'image' || accept === 'image+pdf' ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={url}
              alt="Preview"
              loading="lazy"
              decoding="async"
              className="w-full max-h-52 object-contain"
              onError={(e) => {
                // if not actually an image (e.g. PDF), show a placeholder
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-600">
              <FileText size={16} className="text-brand-700 shrink-0" />
              <span className="truncate">{url.split('/').pop()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
