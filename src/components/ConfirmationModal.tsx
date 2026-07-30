import { StyleSheet, Text } from "react-native"
import { theme } from "../resources/theme"
import Card from "./Card"
import Modal from "react-native-modal"
import ModalActions from "./ModalActions"

type Props = {
	isVisible: boolean
	setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
	title?: string
	saveActionTitle?: string
	onSave: () => void
	isDestructive?: boolean
}

export default function ConfirmationModal({
	isVisible,
	setIsVisible,
	title = "",
	saveActionTitle = "Save",
	onSave,
	isDestructive = true,
}: Props) {
	return (
		<Modal
			isVisible={isVisible}
			onBackButtonPress={() => setIsVisible(false)}
			onBackdropPress={() => setIsVisible(false)}
		>
			<Card style={styles.card}>
				<Text style={styles.title}>{title}</Text>

				<ModalActions
					onCancel={() => setIsVisible(false)}
					onConfirm={onSave}
					confirmTitle={saveActionTitle}
					isDestructive={isDestructive}
				/>
			</Card>
		</Modal>
	)
}

const styles = StyleSheet.create({
	card: {
		marginHorizontal: 0,
		padding: theme.spacing.m,
	},
	title: {
		color: theme.colors.textLight,
		fontSize: theme.fontSize.m,
		fontWeight: "500",
		textAlign: "center",
	},
})
