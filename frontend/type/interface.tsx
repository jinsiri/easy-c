export interface SearchRequestDto {
	workDate?: string | null;
	searchCategory?: string;
	searchValue?: string;
}

export interface ExcelRequestDto {
	fileName: string;
	search?: SearchRequestDto;
}
