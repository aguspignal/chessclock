import "./i18n"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { NavigationContainer } from "@react-navigation/native"
import { onSQLiteProviderError, onSQLiteProviderInit } from "./src/utils/databaseActions"
import { SQLITE_FILE_NAME } from "./src/utils/constants"
import { SQLiteProvider } from "expo-sqlite"
import Main from "./Main"

export default function App() {
	return (
		<GestureHandlerRootView>
			<SQLiteProvider
				databaseName={SQLITE_FILE_NAME}
				onInit={onSQLiteProviderInit}
				onError={onSQLiteProviderError}
			>
				<NavigationContainer>
					<Main />
				</NavigationContainer>
			</SQLiteProvider>
		</GestureHandlerRootView>
	)
}
