import { NativeStackScreenProps } from "@react-navigation/native-stack"

/** Which player's time a selected preset is applied to. */
export type PresetTarget = "primary" | "second" | "both"

export type StackParamList = {
	Home: undefined
	Presets: { target: PresetTarget } | undefined
	Clock: undefined
	Settings: undefined
}

export type HomeProps = NativeStackScreenProps<StackParamList, "Home">
export type PresetsProps = NativeStackScreenProps<StackParamList, "Presets">
export type ClockProps = NativeStackScreenProps<StackParamList, "Clock">
export type SettingsProps = NativeStackScreenProps<StackParamList, "Settings">
