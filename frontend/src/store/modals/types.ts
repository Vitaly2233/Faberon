export type ModalDefinitions = {
  NewCustomer: {
    data?: {
      initialName?: string
    }
    onClosed?: () => void
    onSaved?: (payload: { customerId: string }) => void
    onError?: (error: unknown) => void
  }
  NewWorkOrder: {
    data?: {
      customerId?: string
    }
    onClosed?: () => void
    onCreated?: (payload: { workOrderId: number }) => void
    onError?: (error: unknown) => void
  }
}

export type ModalName = keyof ModalDefinitions

export type ModalEntry = {
  [Name in ModalName]: { name: Name } & ModalDefinitions[Name]
}[ModalName]

export type ModalOptions<Name extends ModalName> = Extract<ModalEntry, { name: Name }>
