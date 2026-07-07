'use client'

import { Trash2 } from 'lucide-react'

export default function DeleteButton({
  action,
  confirmLabel = 'Delete this item? This cannot be undone.',
}: {
  action: () => Promise<void>
  confirmLabel?: string
}) {
  return (
    <button
      onClick={() => {
        if (confirm(confirmLabel)) action()
      }}
      className="text-danger-600 hover:text-danger-700 hover:bg-danger-50 p-1 rounded-lg transition-colors inline-flex items-center justify-center"
      title="Delete"
      aria-label="Delete"
    >
      <Trash2 size={16} />
    </button>
  )
}
