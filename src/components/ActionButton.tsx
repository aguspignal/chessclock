import { Pressable, StyleSheet, View } from "react-native"
import { theme } from "../resources/theme"
import Icon from "@expo/vector-icons/MaterialCommunityIcons"
import React from "react"

type Props = {
	icon: React.ComponentProps<typeof Icon>["name"]
	onPress?: () => void
	disabled?: boolean
}

// The square icon button used across the home screen. Without `onPress` it renders as
// a plain View, so it can sit inside a row that is itself the pressable target.
export default function ActionButton({ icon, onPress, disabled = false }: Props) {
	const content = <Icon name={icon} size={theme.fontSize.xxl} color={theme.colors.textLight} />
	const style = [styles.button, disabled ? styles.buttonDisabled : null]

	if (!onPress) return <View style={style}>{content}</View>

	return (
		<Pressable onPress={onPress} disabled={disabled} style={style}>
			{content}
		</Pressable>
	)
}

const styles = StyleSheet.create({
	button: {
		alignItems: "center",
		backgroundColor: theme.colors.surfaceRaised,
		borderRadius: theme.spacing.xs,
		height: 44,
		justifyContent: "center",
		width: 44,
	},
	buttonDisabled: {
		opacity: 0.4,
	},
})
