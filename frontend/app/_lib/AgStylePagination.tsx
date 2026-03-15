'use client';

import { Box, IconButton, MenuItem, Select, Typography, useTheme } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export interface ServerPaginationConfig {
	page: number; // 0-based
	pageSize: number;
	totalElements: number;
	pageSizeOptions?: number[];
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
}

export default function AgStylePagination({
	page,
	pageSize,
	totalElements,
	pageSizeOptions = [20, 50, 100],
	onPageChange,
	onPageSizeChange,
}: ServerPaginationConfig) {
	const theme = useTheme();
	const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
	const from = totalElements === 0 ? 0 : page * pageSize + 1;
	const to = Math.min((page + 1) * pageSize, totalElements);

	const btnSx = {
		width: 28,
		height: 28,
		borderRadius: '4px',
		color: theme.palette.grey[600],
		'&:hover': { bgcolor: theme.palette.grey[100] },
		'&.Mui-disabled': { color: theme.palette.grey[300] },
	};

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'flex-end',
				gap: '4px',
				px: '12px',
				height: '48px',
				flexShrink: 0,
				borderTop: `1px solid ${theme.palette.grey[200]}`,
				bgcolor: '#ffffff',
				userSelect: 'none',
			}}
		>
			{/* Page size */}
			<Typography variant="body2" sx={{ color: theme.palette.grey[600], fontSize: '0.8125rem', mr: '4px' }}>
				Page Size:
			</Typography>
			<Select
				value={pageSize}
				onChange={(e) => {
					onPageSizeChange(Number(e.target.value));
					onPageChange(0);
				}}
				size="small"
				variant="outlined"
				sx={{
					fontSize: '0.8125rem',
					height: '28px',
					color: theme.palette.grey[700],
					'.MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.grey[300] },
					'&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.grey[400] },
					'.MuiSelect-select': { py: '2px', px: '8px' },
				}}
			>
				{pageSizeOptions.map((opt) => (
					<MenuItem key={opt} value={opt} sx={{ fontSize: '0.8125rem' }}>
						{opt}
					</MenuItem>
				))}
			</Select>

			{/* Row range info */}
			<Typography variant="body2" sx={{ color: theme.palette.grey[600], fontSize: '0.8125rem', mx: '8px' }}>
				{from.toLocaleString()} to {to.toLocaleString()} of {totalElements.toLocaleString()}
			</Typography>

			{/* Navigation */}
			<IconButton size="small" disabled={page === 0} onClick={() => onPageChange(0)} sx={btnSx}>
				<FirstPageIcon sx={{ fontSize: 18 }} />
			</IconButton>
			<IconButton size="small" disabled={page === 0} onClick={() => onPageChange(page - 1)} sx={btnSx}>
				<ChevronLeftIcon sx={{ fontSize: 18 }} />
			</IconButton>

			<Typography variant="body2" sx={{ color: theme.palette.grey[600], fontSize: '0.8125rem', mx: '4px', whiteSpace: 'nowrap' }}>
				Page {page + 1} of {totalPages}
			</Typography>

			<IconButton size="small" disabled={page >= totalPages - 1} onClick={() => onPageChange(page + 1)} sx={btnSx}>
				<ChevronRightIcon sx={{ fontSize: 18 }} />
			</IconButton>
			<IconButton size="small" disabled={page >= totalPages - 1} onClick={() => onPageChange(totalPages - 1)} sx={btnSx}>
				<LastPageIcon sx={{ fontSize: 18 }} />
			</IconButton>
		</Box>
	);
}
