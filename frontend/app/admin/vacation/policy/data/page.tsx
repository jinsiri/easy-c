'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/** Lib */
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
import { VACATIONPOLICYTYPE, VACATIONPOLICYUNIT } from '@/constant/vacationConst';
import { vacationPolicyRequestController, VacationPolicyDto, vacationPolicyService } from '@/app/services/vacationPolicyService';

const unit = ['0.5', '1'];

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
			reset({
				...modalData,
			});
		}
	}, [modalData, reset]);

	const handleSave = handleSubmit(async (data) => {
		setLoader(true);
		try {
			const request: VacationPolicyDto = {
				...data,
			};

			await vacationPolicyService.saveVacationPolicyData(request);
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
						<FormWrapper label='휴가생성 기준' required>
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
						<FormWrapper label='휴가사용 단위' required>
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
											<MenuItem key={idx} value={item}>
												{VACATIONPOLICYUNIT[item]}
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
