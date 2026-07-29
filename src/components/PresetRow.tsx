import { ColorValue, Pressable, StyleSheet, Text, View } from "react-native"
import { theme } from "../resources/theme"
import Icon from "@expo/vector-icons/MaterialCommunityIcons"
import React from "react"

type IconName = React.ComponentProps<typeof Icon>["name"]

type Props = {
	label: string
	onPress: () => void
	value?: string
	icon?: IconName
	trailingIcon?: IconName
	trailingIconColor?: ColorValue
}

export default function PresetRow({
	label,
	onPress,
	value = "",
	icon = "timer-outline",
	trailingIcon = "chevron-right",
	trailingIconColor = theme.colors.grayDark,
}: Props) {
	return (
		<Pressable onPress={onPress} style={styles.row}>
			<Icon name={icon} size={theme.fontSize.xxl} color={theme.colors.textLight} />
			<Text style={styles.label} numberOfLines={1}>
				{label}
			</Text>

			<View style={styles.valueContainer}>
				<Text style={styles.value} numberOfLines={1}>
					{value}
				</Text>
				<Icon name={trailingIcon} size={theme.fontSize.xxl} color={trailingIconColor} />
			</View>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	row: {
		alignItems: "center",
		flexDirection: "row",
		minHeight: 56,
		paddingHorizontal: theme.spacing.s,
		paddingVertical: theme.spacing.xxs,
	},
	label: {
		color: theme.colors.textLight,
		flexShrink: 1,
		fontSize: theme.fontSize.m,
		fontWeight: "500",
		marginLeft: theme.spacing.xs,
	},
	valueContainer: {
		alignItems: "center",
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	value: {
		color: theme.colors.grayDark,
		flexShrink: 1,
		fontSize: theme.fontSize.s,
		marginRight: theme.spacing.xxs,
	},
})
