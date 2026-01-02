'use client';

import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { useState } from 'react';
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
}

export default function CommonTabs({ tabs, defaultTab = 0, containerSx }: CommonTabsProps) {
	const [value, setValue] = useState(defaultTab);
	const theme = useTheme();

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<>
			<Tabs value={value} onChange={handleChange} sx={{ flexShrink: 0, padding: '0 1.5rem' }}>
				{tabs.map((tab, idx) => (
					<Tab key={idx} label={tab.label} id={`tab-${idx}`} />
				))}
			</Tabs>
			<Box
				sx={{
					flexGrow: 1,
					borderTop: `1px solid ${theme.palette.divider}`,
					padding: tabs[value].type === 'grid' ? '' : '1rem 1.5rem',
					...containerSx,
				}}
			>
				{tabs[value].type === 'grid' && tabs[value].rowData && tabs[value].colDefs ? (
					<Box sx={{ flexGrow: 1, width: '100%' }}>
						<CustomAgGridComp rowData={tabs[value].rowData} colDefs={tabs[value].colDefs} />
					</Box>
				) : (
					<>{tabs[value].content}</>
				)}
			</Box>
		</>
	);
}
