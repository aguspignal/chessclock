import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native"
import { theme } from "../utils/theme"
import Icon from "@react-native-vector-icons/material-design-icons"
import ConfigBox from "../components/ConfigBox"
import presets from "../utils/presets.json"

export default function Presets() {
	function handleSelectPreset(time: Preset) {}

	function orderPresetsByDuration(presets: Preset[]): Preset[] {
		return presets
	}

	function handleAddPreset() {}

	function handleEdit() {}

	return (
		<View style={styles.container}>
			<View style={styles.actionsContainer}>
				<TouchableOpacity onPress={handleAddPreset}>
					<Icon
						name="plus"
						color={theme.colors.textLight}
						size={theme.fontSize.xl}
						style={styles.actionIcon}
					/>
				</TouchableOpacity>

				<TouchableOpacity onPress={handleEdit}>
					<Icon
						name="pencil"
						color={theme.colors.textLight}
						size={theme.fontSize.l}
						style={styles.actionIcon}
					/>
				</TouchableOpacity>
			</View>

			<View style={styles.presetsContainer}>
				<FlatList
					data={orderPresetsByDuration(presets)}
					keyExtractor={(item) => item.name}
					renderItem={({ item }) => {
						return (
							<TouchableOpacity
								onPress={() => handleSelectPreset(item)}
								activeOpacity={0.75}
							>
								<ConfigBox
									title={item.name}
									isIcon={true}
									valueName="chevron-right"
								/>
							</TouchableOpacity>
						)
					}}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDark,
	},
	actionsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginVertical: theme.spacing.xs,
	},
	actionIcon: {
		paddingHorizontal: theme.spacing.s,
	},
	presetsContainer: {
		paddingHorizontal: theme.spacing.xxs,
	},
})
