'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/** Lib */
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import useModalStore from '@/store/useModalStore';
import useLoaderStore from '@/store/useLoaderStore';

/** MUI */
import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Box,
	Button,
	Typography,
	Grid,
	Select,
	MenuItem,
	ToggleButtonGroup,
	ToggleButton,
	FormControlLabel,
	RadioGroup,
	Radio,
	IconButton,
} from '@mui/material';

import { ExpandMoreRounded, ArrowBackRounded } from '@mui/icons-material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import { FormWrapper, FormItem } from '@/app/_component/baseElement/FormComp';

/** Type / Interface */
import { ATTENDANCETYPE, SETTLEMENTPERIOD, WORKTIMERULE, WORKDAYOFWEEKNUMBER } from '@/constant/attendanceConst';
import { AttendancePolicyRequestController, AttendancePolicyDto, attendancePolicyService } from '@/app/services/attendancePolicyService';

const hourList: string[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15'];
const minuteList: string[] = ['00', '15', '30'];
const allowMarginMinuteList: string[] = ['00', '05', '10', '15', '20', '25', '30'];

export default function AttendancePolicyDataPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const target = searchParams.get('target');

	const { setLoader } = useLoaderStore();
	const { modalData, resetModalData } = useModalStore();

	const {
		control,
		watch,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<AttendancePolicyRequestController>({
		defaultValues: {
			attendancePolicyName: '',
			attendancePolicyDesc: '',
			attendanceType: 'FIXED',
			workDayOfWeek: ['1', '2', '3', '4', '5'],
			settlementPeriod: 'WEEK',
			worktimeRule: 'ALWAYS_40',
			targetHour: '08',
			targetMinute: '00',
			startTime: dayjs('2026-02-13T09:00'),
			endTime: dayjs('2026-02-13T18:00'),
			halfLeaveStartTime: dayjs('2026-02-13T13:00'),
			halfLeaveEndTime: dayjs('2026-02-13T13:00'),
			coreStartTime: null,
			coreEndTime: null,
			allowMarginMinute: '10',
		},
	});

	const attendanceType = watch('attendanceType');

	useEffect(() => {
		if (modalData) {
			console.log(modalData);
			reset({
				...modalData,
				startTime: modalData.startTime ? dayjs(modalData.startTime, 'HH:mm') : null,
				endTime: modalData.endTime ? dayjs(modalData.endTime, 'HH:mm') : null,
				coreStartTime: modalData.coreStartTime ? dayjs(modalData.coreStartTime, 'HH:mm') : null,
				coreEndTime: modalData.coreEndTime ? dayjs(modalData.coreEndTime, 'HH:mm') : null,
				halfLeaveStartTime: modalData.halfLeaveStartTime ? dayjs(modalData.halfLeaveStartTime, 'HH:mm') : null,
				halfLeaveEndTime: modalData.halfLeaveEndTime ? dayjs(modalData.halfLeaveEndTime, 'HH:mm') : null,
			});
		}
	}, [modalData, reset]);

	const handleSave = handleSubmit(async (data) => {
		setLoader(true);
		try {
			const request: AttendancePolicyDto = {
				...data,
				attendancePolicyId: modalData?.attendancePolicyId,
				startTime: data.startTime ? data.startTime?.format('HH:mm') : null,
				endTime: data.endTime ? data.endTime.format('HH:mm') : null,
				coreStartTime: data.coreStartTime ? data.coreStartTime.format('HH:mm') : null,
				coreEndTime: data.coreEndTime ? data.coreEndTime.format('HH:mm') : null,
				halfLeaveStartTime: data.halfLeaveStartTime ? data.halfLeaveStartTime.format('HH:mm') : null,
				halfLeaveEndTime: data.halfLeaveEndTime ? data.halfLeaveEndTime.format('HH:mm') : null,
				allowMarginMinute: Number(data.allowMarginMinute),
			};

			await attendancePolicyService.saveAttendancePolicyData(request);
			if (confirm('요청이 성공적으로 등록되었습니다.')) {
				resetModalData();
				router.back();
			}
		} finally {
			setLoader(false);
		}
	});

	const handleClose = () => {
		router.back();
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
			<PathBreadcrumbs sx={{ padding: '0 1.5rem' }} />
			<Box sx={{ flexWrap: 'wrap', flexDirection: 'row', padding: '0 1.5rem' }}>
				<Grid
					container
					sx={{
						display: 'flex',
						flexDirection: 'column',
						width: '100%',
						padding: '2rem',
						borderRadius: '2rem',
						border: '1px solid',
						borderColor: 'grey.200',
						gap: 3,
					}}
				>
					<Grid sx={{ display: 'flex', justifyContent: 'row', alignItems: 'center', gap: 1 }}>
						<IconButton onClick={handleClose}>
							<ArrowBackRounded fontSize='small' />
						</IconButton>
						<Typography variant='h5'>{target == null ? '근태정책 생성' : '근태정책 수정'} </Typography>
					</Grid>
					<Grid>
						<FormItem
							name='attendancePolicyName'
							label='근태정책 이름'
							placeholder='정책명을 입력해주세요'
							required
							control={control}
							error={errors.attendancePolicyName?.message}
						/>
						<FormItem
							name='attendancePolicyDesc'
							label='근태정책 설명'
							placeholder='정책 설명을 입력해주세요'
							control={control}
							error={errors.attendancePolicyDesc?.message}
						/>
						<FormWrapper label='근태정책 타입' required>
							<Controller
								name='attendanceType'
								control={control}
								render={({ field: { onChange, value } }) => (
									<Select
										name={'attendanceType'}
										value={value}
										onChange={onChange}
										size='small'
										sx={{ minWidth: '10rem', marginRight: '0.5rem' }}
									>
										{Object.entries(ATTENDANCETYPE).map(([key, value]) => (
											<MenuItem key={key} value={key}>
												{value}
											</MenuItem>
										))}
									</Select>
								)}
							/>
						</FormWrapper>
						<Accordion slotProps={{ heading: { component: 'h4' } }} className='accordion-custom' sx={{ mb: '1rem' }} defaultExpanded={true}>
							<AccordionSummary expandIcon={<ExpandMoreRounded />} sx={{ py: 1, px: 3 }}>
								<Typography sx={{ fontWeight: 500, color: 'grey.700' }}>상세 근로 데이터</Typography>
							</AccordionSummary>
							<AccordionDetails sx={{ py: 2, px: 3 }}>
								<FormWrapper label='근무요일'>
									<Controller
										name='workDayOfWeek'
										control={control}
										render={({ field }) => (
											<ToggleButtonGroup
												color='primary'
												value={field.value || []}
												onChange={(_, newValue) => {
													if (newValue.length <= 6 && newValue.length >= 1) {
														field.onChange(newValue);
													}
												}}
											>
												{Object.entries(WORKDAYOFWEEKNUMBER).map(([key, label]) => {
													return (
														<ToggleButton key={key} value={key}>
															{label}
														</ToggleButton>
													);
												})}
											</ToggleButtonGroup>
										)}
									/>
								</FormWrapper>
								{attendanceType !== 'FIXED' && (
									<>
										<FormWrapper label='정산기간'>
											<Controller
												name='settlementPeriod'
												control={control}
												render={({ field: { onChange, value } }) => (
													<Select
														name='settlementPeriod'
														value={value}
														onChange={onChange}
														size='small'
														sx={{ minWidth: '10rem', marginRight: '0.5rem' }}
													>
														{Object.entries(SETTLEMENTPERIOD).map(([key, value]) => (
															<MenuItem key={key} value={key}>
																{value}
															</MenuItem>
														))}
													</Select>
												)}
											/>
										</FormWrapper>
										<FormWrapper label='소정 근로시간 기준'>
											<Controller
												name='worktimeRule'
												control={control}
												render={({ field }) => (
													<RadioGroup {...field}>
														{Object.entries(WORKTIMERULE).map(([key, value]) => (
															<FormControlLabel
																key={key}
																value={key}
																control={<Radio size='small' color='primary' />}
																label={value}
															/>
														))}
													</RadioGroup>
												)}
											/>
										</FormWrapper>
									</>
								)}
								<FormWrapper label='소정 근로시간'>
									<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
										<Typography>1일 기준</Typography>
										<Controller
											name='targetHour'
											control={control}
											render={({ field: { onChange, value } }) => (
												<Select
													name={'targetHour'}
													value={value}
													onChange={onChange}
													size='small'
													sx={{ minWidth: '4rem', margin: '0 0.25rem 0 0.5rem' }}
												>
													{hourList.map((item) => (
														<MenuItem key={item} value={item}>
															{item}
														</MenuItem>
													))}
												</Select>
											)}
										/>
										<Typography>시간</Typography>
										<Controller
											name='targetMinute'
											control={control}
											render={({ field: { onChange, value } }) => (
												<Select
													name={'targetMinute'}
													value={value}
													onChange={onChange}
													size='small'
													sx={{ minWidth: '4rem', margin: '0 0.25rem 0 0.5rem' }}
												>
													{minuteList.map((item) => (
														<MenuItem key={item} value={item}>
															{item}
														</MenuItem>
													))}
												</Select>
											)}
										/>
										<Typography>분</Typography>
									</Box>
								</FormWrapper>
								<FormWrapper label='근무시간'>
									<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
										<Controller
											name='startTime'
											control={control}
											rules={{
												validate: (value) => {
													if (!value) {
														return '근무 시작 시간을 입력해주세요.';
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
										~
										<Controller
											name='endTime'
											control={control}
											rules={{
												validate: (value) => {
													if (!value) {
														return '근무 종료 시간을 입력해주세요.';
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
								</FormWrapper>
								{attendanceType !== 'FIXED' && (
									<FormWrapper label='코어시간'>
										<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
											<Controller
												name='coreStartTime'
												control={control}
												render={({ field }) => (
													<TimePicker
														{...field}
														slotProps={{
															textField: {
																error: !!errors.coreStartTime,
																helperText: errors.coreStartTime?.message,
															},
														}}
													/>
												)}
											/>
											~
											<Controller
												name='coreEndTime'
												control={control}
												render={({ field }) => (
													<TimePicker
														{...field}
														slotProps={{
															textField: {
																error: !!errors.coreEndTime,
																helperText: errors.coreEndTime?.message,
															},
														}}
													/>
												)}
											/>
										</Box>
									</FormWrapper>
								)}
								<FormWrapper label='오후 반차 출근 시간'>
									<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
										<Controller
											name='halfLeaveStartTime'
											control={control}
											rules={{
												validate: (value) => {
													if (!value) {
														return '오후 반차 시 출근 시간을 입력해주세요.';
													}
													return true;
												},
											}}
											render={({ field }) => (
												<TimePicker
													{...field}
													slotProps={{
														textField: {
															error: !!errors.halfLeaveStartTime,
															helperText: errors.halfLeaveStartTime?.message,
														},
													}}
												/>
											)}
										/>
									</Box>
								</FormWrapper>
								<FormWrapper label='오전 반차 퇴근 시간'>
									<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
										<Controller
											name='halfLeaveEndTime'
											control={control}
											rules={{
												validate: (value) => {
													if (!value) {
														return '오전 반차 시 퇴근 시간을 입력해주세요.';
													}
													return true;
												},
											}}
											render={({ field }) => (
												<TimePicker
													{...field}
													slotProps={{
														textField: {
															error: !!errors.halfLeaveEndTime,
															helperText: errors.halfLeaveEndTime?.message,
														},
													}}
												/>
											)}
										/>
									</Box>
								</FormWrapper>
								<FormWrapper label='근태 허용 시간(분)'>
									<Controller
										name='allowMarginMinute'
										control={control}
										render={({ field: { onChange, value } }) => (
											<Select name={'allowMarginMinute'} value={value} onChange={onChange} size='small' sx={{ marginRight: '0.5rem' }}>
												{allowMarginMinuteList.map((item) => (
													<MenuItem key={item} value={item}>
														{item}
													</MenuItem>
												))}
											</Select>
										)}
									/>
								</FormWrapper>
							</AccordionDetails>
						</Accordion>
						<FormWrapper label='적용 근로자'>
							<Button variant='outlined'>근로자 적용</Button>
						</FormWrapper>
					</Grid>
					<Grid sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
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
