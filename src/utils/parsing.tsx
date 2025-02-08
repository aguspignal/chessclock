import { StyleProp, Text, TextStyle, View } from "react-native"
import { theme } from "./theme"

export function parseTimeFromSeconds(seconds: number) {
	const hs = Math.floor(seconds / 3600)
	const min = Math.floor((seconds - hs * 3600) / 60)
	const sec = seconds - min * 60 - hs * 3600

	const hsString = String(hs).padStart(2, "0") + ":"
	const minString = String(min).padStart(2, "0") + ":"
	const secString = String(sec).padStart(2, "0")

	return `${hs > 0 ? hsString : ""}${minString + secString}`
}

export function parseTimeWithExtra(seconds: number, extra: number) {
	const hs = Math.floor(seconds / 3600)
	const min = Math.floor((seconds - hs * 3600) / 60)
	const sec = seconds - min * 60 - hs * 3600

	const hsString = String(hs).padStart(2, "0") + ":"
	const minString = String(min).padStart(2, "0") + ":"
	const secString = String(sec).padStart(2, "0")

	const extraString = " | " + String(extra) + "s"

	return `${hs > 0 ? hsString : ""}${minString + secString}${extra > 0 ? extraString : ""}`
}

export function parseTimeToPresetName(hs: string, min: string, sec: string, extra: string): string {
	if (Number(hs) === 0 && Number(min) === 0 && Number(sec) === 0) return ""
	if (hs === "" && min === "" && sec === "") return ""

	// "1 hr " "1 min " "1 sec " "| 1s"
	const hours: string = isNaN(Number(hs)) || Number(hs) === 0 ? "" : `${hs} hr `
	const minutes: string = `${min} min `
	const seconds: string = `${sec} sec `
	const extraSeconds = isNaN(Number(hs)) || Number(hs) === 0 ? "" : `| ${Number(extra)}s`

	return `${hours}${minutes}${seconds}${extraSeconds}`
}

export function parseHoursToText(hours: number) {
	if (hours === 0) return <></>

	const textStyle: StyleProp<TextStyle> = { fontSize: theme.fontSize.xl, fontWeight: "500" }

	return (
		<View style={{ flexDirection: "row" }}>
			<Text style={textStyle}>{hours < 10 ? `0${hours}` : hours}</Text>
			{hours === 0 ? <></> : <Text style={textStyle}>:</Text>}
		</View>
	)
}

export function parseMinutesToText(minutes: number) {
	const text = minutes === 0 ? "00" : minutes < 10 ? `0${minutes}` : `${minutes}`

	const textStyle: StyleProp<TextStyle> = { fontSize: theme.fontSize.xl, fontWeight: "500" }

	return (
		<View style={{ flexDirection: "row" }}>
			<Text style={textStyle}>{text}</Text>
			<Text style={textStyle}>:</Text>
		</View>
	)
}

export function parseSecondsToText(seconds: number) {
	const text = seconds === 0 ? "00" : seconds < 10 ? `0${seconds}` : `${seconds}`

	const textStyle: StyleProp<TextStyle> = { fontSize: theme.fontSize.xl, fontWeight: "500" }

	return (
		<View style={{ flexDirection: "row" }}>
			<Text style={textStyle}>{text}</Text>
		</View>
	)
}

export function orderPresetsByDuration(presets: Preset[]): Preset[] {
	return presets
}
