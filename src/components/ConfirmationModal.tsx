import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { theme } from "../resources/theme"
import Modal from "react-native-modal"

type Props = {
	isVisible: boolean
	setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
	title?: string
	saveActionTitle?: string
	onSave: () => void
}

export default function ConfirmationModal({
	isVisible,
	setIsVisible,
	title = "",
	saveActionTitle = "Save",
	onSave,
}: Props) {
	return (
		<Modal
			isVisible={isVisible}
			onBackButtonPress={() => setIsVisible(false)}
			onBackdropPress={() => setIsVisible(false)}
		>
			<View style={styles.container}>
				<Text style={styles.text}>{title}</Text>

				<View style={styles.actionsContainer}>
					<TouchableOpacity
						onPress={() => setIsVisible(false)}
						style={styles.actionContainer}
					>
						<Text style={styles.text}>Cancel</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={onSave}
						style={[styles.confirmDeleteAction, styles.actionContainer]}
					>
						<Text style={[styles.text, { color: theme.colors.textDark }]}>
							{saveActionTitle}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		alignSelf: "center",
		backgroundColor: theme.colors.backgroundDark,
		borderRadius: theme.spacing.s,
		justifyContent: "center",
		padding: theme.spacing.m,
	},
	text: {
		color: theme.colors.textLight,
		fontSize: theme.fontSize.m,
		fontWeight: "500",
		textAlign: "center",
	},
	actionsContainer: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "center",
		paddingTop: theme.spacing.l,
	},
	actionContainer: {
		flex: 1,
	},
	confirmDeleteAction: {
		backgroundColor: theme.colors.red,
		borderRadius: theme.spacing.xxs,
		paddingVertical: theme.spacing.xxs,
	},
})
