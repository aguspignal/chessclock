import { SQLiteDatabase } from "expo-sqlite"
import { Preset } from "./utils"

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

export type LocalStorageData = {
	preset: Preset
}
