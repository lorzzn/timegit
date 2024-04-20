import { create } from "zustand"

type UserStoreType = {
  user: any
  setUser: (user: any) => void
}

const useUserStore = create<UserStoreType>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
}))

export default useUserStore
