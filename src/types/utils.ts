export type Preset = {
	// Only set on presets read from the database — the stores and the bundled
	// defaults have none.
	id?: number
	name: string
	time: PresetTime
	timeIncrementMs: number
}

export type PresetTime = {
	hours: number
	minutes: number
	seconds: number
}

export type ClockOrientation = "Vertical" | "Horizontal"

export type AppTheme = "System" | "Light" | "Dark"
