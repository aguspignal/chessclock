import { DatabasePreset } from "../types/database"
import { parseDatabasePresetsArray } from "../utils/parsing"
import { Preset } from "../types/utils"
import { useSQLiteContext } from "expo-sqlite"

export default function useDatabase() {
	const db = useSQLiteContext()

	async function getAllPresets(): Promise<Preset[]> {
		const presets = await db.getAllAsync<DatabasePreset>("SELECT * FROM Presets")
		return parseDatabasePresetsArray(presets)
	}

	async function postPreset(preset: DatabasePreset): Promise<void> {
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

	async function deletePreset(preset: Preset): Promise<void> {
		db.runAsync("DELETE FROM Presets WHERE name = ?", preset.name).catch((e) => console.log(e))
	}

	return {
		getAllPresets,
		postPreset,
		deletePreset,
	}
}
