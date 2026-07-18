import { create } from 'zustand'
import type { ModalDefinitions, ModalEntry, ModalName } from './types'

type ModalsStore = {
  stack: ModalEntry[]
  open: <Name extends ModalName>(
    name: Name,
    options?: ModalDefinitions[Name],
  ) => { close: () => void }
  close: () => void
  closeAll: () => void
  isOpen: (name: ModalName) => boolean
}

function createEntry<Name extends ModalName>(
  name: Name,
  options?: ModalDefinitions[Name],
): ModalEntry {
  switch (name) {
    case 'NewCustomer':
      return { name: 'NewCustomer', ...options }
  }
}

export const useModalsStore = create<ModalsStore>((set, get) => ({
  stack: [],

  open: (name, options) => {
    set((state) => ({
      stack: [
        ...state.stack.filter((entry) => entry.name !== name),
        createEntry(name, options),
      ],
    }))

    return {
      close: () => get().close(),
    }
  },

  close: () => {
    const { stack } = get()
    if (stack.length === 0) return

    const top = stack[stack.length - 1]
    set({ stack: stack.slice(0, -1) })
    top.onClosed?.()
  },

  closeAll: () => {
    while (get().stack.length > 0) {
      get().close()
    }
  },

  isOpen: (name) => get().stack.some((entry) => entry.name === name),
}))
