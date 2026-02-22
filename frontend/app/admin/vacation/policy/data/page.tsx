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
	Box,
	Button,
	Typography,
	Grid,
	Select,
	MenuItem,
	FormControl,
	FormLabel,
	FormControlLabel,
	RadioGroup,
	Radio,
	IconButton,
	Switch,
} from '@mui/material';

import { ArrowBackRounded } from '@mui/icons-material';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import { FormWrapper, FormItem } from '@/app/_component/baseElement/FormComp';

/** Type / Interface */
import { VACATIONPOLICYTYPE } from '@/constant/vacationConst';
import { AttendancePolicyDto, attendancePolicyService } from '@/app/services/attendancePolicyService';
import { vacationPolicyRequestController } from '@/app/services/vacationPolicyService';

const unit = [
	{ key: '0.5', label: '반차(0.5일)' },
	{
		key: '1',
		label: '1일',
	},
];

export default function VacationPolicyDataPage() {
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
	} = useForm<vacationPolicyRequestController>({
		defaultValues: {
			vacationPolicyName: '',
			vacationPolicyDesc: '',
			vacationPolicyType: 'WORKING_DAY',
			vacationPolicyUnit: '0.5',
			annualLeaveExpired: true,
			monthLeaveExpired: true,
			nextYearLeaveUsed: true,
		},
	});

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
		} catch (error: any) {
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
						<Typography variant='h5'>{target == null ? '휴가정책 생성' : '휴가정책 수정'} </Typography>
					</Grid>
					<Grid>
						<FormItem
							name='vacationPolicyName'
							label='휴가정책 이름'
							placeholder='정책명을 입력해주세요'
							required
							control={control}
							error={errors.vacationPolicyName?.message}
						/>
						<FormItem
							name='vacationPolicyDesc'
							label='휴가정책 설명'
							placeholder='정책 설명을 입력해주세요'
							control={control}
							error={errors.vacationPolicyDesc?.message}
						/>
						<FormWrapper label='휴가생성기준' required>
							<Controller
								name='vacationPolicyType'
								control={control}
								render={({ field: { onChange, value } }) => (
									<Select
										name={'attendanceType'}
										value={value}
										onChange={onChange}
										size='small'
										sx={{ minWidth: '10rem', marginRight: '0.5rem' }}
									>
										{Object.entries(VACATIONPOLICYTYPE).map(([key, value]) => (
											<MenuItem key={key} value={key}>
												{value}
											</MenuItem>
										))}
									</Select>
								)}
							/>
						</FormWrapper>
						<FormWrapper label='휴가사용단위' required>
							<Controller
								name='vacationPolicyUnit'
								control={control}
								render={({ field: { onChange, value } }) => (
									<Select
										name={'attendanceType'}
										value={value}
										onChange={onChange}
										size='small'
										sx={{ minWidth: '10rem', marginRight: '0.5rem' }}
									>
										{unit.map((item, idx) => (
											<MenuItem key={idx} value={item.key}>
												{item.label}
											</MenuItem>
										))}
									</Select>
								)}
							/>
						</FormWrapper>
						<FormWrapper label='소멸기간 설정'>
							<Controller
								name='annualLeaveExpired'
								control={control}
								render={({ field: { onChange, value } }) => (
									<FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
										<FormLabel id='demo-radio-buttons-group-label' sx={{ minWidth: '8rem', mr: '1.5rem' }}>
											연차
										</FormLabel>
										<RadioGroup
											row
											aria-labelledby='demo-radio-buttons-group-label'
											name='radio-buttons-group'
											value={String(value)}
											onChange={(e) => onChange(e.target.value === 'true')}
										>
											<FormControlLabel value='true' control={<Radio />} label='연차 생성 1년 후 소멸' />
											<FormControlLabel value='false' control={<Radio />} label='소멸 안함' />
										</RadioGroup>
									</FormControl>
								)}
							/>
							<Controller
								name='monthLeaveExpired'
								control={control}
								render={({ field: { onChange, value } }) => (
									<FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
										<FormLabel id='demo-radio-buttons-group-label' sx={{ minWidth: '8rem', mr: '1.5rem' }}>
											1년 미만자 연차(월차)
										</FormLabel>
										<RadioGroup
											row
											aria-labelledby='demo-radio-buttons-group-label'
											name='radio-buttons-group'
											value={String(value)}
											onChange={(e) => onChange(e.target.value === 'true')}
										>
											<FormControlLabel value='true' control={<Radio />} label='다음 입사일 도래 시 소멸' />
											<FormControlLabel value='false' control={<Radio />} label='소멸 안함' />
										</RadioGroup>
									</FormControl>
								)}
							/>
						</FormWrapper>
						<FormWrapper label='내년 연차 사용'>
							<Controller name='nextYearLeaveUsed' control={control} render={({ field }) => <Switch defaultChecked {...field} />} />
						</FormWrapper>
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
