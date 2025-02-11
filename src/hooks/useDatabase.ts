import { useSQLiteContext } from "expo-sqlite"
import { DatabasePreset } from "../types/database"

export default function useDatabase() {
	const db = useSQLiteContext()

	async function getAllPresets() {
		const presets = await db.getAllAsync<DatabasePreset>("SELECT * FROM Presets")
		return presets
	}

	async function postPreset(preset: DatabasePreset) {
		db.runAsync(
			"INSERT INTO Presets (name, hours, minutes, seconds, timeIncrement) VALUES ($n, $h, $m, $s, $ti)",
			{
				$n: preset.name,
				$h: preset.hours,
				$m: preset.minutes,
				$s: preset.seconds,
				$ti: preset.timeIncrement,
			},
		).catch((e) => console.log(e))
	}

	async function deletePreset(preset: Preset) {
		db.runAsync("DELETE FROM Presets WHERE name = ?", preset.name).catch((e) => console.log(e))
	}

	return {
		getAllPresets,
		postPreset,
		deletePreset,
	}
}
