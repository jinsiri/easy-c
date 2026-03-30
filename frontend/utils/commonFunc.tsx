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

// 1. 인코딩: 한글(UTF-8) -> Base64
export const encoded = (data: string): string => {
	const bytes = new TextEncoder().encode(data);
	const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('');
	return btoa(binString);
};

// 2. 디코딩: Base64 -> 한글(UTF-8)
export const decoded = (encoded: string): string => {
	try {
		const binString = atob(encoded);
		const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
		return new TextDecoder().decode(bytes);
	} catch (e) {
		console.error('Decoding error:', e);
		return '';
	}
};
