import { StyleSheet, Switch, Text, View } from "react-native"
import { theme } from "../utils/theme"
import Icon from "@react-native-vector-icons/material-design-icons"

type Props = {
	title: string
	valueName?: string
	isIcon?: boolean
	isToggle?: boolean
	toggleValue?: boolean
	toggleChange?: React.Dispatch<React.SetStateAction<boolean>>
	centered?: boolean
	biggerValue?: boolean
}

export default function ConfigBox({
	title,
	valueName = "na",
	isIcon = false,
	isToggle = false,
	toggleValue = false,
	toggleChange = () => {},
	centered = false,
	biggerValue = false,
}: Props) {
	return (
		<View style={[styles.configContainer, centered ? { justifyContent: "center" } : ""]}>
			<Text style={styles.configText}>{title}</Text>

			{isIcon ? (
				<Icon
					//@ts-ignore
					name={valueName}
					color={theme.colors.textLight}
					size={theme.fontSize.m}
				/>
			) : isToggle ? (
				<Switch value={toggleValue} onValueChange={() => toggleChange(!toggleValue)} />
			) : (
				<View style={[centered ? { marginHorizontal: theme.spacing.xs } : ""]}>
					<Text
						style={[
							styles.configText,
							biggerValue ? { fontSize: theme.fontSize.m } : "",
						]}
					>
						{valueName}
					</Text>
				</View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	configContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: theme.spacing.s,
		marginVertical: theme.spacing.s,
	},
	configText: {
		color: theme.colors.textLight,
		fontSize: theme.fontSize.s,
		fontWeight: "500",
	},
})
