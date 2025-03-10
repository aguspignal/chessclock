import {
	createNativeStackNavigator,
	NativeStackNavigationProp,
} from "@react-navigation/native-stack"
import { StackParamList } from "./src/types/navigation"
import { Text, TouchableOpacity } from "react-native"
import { theme } from "./src/resources/theme"
import { useTranslation } from "react-i18next"
import Clock from "./src/screens/Clock"
import Home from "./src/screens/Home"
import Icon from "@react-native-vector-icons/material-design-icons"
import Presets from "./src/screens/Presets"
import Settings from "./src/screens/Settings"

const Stack = createNativeStackNavigator<StackParamList>()

export default function Navigator() {
	return (
		<Stack.Navigator initialRouteName="Home">
			<Stack.Screen
				name="Home"
				component={Home}
				options={({ navigation }) => ({
					headerTitle: () => <HomeHeaderTitle />,
					headerStyle: { backgroundColor: theme.colors.backgroundDark },
					headerTitleAlign: "center",
					headerRight: () => <HomeHeaderRight nav={navigation} />,
					headerShadowVisible: false,
				})}
			/>
			<Stack.Screen
				name="Presets"
				component={Presets}
				options={{
					headerTitle: () => <PresetsHeaderTitle />,
					headerStyle: { backgroundColor: theme.colors.backgroundDark },
					headerShadowVisible: false,
					headerTintColor: theme.colors.textLight,
				}}
			/>
			<Stack.Screen name="Clock" component={Clock} options={{ headerShown: false }} />
			<Stack.Screen
				name="Settings"
				component={Settings}
				options={{
					headerTitle: () => <SettingsHeaderTitle />,
					headerStyle: { backgroundColor: theme.colors.backgroundDark },
					headerShadowVisible: false,
					headerTintColor: theme.colors.textLight,
				}}
			/>
		</Stack.Navigator>
	)
}

function HomeHeaderTitle() {
	const { t } = useTranslation()
	return (
		<Text
			style={{
				color: theme.colors.textLight,
				fontSize: theme.fontSize.l,
				textAlign: "center",
			}}
		>
			{t("app-title")}
		</Text>
	)
}

function HomeHeaderRight({
	nav,
}: {
	nav: NativeStackNavigationProp<StackParamList, "Home", undefined>
}) {
	return (
		<TouchableOpacity onPress={() => nav.navigate("Settings")}>
			<Icon name="cog" size={theme.fontSize.l} color={theme.colors.textLight} />
		</TouchableOpacity>
	)
}

function PresetsHeaderTitle() {
	const { t } = useTranslation()
	return (
		<Text
			style={{
				color: theme.colors.textLight,
				fontSize: theme.fontSize.m,
			}}
		>
			{t("configs.presets-many")}
		</Text>
	)
}

function SettingsHeaderTitle() {
	const { t } = useTranslation()
	return (
		<Text
			style={{
				color: theme.colors.textLight,
				fontSize: theme.fontSize.m,
			}}
		>
			{t("settings")}
		</Text>
	)
}
