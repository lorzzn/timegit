import { create } from "zustand"

type UserType = {
  user: any
  setUser: (user: any) => void
}

const UserStore = create<UserType>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
}))

export default UserStore
