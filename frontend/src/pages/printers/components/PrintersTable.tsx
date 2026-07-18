import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import { DataTable, DataTableRow } from '../../../components/DataTable'
import type { PrinterRecord } from '../../../store/types/printer'
import { OwnershipBadge } from './OwnershipBadge'
import { WarrantyBadge } from './WarrantyBadge'

type PrintersTableProps = {
  printers: PrinterRecord[]
  customerName: (customerId: string) => string
  onPrinterOpen: (printerId: string) => void
}

export function PrintersTable({ printers, customerName, onPrinterOpen }: PrintersTableProps) {
  return (
    <DataTable
      ariaLabel="Printers"
      minWidthClassName="min-w-table-xl"
      columns={
        <>
          <th className="py-3 pl-5">Type</th>
          <th className="py-3">Manufacturer</th>
          <th className="py-3">Model</th>
          <th className="py-3">Serial</th>
          <th className="py-3">Customer</th>
          <th className="py-3">Ownership</th>
          <th className="pr-5 py-3">Warranty</th>
        </>
      }
      empty={
        printers.length === 0 ? { colSpan: 7, message: 'No printers found.' } : undefined
      }
    >
      {printers.map((printer) => (
        <DataTableRow key={printer.id} onClick={() => onPrinterOpen(printer.id)}>
          <td className="py-3.5 pl-5">
            <div className="flex items-center gap-2.5">
              <span className="flex size-6 items-center justify-center rounded-md border border-line bg-brand-soft text-copy">
                <PrintOutlinedIcon sx={{ fontSize: 14 }} aria-hidden="true" />
              </span>
              <span className="font-semibold text-ink">{printer.type}</span>
            </div>
          </td>
          <td className="py-3.5 text-copy">{printer.manufacturer}</td>
          <td className="py-3.5 font-semibold text-ink">{printer.model}</td>
          <td className="py-3.5 font-mono text-copy">{printer.serial}</td>
          <td className="py-3.5 text-copy">{customerName(printer.customerId)}</td>
          <td className="py-3.5">
            <OwnershipBadge ownership={printer.ownership} />
          </td>
          <td className="pr-5 py-3.5">
            <WarrantyBadge warranty={printer.warranty} />
          </td>
        </DataTableRow>
      ))}
    </DataTable>
  )
}
