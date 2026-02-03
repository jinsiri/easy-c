'use client';

import { useState, useImperativeHandle, forwardRef } from 'react';
import secureLocalStorage from 'react-secure-storage';
import { useRouter } from 'next/navigation';

/** MUI */
import { Box, TextField, Typography, Checkbox, FormControl, FormControlLabel, Select, MenuItem, Button, SelectChangeEvent } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

/** Lib */
import { useForm, Controller } from 'react-hook-form';

/** Type / Interface */
import { AttendanceRequestController, attendanceChangeRequestService } from '@/app/services/attendanceChangeRequestService';
import dayjs from 'dayjs';

export interface RequestCorrectionRef {
	submit: () => void;
}

const RequestCorrection = forwardRef<RequestCorrectionRef, {}>((props, ref) => {
	const router = useRouter();

	const [modifyStatus, setModifyStatus] = useState<string>('PRESENT');
	const [isStartTime, setIsStartTime] = useState<boolean>(false);
	const [isEndTime, setIsEndTime] = useState<boolean>(false);
	const [modifyDocument, setModifyDocument] = useState<string>('');

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<AttendanceRequestController>({
		defaultValues: {
			workDate: null,
			startTime: null,
			endTime: null,
			documentsAddress: '',
			violationReason: '',
		},
	});

	useImperativeHandle(ref, () => ({
		submit: () => {
			handleSubmit(async (data) => {
				try {
					await attendanceChangeRequestService.submitWorkRequest({
						...data,
						memberId: Number(secureLocalStorage.getItem('memberId')) ?? 1,
						workDate: dayjs(data.workDate).format('YYYY-MM-DD'),
						startTime: data.startTime ? dayjs(data.startTime).format('HH:mm') : null,
						endTime: data.endTime ? dayjs(data.endTime).format('HH:mm') : null,
					});

					if (confirm('요청이 성공적으로 등록되었습니다.')) {
						router.back();
					}
				} catch (error: any) {
				} finally {
				}
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
										<FormControlLabel
											control={<Checkbox size='small' checked={isStartTime} onChange={() => setIsStartTime((prev) => !prev)} />}
											color='primary'
											label='출근시간'
										/>
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
														disabled: !isStartTime,
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
										<FormControlLabel
											control={<Checkbox size='small' checked={isEndTime} onChange={() => setIsEndTime((prev) => !prev)} />}
											color='primary'
											label='퇴근시간'
										/>
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
														disabled: !isEndTime,
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
								name='documentsAddress'
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
					name='violationReason'
					control={control}
					rules={{ required: '신청사유는 필수 입력사항입니다.' }}
					render={({ field }) => (
						<TextField
							{...field}
							fullWidth
							size='small'
							multiline
							maxRows={5}
							error={!!errors.violationReason}
							helperText={errors.violationReason?.message}
						/>
					)}
				/>
			</Box>
		</Box>
	);
});

RequestCorrection.displayName = 'RequestCorrection';
export default RequestCorrection;
