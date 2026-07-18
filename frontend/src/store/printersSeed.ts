export type PrinterRecord = {
  id: string
  manufacturer: string
  model: string
  serial: string
  customerId: string
  ownership: 'owned' | 'rented'
  addedAt: string
}

export const seedPrinters: PrinterRecord[] = [
  {
    id: 'p1',
    manufacturer: 'HP',
    model: 'LaserJet M607',
    serial: 'SN-HP-88213',
    customerId: 'grand-hotel',
    ownership: 'owned',
    addedAt: '2024-03-12',
  },
  {
    id: 'p2',
    manufacturer: 'Canon',
    model: 'PIXMA G7020',
    serial: 'SN-CN-40551',
    customerId: 'grand-hotel',
    ownership: 'rented',
    addedAt: '2024-05-20',
  },
  {
    id: 'p3',
    manufacturer: 'Brother',
    model: 'HL-L8360',
    serial: 'SN-BR-11002',
    customerId: 'city-library',
    ownership: 'owned',
    addedAt: '2023-11-02',
  },
  {
    id: 'p4',
    manufacturer: 'Epson',
    model: 'SureColor T5170',
    serial: 'SN-EP-77410',
    customerId: 'river-tech',
    ownership: 'owned',
    addedAt: '2024-01-15',
  },
]
