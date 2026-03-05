import { ReactNode } from 'react';

/** Lib */
import { Control, Controller, FieldErrors, FieldValues, Path } from 'react-hook-form';

/** Mui */
import { Box, TextField, Typography } from '@mui/material';

interface FieldWrapperProps {
	label: string;
	required?: boolean;
	direction?: 'row' | 'column';
	children?: ReactNode;
}

interface FieldProps<TFieldValues extends FieldValues> {
	name: Path<TFieldValues>;
	label: string;
	placeholder?: string;
	required?: boolean;
	control: Control<TFieldValues>;
	error?: string;
	readOnly?: boolean;
}

export interface FormProps<T extends FieldValues> {
	control: Control<T>;
	errors: FieldErrors<T>;
}

export const FormWrapper = ({ required, label, direction = 'row', children }: FieldWrapperProps) => (
	<Box sx={{ display: 'flex', flexDirection: direction, alignItems: direction === 'row' ? 'flex-start' : '', mb: 2 }}>
		<Typography sx={{ width: direction === 'row' ? '20%' : '100%', minWidth: direction === 'row' ? 140 : '100%', mt: 1, fontWeight: 500 }}>
			{label}
			{required && <span style={{ color: '#ff4d4f', marginLeft: 4 }}>*</span>}
		</Typography>
		<Box sx={{ flexGrow: 1 }}>{children}</Box>
	</Box>
);

export const FormItem = <TFieldValues extends FieldValues>({ name, label, placeholder, required, control, error, readOnly }: FieldProps<TFieldValues>) => (
	<FormWrapper label={label} required={required}>
		<Controller
			name={name}
			control={control}
			rules={required ? { required: `${label}은(는) 필수입니다.` } : undefined}
			render={({ field }) => (
				<TextField
					{...field}
					value={field.value ?? ''}
					fullWidth
					size='small'
					placeholder={placeholder}
					error={!!error}
					helperText={error}
					slotProps={{
						input: {
							readOnly: readOnly ?? false,
						},
					}}
				/>
			)}
		/>
	</FormWrapper>
);
