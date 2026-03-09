'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import secureLocalStorage from 'react-secure-storage';

/** MUI */
import { Alert, Box, Checkbox, FormControlLabel, Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

/** Lib */
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import useModalStore from '@/store/useModalStore';

/** Custom */
import BaseDialog from '@/app/_component/baseElement/BaseDialog';

/** Type / Interface */
import { attendanceService, AttendanceDayResDto } from '@/app/services/attendanceService';
import { AttendanceApplicationController, AttendanceApplicationResponseDto, attendanceApplicationService } from '@/app/services/attendanceApplicationService';
import { FormWrapper, FormItem } from '@/app/_component/baseElement/FormComp';
import useLoaderStore from '@/store/useLoaderStore';
import { WORKSTATUS } from '@/constant/attendanceConst';

export default function AttendanceUserModal() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const type = searchParams.get('type');

	const { setLoader } = useLoaderStore();
	const { modalData, setModalData, resetModalData } = useModalStore();

	const [isSaving, setIsSaving] = useState(false);
	const [attendanceData, setAttendanceData] = useState<AttendanceDayResDto>();

	const {
		control,
		reset,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm<AttendanceApplicationController>({
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

	useEffect(() => {
		if (modalData && type) {
			reset({
				workDate: dayjs(modalData.workDate),
				isStartTime: modalData.startTime != null,
				isEndTime: modalData.endTime != null,
				startTime: dayjs(modalData.workDate + 'T' + modalData.startTime),
				endTime: dayjs(modalData.workDate + 'T' + modalData.endTime),
				workStatus: modalData.workStatus,
				documentsAddress: modalData.documentsAddress,
				violationReason: modalData.violationReason,
			});

			getAttendanceUserData(modalData);
		}
	}, [type, modalData]);

	const getAttendanceUserData = async (data: AttendanceApplicationResponseDto) => {
		setLoader(true);
		try {
			const res = await attendanceService.getAttendanceUserData({
				memberId: secureLocalStorage.getItem('memberId') as number,
				workDate: dayjs(data.workDate).format('YYYY-MM-DD HH:mm'),
			});

			console.log(res);
			setAttendanceData(res);
		} finally {
			setLoader(false);
		}
	};

	const handleSave = handleSubmit(async (data) => {
		setIsSaving(true);
		try {
			await attendanceApplicationService.submitAttendanceApplication({
				...data,
				memberId: secureLocalStorage.getItem('memberId') as number,
				workDate: dayjs(data.workDate).format('YYYY-MM-DD'),
				startTime: data.startTime ? dayjs(data.startTime).format('HH:mm') : null,
				endTime: data.endTime ? dayjs(data.endTime).format('HH:mm') : null,
			});

			if (confirm('요청이 성공적으로 등록되었습니다.')) {
				resetModalData();
				router.back();
			}
		} finally {
			setIsSaving(false);
		}
	});

	const onClose = () => {
		if (type === 'detail') {
			setModalData(modalData.list);
		} else {
			resetModalData();
		}

		router.back();
	};

	return (
		<BaseDialog title={type ? '근태 수정 확인' : '근태 수정'} loading={isSaving} onConfirm={type ? undefined : handleSave} onClose={onClose}>
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
								readOnly={type != null}
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
					readOnly={type != null}
				/>

				<FormWrapper label='수정 근무상태' required>
					<Controller
						name='workStatus'
						control={control}
						render={({ field: { onChange, value } }) => (
							<Select value={value} onChange={onChange} size='small' fullWidth inputProps={{ readOnly: type != null }}>
								<MenuItem value='PRESENT'>정상 출근</MenuItem>
								<MenuItem value='ABSENT'>결근</MenuItem>
								<MenuItem value='OUTSIDE'>외근</MenuItem>
								<MenuItem value='BUSINESS_TRIP'>출장</MenuItem>
							</Select>
						)}
					/>
					{attendanceData && (
						<Alert icon={false} severity='info' sx={{ mt: '0.5rem' }}>
							기존 근무상태: {attendanceData.workStatus ? WORKSTATUS[attendanceData.workStatus] : '-'}
						</Alert>
					)}
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
											control={<Checkbox size='small' checked={value} onChange={onChange} disabled={type != null} />}
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
											return '출근시간을 입력해주세요.';
										}
										return true;
									},
								}}
								render={({ field }) => (
									<TimePicker
										{...field}
										readOnly={type != null}
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
						{attendanceData && (
							<Alert icon={false} severity='info'>
								기존 출근시간: {attendanceData.startTime ? dayjs(attendanceData.startTime).format('HH:mm') : '-'}
							</Alert>
						)}
						<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
							<Box sx={{ minWidth: 120, paddingLeft: '0.5rem' }}>
								<Controller
									name='isEndTime'
									control={control}
									render={({ field: { onChange, value } }) => (
										<FormControlLabel
											control={<Checkbox size='small' checked={value} onChange={onChange} disabled={type != null} />}
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
											return '퇴근시간을 입력해주세요.';
										}
										return true;
									},
								}}
								render={({ field }) => (
									<TimePicker
										{...field}
										readOnly={type != null}
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
						{attendanceData && (
							<Alert icon={false} severity='info'>
								기존 퇴근시간: {attendanceData.endTime ? dayjs(attendanceData.endTime).format('HH:mm') : '-'}
							</Alert>
						)}
					</Box>
				</FormWrapper>
			</Box>
		</BaseDialog>
	);
}
