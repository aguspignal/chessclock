import { NavigationContainer } from "@react-navigation/native"
import { onSQLiteProviderError, onSQLiteProviderInit } from "./src/utils/databaseActions"
import { SQLITE_FILE_NAME } from "./src/utils/constants"
import { SQLiteProvider } from "expo-sqlite"
import Main from "./Main"
import "./i18n"

export default function App() {
	return (
		<SQLiteProvider
			databaseName={SQLITE_FILE_NAME}
			onInit={onSQLiteProviderInit}
			onError={onSQLiteProviderError}
		>
			<NavigationContainer>
				<Main />
			</NavigationContainer>
		</SQLiteProvider>
	)
}
