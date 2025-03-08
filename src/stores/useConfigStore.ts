import { ClockOrientation } from "../types/utils"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"

type State = {
	orientation: ClockOrientation
	soundEnabled: boolean
	withDifferentTimes: boolean
	setOrientation: (o: ClockOrientation) => void
	toggleSoundEnabled: () => void
	toggleWithDifferentTimes: () => void
}

export const useConfigStore = create<State>()(
	persist(
		(set) => ({
			orientation: "Horizontal",
			setOrientation: (o) => set({ orientation: o }),
			soundEnabled: true,
			toggleSoundEnabled: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
			withDifferentTimes: false,
			toggleWithDifferentTimes: () =>
				set((state) => ({ withDifferentTimes: !state.withDifferentTimes })),
		}),
		{
			name: "config-store",
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
)
