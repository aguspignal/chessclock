import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native"
import { orderPresetsByDuration } from "../utils/parsing"
import { PresetsProps } from "../types/navigation"
import { theme } from "../utils/theme"
import ConfigBox from "../components/ConfigBox"
import IconButton from "../components/IconButton"
import presets from "../utils/presets.json"
import useLocalStorage from "../hooks/useLocalStorage"

export default function Presets({ navigation }: PresetsProps) {
	const { storeInLocalStorage } = useLocalStorage()

	async function handleSelectPreset(preset: Preset) {
		storeInLocalStorage({ preset })
			.then(() => {
				navigation.reset({
					index: 0,
					routes: [{ name: "Home", params: { defaultPreset: preset } }],
				})
			})
			.catch((e) => {
				console.log(e)
				navigation.popToTop()
			})
	}

	function handleAddPreset() {}

	function handleEdit() {}

	return (
		<View style={styles.container}>
			<View style={styles.actionsContainer}>
				<IconButton onPress={handleAddPreset} iconName="plus" style={styles.actionIcon} />

				<IconButton onPress={handleEdit} iconName="pencil" style={styles.actionIcon} />
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
