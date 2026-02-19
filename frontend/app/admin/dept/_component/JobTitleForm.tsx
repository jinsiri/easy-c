import { JobTitleResponseDto } from '@/type/dept';
import { FormItem, FormProps } from '@/app/_component/baseElement/FormComp';
import { Box } from '@mui/material';

export type JobTitleAddFormValues = Omit<JobTitleResponseDto, 'jobTitleId' | 'jobTitleLevel'>;

export default function JobTitleForm({ control, errors }: FormProps<JobTitleAddFormValues>) {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', py: 2 }}>
			<FormItem name='jobTitleNm' label='직책명' required control={control} error={errors.jobTitleNm?.message} />
			<FormItem name='jobTitleCode' label='직책코드' required control={control} error={errors.jobTitleCode?.message} />
		</Box>
	);
}
