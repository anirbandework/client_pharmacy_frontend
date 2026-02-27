export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 border border-gray-200" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        <div className="space-y-3 mb-6">{children}</div>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all">
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
