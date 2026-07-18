import type { ReactNode } from 'react'

type DataTableEmpty = {
  colSpan: number
  message: string
}

type DataTableProps = {
  ariaLabel?: string
  minWidthClassName?: string
  columns: ReactNode
  children: ReactNode
  empty?: DataTableEmpty
}

type DataTableRowProps = {
  onClick?: () => void
  children: ReactNode
}

export function DataTable({
  ariaLabel,
  minWidthClassName = 'min-w-table-xl',
  columns,
  children,
  empty,
}: DataTableProps) {
  return (
    <section
      className="overflow-hidden rounded-xl border border-line bg-surface shadow-card"
      aria-label={ariaLabel}
    >
      <div className="overflow-x-auto">
        <table className={`w-full ${minWidthClassName} text-left text-xs`}>
          <thead className="border-b border-line bg-canvas text-2xs font-extrabold uppercase tracking-wider text-copy">
            <tr>{columns}</tr>
          </thead>
          <tbody>
            {children}
            {empty && (
              <tr>
                <td colSpan={empty.colSpan} className="py-10 text-center text-copy">
                  {empty.message}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function DataTableRow({ onClick, children }: DataTableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={`border-t border-line-soft transition hover:bg-canvas ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {children}
    </tr>
  )
}
