import Constants from "expo-constants"

const STATUS_BAR_HEIGHT = Constants.statusBarHeight
export const SQLITE_FILE_NAME = "chessclock.db"

// The name stored on a hand-edited time. It stays a language-independent sentinel so a
// persisted name survives a language change; the `custom-preset` key translates it at
// render time instead.
export const CUSTOM_PRESET_NAME = "Custom"

// The top clock is rotated 180deg, so its own status-bar gap ends up at the bottom of
// the screen. Padding it by slightly less than the full bar height is what centres the
// rotated text against the untouched bottom clock.
export const ROTATED_CLOCK_PADDING = STATUS_BAR_HEIGHT / 1.2

// The theme setting is fully wired in the config store and persisted, but nothing
// applies `appTheme` yet, so the row stays hidden until the theming work lands.
// Flip to true to bring it back — no other change needed.
export const SHOW_THEME_SETTING: boolean = false
