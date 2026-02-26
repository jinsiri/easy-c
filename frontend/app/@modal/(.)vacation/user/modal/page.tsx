'use client';

import { useEffect, useState } from 'react';

/** MUI */
import { Box, Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

/** Lib */
import { useForm, Controller } from 'react-hook-form';
import useModalStore from '@/store/useModalStore';

/** Custom */
import BaseDialog from '@/app/_component/baseElement/BaseDialog';

/** Type / Interface */
import { VACATIONTYPE } from '@/constant/attendanceConst';
import { vacationApplicationController } from '@/app/services/vacationApplicationService';
import { FormItem, FormWrapper } from '@/app/_component/baseElement/FormComp';

export default function VacationUserModal() {
	const { modalData, resetModalData } = useModalStore();

	const [isSaving, setIsSaving] = useState(false);
	const [remainDay, setRemainDay] = useState(1);

	const {
		control,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm<vacationApplicationController>({
		defaultValues: {
			vacationType: 'FULL',
			vacationDuration: '1',
			startDate: null,
			endDate: null,
			vacationReason: '',
		},
	});

	const watchVacationType = watch('vacationType');
	const watchVacationDuration = watch('vacationDuration');

	useEffect(() => {
		if (modalData) setRemainDay(modalData.remainDay);
	}, [modalData]);

	const handleSave = handleSubmit(() => {
		//setIsSaving(true);
	});

	return (
		<BaseDialog title={'휴가 신청'} loading={isSaving} onConfirm={handleSave}>
			<Box sx={{ display: 'flex', flexDirection: 'column' }}>
				<FormWrapper label='휴가종류' required>
					<Controller
						name='vacationType'
						control={control}
						render={({ field: { onChange, value } }) => (
							<Select value={value} onChange={onChange} size='small' fullWidth>
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
								<Select value={value} onChange={onChange} size='small' fullWidth>
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
					name='vacationReason'
					label='휴가 사유'
					placeholder='휴가 사유를 입력해주세요'
					required
					control={control}
					error={errors.vacationReason?.message}
				></FormItem>
			</Box>
		</BaseDialog>
	);
}
