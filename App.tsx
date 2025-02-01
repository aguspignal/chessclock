import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { NavigationContainer } from "@react-navigation/native"
import { StackParamList } from "./src/types/navigation"
import { StatusBar } from "expo-status-bar"
import { theme } from "./src/utils/theme"
import Clock from "./src/screens/Clock"
import Home from "./src/screens/Home"
import Presets from "./src/screens/Presets"
import presets from "./src/utils/presets.json"
import useLocalStorage from "./src/hooks/useLocalStorage"
import { useEffect, useState } from "react"
import Loading from "./src/screens/Loading"

const Stack = createNativeStackNavigator<StackParamList>()

export default function App() {
	const { getFromLocalStorage } = useLocalStorage()

	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [initialPreset, setInitialPreset] = useState<Preset>(presets[0])

	useEffect(() => {
		const getPresetFromLocalStorage = async () => {
			const localStorageData = await getFromLocalStorage()

			if (localStorageData?.preset !== undefined) {
				setInitialPreset(localStorageData.preset)
			}

			setIsLoading(false)
		}

		getPresetFromLocalStorage()
	}, [])

	if (isLoading) {
		return <Loading />
	}

	return (
		<NavigationContainer>
			<StatusBar style="light" />
			<Stack.Navigator initialRouteName="Home">
				<Stack.Screen
					name="Home"
					component={Home}
					initialParams={{ defaultPreset: initialPreset }}
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
