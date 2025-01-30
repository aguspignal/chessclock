type Preset = {
	name: string
	time: PresetTime
	extraSeconds: number
}

type PresetTime = {
	hours: number
	minutes: number
	seconds: number
}
