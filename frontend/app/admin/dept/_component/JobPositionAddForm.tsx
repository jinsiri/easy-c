import { FormItem, FormProps } from '@/app/_component/baseElement/FormComp';
import { Box } from '@mui/material';
import { JobPositionResponseDto } from '@/type/dept';

export type JobPositionAddFormValues = Omit<JobPositionResponseDto, 'jobPositionId'>;

export default function JobPositionAddForm({ control, errors }: FormProps<JobPositionAddFormValues>) {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', py: 2 }}>
			<FormItem name='jobPositionNm' label='직위명' required control={control} error={errors.jobPositionNm?.message} />
			<FormItem name='jobPositionCode' label='직위코드' control={control} error={errors.jobPositionCode?.message} />
		</Box>
	);
}
