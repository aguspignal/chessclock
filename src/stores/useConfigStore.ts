import { AppLanguage } from "../types/languages"
import { ClockOrientation } from "../types/utils"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"

type State = {
	hasHydrated: boolean
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
			hasHydrated: false,
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

			// Rehydration is async. `hasHydrated` is what tells the app the persisted values
			// are actually in state — reading them before that yields the defaults. This
			// callback runs on both the success and the failure path, so a broken storage
			// entry degrades to the defaults instead of blocking startup forever.
			onRehydrateStorage: () => (_state, error) => {
				if (error) console.log("Something went wrong rehydrating the config", error)
				useConfigStore.setState({ hasHydrated: true })
			},

			partialize: (state) => ({
				language: state.language,
				orientation: state.orientation,
				soundEnabled: state.soundEnabled,
				withDifferentTimes: state.withDifferentTimes,
			}),
		},
	),
)
