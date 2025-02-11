import { SQLiteDatabase } from "expo-sqlite"
import { parseJSONPresetsToQueryValue } from "./parsing"
import presets from "../resources/presets.json"

export async function onSQLiteProviderInit(db: SQLiteDatabase) {
	const DATABASE_VERSION = 1
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
				minutes INTEGER NOT NULL, seconds INTEGER NOT NULL, 
				timeIncrement INTEGER NOT NULL);
		`)
		await db.execAsync(`
			INSERT INTO Presets 
				(name, hours, minutes, seconds, timeIncrement) 
			VALUES
				${parseJSONPresetsToQueryValue(presets)}
		`)
		result.user_version = 1
	}

	await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`)
}

export function onSQLiteProviderError(err: Error) {
	throw new Error(err.message)
}
