import { SQLiteDatabase } from "expo-sqlite"

export type DatabaseContextType = {
	db: SQLiteDatabase | null
}

export type DatabasePreset = {
	id: number
	name: string
	hours: number
	minutes: number
	seconds: number
	timeIncrementMs: number
}

// A preset that hasn't been inserted yet — the id is assigned by SQLite.
export type NewDatabasePreset = Omit<DatabasePreset, "id">
