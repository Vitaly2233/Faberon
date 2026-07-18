export type PrinterOwnership = 'owned' | 'rented'

export type PageReading = {
  id: string
  date: string
  bw: number
  color: number
}

export type PrinterRecord = {
  id: string
  type: string
  manufacturer: string
  model: string
  serial: string
  customerId: string
  ownership: PrinterOwnership
  address: string | null
  contact: string | null
  addedAt: string
  warranty: string | null
  pages: PageReading[]
}

export const PRINTER_TYPES = [
  'Laser',
  'Inkjet',
  'Plotter',
  'Dot matrix',
  'Multifunction',
] as const

export type CreatePrinterInput = Omit<PrinterRecord, 'id' | 'pages' | 'addedAt'> & {
  addedAt?: string
}
