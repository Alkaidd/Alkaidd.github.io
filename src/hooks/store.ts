import { create } from 'zustand'

export const useMoyuStore = create<MoyuStore>()((set) => ({
  moyuFlag: false,
  moOrNot: (mo) =>
    set((state) => {
      if (mo != null) {
        return { moyuFlag: mo }
      }
      return { moyuFlag: !state.moyuFlag }
    }),
}))

interface MoyuStore {
  moyuFlag: boolean
  moOrNot: (mo?: boolean) => void
}
