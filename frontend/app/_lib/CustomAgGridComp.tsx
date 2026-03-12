'use client';

import { forwardRef, useImperativeHandle, useMemo, useCallback, useRef } from 'react';

/** MUI */
import { Box, useTheme } from '@mui/material';

/** Ag Grid */
import {
	AllCommunityModule,
	ModuleRegistry,
	ColDef,
	themeQuartz,
	iconSetQuartzLight,
	GridReadyEvent,
	RowSelectionOptions,
	RowDragEndEvent,
	CellClickedEvent,
	CellDoubleClickedEvent,
} from 'ag-grid-community';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import AgStylePagination, { ServerPaginationConfig } from './AgStylePagination';

// Ag-grid Row selection 옵션 추가
export type RowSelectionMode = 'single' | 'multiple' | 'none';

export const createRowSelection = (mode: RowSelectionMode) => {
	if (mode === 'none') return undefined;

	const options: RowSelectionOptions = {
		mode: mode === 'single' ? 'singleRow' : 'multiRow',
		enableClickSelection: false,
		enableSelectionWithoutKeys: true, // ctrl 키 없이 여러개 선택
	};

	return options;
};

ModuleRegistry.registerModules([AllCommunityModule]);

interface propsType extends AgGridReactProps {
	rowData: Record<string, any>[];
	colDefs: ColDef<Record<string, any>>[];
	pagination?: boolean;
	serverPagination?: ServerPaginationConfig;
	rowSelectionMode?: 'single' | 'multiple' | 'none';
	animateRows?: boolean;
	isReorderMode?: boolean;
	onGridReady?: (params: GridReadyEvent) => void;
	onRowDragEnd?: (params: RowDragEndEvent) => void;
	onCellClicked?: (params: CellClickedEvent) => void;
	onCellDoubleClicked?: (params: CellDoubleClickedEvent) => void;
}

const CustomAgGridComp = forwardRef(
	(
		{
			rowData,
			colDefs,
			pagination = true,
			serverPagination,
			rowSelectionMode = 'none',
			animateRows,
			isReorderMode = false,
			onGridReady,
			onRowDragEnd,
			onCellClicked,
			onCellDoubleClicked,
			...props
		}: propsType,
		ref,
	) => {
		const gridRef = useRef<AgGridReact>(null);
		const theme = useTheme();
		const gridTheme = themeQuartz.withPart(iconSetQuartzLight).withParams({
			accentColor: theme.palette.primary.main,
			backgroundColor: '#ffffff',
			borderColor: theme.palette.grey[200],
			browserColorScheme: 'light',
			columnBorder: false,
			cellTextColor: theme.palette.grey[900],
			fontSize: '0.875rem',
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

		// 부모에서 ref.current.api 등 바로 사용 가능
		useImperativeHandle(ref, () => gridRef.current);

		const finalColDefs: ColDef<Record<string, any>>[] = useMemo(() => {
			const baseCols = [...colDefs];

			if (isReorderMode) {
				return [
					{
						headerName: '',
						width: 80,
						rowDrag: isReorderMode,
						cellClass: 'cursor-move',
					},
					...baseCols,
				];
			}

			if (rowSelectionMode === 'multiple') {
				return [...baseCols];
			}

			return baseCols;
		}, [colDefs, isReorderMode, rowSelectionMode]);

		const rowSelection = useMemo(() => {
			if (isReorderMode) return undefined;
			return createRowSelection(rowSelectionMode);
		}, [rowSelectionMode, isReorderMode]);

		const onGridReadyEvent = (params: GridReadyEvent) => {
			params.api.sizeColumnsToFit();
			if (onGridReady) {
				onGridReady(params);
			}
		};

		const onGridSizeChanged = useCallback((params: { api: { sizeColumnsToFit: () => void } }) => {
			params.api.sizeColumnsToFit();
		}, []);

		return (
			<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
				<Box sx={{ flex: 1, minHeight: 0 }}>
					<AgGridReact
						{...props}
						ref={gridRef}
						theme={gridTheme}
						rowData={rowData}
						columnDefs={finalColDefs}
						rowSelection={rowSelection}
						pagination={serverPagination ? false : pagination}
						rowDragManaged={isReorderMode}
						suppressRowDrag={!isReorderMode}
						animateRows={animateRows}
						onGridReady={onGridReadyEvent}
						onGridSizeChanged={onGridSizeChanged}
						onRowDragEnd={onRowDragEnd}
						onCellClicked={onCellClicked}
						onCellDoubleClicked={onCellDoubleClicked}
					/>
				</Box>
				{serverPagination && <AgStylePagination {...serverPagination} />}
			</Box>
		);
	},
);

CustomAgGridComp.displayName = 'CustomAgGridComp';
export default CustomAgGridComp;
