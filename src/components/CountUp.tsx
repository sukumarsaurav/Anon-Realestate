'use client'

import { useEffect, useRef, useState } from 'react'

/** Counts from 0 → end the first time it scrolls into view. */
export default function CountUp({
  end,
  suffix = '',
  prefix = '',
  duration = 1400,
}: {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [val, setVal] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setVal(end); return }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1)
            // easeOutCubic
            const eased = 1 - Math.pow(1 - p, 3)
            setVal(Math.round(eased * end))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [end, duration])

  return <span ref={ref}>{prefix}{val.toLocaleString('en-IN')}{suffix}</span>
}
