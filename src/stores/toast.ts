"use client"

import { Key } from "react"
import { create } from "zustand"

export type ToastStoreType = {
  show: (toastId: Key) => void
  close: (toastId: Key) => void
  closeAll: () => void
  toastList: Set<Key> | null
}

const useToastStore = create<ToastStoreType>((set, get) => ({
  toastList: new Set(),
  show(toastId) {
    const { toastList } = get()

    const newToastList = new Set(toastList)
    newToastList.add(toastId)

    set({
      toastList: newToastList,
    })
  },
  close(toastId) {
    const { toastList } = get()

    const newToastList = new Set(toastList)
    newToastList.delete(toastId)

    set({
      toastList: newToastList,
    })
  },
  closeAll() {
    set({
      toastList: null,
    })
  },
}))

export default useToastStore
