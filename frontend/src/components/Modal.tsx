import type { ReactNode } from 'react'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

type ModalProps = {
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}

export function Modal({ title, subtitle, onClose, children, wide }: ModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
        className={`my-10 w-full rounded-xl border border-line bg-surface p-5 shadow-card ${
          wide ? 'max-w-modal-wide' : 'max-w-modal'
        }`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="modal-title" className="text-base font-extrabold tracking-tight text-ink">
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-xs text-copy">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-copy transition hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            aria-label="Close"
          >
            <CloseRoundedIcon fontSize="small" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
