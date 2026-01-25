'use client';

import { useRouter } from 'next/navigation';

/** MUI */
import { Box, TextField, Typography, Checkbox, FormControlLabel, Button } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';

/** Lib */
import { useForm, Control, Controller, FieldErrors } from 'react-hook-form';
import axiosConfig from '@/app/_lib/axiosConfig';

type DeptFormValues = Omit<DeptResponseDto, 'deptId'>;
interface Props {
	control: Control<DeptFormValues>;
	errors: FieldErrors<DeptFormValues>;
}

export default function RequestCorrection() {
	const router = useRouter();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<DeptFormValues>({
		defaultValues: {
			deptNm: '',
			deptEmail: '',
			deptCode: '',
			deptShortNm: '',
		},
	});

	const handleClose = () => router.back();

	const handleSave = handleSubmit(async (data) => {});

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
				<Typography sx={{ width: '100%', marginBottom: '0.5rem', fontWeight: 500 }}>
					<span style={{ color: '#ff4d4f' }}>*</span> 수정 근무일자
				</Typography>
				<Controller
					name='deptNm'
					control={control}
					rules={{ required: '부서명은 필수입니다.' }}
					render={({ field }) => <DatePicker sx={{ width: '100%' }} />}
				/>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, padding: '0.5rem' }}>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Box sx={{ minWidth: 130, display: 'flex', alignItems: 'center' }}>
							<FormControlLabel control={<Checkbox defaultChecked color='primary' />} label='출근시간' />
						</Box>
						<Controller name='deptEmail' control={control} render={({ field }) => <TimePicker />} />
					</Box>

					<Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
						<Box sx={{ minWidth: 130, display: 'flex', alignItems: 'center' }}>
							<FormControlLabel control={<Checkbox defaultChecked color='primary' />} label='퇴근시간' />
						</Box>
						<Controller name='deptCode' control={control} render={({ field }) => <TimePicker />} />
					</Box>
				</Box>
			</Box>

			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Typography sx={{ width: '100%', marginBottom: '0.5rem', fontWeight: 500 }}>
						<span style={{ color: '#ff4d4f' }}>*</span>수정 신청 사유
					</Typography>
				</Box>
				<Controller
					name='deptShortNm'
					control={control}
					render={({ field }) => <TextField {...field} fullWidth size='small' multiline maxRows={5} />}
				/>
			</Box>

			<Box>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Typography sx={{ width: '100%', marginBottom: '0.5rem', fontWeight: 500 }}>첨부 파일</Typography>
				</Box>
				<Controller
					name='deptShortNm'
					control={control}
					render={({ field }) => (
						<Box sx={{ display: 'flex', gap: 1 }}>
							<input
								accept='.pdf, .jpg, .png'
								id='contained-button-file'
								type='file'
								style={{ display: 'none' }}
								onChange={() => {} /*handleFileChange*/}
							/>
							<label htmlFor='contained-button-file'>
								<Button variant='contained' component='span'>
									파일 선택
								</Button>
							</label>
							<Box sx={{ flex: 1 }}>
								<TextField value={'sdaf'} placeholder='선택된 파일' variant='outlined' fullWidth size='small' />
							</Box>
						</Box>
					)}
				/>
			</Box>
		</Box>
	);
}
