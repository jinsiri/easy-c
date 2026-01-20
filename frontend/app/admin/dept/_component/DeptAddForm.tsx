import { DeptResponseDto } from '@/type/dept';
import { Control, Controller, FieldErrors, Path } from 'react-hook-form';
import { Box, TextField, Typography } from '@mui/material';

export type DeptFormValues = Omit<DeptResponseDto, 'deptId'>;

interface Props {
	control: Control<DeptFormValues>;
	errors: FieldErrors<DeptFormValues>;
}

interface FieldProps {
	name: Path<DeptFormValues>;
	label: string;
	placeholder?: string;
	required?: boolean;
	control: Control<DeptFormValues>;
	error?: string;
}

const FormItem = ({ name, label, placeholder, required, control, error }: FieldProps) => (
	<Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
		<Typography sx={{ minWidth: 130, mt: 1, fontWeight: 500 }}>
			{required && <span style={{ color: '#ff4d4f' }}>*</span>} {label}
		</Typography>
		<Controller
			name={name}
			control={control}
			rules={required ? { required: `${label}은(는) 필수입니다.` } : undefined}
			render={({ field }) => (
				<TextField
					{...field}
					value={field.value ?? ''} // null 방지
					fullWidth
					size='small'
					placeholder={placeholder}
					error={!!error}
					helperText={error}
				/>
			)}
		/>
	</Box>
);

export default function DeptAddForm({ control, errors }: Props) {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
			<FormItem name='deptNm' label='부서명' placeholder='부서명을 입력해주세요' required control={control} error={errors.deptNm?.message} />
			<FormItem name='deptEmail' label='부서메일아이디' control={control} error={errors.deptEmail?.message} />
			<FormItem name='deptCode' label='부서코드' control={control} error={errors.deptCode?.message} />
			<FormItem name='deptShortNm' label='부서 약어' control={control} error={errors.deptShortNm?.message} />
		</Box>
	);
}
