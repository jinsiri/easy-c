import { DeptResponseDto } from '@/type/dept';
import { Box } from '@mui/material';
import { FormItem, FormProps } from '@/app/_component/baseElement/FormComp';

export type DeptAddFormValues = Omit<DeptResponseDto, 'deptId'>;

export default function DeptForm({ control, errors }: FormProps<DeptAddFormValues>) {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
			<FormItem name='deptNm' label='부서명' placeholder='부서명을 입력해주세요' required control={control} error={errors.deptNm?.message} />
			<FormItem name='deptEmail' label='부서메일아이디' control={control} error={errors.deptEmail?.message} />
			<FormItem name='deptCode' label='부서코드' control={control} error={errors.deptCode?.message} />
			<FormItem name='deptShortNm' label='부서 약어' control={control} error={errors.deptShortNm?.message} />
		</Box>
	);
}
