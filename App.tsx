import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { NavigationContainer } from "@react-navigation/native"
import { onSQLiteProviderError, onSQLiteProviderInit } from "./src/utils/databaseActions"
import { SQLITE_FILE_NAME } from "./src/utils/constants"
import { SQLiteProvider } from "expo-sqlite"
import { StackParamList } from "./src/types/navigation"
import { StatusBar } from "expo-status-bar"
import { theme } from "./src/resources/theme"
import Clock from "./src/screens/Clock"
import Home from "./src/screens/Home"
import Presets from "./src/screens/Presets"

const Stack = createNativeStackNavigator<StackParamList>()

export default function App() {
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
