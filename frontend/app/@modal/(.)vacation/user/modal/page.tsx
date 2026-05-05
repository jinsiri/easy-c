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
import { vacationApplicationController, vacationApplicationService, vacationApplication } from '@/app/services/vacationApplicationService';
import { FormItem, FormWrapper } from '@/app/_component/baseElement/FormComp';

export default function VacationUserModal() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const type = searchParams.get('type');
	const { modalData, resetModalData } = useModalStore();

	const remainDay = modalData.remainDay ?? 30;
	const [isSaving, setIsSaving] = useState(false);

	const {
		control,
		watch,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<vacationApplicationController>({
		defaultValues: {
			vacationType: type === 'read' && modalData ? modalData.vacationType : modalData.remainDay === 0.5 ? 'HALF_AM' : 'FULL',
			vacationDuration: type === 'read' && modalData ? String(modalData.vacationDuration) : '1',
			startDate: modalData?.startDate ? dayjs(modalData.startDate) : null,
			endDate: modalData?.endDate ? dayjs(modalData.endDate) : null,
			violationReason: modalData?.violationReason,
		},
	});

	const watchVacationType = watch('vacationType');
	const watchVacationDuration = watch('vacationDuration');

	const handleSave = handleSubmit(async (data) => {
		setIsSaving(true);

		try {
			const request: vacationApplication = {
				...data,
				memberId: Number(secureLocalStorage.getItem('memberId')),
				startDate: dayjs(data.startDate).format('YYYY-MM-DD'),
				endDate: data.endDate ? dayjs(data.endDate).format('YYYY-MM-DD') : null,
				vacationDuration: Number(data.vacationDuration),
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

	useEffect(() => {
		if (!modalData) return;

		reset({
			vacationType: type === 'read' ? modalData.vacationType : modalData.remainDay === 0.5 ? 'HALF_AM' : 'FULL',
			vacationDuration: type === 'read' ? String(modalData.vacationDuration) : '1',
			startDate: modalData.startDate ? dayjs(modalData.startDate) : null,
			endDate: modalData.endDate ? dayjs(modalData.endDate) : null,
			violationReason: modalData.violationReason,
		});
	}, [modalData, type]);

	return (
		<BaseDialog title={'휴가 신청'} loading={isSaving} onConfirm={type === 'read' ? undefined : handleSave}>
			<Box sx={{ display: 'flex', flexDirection: 'column' }}>
				<FormWrapper label='휴가종류' required>
					<Controller
						name='vacationType'
						control={control}
						render={({ field: { onChange, value } }) => (
							<Select value={value} onChange={onChange} size='small' fullWidth inputProps={{ readOnly: type && type === 'read' }}>
								{remainDay == 0.5
									? [
											<MenuItem key='HALF_AM' value='HALF_AM'>
												오전 반차
											</MenuItem>,
											<MenuItem key='HALF_PM' value='HALF_PM'>
												오후 반차
											</MenuItem>,
										]
									: Object.entries(VACATIONTYPE).map(([key, value]) => (
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
									value={field.value ?? null}
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
											value={field.value ?? null}
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
