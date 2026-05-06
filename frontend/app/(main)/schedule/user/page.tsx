'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

/** Lib */
import dayjs from 'dayjs';

/** MUI */
import { Box, Button } from '@mui/material';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import CalendarComp from '@/app/_component/baseElement/CalendarComp';

/** Type / Interface */
import { dayName } from '@/type/types';
import { CalendarRequestDto, CalendarDayDto, scheduleService } from '@/app/services/scheduleService';
import secureLocalStorage from 'react-secure-storage';

export default function ScheduleUserPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [calendarData, setCalendarData] = useState<Record<dayName, CalendarDayDto>[]>([]);

	const onChangeDateFunc = async (calendarDate: dayjs.Dayjs) => {
		const request: CalendarRequestDto = {
			memberIds: [secureLocalStorage.getItem('memberId') as number],
			calendarType: 'PERSONAL',
			date: calendarDate ? calendarDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
		};

		await scheduleService.getUserMonthSchedules(request).then((res) => {
			setCalendarData(res);
			router.replace(`?date=${calendarDate.format('YYYY-MM')}`);
		});
	};

	useEffect(() => {
		const initialDate = searchParams.get('date') ? dayjs(searchParams.get('date')) : dayjs();
		onChangeDateFunc(initialDate);
	}, []);

	return (
		<Box
			className='main-wrap-overflow'
			sx={{
				padding: '0 1.5rem',
			}}
		>
			<PathBreadcrumbs>
				<Button variant='contained' sx={{ height: 'auto' }} onClick={() => router.push('/schedule/user/data')}>
					일정 추가
				</Button>
			</PathBreadcrumbs>
			<Box sx={{ flexDirection: 'column', flexGrow: 1, minWidth: '100%', gap: 2 }}>
				<Box sx={{ flexGrow: 1 }}>
					<CalendarComp calendarType='schedule' calendarRow={calendarData} onChangeDate={onChangeDateFunc} />
				</Box>
			</Box>
		</Box>
	);
}
