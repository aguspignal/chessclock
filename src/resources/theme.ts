const pallete = {
	black0: "#242424",
	black1: "#343434",
	white0: "#FDFDFD",
	white1: "#FEFEFE",
	gray0: "#B0B0B0",
	gray1: "#DADADA",
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
		m: 24,
		l: 32,
		xl: 48,
		xxl: 64,
	},

	fontSize: {
		xs: 16,
		s: 20,
		m: 24,
		l: 32,
		xl: 42,
		xxl: 48,
	},
}
