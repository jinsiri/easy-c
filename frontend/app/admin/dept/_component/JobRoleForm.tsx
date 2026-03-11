import { JobRoleResponseDto } from '@/type/dept';
import { FormItem, FormProps } from '@/app/_component/baseElement/FormComp';
import { Box } from '@mui/material';

export type JobRoleAddFormValues = Omit<JobRoleResponseDto, 'jobRoleId' | 'jobRoleOrder'>;

export default function JobRoleForm({ control, errors }: FormProps<JobRoleAddFormValues>) {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', py: 2 }}>
			<FormItem name='jobRoleCategory' label='직무 구분' control={control} error={errors.jobRoleCategory?.message} />
			<FormItem name='jobRoleType' label='직무 유형' control={control} error={errors.jobRoleType?.message} />
			<FormItem name='jobRoleNm' label='직무명' required control={control} error={errors.jobRoleNm?.message} />
		</Box>
	);
}
