'use client';

import { useRef, useMemo, forwardRef, useImperativeHandle } from 'react';

/** MUI */
import { Box, useTheme } from '@mui/material';

/** Ag Grid */
import { AllCommunityModule, ModuleRegistry, ColDef, themeQuartz, iconSetQuartzLight, GridReadyEvent, RowSelectionOptions } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

ModuleRegistry.registerModules([AllCommunityModule]);

interface propsType {
	rowData: Record<string, any>[];
	colDefs: ColDef<Record<string, any>>[];
	rowSelect?: 'single' | 'multiple' | RowSelectionOptions;
	onGridReady?: (params: GridReadyEvent) => void;
}

const CustomAgGridComp = forwardRef(({ rowData, colDefs, rowSelect, onGridReady }: propsType, ref) => {
	const gridRef = useRef<AgGridReact>(null);
	const theme = useTheme();
	const gridTheme = themeQuartz.withPart(iconSetQuartzLight).withParams({
		accentColor: theme.palette.primary.main,
		backgroundColor: '#ffffff',
		borderColor: theme.palette.grey[200],
		browserColorScheme: 'light',
		columnBorder: false,
		foregroundColor: theme.palette.grey[500],
		headerBackgroundColor: theme.palette.grey[50],
		headerFontSize: 14,
		headerFontWeight: 600,
		headerTextColor: theme.palette.grey[700],
		rowBorder: true,
		sidePanelBorder: false,
		spacing: 6,
		wrapperBorder: false,
		wrapperBorderRadius: 0,
	});

	useImperativeHandle(ref, () => gridRef.current);

	const onGridReadyEvent = (params: GridReadyEvent) => {
		params.api.sizeColumnsToFit();
		if (onGridReady) {
			onGridReady(params);
		}
	};

	const RowSelection = useMemo<RowSelectionOptions | undefined>(() => {
		if (!rowSelect) return undefined;

		if (typeof rowSelect === 'string') {
			return {
				mode: rowSelect === 'multiple' ? 'multiRow' : 'singleRow',
			};
		}

		return rowSelect;
	}, [rowSelect]);

	return (
		<Box sx={{ width: '100%', height: '100%' }}>
			<AgGridReact
				ref={gridRef}
				theme={gridTheme}
				rowData={rowData}
				columnDefs={colDefs}
				rowSelection={RowSelection}
				pagination={true}
				onGridReady={onGridReadyEvent}
			/>
		</Box>
	);
});

CustomAgGridComp.displayName = 'CustomAgGridComp';
export default CustomAgGridComp;
