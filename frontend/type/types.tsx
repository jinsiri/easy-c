export type menuType = {
	id: string;
	title: string;
	type: '' | '1depth' | '2depth' | '3depth';
	url: string;
	icon?: React.ElementType;
	children?: menuType[];
};

export type attendanceType = 'FIXED' | 'FLEXTIME' | 'SELECTIVE' | 'FLEXIBLE' | 'SHIFT';
export type settlementPeriod = 'WEEK' | 'WEEK_2' | 'MONTH' | 'MONTH_2' | 'MONTH_3';
export type worktimeRule = 'CAP_AT_40' | 'ALWAYS_40' | 'BY_WORK_DAYS';

export type workType = 'NORMAL' | 'WEEKEND' | 'HOLIDAY';
export type workStatus = 'PRESENT' | 'LATE' | 'EARLY_LEAVE' | 'ABSENT' | 'VACATION' | 'OUTSIDE' | 'BUSINESS_TRIP' | 'UNNORMAL_START' | 'UNNORMAL_END';

export type vacationPolicyType = 'WORKING_DAY' | 'FINANCIAL_DAY';
export type vacationType = 'FULL' | 'HALF_AM' | 'HALF_PM' | 'SICK_LEAVE' | 'SPECIAL_LEAVE';

export type dayName = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
