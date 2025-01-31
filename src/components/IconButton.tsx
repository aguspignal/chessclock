import { ColorValue, TouchableOpacity } from "react-native"
import { theme } from "../utils/theme"
import Icon from "@react-native-vector-icons/material-design-icons"

type Props = {
	onPress: () => void
	iconName: React.ComponentProps<typeof Icon>["name"]
	iconSize?: number
	iconColor?: ColorValue
}

export default function IconButton({
	onPress,
	iconName = "check",
	iconSize = theme.fontSize.xl,
	iconColor = theme.colors.textLight,
}: Props) {
	return (
		<TouchableOpacity onPress={onPress}>
			<Icon name={iconName} size={iconSize} color={iconColor} />
		</TouchableOpacity>
	)
}
