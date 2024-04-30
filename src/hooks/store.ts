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

export const useConfigStore = create<ConfigStore>()((set) => ({
  mobileFlag: false,
  setMobileFlag: (flag) => {
    set((state) => {
      state.mobileFlag = flag
      return { mobileFlag: flag }
    })
  },
}))

interface ConfigStore {
  mobileFlag: boolean
  setMobileFlag: (flag: boolean) => void
}

interface MoyuStore {
  moyuFlag: boolean
  moOrNot: (mo?: boolean) => void
}
