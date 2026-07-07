'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'

type Plot = {
  id: string
  plot_number: string
  size_sqyd: number | null
  size_sqft: number | null
  facing: string | null
  base_price: number
  total_price: number | null
  status: string
}

const STATUSES = ['available', 'soft_hold', 'booked', 'sold']

export default function PlotsPanel({
  plots,
  createPlot,
  updatePlotStatus,
  deletePlot,
}: {
  plots: Plot[]
  createPlot: (formData: FormData) => Promise<void>
  updatePlotStatus: (plotId: string, status: string) => Promise<void>
  deletePlot: (plotId: string) => Promise<void>
}) {
  const [adding, setAdding] = useState(false)

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Plots ({plots.length})</h3>
        <button
          type="button" onClick={() => setAdding((v) => !v)}
          className="text-sm font-medium text-brand-700 hover:text-brand-900"
        >
          {adding ? 'Cancel' : '+ Add plot'}
        </button>
      </div>

      {adding && (
        <form
          action={async (formData) => { await createPlot(formData); setAdding(false) }}
          className="grid grid-cols-6 gap-2 mb-4 p-3 bg-gray-50 rounded-lg items-end"
        >
          <div>
            <label className="block text-xs text-gray-500 mb-1">Plot #</label>
            <input name="plot_number" required className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Sq.yd</label>
            <input name="size_sqyd" type="number" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Sq.ft</label>
            <input name="size_sqft" type="number" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Facing</label>
            <input name="facing" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Base price</label>
            <input name="base_price" type="number" required className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" />
          </div>
          <button type="submit" className="bg-brand-900 text-white text-sm font-medium rounded px-3 py-1.5">Add</button>
        </form>
      )}

      <table className="w-full text-sm">
        <thead className="text-left text-gray-500">
          <tr>
            <th className="py-2 font-medium">Plot #</th>
            <th className="py-2 font-medium">Size</th>
            <th className="py-2 font-medium">Facing</th>
            <th className="py-2 font-medium">Price</th>
            <th className="py-2 font-medium">Status</th>
            <th className="py-2 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {plots.map((p) => (
            <tr key={p.id}>
              <td className="py-2 font-medium text-gray-900">{p.plot_number}</td>
              <td className="py-2 text-gray-600">{p.size_sqyd ? `${p.size_sqyd} sqyd` : p.size_sqft ? `${p.size_sqft} sqft` : '—'}</td>
              <td className="py-2 text-gray-600 capitalize">{p.facing ?? '—'}</td>
              <td className="py-2 text-gray-600">₹{(p.total_price ?? p.base_price).toLocaleString('en-IN')}</td>
              <td className="py-2">
                <select
                  defaultValue={p.status}
                  onChange={(e) => updatePlotStatus(p.id, e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </td>
              <td className="py-2 text-right">
                <button
                  type="button"
                  onClick={() => { if (confirm('Delete this plot?')) deletePlot(p.id) }}
                  className="text-danger-600 hover:text-danger-700 hover:bg-danger-50 p-1 rounded-lg transition-colors inline-flex items-center justify-center align-middle"
                  title="Delete"
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {plots.length === 0 && <p className="text-center text-sm text-gray-400 py-6">No plots yet.</p>}
    </div>
  )
}
