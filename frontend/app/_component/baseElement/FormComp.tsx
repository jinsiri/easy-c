import { Control, Controller, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { Box, TextField, Typography } from '@mui/material';

interface FieldProps<TFieldValues extends FieldValues> {
	name: Path<TFieldValues>;
	label: string;
	placeholder?: string;
	required?: boolean;
	control: Control<TFieldValues>;
	error?: string;
}

export interface FormProps<T extends FieldValues> {
	control: Control<T>;
	errors: FieldErrors<T>;
}

export const FormItem = <TFieldValues extends FieldValues>({ name, label, placeholder, required, control, error }: FieldProps<TFieldValues>) => (
	<Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
		<Typography sx={{ minWidth: 130, mt: 1, fontWeight: 500 }}>
			{required && <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>}
			{label}
		</Typography>
		<Controller
			name={name}
			control={control}
			rules={required ? { required: `${label}은(는) 필수입니다.` } : undefined}
			render={({ field }) => (
				<TextField {...field} value={field.value ?? ''} fullWidth size='small' placeholder={placeholder} error={!!error} helperText={error} />
			)}
		/>
	</Box>
);
