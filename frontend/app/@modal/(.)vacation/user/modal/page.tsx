'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import secureLocalStorage from 'react-secure-storage';

/** MUI */
import { Box, Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

/** Lib */
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import useModalStore from '@/store/useModalStore';

/** Custom */
import BaseDialog from '@/app/_component/baseElement/BaseDialog';

/** Type / Interface */
import { VACATIONTYPE } from '@/constant/attendanceConst';
import { vacationApplicationController, vacationApplicationService, vacationApplicationDto } from '@/app/services/vacationApplicationService';
import { FormItem, FormWrapper } from '@/app/_component/baseElement/FormComp';

export default function VacationUserModal() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const type = searchParams.get('type');

	const { modalData, resetModalData } = useModalStore();

	const [isSaving, setIsSaving] = useState(false);
	const [remainDay, setRemainDay] = useState(1);

	const {
		control,
		reset,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm<vacationApplicationController>({
		defaultValues: {
			vacationType: 'FULL',
			vacationDuration: '1',
			startDate: null,
			endDate: null,
			violationReason: '',
		},
	});

	const watchVacationType = watch('vacationType');
	const watchVacationDuration = watch('vacationDuration');

	useEffect(() => {
		if (modalData) {
			if (type && type === 'read') {
				reset({
					vacationType: modalData.vacationType,
					vacationDuration: String(modalData.vacationDuration),
					startDate: modalData.startDate ? dayjs(modalData.startDate) : null,
					endDate: modalData.endDate ? dayjs(modalData.endDate) : null,
					violationReason: modalData.violationReason,
				});
			} else {
				setRemainDay(modalData.remainDay);
			}
		}
	}, [type, modalData]);

	const handleSave = handleSubmit(async (data) => {
		setIsSaving(true);

		try {
			const request: vacationApplicationDto = {
				...data,
				memberId: Number(secureLocalStorage.getItem('memberId')),
				startDate: dayjs(data.startDate).format('YYYY-MM-DD'),
				endDate: data.endDate ? dayjs(data.endDate).format('YYYY-MM-DD') : null,
			};

			await vacationApplicationService.saveVacationApplicationData(request);
			if (confirm('요청이 성공적으로 등록되었습니다.')) {
				resetModalData();
				router.back();
			}
		} finally {
			setIsSaving(false);
		}
	});

	return (
		<BaseDialog title={'휴가 신청'} loading={isSaving} onConfirm={type === 'read' ? undefined : handleSave}>
			<Box sx={{ display: 'flex', flexDirection: 'column' }}>
				<FormWrapper label='휴가종류' required>
					<Controller
						name='vacationType'
						control={control}
						render={({ field: { onChange, value } }) => (
							<Select value={value} onChange={onChange} size='small' fullWidth inputProps={{ readOnly: type && type === 'read' }}>
								{Object.entries(VACATIONTYPE).map(([key, value]) => (
									<MenuItem key={key} value={key}>
										{value}
									</MenuItem>
								))}
							</Select>
						)}
					/>
				</FormWrapper>
				{watchVacationType === 'HALF_AM' || watchVacationType === 'HALF_PM' || (
					<FormWrapper label='휴가기간' required>
						<Controller
							name='vacationDuration'
							control={control}
							render={({ field: { onChange, value } }) => (
								<Select value={value} onChange={onChange} size='small' fullWidth inputProps={{ readOnly: type && type === 'read' }}>
									{Array.from({ length: remainDay }, (_, i) => (
										<MenuItem key={i} value={String(i + 1)}>
											{i + 1}일
										</MenuItem>
									))}
								</Select>
							)}
						/>
					</FormWrapper>
				)}
				<FormWrapper label='휴가 일자' required>
					<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
						<Controller
							name='startDate'
							control={control}
							rules={{
								validate: (value) => {
									if (!value) {
										return '휴가 일자는 필수 입력사항입니다.';
									}
									return true;
								},
							}}
							render={({ field }) => (
								<DatePicker
									{...field}
									readOnly={type === 'read'}
									slotProps={{
										textField: {
											error: !!errors.startDate,
											helperText: errors.startDate?.message,
										},
									}}
								/>
							)}
						/>

						{Number(watchVacationDuration) > 1 && (
							<>
								~
								<Controller
									name='endDate'
									control={control}
									rules={{
										validate: (value) => {
											if (Number(watchVacationDuration) > 1 && !value) {
												return '휴가 일자는 필수 입력사항입니다.';
											}
											return true;
										},
									}}
									render={({ field }) => (
										<DatePicker
											{...field}
											readOnly={type === 'read'}
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
					</Box>
				</FormWrapper>

				<FormItem
					name='violationReason'
					label='휴가 사유'
					placeholder='휴가 사유를 입력해주세요'
					required
					control={control}
					error={errors.violationReason?.message}
					readOnly={type === 'read'}
				></FormItem>
			</Box>
		</BaseDialog>
	);
}
