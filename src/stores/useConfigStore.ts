import { AppLanguage } from "../types/languages"
import { ClockOrientation } from "../types/utils"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"

type State = {
	language: AppLanguage | null
	orientation: ClockOrientation
	soundEnabled: boolean
	withDifferentTimes: boolean
	setLanguage: (lng: AppLanguage | null) => void
	setOrientation: (o: ClockOrientation) => void
	toggleSoundEnabled: () => void
	toggleWithDifferentTimes: () => void
}

export const useConfigStore = create<State>()(
	persist(
		(set) => ({
			language: null,
			orientation: "Vertical",
			soundEnabled: true,
			withDifferentTimes: false,

			setLanguage: (lng) => set({ language: lng }),
			setOrientation: (o) => set({ orientation: o }),
			toggleSoundEnabled: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
			toggleWithDifferentTimes: () =>
				set((state) => ({ withDifferentTimes: !state.withDifferentTimes })),
		}),
		{
			name: "config-store",
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
)
