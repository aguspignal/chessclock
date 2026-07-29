const pallete = {
	black0: "#121212",
	black1: "#1C1A15",
	black2: "#24211A",
	black3: "#2F2B22",
	black4: "#3D382C",
	black5: "#37322A",
	white0: "#FDFCFC",
	white1: "#FEFEFE",
	gray0: "#B0B0B0",
	gray1: "#DADADA",
	tan0: "#E0A96D",
	green: "#AACC00",
	yellow: "#FFDD00",
	orange: "#E36414",
	red: "#F50F0F",
}

export const theme = {
	colors: {
		textDark: pallete.black0,
		textLight: pallete.white1,

		backgroundDark: pallete.black1,
		backgroundLight: pallete.white0,

		// Card surfaces used by the home cards: the card sits one step lighter than the
		// screen, its controls one step lighter again, the active segment lighter still.
		surface: pallete.black2,
		surfaceRaised: pallete.black3,
		surfaceActive: pallete.black4,
		divider: pallete.black3,
		border: pallete.black5,

		accent: pallete.tan0,

		grayDark: pallete.gray0,
		grayLight: pallete.gray1,

		green: pallete.green,
		yellow: pallete.yellow,
		orange: pallete.orange,
		red: pallete.red,
	},

	spacing: {
		xxs: 8,
		xs: 12,
		s: 16,
		m: 20,
		l: 24,
		xl: 32,
		xxl: 40,
		x3l: 48,
		x4l: 64,
		x5l: 80,
	},

	fontSize: {
		xxs: 12,
		xs: 14,
		s: 16,
		m: 18,
		l: 20,
		xl: 22,
		xxl: 24,
		h3: 32,
		h2: 40,
		h1: 48,
	},
}
