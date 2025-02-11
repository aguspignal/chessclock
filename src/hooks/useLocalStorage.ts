import { LocalStorageData } from "../types/storage"
import { LOCAL_STORAGE_KEY } from "../utils/constants"
import AsyncStorage from "expo-sqlite/kv-store"

export default function useLocalStorage() {
	async function storeInLocalStorage(value: LocalStorageData): Promise<void> {
		try {
			await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value))
		} catch (error) {
			throw error
		}
	}

	async function getFromLocalStorage(): Promise<LocalStorageData | null> {
		try {
			const data = await AsyncStorage.getItem(LOCAL_STORAGE_KEY)
			return data ? JSON.parse(data) : null
		} catch (error) {
			throw error
		}
	}

	async function cleanLocalStorage(): Promise<void> {
		try {
			await AsyncStorage.removeItem(LOCAL_STORAGE_KEY)
		} catch (error) {
			throw error
		}
	}

	return {
		storeInLocalStorage,
		getFromLocalStorage,
		cleanLocalStorage,
	}
}
