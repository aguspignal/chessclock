import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { getTimeInMillisecondsFromPreset } from "../utils/parsing"
import { Preset } from "../types/utils"
import AsyncStorage from "@react-native-async-storage/async-storage"
import defaultpresets from "../resources/defaultpresets.json"

type State = {
	time: Preset
	timeInMilliseconds: number
	setTime: (p: Preset) => void
	setName: (n: string) => void
	setIncrement: (inc: number) => void
}

export const useTimeStore = create<State>()(
	persist(
		(set) => ({
			time: defaultpresets[0],
			timeInMilliseconds: getTimeInMillisecondsFromPreset(defaultpresets[0]),
			setTime: (p) => {
				set({ time: p })
				set({ timeInMilliseconds: getTimeInMillisecondsFromPreset(p) })
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
						timeIncrementMs: state.time.timeIncrementMs,
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
						timeIncrementMs: inc,
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
	secondTimeInMilliseconds: number
	setSecondTime: (t: Preset) => void
}

export const useSecondTimeStore = create<SecondState>()(
	persist(
		(set) => ({
			secondTime: defaultpresets[0],
			secondTimeInMilliseconds: getTimeInMillisecondsFromPreset(defaultpresets[0]),
			setSecondTime: (t) => {
				set({ secondTime: t })
				set({ secondTimeInMilliseconds: getTimeInMillisecondsFromPreset(t) })
			},
		}),
		{
			name: "second-time-store",
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
)
