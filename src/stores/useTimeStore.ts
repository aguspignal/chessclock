import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { Preset } from "../types/utils"
import AsyncStorage from "@react-native-async-storage/async-storage"
import defaultpresets from "../resources/defaultpresets.json"
import { getTimeInSecondsFromPreset } from "../utils/parsing"

type State = {
	time: Preset
	timeInSeconds: number
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
			timeInSeconds: getTimeInSecondsFromPreset(defaultpresets[0]),
			setTime: (t) => {
				set({ time: t })
				set({ timeInSeconds: getTimeInSecondsFromPreset(t) })
			},
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

type SecondState = {
	secondTime: Preset
	secondTimeInSeconds: number
	setSecondTime: (t: Preset) => void
	setSecondHours: (hr: number) => void
	setSecondMinutes: (min: number) => void
	setSecondSeconds: (sec: number) => void
	setSecondIncrement: (inc: number) => void
}

export const useSecondTimeStore = create<SecondState>()((set) => ({
	secondTime: defaultpresets[0],
	secondTimeInSeconds: getTimeInSecondsFromPreset(defaultpresets[0]),
	setSecondTime: (t) => {
		set({ secondTime: t })
		set({ secondTimeInSeconds: getTimeInSecondsFromPreset(t) })
	},
	setSecondHours: (hr) => {
		set((state) => ({
			secondTime: {
				name: state.secondTime.name,
				time: {
					hours: hr,
					minutes: state.secondTime.time.minutes,
					seconds: state.secondTime.time.seconds,
				},
				timeIncrement: state.secondTime.timeIncrement,
			},
		}))
	},
	setSecondMinutes: (min) => {
		set((state) => ({
			secondTime: {
				name: state.secondTime.name,
				time: {
					hours: state.secondTime.time.minutes,
					minutes: min,
					seconds: state.secondTime.time.seconds,
				},
				timeIncrement: state.secondTime.timeIncrement,
			},
		}))
	},
	setSecondSeconds: (sec) => {
		set((state) => ({
			secondTime: {
				name: state.secondTime.name,
				time: {
					hours: state.secondTime.time.minutes,
					minutes: state.secondTime.time.minutes,
					seconds: sec,
				},
				timeIncrement: state.secondTime.timeIncrement,
			},
		}))
	},
	setSecondIncrement: (inc) => {
		set((state) => ({
			secondTime: {
				name: state.secondTime.name,
				time: {
					hours: state.secondTime.time.minutes,
					minutes: state.secondTime.time.minutes,
					seconds: state.secondTime.time.seconds,
				},
				timeIncrement: inc,
			},
		}))
	},
}))
