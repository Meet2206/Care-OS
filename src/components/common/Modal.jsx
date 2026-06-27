function Modal({ open, onClose, title, eyebrow = "CareOS", maxWidthClass = "max-w-xl", children }) {
    if (!open) {
        return null
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.28)] p-4">
            <div className={`flex max-h-[90vh] w-full flex-col overflow-hidden ${maxWidthClass} rounded-[32px] border border-[rgba(216,206,193,0.95)] bg-[rgba(252,246,238,0.985)] shadow-[0_20px_60px_rgba(23,41,63,0.18)]`}>
                <div className="flex items-start justify-between gap-4 border-b border-[rgba(216,206,193,0.55)] px-6 py-5">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">{eyebrow}</p>
                        <h2 className="mt-2 font-display text-2xl text-[var(--ink)]">{title}</h2>
                    </div>
                    <button className="rounded-full border border-[var(--line)] px-3 py-1 text-sm text-[var(--muted)]" onClick={onClose}>
                        Close
                    </button>
                </div>
                <div className="overflow-y-auto px-6 py-6 text-sm leading-7 text-[var(--muted)]">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal
