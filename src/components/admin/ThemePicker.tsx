'use client'

import type { ThemePreset } from '@/lib/themes'

export default function ThemePicker({
  themes,
  activeTheme,
  action,
}: {
  themes: ThemePreset[]
  activeTheme: string
  action: (formData: FormData) => void
}) {
  return (
    <form action={action} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {themes.map((theme) => (
        <label
          key={theme.id}
          className={`cursor-pointer rounded-xl border-2 p-3 transition-colors ${
            theme.id === activeTheme ? 'border-brand-900' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <input
            type="radio"
            name="theme_name"
            value={theme.id}
            defaultChecked={theme.id === activeTheme}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
            className="sr-only"
          />
          <div className="flex gap-1.5 mb-2">
            <span className="h-6 w-6 rounded-full border border-black/5" style={{ backgroundColor: `rgb(${theme.brand['900']})` }} />
            <span className="h-6 w-6 rounded-full border border-black/5" style={{ backgroundColor: `rgb(${theme.gold['500']})` }} />
          </div>
          <span className="block text-xs font-medium text-gray-700">{theme.label}</span>
        </label>
      ))}
    </form>
  )
}
