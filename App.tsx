import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { NavigationContainer } from "@react-navigation/native"
import { onSQLiteProviderInit, onSQLiteProviderError } from "./src/utils/databaseActions"
import { SQLITE_FILE_NAME } from "./src/utils/constants"
import { SQLiteProvider } from "expo-sqlite"
import { StackParamList } from "./src/types/navigation"
import { StatusBar } from "expo-status-bar"
import { theme } from "./src/resources/theme"
import { useEffect, useState } from "react"
import Clock from "./src/screens/Clock"
import Home from "./src/screens/Home"
import Loading from "./src/screens/Loading"
import presets from "./src/resources/presets.json"
import Presets from "./src/screens/Presets"
import useLocalStorage from "./src/hooks/useLocalStorage"

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
		<SQLiteProvider
			databaseName={SQLITE_FILE_NAME}
			onInit={onSQLiteProviderInit}
			onError={onSQLiteProviderError}
		>
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
								fontSize: theme.fontSize.l,
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
		</SQLiteProvider>
	)
}
