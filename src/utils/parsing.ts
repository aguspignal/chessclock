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
