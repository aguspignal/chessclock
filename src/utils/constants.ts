import Constants from "expo-constants"

export const STATUS_BAR_HEIGHT = Constants.statusBarHeight
export const SQLITE_FILE_NAME = "chessclock.db"

// The theme setting is fully wired in the config store and persisted, but nothing
// applies `appTheme` yet, so the row stays hidden until the theming work lands.
// Flip to true to bring it back — no other change needed.
export const SHOW_THEME_SETTING: boolean = false
