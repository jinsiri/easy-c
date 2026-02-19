import { JobGradeResponseDto } from '@/type/dept';
import { FormItem, FormProps } from '@/app/_component/baseElement/FormComp';
import { Box } from '@mui/material';

export type JobGradeAddFormValues = Omit<JobGradeResponseDto, 'jobGradeId' | 'jobGradeLevel'>;

export default function JobGradeForm({ control, errors }: FormProps<JobGradeAddFormValues>) {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', py: 2 }}>
			<FormItem name='jobGradeNm' label='직급명' required control={control} error={errors.jobGradeNm?.message} />
			<FormItem name='jobGradeCode' label='직급코드' required control={control} error={errors.jobGradeCode?.message} />
		</Box>
	);
}
