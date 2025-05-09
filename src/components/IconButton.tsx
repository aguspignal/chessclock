import { ColorValue, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity } from "react-native"
import { theme } from "../resources/theme"
import Icon from "@react-native-vector-icons/material-design-icons"
import React from "react"

type Props = {
	onPress: () => void
	iconName: React.ComponentProps<typeof Icon>["name"]
	iconSize?: number
	iconColor?: ColorValue
	title?: string
	style?: StyleProp<TextStyle>
}

export default function IconButton({
	onPress,
	iconName = "check",
	iconSize = theme.fontSize.h3,
	iconColor = theme.colors.textLight,
	title = "",
	style,
}: Props) {
	return (
		<TouchableOpacity onPress={onPress} style={[styles.container, style]}>
			<Icon name={iconName} size={iconSize} color={iconColor} />
			{title === "" ? <></> : <Text style={styles.title}>{title}</Text>}
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
	},
	title: {
		fontSize: theme.fontSize.l,
		color: theme.colors.textLight,
		paddingHorizontal: theme.spacing.xxs,
	},
})
