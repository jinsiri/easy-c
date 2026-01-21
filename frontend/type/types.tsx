export type menuType = {
	id: string;
	title: string;
	type: '' | '1depth' | '2depth' | '3depth';
	url: string;
	icon?: React.ElementType;
	children?: menuType[];
};

export type workType = 'NORMAL' | 'WEEKEND' | 'HOLIDAY';
export type workStatus = 'PRESENT' | 'LATE' | 'EARLY_LEAVE' | 'ABSENT' | 'VACATION';
export type vacationType = 'FULL' | 'HALF_AM' | 'HALF_PM' | 'SICK_LEAVE' | 'SPECIAL_LEAVE';
