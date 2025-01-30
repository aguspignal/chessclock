import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StackParamList } from "./src/types/navigation"
import { StatusBar } from "expo-status-bar"
import Home from "./src/screens/Home"
import Presets from "./src/screens/Presets"
import Clock from "./src/screens/Clock"
import { theme } from "./src/utils/theme"

const Stack = createNativeStackNavigator<StackParamList>()

export default function App() {
	return (
		<NavigationContainer>
			<StatusBar style="light" />
			<Stack.Navigator initialRouteName="Home">
				<Stack.Screen
					name="Home"
					component={Home}
					options={{
						headerTitle: "Chess Clock",
						headerStyle: { backgroundColor: theme.colors.backgroundDark },
						headerTitleStyle: {
							color: theme.colors.textLight,
							fontSize: theme.fontSize.m,
						},
						headerTitleAlign: "center",
						headerShadowVisible: false,
					}}
				/>
				<Stack.Screen
					name="Presets"
					component={Presets}
					options={{
						headerTitle: "Presets",
						headerStyle: { backgroundColor: theme.colors.backgroundDark },
						headerTitleStyle: {
							color: theme.colors.textLight,
							fontSize: theme.fontSize.m,
						},
						headerShadowVisible: false,
						headerTintColor: theme.colors.textLight,
					}}
				/>
				<Stack.Screen name="Clock" component={Clock} options={{ headerShown: false }} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}
