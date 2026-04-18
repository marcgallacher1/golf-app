import type { ReactNode } from 'react'

export default function BottomSheet({ open, onClose, children }: {
  open: boolean
  onClose: () => void
  children: ReactNode
}) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-slate-800 rounded-t-2xl transition-transform duration-300 ease-out
          ${open ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto mt-3 mb-4" />
        {children}
      </div>
    </>
  )
}
