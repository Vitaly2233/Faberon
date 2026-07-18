import { create } from 'zustand'
import { seedPrinters } from './printersSeed'
import type { CreatePrinterInput, PrinterRecord } from './types/printer'
import { createId, todayIso } from './types/work-order'

type PrintersStore = {
  printers: PrinterRecord[]
  addPrinter: (input: CreatePrinterInput) => string
  addPageReading: (printerId: string, bw: number, color: number) => void
  removePageReading: (printerId: string, readingId: string) => void
}

export const usePrintersStore = create<PrintersStore>((set) => ({
  printers: seedPrinters,

  addPrinter: (input) => {
    const id = createId()
    const record: PrinterRecord = {
      ...input,
      id,
      pages: [],
      addedAt: input.addedAt ?? todayIso(),
    }

    set((state) => ({ printers: [...state.printers, record] }))
    return id
  },

  addPageReading: (printerId, bw, color) => {
    set((state) => ({
      printers: state.printers.map((printer) =>
        printer.id === printerId
          ? {
              ...printer,
              pages: [
                ...printer.pages,
                { id: createId(), date: todayIso(), bw, color },
              ],
            }
          : printer,
      ),
    }))
  },

  removePageReading: (printerId, readingId) => {
    set((state) => ({
      printers: state.printers.map((printer) =>
        printer.id === printerId
          ? { ...printer, pages: printer.pages.filter((reading) => reading.id !== readingId) }
          : printer,
      ),
    }))
  },
}))
