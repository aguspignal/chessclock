import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { ClockOrientation, Preset, PresetTime } from "./utils"

export type StackParamList = {
	Home: {
		defaultPreset: Preset
	}
	Presets: undefined
	Clock: {
		time: PresetTime
		timeIncrement: number
		isSoundEnabled: boolean
		clockOrientation: ClockOrientation
		secondTime: PresetTime | null
		secondTimeIncrement: number | null
	}
}

export type HomeProps = NativeStackScreenProps<StackParamList, "Home">
export type PresetsProps = NativeStackScreenProps<StackParamList, "Presets">
export type ClockProps = NativeStackScreenProps<StackParamList, "Clock">
