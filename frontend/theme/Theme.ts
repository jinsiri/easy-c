'use client';

// import type {} from '@mui/material/themeCssVarsAugmentation';
import { createTheme } from '@mui/material/styles';
import colorSchemes from '@/theme/colorSchemes';
import typography from '@/theme/typography';

import component from './component';
import shapes from './shapes';

const theme = createTheme({
	cssVariables: true,
	colorSchemes: colorSchemes,
	typography: typography,
	shape: shapes,
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 900,
			lg: 1200,
			xl: 1536,
		},
	},
});

theme.components = component(theme);

export default theme;
