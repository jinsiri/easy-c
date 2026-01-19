import dayjs from 'dayjs';

export const formatMinutes = (minutes: number | undefined) => {
	if (minutes === undefined || minutes === null) return '00h 00m';
	const dur = dayjs.duration(minutes, 'minutes');

	return `${Math.floor(dur.asHours())}h ${dur.minutes()}m`;
};
