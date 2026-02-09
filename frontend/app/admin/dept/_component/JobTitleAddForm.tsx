import { JobTitleResponseDto } from '@/type/dept';
import { FormItem, FormProps } from '@/app/_component/baseElement/FormComp';
import { Box } from '@mui/material';

type JobTitleFormValues = Omit<JobTitleResponseDto, 'jobTitleId'>;

export default function JobTitleAddForm({ control, errors }: FormProps<JobTitleFormValues>) {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', py: 2 }}>
			<FormItem name='jobTitleNm' label='직책명' required control={control} error={errors.jobTitleNm?.message} />
			<FormItem name='jobTitleCode' label='직책코드' control={control} error={errors.jobTitleCode?.message} />
		</Box>
	);
}
