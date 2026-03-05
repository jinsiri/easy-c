export type MemberFieldDef = {
	key: string;
	label: string;
	wide?: boolean;
	required?: boolean;
	readOnly?: boolean;
	type?: 'text' | 'password' | 'date' | 'number' | 'select' | 'checkbox';
	options?: { label: string; value: string }[];
};

export type MemberColDef = {
	key: string;
	label: string;
	type?: 'text' | 'password' | 'date' | 'number' | 'select';
	options?: { label: string; value: string }[];
};

export const careerCols: MemberColDef[] = [
	{ key: 'startDate', label: '시작일', type: 'date' },
	{ key: 'endDate', label: '종료일', type: 'date' },
	{ key: 'companyName', label: '근무처', type: 'text' },
	{ key: 'jobPosition', label: '직위', type: 'text' },
	{ key: 'jobDescription', label: '담당업무', type: 'text' },
	{ key: 'workPeriod', label: '근속기간', type: 'text' },
	{ key: 'resignationReason', label: '퇴직사유', type: 'text' },
];

export const rewardCols: MemberColDef[] = [
	{
		key: 'type',
		label: '구분',
		type: 'select',
		options: [
			{ label: '포상', value: 'REWARD' },
			{ label: '징계', value: 'DISCIPLINE' },
		],
	},
	{ key: 'actionDate', label: '일자', type: 'date' },
	{ key: 'title', label: '내용', type: 'text' },
	{ key: 'reason', label: '사유', type: 'text' },
	{ key: 'remark', label: '기타', type: 'text' },
];

export const qualificationCols: MemberColDef[] = [
	{
		key: 'qualificationType',
		label: '구분',
		type: 'select',
		options: [
			{ label: '자격증', value: 'CERTIFICATE' },
			{ label: '면허', value: 'LICENSE' },
			{ label: '민간/국제인증', value: 'CERTIFICATION' },
			{ label: '기타', value: 'ETC' },
		],
	},
	{ key: 'qualificationName', label: '자격명', type: 'text' },
	{ key: 'qualificationNumber', label: '자격번호', type: 'text' },
	{ key: 'qualificationGrade', label: '자격등급', type: 'text' },
	{ key: 'issuingOrganization', label: '기관명', type: 'text' },
	{ key: 'acquiredDate', label: '취득일', type: 'date' },
	{ key: 'suspendedDate', label: '정지일', type: 'date' },
];

export const languageCols: MemberColDef[] = [
	{ key: 'languageType', label: '구분', type: 'text' },
	{ key: 'languageName', label: '어학명', type: 'text' },
	{ key: 'evaluationDate', label: '평가일', type: 'date' },
	{ key: 'evaluationAgency', label: '평가기관', type: 'text' },
	{ key: 'score', label: '점수', type: 'number' },
	{ key: 'grade', label: '등급', type: 'text' },
	{ key: 'etc', label: '기타', type: 'text' },
];
