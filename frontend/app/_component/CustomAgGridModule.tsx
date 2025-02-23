import { AgGridReact } from 'ag-grid-react';

/** MUI */
import { Box } from '@mui/material';

/** AG Grid */
import {
	ModuleRegistry,
	AllCommunityModule,
	themeQuartz,
	iconSetQuartzLight,
} from 'ag-grid-community';

// Register the module
ModuleRegistry.registerModules([AllCommunityModule]);

const theme = themeQuartz
	.withPart(iconSetQuartzLight)
	.withParams({
		backgroundColor: '#ffffff',
		browserColorScheme: 'light',
		columnBorder: false,
		fontFamily: 'Arial',
		foregroundColor: 'rgb(46, 55, 66)',
		headerBackgroundColor: '#F9FAFB',
		headerFontSize: 14,
		headerFontWeight: 600,
		headerTextColor: '#919191',
		oddRowBackgroundColor: '#F9FAFB',
		rowBorder: false,
		sidePanelBorder: false,
		spacing: 8,
		wrapperBorder: false,
		wrapperBorderRadius: 0,
	});


export default function CustomAgGridModule({ children }: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<Box style={{ width: '100%', height: '100%' }}>
			<AgGridReact
				theme={theme}
			/>
		</Box>
	);
}

