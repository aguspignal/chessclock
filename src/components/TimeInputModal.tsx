import { StyleSheet, Text, TextInput, View } from "react-native"
import { theme } from "../resources/theme"
import { useTranslation } from "react-i18next"
import Card from "./Card"
import Modal from "react-native-modal"
import ModalActions from "./ModalActions"

type Props = {
	isVisible: boolean
	setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
	title?: string
	saveActionTitle?: string
	onSave: () => void
	hours: string
	setHours: React.Dispatch<React.SetStateAction<string>>
	minutes: string
	setMinutes: React.Dispatch<React.SetStateAction<string>>
	seconds: string
	setSeconds: React.Dispatch<React.SetStateAction<string>>
	withIncrementInput?: boolean
	increment?: string
	setIncrement?: React.Dispatch<React.SetStateAction<string>>
}

export default function TimeInputModal({
	isVisible,
	setIsVisible,
	title = "",
	saveActionTitle = "Save",
	onSave,
	hours,
	minutes,
	seconds,
	setHours,
	setMinutes,
	setSeconds,
	withIncrementInput = false,
	increment,
	setIncrement = () => {},
}: Props) {
	const { t } = useTranslation()

	return (
		<Modal
			isVisible={isVisible}
			onBackButtonPress={() => setIsVisible(false)}
			onBackdropPress={() => setIsVisible(false)}
		>
			<Card style={styles.card}>
				<Text style={styles.title}>{title}</Text>

				<View style={styles.inputsContainer}>
					<View style={styles.inputContainer}>
						<TextInput
							style={styles.input}
							onChangeText={setHours}
							value={hours}
							maxLength={2}
							placeholder="00"
							placeholderTextColor={theme.colors.grayDark}
							keyboardType="numeric"
							selectTextOnFocus
						/>
					</View>

					<Text style={styles.colon}>:</Text>

					<View style={styles.inputContainer}>
						<TextInput
							style={styles.input}
							onChangeText={(t) => {
								Number(t) > 59 ? setMinutes("59") : setMinutes(t)
							}}
							value={minutes}
							maxLength={2}
							placeholder="00"
							placeholderTextColor={theme.colors.grayDark}
							keyboardType="numeric"
							selectTextOnFocus
						/>
					</View>

					<Text style={styles.colon}>:</Text>

					<View style={styles.inputContainer}>
						<TextInput
							style={styles.input}
							onChangeText={(t) => {
								Number(t) > 59 ? setSeconds("59") : setSeconds(t)
							}}
							value={seconds}
							maxLength={2}
							placeholder="00"
							placeholderTextColor={theme.colors.grayDark}
							keyboardType="numeric"
							selectTextOnFocus
						/>
					</View>
				</View>

				{withIncrementInput ? (
					<View style={styles.incrementContainer}>
						<Text style={styles.incrementLabel}>{t("increment")}</Text>

						<View style={styles.inputContainer}>
							<TextInput
								style={[styles.input, styles.incrementInput]}
								onChangeText={(t) => {
									Number(t) > 59 ? setIncrement("59") : setIncrement(t)
								}}
								value={increment}
								maxLength={2}
								placeholder="0"
								placeholderTextColor={theme.colors.grayDark}
								keyboardType="numeric"
								selectTextOnFocus
							/>
						</View>
					</View>
				) : (
					<></>
				)}

				<ModalActions
					onCancel={() => setIsVisible(false)}
					onConfirm={onSave}
					confirmTitle={saveActionTitle}
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
	inputsContainer: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "center",
		marginTop: theme.spacing.m,
	},
	inputContainer: {
		backgroundColor: theme.colors.surfaceRaised,
		borderRadius: theme.spacing.xxs,
	},
	input: {
		color: theme.colors.textLight,
		fontSize: theme.fontSize.h3,
		fontWeight: "600",
		paddingHorizontal: theme.spacing.xs,
		paddingVertical: 2,
		textAlign: "center",
	},
	colon: {
		color: theme.colors.grayDark,
		fontSize: theme.fontSize.xxl,
		fontWeight: "600",
		marginHorizontal: 4,
	},
	incrementContainer: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: theme.spacing.s,
	},
	incrementLabel: {
		color: theme.colors.accent,
		fontSize: theme.fontSize.xxs,
		fontWeight: "600",
		letterSpacing: 1,
		textTransform: "uppercase",
	},
	incrementInput: {
		fontSize: theme.fontSize.xl,
		minWidth: theme.spacing.x3l,
	},
})
