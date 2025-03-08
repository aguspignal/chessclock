import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { Preset } from "../types/utils"
import AsyncStorage from "@react-native-async-storage/async-storage"
import defaultpresets from "../resources/defaultpresets.json"

type State = {
	time: Preset
	setTime: (t: Preset) => void
	setHours: (hr: number) => void
	setMinutes: (min: number) => void
	setSeconds: (sec: number) => void
	setIncrement: (inc: number) => void
}

export const useTimeStore = create<State>()(
	persist(
		(set) => ({
			time: defaultpresets[0],
			setTime: (t) => set({ time: t }),
			setHours: (hr) => {
				set((state) => ({
					time: {
						name: state.time.name,
						time: {
							hours: hr,
							minutes: state.time.time.minutes,
							seconds: state.time.time.seconds,
						},
						timeIncrement: state.time.timeIncrement,
					},
				}))
			},
			setMinutes: (min) => {
				set((state) => ({
					time: {
						name: state.time.name,
						time: {
							hours: state.time.time.minutes,
							minutes: min,
							seconds: state.time.time.seconds,
						},
						timeIncrement: state.time.timeIncrement,
					},
				}))
			},
			setSeconds: (sec) => {
				set((state) => ({
					time: {
						name: state.time.name,
						time: {
							hours: state.time.time.minutes,
							minutes: state.time.time.minutes,
							seconds: sec,
						},
						timeIncrement: state.time.timeIncrement,
					},
				}))
			},
			setIncrement: (inc) => {
				set((state) => ({
					time: {
						name: state.time.name,
						time: {
							hours: state.time.time.minutes,
							minutes: state.time.time.minutes,
							seconds: state.time.time.seconds,
						},
						timeIncrement: inc,
					},
				}))
			},
		}),
		{
			name: "time-store",
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
)
