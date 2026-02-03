'use client';

import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';

/** MUI */
import { Box, useTheme } from '@mui/material';

/** Ag Grid */
import { AllCommunityModule, ColDef, GridReadyEvent, iconSetQuartzLight, ModuleRegistry, RowSelectionOptions, themeQuartz } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

// Ag-grid Row selection 옵션 추가
export type RowSelectionMode = 'single' | 'multiple' | 'none';

export const createRowSelection = (mode: RowSelectionMode) => {
	if (mode === 'none') return undefined;

	const options: RowSelectionOptions = {
		mode: mode === 'single' ? 'singleRow' : 'multiRow',
		enableClickSelection: true,
		enableSelectionWithoutKeys: true, // ctrl 키 없이 여러개 선택
	};

	return options;
};

ModuleRegistry.registerModules([AllCommunityModule]);

interface propsType {
	rowData: Record<string, any>[];
	colDefs: ColDef<Record<string, any>>[];
	pagination?: boolean;
	onGridReady?: (params: GridReadyEvent) => void;
	rowSelectionMode?: 'single' | 'multiple' | 'none';
}

const CustomAgGridComp = forwardRef(({ rowData, colDefs, onGridReady, pagination = true, rowSelectionMode = 'none' }: propsType, ref) => {
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

	const rowSelection = useMemo(() => {
		return createRowSelection(rowSelectionMode);
	}, [rowSelectionMode]);

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
			<AgGridReact
				ref={gridRef}
				theme={gridTheme}
				rowData={rowData}
				columnDefs={colDefs}
				rowSelection={rowSelection}
				pagination={pagination}
				onGridReady={onGridReadyEvent}
			/>
		</Box>
	);
});

CustomAgGridComp.displayName = 'CustomAgGridComp';
export default CustomAgGridComp;
