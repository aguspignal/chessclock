const pallete = {
	black0: "#242424",
	black1: "#343434",
	white0: "#FDFDFD",
	white1: "#FEFEFE",
	gray0: "#B0B0B0",
	gray1: "#DADADA",
	green: "#AACC00",
	yellow: "#FFDD00",
	red: "#F50F0F",
}

export const theme = {
	colors: {
		textDark: pallete.black0,
		textLight: pallete.white1,

		backgroundDark: pallete.black1,
		backgroundLight: pallete.white0,

		grayDark: pallete.gray0,
		grayLight: pallete.gray1,

		green: pallete.green,
		yellow: pallete.yellow,
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
