'use client';

import { useState, useMemo, forwardRef, useImperativeHandle } from 'react';

/** MUI */
import { FormHelperText, Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, SxProps, Typography, IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { KeyboardArrowDownRounded, KeyboardArrowUpRounded, DownloadRounded } from '@mui/icons-material';

/** Lib */
import dayjs, { Dayjs } from 'dayjs';
import { useForm, Controller } from 'react-hook-form';

/** Type / Interface */
import { FilterField, FilterValues } from '@/type/interface';

interface Props {
	fields: FilterField[];
	fieldDefault: FilterValues;
	title?: string;
	sx?: SxProps;
	isDate?: boolean;
	isExcel?: boolean;
	startDateMin?: Dayjs | null;
	startDateMax?: Dayjs | null;
	endDateMin?: Dayjs | null;
	endDateMax?: Dayjs | null;
	onSearch: (data: FilterValues) => void;
	onReset: () => void;
	onClickExcelDown?: (data: FilterValues) => void;
}

export interface FilterRef {
	getFilterValues: () => FilterValues;
}

const DetailSearchFilterComp = forwardRef<FilterRef, Props>(
	({ title, fields, fieldDefault, sx, isDate = true, isExcel = false, onSearch, onReset, onClickExcelDown, ...props }, ref) => {
		const [isOpen, setIsOpen] = useState(true);

		const initialValues = useMemo(() => {
			const base: any = {};

			if (isDate) {
				base['startDate'] = dayjs().startOf('year');
				base['endDate'] = dayjs().endOf('year');
			}

			if (fieldDefault) {
				Object.entries(fieldDefault).forEach(([key, value]) => {
					base[key] = value ?? ''; // 모든 동적 필드에 빈 문자열 할당
				});
			}
			return base as FilterValues;
		}, [fieldDefault, isDate]);

		const {
			control,
			watch,
			reset,
			handleSubmit,
			getValues,
			formState: { errors },
		} = useForm<FilterValues>({
			defaultValues: initialValues,
		});

		const watchAllFields = watch();

		useImperativeHandle(ref, () => ({
			getFilterValues: () => {
				return getValues();
			},
		}));

		const handleSave = handleSubmit((data) => {
			onSearch?.(data);
		});

		const handleReset = () => {
			reset(initialValues);
			onReset?.();
		};

		const handleExcelDown = handleSubmit((data) => {
			onClickExcelDown?.(data);
		});

		return (
			<Box>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
						padding: '0.5rem 1.5rem 0',
					}}
				>
					<Typography variant='subtitle1'>{title}</Typography>
					<IconButton size='small' onClick={(e) => setIsOpen((prev) => !prev)}>
						{isOpen ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
					</IconButton>
				</Box>
				<Box sx={{ overflow: 'hidden', transition: 'all 0.5s ease-in-out', maxHeight: isOpen ? '500px' : '0px', ...sx }}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							flexWrap: 'wrap',
							gap: 1,
							margin: '1rem 1.5rem',
							padding: '1rem',
							border: '1px solid',
							borderColor: 'grey.200',
							borderRadius: '1rem',
						}}
					>
						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}>
							{isDate && (
								<>
									<Controller
										name='startDate'
										control={control}
										rules={{
											validate: (value) => {
												if (!value) return '시작일은 필수입니다.';
												if (watchAllFields['endDate'] && value.isAfter(watchAllFields['endDate'])) {
													return '시작일은 종료일보다 빨라야 합니다.';
												}
												return true;
											},
										}}
										render={({ field }) => (
											<DatePicker
												{...field}
												label='시작일'
												minDate={props.startDateMin ?? undefined}
												maxDate={props.startDateMax ?? undefined}
												slotProps={{
													textField: {
														error: !!errors.startDate,
														helperText: errors.startDate?.message,
													},
												}}
											/>
										)}
									/>
									<Controller
										name='endDate'
										control={control}
										rules={{
											validate: (value) => {
												if (!value) return '종료일은 필수입니다.';
												if (watchAllFields['startDate'] && value.isBefore(watchAllFields['startDate'])) {
													return '종료일은 시작일보다 늦어야 합니다.';
												}
												return true;
											},
										}}
										render={({ field }) => (
											<DatePicker
												{...field}
												label='종료일'
												minDate={props.endDateMin ?? undefined}
												maxDate={props.endDateMax ?? undefined}
												slotProps={{
													textField: {
														error: !!errors.endDate,
														helperText: errors.endDate?.message,
													},
												}}
											/>
										)}
									/>
								</>
							)}

							{/* 동적 필드 */}
							{fields?.map((fieldItem) =>
								fieldItem.type === 'select' ? (
									<Controller
										key={fieldItem.key}
										name={fieldItem.key}
										control={control}
										rules={{
											validate: (value) => {
												if (fieldItem.validate) {
													return fieldItem.validate(value, watchAllFields);
												} else {
													return true;
												}
											},
										}}
										render={({ field: { onChange, value }, fieldState: { error } }) => (
											<FormControl size='small' error={!!error}>
												<InputLabel id='demo-simple-select-label'>{fieldItem.label}</InputLabel>
												<Select
													labelId='demo-simple-select-label'
													label={fieldItem.label}
													value={value}
													sx={{ minWidth: '8rem' }}
													onChange={onChange}
													size='small'
												>
													<MenuItem value='all'>
														<em>전체</em>
													</MenuItem>
													{fieldItem.options?.map((opt) => (
														<MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.875rem' }}>
															{opt.label}
														</MenuItem>
													))}
												</Select>
												{error && <FormHelperText>{error.message}</FormHelperText>}
											</FormControl>
										)}
									/>
								) : (
									<Controller
										key={fieldItem.key}
										name={fieldItem.key}
										control={control}
										rules={{
											validate: (value) => {
												if (fieldItem.validate) {
													fieldItem.validate(value, watchAllFields);
												}
												return true;
											},
										}}
										render={({ field, fieldState: { error } }) => (
											<TextField
												{...field}
												label={fieldItem.label}
												size='small'
												sx={{ minWidth: '8rem' }}
												error={!!error}
												helperText={error?.message ?? ''}
											/>
										)}
									/>
								),
							)}
						</Box>
						<Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'nowrap', flexGrow: 1, gap: 1, mt: '0.5rem' }}>
							<Button variant='contained' type='submit' onClick={handleSave}>
								조회하기
							</Button>
							<Button variant='outlined' onClick={handleReset}>
								초기화
							</Button>
							{isExcel && (
								<Button variant='contained' color='info' startIcon={<DownloadRounded />} onClick={handleExcelDown} sx={{ ml: '0.5rem' }}>
									엑셀 다운
								</Button>
							)}
						</Box>
					</Box>
				</Box>
			</Box>
		);
	},
);

DetailSearchFilterComp.displayName = 'DetailSearchFilterComp';
export default DetailSearchFilterComp;
