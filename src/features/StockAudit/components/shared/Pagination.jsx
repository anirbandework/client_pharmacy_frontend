const Pagination = ({ page, totalPages, total, perPage, onPageChange }) => {
  if (totalPages <= 1) return null

  const startItem = (page - 1) * perPage + 1
  const endItem = Math.min(page * perPage, total)

  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i)
    } else if (i === page - 2 || i === page + 2) {
      pages.push('...')
    }
  }
  // Remove duplicate '...'
  const dedupedPages = pages.filter((p, idx) => p !== '...' || pages[idx - 1] !== '...')

  return (
    <div className="mt-4 flex items-center justify-between bg-white dark:bg-slate-800/80 px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700/50">
      <p className="text-sm text-gray-600 dark:text-slate-400">
        Showing <span className="font-medium">{startItem}</span>–<span className="font-medium">{endItem}</span> of <span className="font-medium">{total}</span>
      </p>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 text-sm border border-gray-300 dark:border-slate-600 rounded hover:bg-gray-50 dark:hover:bg-slate-700/30 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        {dedupedPages.map((p, idx) =>
          p === '...' ? (
            <span key={`dots-${idx}`} className="px-2 py-1 text-sm text-gray-400 dark:text-slate-500">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 text-sm border rounded ${
                p === page
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'border-gray-300 dark:border-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700/30'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 text-sm border border-gray-300 dark:border-slate-600 rounded hover:bg-gray-50 dark:hover:bg-slate-700/30 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Pagination
