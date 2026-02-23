import { DeptResponseDto } from '@/type/dept';
import { Box, Typography } from '@mui/material';
import { FormItem, FormProps } from '@/app/_component/baseElement/FormComp';
import { useWatch } from 'react-hook-form';

export type DeptAddFormValues = DeptResponseDto;

export default function DeptForm({ control, errors }: FormProps<DeptAddFormValues>) {
	const deptId = useWatch({ control, name: 'deptId' });
	const deptNm = useWatch({ control, name: 'deptNm' });
	const isRoot = deptId === 1;

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
			{isRoot ? (
				<Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
					<Typography variant='body1' sx={{ width: '20%', minWidth: '140px' }}>
						부서명
					</Typography>
					<Typography variant='body1'>{deptNm}</Typography>
				</Box>
			) : (
				<FormItem name='deptNm' label='부서명' placeholder='부서명을 입력해주세요' required control={control} error={errors.deptNm?.message} />
			)}
			<FormItem name='deptEmail' label='부서메일아이디' control={control} error={errors.deptEmail?.message} />
			<FormItem name='deptCode' label='부서코드' control={control} error={errors.deptCode?.message} />
			<FormItem name='deptShortNm' label='부서 약어' control={control} error={errors.deptShortNm?.message} />
		</Box>
	);
}
