import { Alert } from "react-native"

// Every failure path in the app used to end in a bare `console.log`, which made a failed
// delete or restore indistinguishable from a no-op. The log is kept for debugging; the
// alert is the part the user sees.
export function showError(message: string, e?: unknown) {
	console.log(message, e)
	Alert.alert(message)
}
