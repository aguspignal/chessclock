import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { theme } from "../resources/theme"
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
							keyboardType="numeric"
						/>
					</View>
				</View>

				{withIncrementInput ? (
					<View style={styles.configContainer}>
						<Text style={styles.text}>Time increment</Text>
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
						<Text style={styles.text}>Cancel</Text>
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
		backgroundColor: theme.colors.backgroundDark,
		borderRadius: 16,
		justifyContent: "center",
		padding: theme.spacing.l,
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
		marginVertical: theme.spacing.m,
	},
	inputContainer: {
		backgroundColor: theme.colors.grayLight,
		borderRadius: 8,
		paddingVertical: theme.spacing.xxs,
	},
	input: {
		fontSize: theme.fontSize.xl,
		fontWeight: "500",
		paddingHorizontal: theme.spacing.s,
	},
	colon: {
		color: theme.colors.grayLight,
		fontSize: theme.fontSize.xl,
		fontWeight: "500",
		marginHorizontal: 4,
	},
	configContainer: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "center",
		marginBottom: theme.spacing.l,
	},
	timeIncrementInput: {
		borderBottomColor: theme.colors.textLight,
		borderBottomWidth: 2,
		color: theme.colors.textLight,
		fontSize: theme.fontSize.l,
		fontWeight: "500",
		marginLeft: theme.spacing.xxs,
		paddingHorizontal: theme.spacing.xxs,
	},
	actionsContainer: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "center",
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
