import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { theme } from "../resources/theme"
import { useTranslation } from "react-i18next"
import Modal from "react-native-modal"

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
			<View style={styles.container}>
				<Text style={styles.text}>{title}</Text>

				<View style={styles.inputsContainer}>
					<View style={styles.inputContainer}>
						<TextInput
							style={styles.input}
							onChangeText={setHours}
							value={hours}
							maxLength={2}
							placeholder="00"
							placeholderTextColor={theme.colors.textDark}
							keyboardType="numeric"
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
							placeholderTextColor={theme.colors.textDark}
							keyboardType="numeric"
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
							placeholderTextColor={theme.colors.textDark}
							keyboardType="numeric"
						/>
					</View>
				</View>

				{withIncrementInput ? (
					<View style={styles.configContainer}>
						<Text style={styles.text}>{t("increment")}</Text>
						<View>
							<TextInput
								style={styles.timeIncrementInput}
								onChangeText={(t) => {
									Number(t) > 59 ? setIncrement("59") : setIncrement(t)
								}}
								value={increment}
								maxLength={2}
								placeholder="0"
								placeholderTextColor={theme.colors.grayDark}
								keyboardType="numeric"
							/>
						</View>
					</View>
				) : (
					<></>
				)}

				<View style={styles.actionsContainer}>
					<TouchableOpacity
						onPress={() => setIsVisible(false)}
						style={styles.actionContainer}
					>
						<Text style={styles.text}>{t("actions.cancel")}</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={onSave}
						style={[styles.actionContainer, styles.confirmAction]}
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
		justifyContent: "center",
		backgroundColor: theme.colors.backgroundDark,
		borderRadius: 16,
		padding: theme.spacing.m,
		marginHorizontal: theme.spacing.s,
	},
	text: {
		color: theme.colors.textLight,
		fontSize: theme.fontSize.m,
		fontWeight: "500",
		textAlign: "center",
	},
	inputsContainer: {
		alignItems: "center",
		flexDirection: "row",
		marginTop: theme.spacing.m,
	},
	inputContainer: {
		backgroundColor: theme.colors.grayLight,
		borderRadius: 8,
		// paddingVertical: theme.spacing.xxs,
	},
	input: {
		fontSize: theme.fontSize.h3,
		fontWeight: "500",
		paddingHorizontal: theme.spacing.xs,
	},
	colon: {
		color: theme.colors.grayLight,
		fontSize: theme.fontSize.xxl,
		fontWeight: "600",
		marginHorizontal: 4,
	},
	configContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	timeIncrementInput: {
		borderBottomColor: theme.colors.textLight,
		borderBottomWidth: 2,
		color: theme.colors.textLight,
		fontSize: theme.fontSize.xl,
		fontWeight: "500",
		marginLeft: theme.spacing.xxs,
		paddingHorizontal: theme.spacing.xxs,
	},
	actionsContainer: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "center",
		marginTop: theme.spacing.s,
	},
	actionContainer: {
		flex: 1,
	},
	confirmAction: {
		backgroundColor: theme.colors.grayLight,
		borderRadius: theme.spacing.xxs,
		paddingVertical: theme.spacing.xxs,
	},
})
