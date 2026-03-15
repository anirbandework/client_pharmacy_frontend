export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-slate-700/50" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{title}</h3>
        <div className="space-y-3 mb-6 dark:text-slate-300">{children}</div>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:bg-slate-700 dark:hover:bg-slate-600 transition-all">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg transition-all">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
