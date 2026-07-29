import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { theme } from "../resources/theme"
import React from "react"

type Props = {
	children: React.ReactNode
	style?: StyleProp<ViewStyle>
}

// The bordered panel every section sits in. `CardDivider` separates its rows.
export default function Card({ children, style }: Props) {
	return <View style={[styles.card, style]}>{children}</View>
}

export function CardDivider() {
	return <View style={styles.divider} />
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: theme.colors.surface,
		borderColor: theme.colors.border,
		borderRadius: theme.spacing.s,
		borderWidth: 1,
		marginHorizontal: theme.spacing.s,
	},
	divider: {
		backgroundColor: theme.colors.divider,
		height: StyleSheet.hairlineWidth,
		marginHorizontal: theme.spacing.s,
	},
})
