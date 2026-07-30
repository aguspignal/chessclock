import { DatabasePreset, NewDatabasePreset } from "../types/database"
import { parseDatabasePresetsArray, parsePresetToDatabasePreset } from "../utils/parsing"
import { Preset } from "../types/utils"
import { useSQLiteContext } from "expo-sqlite"
import defaultPresets from "../resources/defaultpresets.json"

export default function useDatabase() {
	const db = useSQLiteContext()

	async function getAllPresets(): Promise<Preset[]> {
		const presets = await db.getAllAsync<DatabasePreset>("SELECT * FROM Presets")
		return parseDatabasePresetsArray(presets)
	}

	// Saving a duration that already exists is not an error: the unique index
	// turns the insert into a no-op and the existing row stays as it is.
	async function postPreset(preset: NewDatabasePreset): Promise<void> {
		await db.runAsync(
			"INSERT OR IGNORE INTO Presets (name, hours, minutes, seconds, timeIncrementMs) VALUES ($n, $h, $m, $s, $ti)",
			{
				$n: preset.name,
				$h: preset.hours,
				$m: preset.minutes,
				$s: preset.seconds,
				$ti: preset.timeIncrementMs,
			},
		)
	}

	async function deletePreset(id: number): Promise<void> {
		await db.runAsync("DELETE FROM Presets WHERE id = ?", id)
	}

	// The seed in `onSQLiteProviderInit` only runs on the 0 -> 1 migration, so this is
	// the only way back for someone who deleted the bundled presets. It is additive,
	// never a reset: `INSERT OR IGNORE` leaves defaults that are still there — and every
	// custom preset — untouched.
	async function restoreDefaultPresets(): Promise<void> {
		await db.withTransactionAsync(async () => {
			for (const preset of defaultPresets) {
				await postPreset(parsePresetToDatabasePreset(preset))
			}
		})
	}

	return {
		getAllPresets,
		postPreset,
		deletePreset,
		restoreDefaultPresets,
	}
}
