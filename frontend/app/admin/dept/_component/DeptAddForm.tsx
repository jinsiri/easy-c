import { DeptResponseDto } from '@/type/dept';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Box, TextField, Typography } from '@mui/material';

export type DeptFormValues = Omit<DeptResponseDto, 'deptId'>;

interface Props {
	control: Control<DeptFormValues>;
	errors: FieldErrors<DeptFormValues>;
}

export default function DeptAddForm({ control, errors }: Props) {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
			<Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
				<Typography sx={{ minWidth: 130, mt: 1, fontWeight: 500 }}>
					<span style={{ color: '#ff4d4f' }}>*</span> 부서명
				</Typography>
				<Controller
					name='deptNm'
					control={control}
					rules={{ required: '부서명은 필수입니다.' }}
					render={({ field }) => (
						<TextField
							{...field}
							fullWidth
							size='small'
							placeholder='부서명을 입력해주세요'
							error={!!errors.deptNm}
							helperText={errors.deptNm?.message}
						/>
					)}
				/>
			</Box>

			<Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
				<Box sx={{ minWidth: 130, display: 'flex', alignItems: 'center', mt: 1 }}>
					<Typography sx={{ fontWeight: 500 }}>부서메일아이디</Typography>
				</Box>
				<Controller
					name='deptEmail'
					control={control}
					render={({ field }) => <TextField {...field} value={field.value || ''} fullWidth size='small' />}
				/>
			</Box>

			<Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
				<Box sx={{ minWidth: 130, display: 'flex', alignItems: 'center', mt: 1 }}>
					<Typography sx={{ fontWeight: 500 }}>부서코드</Typography>
				</Box>
				<Controller name='deptCode' control={control} render={({ field }) => <TextField {...field} fullWidth size='small' />} />
			</Box>

			<Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
				<Box sx={{ minWidth: 130, display: 'flex', alignItems: 'center', mt: 1 }}>
					<Typography sx={{ fontWeight: 500 }}>부서 약어</Typography>
				</Box>
				<Controller name='deptShortNm' control={control} render={({ field }) => <TextField {...field} fullWidth size='small' />} />
			</Box>
		</Box>
	);
}
