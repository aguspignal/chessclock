import { ActivityIndicator, StyleSheet, View } from "react-native"
import { StatusBar } from "expo-status-bar"
import { theme } from "../resources/theme"

export default function Loading() {
	return (
		<>
			<StatusBar style="light" />

			<View style={styles.container}>
				<ActivityIndicator color={theme.colors.textLight} />
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
})
