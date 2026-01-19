'use client';

import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { SyntheticEvent, useState } from 'react';
import { Box, Tab, Tabs, useTheme } from '@mui/material';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';
import { ColDef } from 'ag-grid-community';

interface TabItem {
	label: string;
	type?: string;
	content?: React.ReactNode;
	colDefs?: ColDef<Record<string, any>>[];
	rowData?: Record<string, any>[];
}

interface CommonTabsProps {
	tabs: TabItem[];
	defaultTab?: number;
	containerSx?: SxProps<Theme>;
	value?: number; // 탭 변경 상태 부모가 관리할 경우
	onChange?: (event: SyntheticEvent, newValue: number) => void;
}

export default function CommonTabs({ tabs, defaultTab = 0, containerSx, value: parentValue, onChange }: CommonTabsProps) {
	const theme = useTheme();
	const [localTab, setLocalTab] = useState(defaultTab);

	const activeTab = parentValue !== undefined ? parentValue : localTab;

	const handleChange = (e: SyntheticEvent, newValue: number) => {
		if (onChange) onChange(e, newValue);
		setLocalTab(newValue);
	};

	return (
		<>
			<Tabs value={activeTab} onChange={handleChange} sx={{ flexShrink: 0, padding: '0 1.5rem' }}>
				{tabs.map((tab, idx) => (
					<Tab key={idx} label={tab.label} id={`tab-${idx}`} />
				))}
			</Tabs>
			<Box
				sx={{
					flexGrow: 1,
					borderTop: `1px solid ${theme.palette.divider}`,
					...containerSx,
				}}
			>
				{tabs[activeTab].type === 'grid' && tabs[activeTab].rowData && tabs[activeTab].colDefs ? (
					<Box key={activeTab} sx={{ flexGrow: 1, width: '100%' }}>
						<CustomAgGridComp rowData={tabs[activeTab].rowData} colDefs={tabs[activeTab].colDefs} />
					</Box>
				) : (
					<>{tabs[activeTab].content}</>
				)}
			</Box>
		</>
	);
}
