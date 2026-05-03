'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import secureLocalStorage from 'react-secure-storage';

/** Lib */
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import useModalStore from '@/store/useModalStore';
import useLoaderStore from '@/store/useLoaderStore';

/** MUI */
import { Select, MenuItem, Box, Button, Typography, Grid, Tooltip, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import { HelpRounded, ArrowBackRounded } from '@mui/icons-material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import { FormWrapper, FormItem } from '@/app/_component/baseElement/FormComp';

/** Type / Interface */
import { ScheduleController, ScheduleRequestDto, scheduleService } from '@/app/services/scheduleService';
import { SCHEDULETYPE } from '@/constant/scheduleConst';

export default function ScheduleUserDataPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const target = searchParams.get('target');

	const { setLoader } = useLoaderStore();
	const { resetModalData } = useModalStore();

	const {
		control,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm<ScheduleController>({
		defaultValues: {
			scheduleName: '',
			scheduleDesc: '',
			published: 'public',
			scheduleType: 'NORMAL',
			startDate: dayjs(),
			endDate: dayjs(),
			startTime: null,
			endTime: null,
		},
	});

	const watchStartDate = watch('startDate');
	const watchEndDate = watch('endDate');
	const watchStartTime = watch('startTime');
	const watchEndTime = watch('endTime');

	const handleSave = handleSubmit(async (data: ScheduleController) => {
		setLoader(true);
		try {
			const _request: ScheduleRequestDto = {
				...data,
				memberId: secureLocalStorage.getItem('memberId') as number,
				published: data.published === 'public',
				startDate: data.startDate ? data.startDate.format('YYYY-MM-DD') : '',
				endDate: data.endDate ? data.endDate.format('YYYY-MM-DD') : null,
				startTime: data.startTime ? data.startTime.format('HH:mm') : null,
				endTime: data.endTime ? data.endTime.format('HH:mm') : null,
			};

			scheduleService.createUserSchedule(_request).then(() => {
				if (confirm('요청이 성공적으로 등록되었습니다.')) {
					resetModalData();
					router.back();
				}
			});
		} finally {
			setLoader(false);
		}
	});

	const handleClose = () => {
		router.back();
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: 'grey.50' }}>
			<PathBreadcrumbs sx={{ padding: '0 1.5rem' }} />
			<Box sx={{ flexWrap: 'wrap', flexDirection: 'column', padding: '0 1.5rem' }}>
				<Button startIcon={<ArrowBackRounded fontSize='small' />} onClick={handleClose} sx={{ mb: '0.5rem' }}>
					뒤로 가기
				</Button>
				<Grid
					container
					sx={{
						display: 'flex',
						flexDirection: 'column',
						width: '100%',
						padding: '2rem',
						borderRadius: '2rem',
						backgroundColor: 'background.default',
						gap: 3,
					}}
				>
					<Grid size={12} sx={{ display: 'flex', justifyContent: 'row', alignItems: 'center', gap: 1 }}>
						<Typography variant='h5'>{target == null ? '일정 생성' : '일정 수정'} </Typography>
					</Grid>
					<Grid size={12}>
						<FormItem
							name='scheduleName'
							label='일정 이름'
							placeholder='일정 이름을 입력해주세요'
							required
							control={control}
							error={errors.scheduleName?.message}
						/>
						<FormWrapper label='일시' required>
							<Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
								<Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
									<Controller
										name='startDate'
										control={control}
										rules={{
											validate: (value) => {
												if (!value) {
													return '일정 시작 일자을 입력해주세요.';
												}
												return true;
											},
										}}
										render={({ field }) => (
											<DatePicker
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
									<Controller
										name='startTime'
										control={control}
										rules={{
											validate: (value) => {
												if (watchEndTime && !value) {
													return '일정 시작시간을 입력해주세요.';
												}

												if (watchEndTime && value && watchStartDate.isSame(watchEndDate)) {
													if (value.isAfter(watchEndTime)) {
														return '종료시간은 시작 시간보다 이후 시간이어야 합니다.';
													}
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
								~
								<Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
									<Controller
										name='endDate'
										control={control}
										rules={{
											validate: (value) => {
												if (!value) {
													return '일정 종료일을 입력해주세요.';
												}
												return true;
											},
										}}
										render={({ field }) => (
											<DatePicker
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
									<Controller
										name='endTime'
										control={control}
										rules={{
											validate: (value) => {
												if (watchStartTime && !value) {
													return '일정 종료시간을 입력해주세요.';
												}

												if (watchStartTime && value && watchStartDate.isSame(watchEndDate)) {
													if (value.isBefore(watchStartTime)) {
														return '시작시간은 시작 시간보다 이전 시간이어야 합니다.';
													}
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
						</FormWrapper>
						<FormWrapper label='공개여부'>
							<Controller
								name='published'
								control={control}
								render={({ field }) => (
									<RadioGroup row name={field.name} value={field.value ?? 'private'} onChange={field.onChange}>
										<FormControlLabel value='public' control={<Radio />} label='공개' />
										<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
											<FormControlLabel value='private' control={<Radio />} label='비공개' />
											<Tooltip title='‘비공개’를 선택하면 공유 캘린더의 다른 참석자들은 해당 일정을 볼 수 없습니다.' arrow>
												<HelpRounded color='primary' sx={{ fontSize: '1rem', ml: '-12px' }} />
											</Tooltip>
										</Box>
									</RadioGroup>
								)}
							/>
						</FormWrapper>
						<FormWrapper label='일정 종류' required>
							<Controller
								name='scheduleType'
								control={control}
								render={({ field: { onChange, value } }) => (
									<Select value={value} onChange={onChange} size='small' fullWidth>
										{Object.entries(SCHEDULETYPE).map(([key, value]) => (
											<MenuItem key={key} value={key}>
												{value}
											</MenuItem>
										))}
									</Select>
								)}
							/>
						</FormWrapper>
						<FormItem
							name='scheduleDesc'
							label='일정 설명'
							placeholder='일정 설명을 입력해주세요'
							control={control}
							error={errors.scheduleDesc?.message}
						/>
					</Grid>
					<Grid size={12} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 3 }}>
						<Button variant='text' onClick={handleClose} size='large'>
							닫기
						</Button>
						<Button variant='contained' size='large' onClick={handleSave}>
							저장
						</Button>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
}
