'use client';
import { ReactNode } from 'react';

/** MUI */
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ko';

export default function ClientLocalizationProvider({ children }: { children: ReactNode }) {
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ko'>
			{children}
		</LocalizationProvider>
	);
}
