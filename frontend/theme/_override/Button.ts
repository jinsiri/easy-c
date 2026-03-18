import { Theme } from '@mui/material/styles';

const Button = (theme: Theme) => ({
	MuiButton: {
		styleOverrides: {
			root: {
				textWrap: 'nowrap',
			},

			contained: ({ ownerState }) => {
				const color = ownerState.color || 'primary';
				const shadowColor = theme.palette[color].darker;

				return {
					transition: 'all 0.2s ease-in-out',
					// 초기 그림자 (main 컬러에 0.3 투명도)
					boxShadow: `0px 3px 1px -2px rgba(${hexToRgb(shadowColor)}, 0.2), 
								0px 2px 2px 0px rgba(${hexToRgb(shadowColor)}, 0.14), 
								0px 1px 5px 0px rgba(${hexToRgb(shadowColor)}, 0.12);`,
					'&:hover': {
						// 호버 시 그림자를 더 진하고 깊게 (0.4 투명도)
						boxShadow: `0px 2px 4px -1px rgba(${hexToRgb(shadowColor)},0.2), 
									0px 4px 5px 0px rgba(${hexToRgb(shadowColor)}, 0.14), 
									0px 1px 10px 0px rgba(${hexToRgb(shadowColor)}, 0.12)`,
						//transform: 'translateY(-1px)',
					},
					'&:active': {
						boxShadow: `0px 5px 5px -3px rgba(${hexToRgb(shadowColor)},0.2), 
									0px 8px 10px 1px rgba(${hexToRgb(shadowColor)},0.14), 
									0px 3px 14px 2px rgba(${hexToRgb(shadowColor)},0.12)`,
					},
				};
			},
			sizeSmall: {
				fontSize: '0.75rem',
				padding: '0.5rem 0.25rem',
			},
			sizeMedium: {
				minHeight: '2.25rem',
			},
			sizeLarge: {
				padding: '0.5rem 1.5rem',
				fontSize: '1rem',
				minWidth: '5rem',
				minHeight: '2.5rem',
			},
		},
	},
});

function hexToRgb(hex) {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `${r}, ${g}, ${b}`;
}

export default Button;
