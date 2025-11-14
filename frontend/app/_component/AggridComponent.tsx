'use client';

import { useRef, forwardRef, useImperativeHandle } from 'react';

/** MUI */
import { Box, useTheme } from '@mui/material';

/** Ag Grid */
import { AllCommunityModule, ModuleRegistry, ColDef, themeQuartz, iconSetQuartzLight, GridReadyEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

ModuleRegistry.registerModules([AllCommunityModule]);

interface propsType {
	rowData: Record<string, any>[];
	colDefs: ColDef<Record<string, any>>[];
	onGridReady?: (params: GridReadyEvent) => void;
}

const AggridComponent = forwardRef(({ rowData, colDefs, onGridReady }: propsType, ref) => {
	const gridRef = useRef<AgGridReact>(null);
	const theme = useTheme();
	const gridTheme = themeQuartz.withPart(iconSetQuartzLight).withParams({
		accentColor: theme.palette.primary.main,
		backgroundColor: '#ffffff',
		browserColorScheme: 'light',
		columnBorder: false,
		foregroundColor: theme.palette.grey[500],
		headerBackgroundColor: theme.palette.grey[50],
		headerFontSize: 14,
		headerFontWeight: 600,
		headerTextColor: theme.palette.grey[700],
		rowBorder: true,
		sidePanelBorder: false,
		spacing: 8,
		wrapperBorder: false,
		wrapperBorderRadius: 0,
	});

	// 부모에서 ref.current.api 등 바로 사용 가능
	useImperativeHandle(ref, () => gridRef.current);

	const onGridReadyEvent = (params: GridReadyEvent) => {
		params.api.sizeColumnsToFit();
		if (onGridReady) {
			onGridReady(params);
		}
	};

	return (
		<Box sx={{ width: '100%', height: '100%' }}>
			<AgGridReact ref={gridRef} theme={gridTheme} rowData={rowData} columnDefs={colDefs} pagination={true} onGridReady={onGridReadyEvent} />
		</Box>
	);
});

AggridComponent.displayName = 'AggridComponent';
export default AggridComponent;
