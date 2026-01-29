'use client';

import { useState, useImperativeHandle, useRef, forwardRef } from 'react';

/** MUI */
import { Box, TextField, Typography, Checkbox, FormControl, FormControlLabel, Select, MenuItem, Button, SelectChangeEvent } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

/** Lib */
import { Dayjs } from 'dayjs';
import { useForm, Controller } from 'react-hook-form';

interface RequestCorrectionInterface {
	workDate: Dayjs | null;
	startTime: Dayjs | null;
	endTime: Dayjs | null;
	modifyDocument: string;
	modifyReason: string;
}

export interface RequestCorrectionRef {
	submit: () => void;
}

const RequestCorrection = forwardRef<RequestCorrectionRef, {}>((props, ref) => {
	const [modifyStatus, setModifyStatus] = useState<string>('PRESENT');
	const [isStartTime, setIsStartTime] = useState<boolean>(false);
	const [isEndTime, setIsEndTime] = useState<boolean>(false);
	const [modifyDocument, setModifyDocument] = useState<string>('');

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<RequestCorrectionInterface>({
		defaultValues: {
			workDate: null,
			startTime: null,
			endTime: null,
			modifyDocument: '',
			modifyReason: '',
		},
	});

	useImperativeHandle(ref, () => ({
		submit: () => {
			console.log('submit 호출됨'); // <- 이건 항상 찍혀
			handleSubmit((data) => {
				console.log('폼 데이터 제출:', data);
			})();
		},
	}));

	const handleChangeModifyStatus = (event: SelectChangeEvent<string>) => {
		setModifyStatus(event.target.value);
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '28rem', gap: 3, py: 2 }}>
			<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
				<Typography sx={{ width: '100%', marginBottom: '0.5rem', fontWeight: 500 }}>
					<span style={{ color: '#ff4d4f' }}>*</span> 수정 근무 일자
				</Typography>
				<Controller
					name='workDate'
					control={control}
					rules={{ required: '수정 근무일은 필수 입력사항입니다.' }}
					render={({ field }) => (
						<DatePicker
							{...field}
							sx={{ width: '100%' }}
							slotProps={{
								textField: {
									error: !!errors.workDate,
									helperText: errors.workDate?.message,
								},
							}}
						/>
					)}
				/>
			</Box>

			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
				<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
					<Typography sx={{ width: '100%', marginBottom: '0.5rem', fontWeight: 500 }}>
						<span style={{ color: '#ff4d4f' }}>*</span> 수정 내용
					</Typography>
				</Box>
				<Box sx={{ width: '100%', py: 3, px: 2, borderRadius: '1rem', backgroundColor: 'grey.50' }}>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
						<Box sx={{ display: 'flex', flexDirection: 'column' }}>
							<Typography sx={{ width: '100%', marginBottom: '0.5rem', fontWeight: 500 }}>수정 근무 시간</Typography>
							<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
								<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<Box sx={{ minWidth: 130, display: 'flex', alignItems: 'center' }}>
										<FormControlLabel control={<Checkbox size='small' />} color='primary' label='출근시간' />
									</Box>
									<Controller
										name='startTime'
										control={control}
										rules={{
											validate: (value) => {
												if (isStartTime && !value) {
													return '수정할 출근시간을 입력해주세요.';
												}
												return true;
											},
										}}
										render={({ field }) => (
											<TimePicker
												{...field}
												slotProps={{
													textField: {
														error: !!errors.startTime,
														helperText: errors.startTime?.message,
													},
												}}
											/>
										)}
									/>
								</Box>
								<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<Box sx={{ minWidth: 130, display: 'flex', alignItems: 'center' }}>
										<FormControlLabel control={<Checkbox size='small' />} color='primary' label='퇴근시간' />
									</Box>
									<Controller
										name='endTime'
										control={control}
										rules={{
											validate: (value) => {
												if (isEndTime && !value) {
													return '수정할 퇴근시간을 입력해주세요.';
												}
												return true;
											},
										}}
										render={({ field }) => (
											<TimePicker
												{...field}
												slotProps={{
													textField: {
														error: !!errors.endTime,
														helperText: errors.endTime?.message,
													},
												}}
											/>
										)}
									/>
								</Box>
							</Box>
						</Box>

						<Box sx={{ display: 'flex', flexDirection: 'column' }}>
							<Typography sx={{ width: '100%', marginBottom: '0.5rem', fontWeight: 500 }}>수정 근무 상태</Typography>
							<FormControl sx={{ minWidth: 168 }} size='small'>
								<Select id='demo-select-small' value={modifyStatus} onChange={handleChangeModifyStatus}>
									<MenuItem value='PRESENT'>정상 출근</MenuItem>
									<MenuItem value='LATE'>지각</MenuItem>
									<MenuItem value='EARLY_LEAVE'>조퇴</MenuItem>
									<MenuItem value='ABSENT'>결근</MenuItem>
									<MenuItem value='VACATION'>휴가</MenuItem>
									<MenuItem value='OUTSIDE'>외근</MenuItem>
									<MenuItem value='BUSINESS_TRIP'>출장</MenuItem>
								</Select>
							</FormControl>
						</Box>
						<Box sx={{ display: 'flex', flexDirection: 'column' }}>
							<Typography sx={{ width: '100%', marginBottom: '0.5rem', fontWeight: 500 }}>첨부 파일</Typography>
							<Controller
								name='modifyDocument'
								control={control}
								render={({ field }) => (
									<Box sx={{ display: 'flex', gap: 1 }}>
										<input
											accept='.pdf, .jpg, .png'
											id='contained-button-file'
											type='file'
											style={{ display: 'none' }}
											onChange={() => {} /*handleFileChange*/}
										/>
										<label htmlFor='contained-button-file'>
											<Button variant='contained' component='span'>
												파일 선택
											</Button>
										</label>
										<Box sx={{ flex: 1 }}>
											<TextField value={modifyDocument} placeholder='선택된 파일' variant='outlined' fullWidth size='small' />
										</Box>
									</Box>
								)}
							/>
						</Box>
					</Box>
				</Box>
			</Box>

			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Typography sx={{ width: '100%', marginBottom: '0.5rem', fontWeight: 500 }}>
						<span style={{ color: '#ff4d4f' }}>*</span> 수정 신청 사유
					</Typography>
				</Box>
				<Controller
					name='modifyReason'
					control={control}
					rules={{ required: '신청사유는 필수 입력사항입니다.' }}
					render={({ field }) => (
						<TextField
							{...field}
							fullWidth
							size='small'
							multiline
							maxRows={5}
							error={!!errors.modifyReason}
							helperText={errors.modifyReason?.message}
						/>
					)}
				/>
			</Box>
		</Box>
	);
});

RequestCorrection.displayName = 'RequestCorrection';
export default RequestCorrection;
