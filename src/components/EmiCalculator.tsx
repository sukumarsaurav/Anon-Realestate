'use client'

import { useState } from 'react'
import { Calculator, MessageCircle } from 'lucide-react'

interface Props {
  defaultPrice?: number
}

function calcEmi(principal: number, annualRate: number, tenureYears: number) {
  const r  = annualRate / (12 * 100)
  const n  = tenureYears * 12
  if (r === 0) return principal / n
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

export default function EmiCalculator({ defaultPrice = 2000000 }: Props) {
  const [price,    setPrice]    = useState(defaultPrice)
  const [downPct,  setDownPct]  = useState(20)
  const [rate,     setRate]     = useState(8.5)
  const [tenure,   setTenure]   = useState(15)
  const [showCtA,  setShowCta]  = useState(false)

  const loanAmt    = price * (1 - downPct / 100)
  const emi        = calcEmi(loanAmt, rate, tenure)
  const totalAmt   = emi * tenure * 12
  const totalInt   = totalAmt - loanAmt
  const waNumber   = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') ?? '919876543210'
  const waMsg      = `Hi, I calculated EMI of ${fmt(emi)}/mo for a property worth ${fmt(price)}. Can you help with home loan?`

  function handleCalc() {
    setShowCta(true)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
          <Calculator size={16} className="text-blue-600" />
        </div>
        <h3 className="font-bold text-gray-900">EMI Calculator</h3>
      </div>

      <div className="space-y-5">
        {/* Property price */}
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <label className="text-gray-600 font-medium">Property Price</label>
            <span className="font-bold text-gray-900">{fmt(price)}</span>
          </div>
          <input type="range" min={500000} max={20000000} step={100000}
            value={price} onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full accent-blue-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>₹5L</span><span>₹2Cr</span>
          </div>
        </div>

        {/* Down payment */}
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <label className="text-gray-600 font-medium">Down Payment</label>
            <span className="font-bold text-gray-900">{downPct}% ({fmt(price * downPct / 100)})</span>
          </div>
          <input type="range" min={5} max={50} step={5}
            value={downPct} onChange={(e) => setDownPct(Number(e.target.value))}
            className="w-full accent-blue-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>5%</span><span>50%</span>
          </div>
        </div>

        {/* Interest rate */}
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <label className="text-gray-600 font-medium">Interest Rate</label>
            <span className="font-bold text-gray-900">{rate}% p.a.</span>
          </div>
          <input type="range" min={6} max={15} step={0.25}
            value={rate} onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-blue-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>6%</span><span>15%</span>
          </div>
        </div>

        {/* Tenure */}
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <label className="text-gray-600 font-medium">Loan Tenure</label>
            <span className="font-bold text-gray-900">{tenure} years</span>
          </div>
          <input type="range" min={1} max={30} step={1}
            value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full accent-blue-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1yr</span><span>30yrs</span>
          </div>
        </div>

        {/* Result */}
        <div className="bg-blue-50 rounded-xl p-4 space-y-2">
          <div className="text-center mb-2">
            <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Monthly EMI</p>
            <p className="text-3xl font-bold text-blue-700">{fmt(emi)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">Loan Amount</p>
              <p className="font-bold text-gray-900">{fmt(loanAmt)}</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">Total Interest</p>
              <p className="font-bold text-gray-900">{fmt(totalInt)}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center text-sm">
            <p className="text-xs text-gray-400">Total Payable</p>
            <p className="font-bold text-gray-900">{fmt(totalAmt)}</p>
          </div>
        </div>

        {/* CTA */}
        {!showCtA ? (
          <button onClick={handleCalc}
            className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 text-sm transition-colors">
            Check Loan Eligibility
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-center text-gray-700 font-medium">Talk to our finance advisor</p>
            <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 text-sm transition-colors">
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
