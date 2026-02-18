'use client';

import { useImperativeHandle, forwardRef } from 'react';
import secureLocalStorage from 'react-secure-storage';
import { useRouter } from 'next/navigation';

/** MUI */
import { Box, Checkbox, FormControlLabel, Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

/** Lib */
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import useLoaderStore from '@/store/useLoaderStore';

/** Type / Interface */
import { AttendanceRequestController, attendanceChangeRequestService } from '@/app/services/attendanceChangeRequestService';
import { FormWrapper, FormItem } from '@/app/_component/baseElement/FormComp';

export interface RequestCorrectionRef {
	submit: () => void;
}

const RequestCorrection = forwardRef<RequestCorrectionRef, {}>((props, ref) => {
	const router = useRouter();
	const { setLoader } = useLoaderStore();

	const {
		control,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm<AttendanceRequestController>({
		defaultValues: {
			workDate: null,
			isStartTime: false,
			isEndTime: false,
			startTime: null,
			endTime: null,
			workStatus: 'PRESENT',
			documentsAddress: null,
			violationReason: '',
		},
	});

	const watchIsStartTime = watch('isStartTime');
	const watchIsEndTime = watch('isEndTime');

	useImperativeHandle(ref, () => ({
		submit: () => {
			handleSubmit(async (data) => {
				setLoader(true);
				try {
					console.log(data);

					await attendanceChangeRequestService.submitWorkRequest({
						...data,
						loginId: secureLocalStorage.getItem('loginId') as string,
						workDate: dayjs(data.workDate).format('YYYY-MM-DD'),
						startTime: data.startTime ? dayjs(data.startTime).format('HH:mm') : null,
						endTime: data.endTime ? dayjs(data.endTime).format('HH:mm') : null,
					});

					if (confirm('요청이 성공적으로 등록되었습니다.')) {
						router.back();
					}
				} catch (error: any) {
				} finally {
					setLoader(false);
				}
			})();
		},
	}));

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '28rem', py: 2 }}>
			<FormWrapper label='수정 근무 일자' required>
				<Controller
					name='workDate'
					control={control}
					rules={{
						validate: (value) => {
							if (!value) {
								return '수정 근무일은 필수 입력사항입니다.';
							}
							return true;
						},
					}}
					render={({ field }) => (
						<DatePicker
							{...field}
							sx={{ minWidth: '19.5rem' }}
							slotProps={{
								textField: {
									error: !!errors.workDate,
									helperText: errors.workDate?.message,
								},
							}}
						/>
					)}
				/>
			</FormWrapper>

			<FormItem
				name='violationReason'
				label='수정 사유'
				placeholder='수정 사유를 입력해주세요'
				required
				control={control}
				error={errors.violationReason?.message}
			/>

			<FormWrapper label='수정 근무상태' required>
				<Controller
					name='workStatus'
					control={control}
					render={({ field: { onChange, value } }) => (
						<Select value={value} onChange={onChange} size='small' fullWidth>
							<MenuItem value='PRESENT'>정상 출근</MenuItem>
							<MenuItem value='ABSENT'>결근</MenuItem>
							<MenuItem value='VACATION'>휴가</MenuItem>
							<MenuItem value='OUTSIDE'>외근</MenuItem>
							<MenuItem value='BUSINESS_TRIP'>출장</MenuItem>
						</Select>
					)}
				/>
			</FormWrapper>

			<FormWrapper label='수정 근무시간'>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: '0.5rem' }}>
					<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
						<Box sx={{ minWidth: 120, paddingLeft: '0.5rem' }}>
							<Controller
								name='isStartTime'
								control={control}
								render={({ field: { onChange, value } }) => (
									<FormControlLabel
										control={<Checkbox size='small' checked={value} onChange={onChange} />}
										color='primary'
										label='출근시간'
									/>
								)}
							/>
						</Box>
						<Controller
							name='startTime'
							control={control}
							rules={{
								validate: (value) => {
									if (watchIsStartTime && !value) {
										return '근무 시작 시간을 입력해주세요.';
									}
									return true;
								},
							}}
							render={({ field }) => (
								<TimePicker
									{...field}
									sx={{ maxWidth: '11rem' }}
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
					<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
						<Box sx={{ minWidth: 120, paddingLeft: '0.5rem' }}>
							<Controller
								name='isEndTime'
								control={control}
								render={({ field: { onChange, value } }) => (
									<FormControlLabel
										control={<Checkbox size='small' checked={value} onChange={onChange} />}
										color='primary'
										label='퇴근시간'
									/>
								)}
							/>
						</Box>
						<Controller
							name='endTime'
							control={control}
							rules={{
								validate: (value) => {
									if (watchIsEndTime && !value) {
										return '근무 종료 시간을 입력해주세요.';
									}
									return true;
								},
							}}
							render={({ field }) => (
								<TimePicker
									{...field}
									sx={{ maxWidth: '11rem' }}
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
			</FormWrapper>
			{/*<FormWrapper label='첨부 파일'>
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
								onChange={(e) => {
									const file = e.target.files?.[0];
									field.onChange(file); // File 객체만 전달
								}}
							/>
							<label htmlFor='contained-button-file'>
								<Button variant='contained' component='span'>
									파일 선택
								</Button>
							</label>
							<TextField
								placeholder='선택된 파일'
								variant='outlined'
								size='small'
								value={field.value?.name ?? ''}
								fullWidth
								slotProps={{
									input: {
										readOnly: true,
									},
								}}
							/>
						</Box>
					)}
				/>
			</FormWrapper>*/}
		</Box>
	);
});

RequestCorrection.displayName = 'RequestCorrection';
export default RequestCorrection;
