export type Preset = {
	name: string
	time: PresetTime
	timeIncrement: number
}

export type PresetTime = {
	hours: number
	minutes: number
	seconds: number
}

export type ClockOrientation = "Vertical" | "Horizontal"
