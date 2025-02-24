import { SQLiteDatabase } from "expo-sqlite"

export type DatabaseContextType = {
	db: SQLiteDatabase | null
}

export type DatabasePreset = {
	name: string
	hours: number
	minutes: number
	seconds: number
	timeIncrement: number
}
