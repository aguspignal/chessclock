import { StyleSheet, Text, View } from "react-native"
import { theme } from "../utils/theme"
import { StatusBar } from "expo-status-bar"

export default function Loading() {
	return (
		<>
			<StatusBar style="light" />
			<View style={styles.container}>
				<Text style={styles.title}>Chess clock</Text>
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.colors.backgroundDark,
		flex: 1,
		justifyContent: "center",
	},
	title: {
		fontSize: theme.fontSize.xl,
		color: theme.colors.textLight,
		textAlign: "center",
	},
})
