'use client';

import { Box, Button, MenuItem, Select, TextField, InputLabel, FormControl, useTheme } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

export interface LogFilterField {
	key: string;
	label: string;
	type: 'text' | 'select';
	options?: { value: string; label: string }[];
}

export interface LogFilterValues {
	[key: string]: string;
	fromDate: string;
	toDate: string;
}

interface Props {
	fields: LogFilterField[];
	values: LogFilterValues;
	onChange: (values: LogFilterValues) => void;
	onSearch: () => void;
	onReset: () => void;
	showDateRange?: boolean;
}

export default function LogFilterForm({ fields, values, onChange, onSearch, onReset, showDateRange = true }: Props) {
	const theme = useTheme();

	const handleChange = (key: string, value: string) => {
		onChange({ ...values, [key]: value });
	};

	const fieldSx = { minWidth: 140, '& .MuiInputBase-root': { fontSize: '0.875rem' } };
	const labelSx = { fontSize: '0.875rem' };

	return (
		<Box
			sx={{
				display: 'flex',
				flexWrap: 'wrap',
				alignItems: 'center',
				gap: 1,
				px: 1,
				py: 1,
				mb: 1,
				border: `1px solid ${theme.palette.grey[200]}`,
				borderRadius: 1,
				bgcolor: theme.palette.grey[50],
			}}
		>
			{/* 기간 */}
			{showDateRange && (
				<>
					<DatePicker
						label="시작일"
						value={values.fromDate ? dayjs(values.fromDate) : null}
						onChange={(v: Dayjs | null) => handleChange('fromDate', v ? v.format('YYYY-MM-DD') : '')}
						slotProps={{
							textField: { size: 'small', sx: { '& .MuiOutlinedInput-root': { fontSize: '0.875rem' } } },
							popper: { placement: 'bottom-start' },
						}}
					/>
					<DatePicker
						label="종료일"
						value={values.toDate ? dayjs(values.toDate) : null}
						onChange={(v: Dayjs | null) => handleChange('toDate', v ? v.format('YYYY-MM-DD') : '')}
						slotProps={{
							textField: { size: 'small', sx: { '& .MuiOutlinedInput-root': { fontSize: '0.875rem' } } },
							popper: { placement: 'bottom-start' },
						}}
					/>
				</>
			)}

			{/* 동적 필드 */}
			{fields.map((field) =>
				field.type === 'select' ? (
					<FormControl key={field.key} size="small" sx={fieldSx}>
						<InputLabel sx={labelSx}>{field.label}</InputLabel>
						<Select
							label={field.label}
							value={values[field.key] ?? ''}
							onChange={(e) => handleChange(field.key, e.target.value)}
						>
							<MenuItem value=""><em>전체</em></MenuItem>
							{field.options?.map((opt) => (
								<MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.875rem' }}>
									{opt.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				) : (
					<TextField
						key={field.key}
						label={field.label}
						size="small"
						value={values[field.key] ?? ''}
						onChange={(e) => handleChange(field.key, e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && onSearch()}
						sx={fieldSx}
					/>
				),
			)}

			<Button variant="contained" size="small" onClick={onSearch} sx={{ px: 2 }}>
				조회
			</Button>
			<Button variant="outlined" size="small" onClick={onReset} sx={{ px: 2 }}>
				초기화
			</Button>
		</Box>
	);
}
