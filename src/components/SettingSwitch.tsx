import { Switch } from "react-native"
import { theme } from "../resources/theme"
import React from "react"

type Props = {
	value: boolean
	onValueChange: () => void
}

export default function SettingSwitch({ value, onValueChange }: Props) {
	return (
		<Switch
			value={value}
			onValueChange={onValueChange}
			trackColor={{ false: theme.colors.surfaceActive, true: theme.colors.accent }}
			thumbColor={theme.colors.textLight}
			ios_backgroundColor={theme.colors.surfaceActive}
		/>
	)
}
