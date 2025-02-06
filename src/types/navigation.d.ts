import { NativeStackScreenProps } from "@react-navigation/native-stack"

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
	}
}

export type HomeProps = NativeStackScreenProps<StackParamList, "Home">
export type PresetsProps = NativeStackScreenProps<StackParamList, "Presets">
export type ClockProps = NativeStackScreenProps<StackParamList, "Clock">
