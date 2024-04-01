import { create } from 'zustand'

export const useMoyuStore = create<MoyuStore>()((set) => ({
  moyuFlag: false,
  moOrNot: (mo) => set(() => ({ moyuFlag: mo })),
}))

interface MoyuStore {
  moyuFlag: boolean
  moOrNot: (mo: boolean) => void
}
