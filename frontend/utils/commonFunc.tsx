import { ReactNode } from 'react';
import dayjs from 'dayjs';

export const formatMinutes = (minutes: number | undefined) => {
	if (minutes === undefined || minutes === null) return '00h 00m';
	const dur = dayjs.duration(minutes, 'minutes');

	return `${Math.floor(dur.asHours())}h ${dur.minutes()}m`;
};

export const getTimelineInnerData = (target: any): ReactNode => {
	if (target instanceof Date) {
		return target ? dayjs(target).format('YYYY-MM-DD HH:mm') : '-';
	} else {
		return target;
	}
};
