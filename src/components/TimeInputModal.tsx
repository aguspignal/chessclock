import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { theme } from "../utils/theme"
import Modal from "react-native-modal"

type Props = {
	isVisible: boolean
	setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
	hours: string
	setHours: React.Dispatch<React.SetStateAction<string>>
	minutes: string
	setMinutes: React.Dispatch<React.SetStateAction<string>>
	seconds: string
	setSeconds: React.Dispatch<React.SetStateAction<string>>
	onSave: () => void
}

export default function TimeInputModal({
	isVisible,
	setIsVisible,
	hours,
	minutes,
	seconds,
	setHours,
	setMinutes,
	setSeconds,
	onSave,
}: Props) {
	return (
		<Modal
			isVisible={isVisible}
			onBackButtonPress={() => setIsVisible(false)}
			onBackdropPress={() => setIsVisible(false)}
		>
			<View style={styles.timeModalContainer}>
				<Text style={styles.timeModalText}>Adjust time</Text>

				<View style={styles.timeModalInputsContainer}>
					<View style={styles.timeModalInputContainer}>
						<TextInput
							style={styles.timeModalInput}
							onChangeText={setHours}
							value={hours}
							maxLength={2}
							placeholder="00"
							keyboardType="numeric"
						/>
					</View>

					<Text style={styles.timeModalColon}>:</Text>

					<View style={styles.timeModalInputContainer}>
						<TextInput
							style={styles.timeModalInput}
							onChangeText={(t) => {
								Number(t) > 59 ? setMinutes("59") : setMinutes(t)
							}}
							value={minutes}
							maxLength={2}
							placeholder="00"
							keyboardType="numeric"
						/>
					</View>

					<Text style={styles.timeModalColon}>:</Text>

					<View style={styles.timeModalInputContainer}>
						<TextInput
							style={styles.timeModalInput}
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

				<View style={styles.timeModalActionsContainer}>
					<TouchableOpacity onPress={() => setIsVisible(false)}>
						<Text style={styles.timeModalText}>Cancel</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={onSave}>
						<Text style={[styles.timeModalText, { marginLeft: theme.spacing.l }]}>
							Save
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	timeModalContainer: {
		alignItems: "center",
		alignSelf: "center",
		backgroundColor: theme.colors.backgroundDark,
		borderRadius: 16,
		justifyContent: "center",
		paddingHorizontal: theme.spacing.l,
		paddingVertical: theme.spacing.m,
	},
	timeModalText: {
		color: theme.colors.textLight,
		fontSize: theme.fontSize.m,
		fontWeight: "500",
	},
	timeModalInputsContainer: {
		alignItems: "center",
		flexDirection: "row",
	},
	timeModalInputContainer: {
		backgroundColor: theme.colors.grayLight,
		borderRadius: 8,
		marginVertical: theme.spacing.m,
		paddingVertical: theme.spacing.xxs,
	},
	timeModalInput: {
		fontSize: theme.fontSize.xl,
		fontWeight: "500",
		paddingHorizontal: theme.spacing.s,
	},
	timeModalColon: {
		color: theme.colors.grayLight,
		fontSize: theme.fontSize.xl,
		fontWeight: "500",
		marginHorizontal: 4,
	},
	timeModalActionsContainer: {
		alignSelf: "flex-end",
		borderRadius: 8,
		flexDirection: "row",
	},
})
