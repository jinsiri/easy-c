import '@mui/material/styles';

type ColorScale = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1500;

declare module '@mui/material/styles' {
	interface PaletteColor {
		[key: number]: string;
	}
}
