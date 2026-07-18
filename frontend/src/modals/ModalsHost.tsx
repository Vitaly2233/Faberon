import { useModalsStore } from '../store/modals'
import type { ModalEntry } from '../store/modals'
import { NewCustomerModal } from './NewCustomerModal'
import { NewPrinterModal } from './NewPrinterModal'
import { NewWorkOrderModal } from './NewWorkOrderModal'

function renderModal(entry: ModalEntry) {
  switch (entry.name) {
    case 'NewCustomer':
      return <NewCustomerModal key={entry.name} options={entry} />
    case 'NewWorkOrder':
      return <NewWorkOrderModal key={entry.name} options={entry} />
    case 'NewPrinter':
      return <NewPrinterModal key={entry.name} options={entry} />
  }
}

export function ModalsHost() {
  const stack = useModalsStore((state) => state.stack)

  return <>{stack.map((entry) => renderModal(entry))}</>
}
