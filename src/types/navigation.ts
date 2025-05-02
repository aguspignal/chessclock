import { NativeStackScreenProps } from "@react-navigation/native-stack"

export type StackParamList = {
	Home: undefined
	Presets: undefined
	Clock: undefined
	Settings: undefined
}

export type HomeProps = NativeStackScreenProps<StackParamList, "Home">
export type PresetsProps = NativeStackScreenProps<StackParamList, "Presets">
export type ClockProps = NativeStackScreenProps<StackParamList, "Clock">
export type SettingsProps = NativeStackScreenProps<StackParamList, "Settings">
