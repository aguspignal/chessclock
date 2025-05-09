import {
	createNativeStackNavigator,
	NativeStackNavigationProp,
} from "@react-navigation/native-stack"
import { Header } from "@react-navigation/elements"
import { ParamListBase } from "@react-navigation/native"
import { Pressable } from "react-native"
import { StackParamList } from "./src/types/navigation"
import { theme } from "./src/resources/theme"
import { useTranslation } from "react-i18next"
import Clock from "./src/screens/Clock"
import Home from "./src/screens/Home"
import Icon from "@react-native-vector-icons/material-design-icons"
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
				options={{
					header: ({ back }) => (
						<HeaderWithLabel label={t("configs.presets-many")} back={back} />
					),
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
				textAlign: "center",
			}}
			headerRight={() => (
				<Pressable
					onPressIn={() => navigation.navigate("Settings")}
					style={{ marginRight: theme.spacing.xs }}
				>
					<Icon name="cog" size={theme.fontSize.h3} color={theme.colors.textLight} />
				</Pressable>
			)}
			headerStyle={{ backgroundColor: theme.colors.backgroundDark }}
			headerShadowVisible={false}
			headerTitleAlign="center"
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
