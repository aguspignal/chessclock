import { Pressable, StyleSheet, Text, View } from "react-native"
import { theme } from "../resources/theme"
import Icon from "@expo/vector-icons/MaterialCommunityIcons"
import React from "react"

type Props = {
	options: { value: string; label?: string; icon?: React.ComponentProps<typeof Icon>["name"] }[]
	selected: string
	onSelect: (value: string) => void
}

export default function SegmentedControl({ options, selected, onSelect }: Props) {
	return (
		<View style={styles.container}>
			{options.map((option) => {
				const isSelected = option.value === selected

				return (
					<Pressable
						key={option.value}
						onPress={() => onSelect(option.value)}
						style={[styles.segment, isSelected ? styles.segmentSelected : null]}
					>
						{option.icon ? (
							<Icon
								name={option.icon}
								size={theme.fontSize.l}
								color={isSelected ? theme.colors.textLight : theme.colors.grayDark}
							/>
						) : (
							<Text
								style={[
									styles.segmentText,
									isSelected ? styles.segmentTextSelected : null,
								]}
							>
								{option.label}
							</Text>
						)}
					</Pressable>
				)
			})}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.colors.surfaceRaised,
		borderRadius: 10,
		flexDirection: "row",
		padding: 3,
	},
	segment: {
		alignItems: "center",
		borderRadius: 8,
		justifyContent: "center",
		paddingHorizontal: theme.spacing.xs,
		paddingVertical: 6,
	},
	segmentSelected: {
		backgroundColor: theme.colors.surfaceActive,
	},
	segmentText: {
		color: theme.colors.grayDark,
		fontSize: theme.fontSize.xs,
		fontWeight: "500",
	},
	segmentTextSelected: {
		color: theme.colors.textLight,
		fontWeight: "600",
	},
})
