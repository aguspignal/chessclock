import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { getTimeInSecondsFromPreset } from "../utils/parsing"
import { Preset } from "../types/utils"
import AsyncStorage from "@react-native-async-storage/async-storage"
import defaultpresets from "../resources/defaultpresets.json"

type State = {
	time: Preset
	timeInSeconds: number
	setTime: (p: Preset) => void
	setName: (n: string) => void
	setIncrement: (inc: number) => void
}

export const useTimeStore = create<State>()(
	persist(
		(set) => ({
			time: defaultpresets[0],
			timeInSeconds: getTimeInSecondsFromPreset(defaultpresets[0]),
			setTime: (p) => {
				set({ time: p })
				set({ timeInSeconds: getTimeInSecondsFromPreset(p) })
			},
			setName: (n) =>
				set((state) => ({
					time: {
						name: n,
						time: {
							hours: state.time.time.hours,
							minutes: state.time.time.minutes,
							seconds: state.time.time.seconds,
						},
						timeIncrement: state.time.timeIncrement,
					},
				})),
			setIncrement: (inc) => {
				set((state) => ({
					time: {
						name: state.time.name,
						time: {
							hours: state.time.time.hours,
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

type SecondState = {
	secondTime: Preset
	secondTimeInSeconds: number
	setSecondTime: (t: Preset) => void
	setSecondName: (n: string) => void
	setSecondIncrement: (inc: number) => void
}

export const useSecondTimeStore = create<SecondState>()((set) => ({
	secondTime: defaultpresets[0],
	secondTimeInSeconds: getTimeInSecondsFromPreset(defaultpresets[0]),
	setSecondTime: (t) => {
		set({ secondTime: t })
		set({ secondTimeInSeconds: getTimeInSecondsFromPreset(t) })
	},
	setSecondName: (n) =>
		set((state) => ({
			secondTime: {
				name: n,
				time: {
					hours: state.secondTime.time.hours,
					minutes: state.secondTime.time.minutes,
					seconds: state.secondTime.time.seconds,
				},
				timeIncrement: state.secondTime.timeIncrement,
			},
		})),
	setSecondIncrement: (inc) => {
		set((state) => ({
			secondTime: {
				name: state.secondTime.name,
				time: {
					hours: state.secondTime.time.hours,
					minutes: state.secondTime.time.minutes,
					seconds: state.secondTime.time.seconds,
				},
				timeIncrement: inc,
			},
		}))
	},
}))
