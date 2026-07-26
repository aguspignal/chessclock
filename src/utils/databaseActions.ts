import { parseJSONPresetsToQueryValue } from "./parsing"
import { SQLiteDatabase } from "expo-sqlite"
import presets from "../resources/defaultpresets.json"

export async function onSQLiteProviderInit(db: SQLiteDatabase) {
	const DATABASE_VERSION = 2
	let result = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version")

	if (result === null) return

	let { user_version: currentDbVersion } = result

	if (currentDbVersion >= DATABASE_VERSION) return

	if (currentDbVersion === 0) {
		console.log("migration for dbVersion=0 ")
		await db.execAsync(`
			PRAGMA journal_mode = 'wal';
			CREATE TABLE IF NOT EXISTS Presets 
				(id INTEGER PRIMARY KEY NOT NULL, 
				name TEXT NOT NULL, 
				hours INTEGER NOT NULL, 
				minutes INTEGER NOT NULL, 
				seconds INTEGER NOT NULL, 
				timeIncrementMs INTEGER NOT NULL);
		`)
		await db.execAsync(`
			INSERT INTO Presets 
				(name, hours, minutes, seconds, timeIncrementMs) 
			VALUES
				${parseJSONPresetsToQueryValue(presets)}
		`)
		currentDbVersion = 1
	}

	if (currentDbVersion === 1) {
		console.log("migration for dbVersion=1 ")
		// A preset is defined by its duration, so rows that only differ by id or
		// by name are duplicates. Collapse the existing ones, keeping the oldest,
		// and stop new ones from being inserted.
		await db.execAsync(`
			DELETE FROM Presets
			WHERE id NOT IN
				(SELECT MIN(id) FROM Presets
				GROUP BY hours, minutes, seconds, timeIncrementMs);
			CREATE UNIQUE INDEX IF NOT EXISTS idx_presets_duration
				ON Presets (hours, minutes, seconds, timeIncrementMs);
		`)
		currentDbVersion = 2
	}

	await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`)
}

export function onSQLiteProviderError(err: Error) {
	throw new Error(err.message)
}
