type Preset = {
	name: string
	time: PresetTime
	timeIncrement: number
}

type PresetTime = {
	hours: number
	minutes: number
	seconds: number
}

type ClockOrientation = "Vertical" | "Horizontal"
