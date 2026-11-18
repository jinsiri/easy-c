import '@mui/material/styles';

declare module '@mui/material/styles' {
	interface Palette {
		point: Palette['primary'];
	}
	interface PaletteOptions {
		point?: PaletteOptions['primary'];
	}
}
