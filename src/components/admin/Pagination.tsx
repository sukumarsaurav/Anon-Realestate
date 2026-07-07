'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({
  currentPage,
  totalPages,
  searchParams,
}: {
  currentPage: number
  totalPages: number
  searchParams: Record<string, string | string[] | undefined>
}) {
  if (totalPages <= 1) return null

  // Helper to build URL with preserved query parameters
  function buildPageUrl(page: number) {
    const params = new URLSearchParams()
    // Copy existing search parameters
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v))
        } else {
          params.set(key, value)
        }
      }
    }
    // Set/overwrite page parameter
    params.set('page', page.toString())
    return `?${params.toString()}`
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-100 bg-white px-4 py-3 sm:px-6 mt-4 rounded-b-2xl shadow-soft">
      {/* Mobile view layout */}
      <div className="flex flex-1 justify-between sm:hidden">
        {currentPage > 1 ? (
          <Link
            href={buildPageUrl(currentPage - 1)}
            className="relative inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Previous
          </Link>
        ) : (
          <span className="relative inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-300 cursor-not-allowed">
            Previous
          </span>
        )}
        {currentPage < totalPages ? (
          <Link
            href={buildPageUrl(currentPage + 1)}
            className="relative ml-3 inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Next
          </Link>
        ) : (
          <span className="relative ml-3 inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-300 cursor-not-allowed">
            Next
          </span>
        )}
      </div>

      {/* Desktop view layout */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Showing Page <span className="font-semibold text-gray-900">{currentPage}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalPages}</span> pages
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-lg shadow-sm border border-gray-200 bg-white" aria-label="Pagination">
            {currentPage > 1 ? (
              <Link
                href={buildPageUrl(currentPage - 1)}
                className="relative inline-flex items-center rounded-l-lg p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft size={16} />
              </Link>
            ) : (
              <span className="relative inline-flex items-center rounded-l-lg p-2 text-gray-300 bg-gray-50 cursor-not-allowed">
                <ChevronLeft size={16} />
              </span>
            )}
            
            {/* Generate Page Numbers */}
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1
              const isCurrent = pageNum === currentPage
              
              // Simplistic responsive pagination truncation logic
              const shouldShow =
                pageNum === 1 ||
                pageNum === totalPages ||
                Math.abs(pageNum - currentPage) <= 1

              if (!shouldShow) {
                if (pageNum === 2 || pageNum === totalPages - 1) {
                  return (
                    <span
                      key={`ellipsis-${pageNum}`}
                      className="relative inline-flex items-center px-3 py-1.5 text-sm font-semibold text-gray-400 cursor-default"
                    >
                      ...
                    </span>
                  )
                }
                return null
              }

              return (
                <Link
                  key={pageNum}
                  href={buildPageUrl(pageNum)}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`relative inline-flex items-center px-3.5 py-1.5 text-sm font-semibold transition-all border-l border-r border-gray-100 ${
                    isCurrent
                      ? 'z-10 bg-brand-900 text-white focus:outline-none'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {pageNum}
                </Link>
              )
            })}

            {currentPage < totalPages ? (
              <Link
                href={buildPageUrl(currentPage + 1)}
                className="relative inline-flex items-center rounded-r-lg p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <span className="sr-only">Next</span>
                <ChevronRight size={16} />
              </Link>
            ) : (
              <span className="relative inline-flex items-center rounded-r-lg p-2 text-gray-300 bg-gray-50 cursor-not-allowed">
                <ChevronRight size={16} />
              </span>
            )}
          </nav>
        </div>
      </div>
    </div>
  )
}
