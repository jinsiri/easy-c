/** Lib */
import { Dayjs } from 'dayjs';

export interface SearchRequestDto {
	workDate?: string | null;
	searchCategory?: string;
	searchValue?: string;
}

export interface PageRequest<T> {
	request?: T;
	number: number;
	size: number;
}

export interface PageResponse<T> {
	content: T[];
	totalElements: number;
	totalPages: number;
	number: number;
	size: number;
}

export interface ExcelRequestDto<T> {
	fileName: string;
	request?: T;
}

export interface FilterField {
	key: string;
	label: string;
	type: 'text' | 'select';
	options?: { value: string; label: string }[];
	validate?: (data: any, watchAllFields: FilterValues) => string | boolean;
}

export interface FilterValues {
	[key: string]: any;
	startDate: Dayjs | null;
	endDate: Dayjs | null;
}
