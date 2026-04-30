'use client';

import { useEffect } from 'react';
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
} from '@mui/material';

import { ExpandMoreRounded, ArrowBackRounded } from '@mui/icons-material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import { FormWrapper, FormItem } from '@/app/_component/baseElement/FormComp';

/** Type / Interface */
import { ATTENDANCETYPE, SETTLEMENTPERIOD, WORKTIMERULE, WORKDAYOFWEEKNUMBER } from '@/constant/attendanceConst';
import { AttendancePolicyRequestController, AttendancePolicyDto, attendancePolicyService } from '@/app/services/attendancePolicyService';
import { ScheduleController } from '@/app/services/scheduleService';

export default function ScheduleUserDataPage() {
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
	} = useForm<ScheduleController>({
		defaultValues: {
			scheduleName: '',
			scheduleDesc: '',
			published: false,
			startDate: null,
			endDate: null,
			startTime: null,
			endTime: null,
		},
	});

	const handleSave = handleSubmit(async (data) => {
		setLoader(true);
		try {
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
						<FormWrapper label='공개여부'>
							<Controller
								name='published'
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
									<RadioGroup
										row
										aria-labelledby='demo-row-radio-buttons-group-label'
										name='row-radio-buttons-group'
										value={field.value ?? 'public'}
										onChange={field.onChange}
									>
										<FormControlLabel value='public' control={<Radio />} label='공개' />
										<FormControlLabel value='private' control={<Radio />} label='비공개' />
									</RadioGroup>
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
