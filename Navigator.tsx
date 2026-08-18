import {
	createNativeStackNavigator,
	NativeStackNavigationProp,
} from "@react-navigation/native-stack"
import { Header } from "@react-navigation/elements"
import { ParamListBase } from "@react-navigation/native"
import { StackParamList } from "./src/types/navigation"
import { theme } from "./src/resources/theme"
import { useTranslation } from "react-i18next"
import { View } from "react-native"
import ActionButton from "./src/components/ActionButton"
import Clock from "./src/screens/Clock"
import Home from "./src/screens/Home"
import Presets from "./src/screens/Presets"
import Settings from "./src/screens/Settings"

const Stack = createNativeStackNavigator<StackParamList>()

export default function Navigator() {
	const { t } = useTranslation()

	return (
		<Stack.Navigator initialRouteName="Home">
			<Stack.Screen
				name="Home"
				component={Home}
				options={{
					header: ({ navigation }) => <HomeHeader navigation={navigation} />,
				}}
			/>
			<Stack.Screen
				name="Presets"
				component={Presets}
				options={({ route }) => {
					const target = route.params?.target
					const player = target === "primary" ? 1 : target === "second" ? 2 : null

					// Interpolating rather than concatenating leaves the number's position to
					// the translation, which is what the RTL locales need.
					const label =
						player === null
							? t("configs.presets-many")
							: t("configs.presets-many-numbered", { number: player })

					return {
						header: ({ back }) => <HeaderWithLabel label={label} back={back} />,
					}
				}}
			/>
			<Stack.Screen name="Clock" component={Clock} options={{ headerShown: false }} />
			<Stack.Screen
				name="Settings"
				component={Settings}
				options={{
					header: ({ back }) => <HeaderWithLabel label={t("settings")} back={back} />,
				}}
			/>
		</Stack.Navigator>
	)
}

type HomeHeaderProps = {
	navigation: NativeStackNavigationProp<ParamListBase, string, undefined>
}
function HomeHeader({ navigation }: HomeHeaderProps) {
	const { t } = useTranslation()

	return (
		<Header
			title={t("app-title")}
			headerTitleStyle={{
				color: theme.colors.textLight,
				fontSize: theme.fontSize.xxl,
			}}
			headerRight={() => (
				<View style={{ marginRight: theme.spacing.s }}>
					<ActionButton icon="cog" onPress={() => navigation.navigate("Settings")} />
				</View>
			)}
			headerStyle={{ backgroundColor: theme.colors.backgroundDark }}
			headerShadowVisible={false}
			headerTitleAlign="left"
		/>
	)
}

type HeaderWithLabelProps = {
	label: string
	back?: {
		title: string | undefined
		href: string | undefined
	}
}
function HeaderWithLabel({ label, back }: HeaderWithLabelProps) {
	return (
		<Header
			title={label}
			headerTitleStyle={{
				color: theme.colors.textLight,
				fontSize: theme.fontSize.l,
			}}
			headerStyle={{ backgroundColor: theme.colors.backgroundDark }}
			headerShadowVisible={false}
			headerTintColor={theme.colors.textLight}
			back={back}
		/>
	)
}
