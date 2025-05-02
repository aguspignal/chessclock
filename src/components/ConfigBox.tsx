import { Dropdown } from "react-native-element-dropdown"
import { StyleSheet, Switch, Text, View } from "react-native"
import { theme } from "../resources/theme"
import Icon from "@react-native-vector-icons/material-design-icons"
import React from "react"

type Props = {
	title: string
	valueName?: string
	isIcon?: boolean
	isToggle?: boolean
	toggleValue?: boolean
	onToggleChange?: React.Dispatch<React.SetStateAction<boolean>>
	isDropdown?: boolean
	onDropdownChange?: React.Dispatch<React.SetStateAction<any>>
	dropdownData?: { label: string; value: string }[]
	dropdownDefaultValue?: string | null
	centered?: boolean
}

export default function ConfigBox({
	title,
	valueName = "na",
	isIcon = false,
	isToggle = false,
	toggleValue = false,
	onToggleChange = () => {},
	isDropdown = false,
	onDropdownChange = () => {},
	dropdownData = [],
	dropdownDefaultValue = "",
	centered = false,
}: Props) {
	return (
		<View style={[styles.container, centered ? { justifyContent: "center" } : ""]}>
			<Text style={[styles.text]}>{title}</Text>

			{isIcon ? (
				<Icon
					//@ts-ignore
					name={valueName}
					color={theme.colors.textLight}
					size={theme.fontSize.xxl}
				/>
			) : isToggle ? (
				<Switch value={toggleValue} onValueChange={() => onToggleChange(!toggleValue)} />
			) : isDropdown ? (
				<Dropdown
					style={styles.dropdown}
					selectedTextStyle={styles.dropdownText}
					labelField="label"
					valueField="value"
					value={dropdownDefaultValue ?? ""}
					data={dropdownData}
					onChange={(i) => onDropdownChange(i.value)}
					renderRightIcon={() => <></>}
				/>
			) : (
				<View style={[centered ? { marginHorizontal: theme.spacing.xs } : ""]}>
					<Text style={[styles.text, { fontWeight: "400" }]}>{valueName}</Text>
				</View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: theme.spacing.s,
		marginVertical: theme.spacing.s,
	},
	text: {
		color: theme.colors.textLight,
		flex: 1,
		fontSize: theme.fontSize.m,
		fontWeight: "500",
	},
	dropdown: {
		flex: 1,
	},
	dropdownText: {
		color: theme.colors.textLight,
		fontSize: theme.fontSize.m,
		textAlign: "right",
	},
})
