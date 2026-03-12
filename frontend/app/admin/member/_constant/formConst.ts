import { ColDef } from 'ag-grid-community';
import { transformToColDefs } from '@/app/admin/member/_utils/formUtil';

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

export const MEMBER_FORM_CONFIG: { title: string; fields: MemberFieldDef[] }[] = [
	{
		title: '기본 정보',
		fields: [
			{ key: 'loginId', label: '로그인아이디', required: true },
			{ key: 'password', label: '비밀번호', required: true, type: 'password' }, //todo
			{ key: 'passwordCheck', label: '비밀번호 확인', required: true, type: 'password' },
			{ key: 'memberNm', label: '이름', required: true },
			{ key: 'employeeId', label: '사번', required: true },
			{ key: 'extensionNumber', label: '대표전화' },
			{ key: 'deptMemberMapList', label: '부서/직책' },
			{ key: 'jobPosition', label: '직위', type: 'select' },
			{ key: 'jobGrade', label: '직급', type: 'select' },
			{ key: 'jobRole', label: '직무', type: 'select' },
			{ key: 'email', label: '이메일' },
			{
				key: 'employmentStatus',
				label: '근무상태',
				type: 'select',
				options: [
					{ label: '재직', value: 'ACTIVE' },
					{ label: '휴직', value: 'LEAVE' },
					{ label: '퇴직 예정', value: 'RETIRING_SOON' },
					{ label: '퇴사', value: 'RESIGNED' },
				],
			},
			{
				key: 'employmentType',
				label: '직원 구분',
				required: true,
				type: 'select',
				options: [
					{ label: '정규직', value: 'REGULAR' },
					{ label: '계약직', value: 'CONTRACT' },
					{ label: '인턴', value: 'INTERN' },
					{ label: '파견직', value: 'DISPATCH' },
					{ label: '프리랜서', value: 'FREELANCER' },
				],
			},
			{
				key: 'recruitmentType',
				label: '채용 구분',
				required: true,
				type: 'select',
				options: [
					{ label: '신입', value: 'NEW' },
					{ label: '경력', value: 'EXPERIENCED' },
					{ label: '공채', value: 'OPEN' },
					{ label: '특채', value: 'SPECIAL' },
					{ label: '수시채용', value: 'ROLLING' },
					{ label: '사내전보', value: 'INTERNAL_TRANSFER' },
				],
			},
			{
				key: 'salaryType',
				label: '급여 구분',
				required: true,
				type: 'select',
				options: [
					{ label: '연봉', value: 'ANNUAL' },
					{ label: '월급', value: 'MONTHLY' },
					{ label: '시급', value: 'HOURLY' },
				],
			},
			{ key: 'referredBy', label: '추천자' },
			{ key: 'hireDate', label: '입사일', type: 'date', required: true },
			{ key: 'resignationDate', label: '퇴사일', type: 'date' },
		],
	},
	{
		title: '개인 정보',
		fields: [
			{ key: 'memberNmEn', label: '영문 이름' },
			{ key: 'phoneNumber', label: '휴대전화' },
			{ key: 'externalEmail', label: '외부이메일' },
			{
				key: 'gender',
				label: '성별',
				required: true,
				type: 'select',
				options: [
					{ label: '남성', value: 'MALE' },
					{ label: '여성', value: 'FEMALE' },
				],
			},
			{
				key: 'nationality',
				label: '국적',
				type: 'select',
				options: [
					{ label: '한국', value: 'KR' },
					{ label: '미국', value: 'US' },
					{ label: '일본', value: 'JP' },
					{ label: '중국', value: 'CN' },
					{ label: '베트남', value: 'VN' },
					{ label: '필리핀', value: 'PH' },
					{ label: '태국', value: 'TH' },
					{ label: '인도네시아', value: 'ID' },
					{ label: '기타', value: 'ETC' },
				],
			},
			{ key: 'dateOfBirth', label: '생년월일', type: 'date' },
			{ key: 'address', label: '주소', wide: true },
			{ key: 'faxNumber', label: '자택번호' },
		],
	},
	{
		title: '보훈 정보',
		fields: [
			{ key: 'veteranNumber', label: '보훈번호' },
			{
				key: 'veteranType',
				label: '보훈 구분',
				type: 'select',
				options: [
					{ label: '국가유공자', value: 'NATIONAL_MERIT' },
					{ label: '보훈가족', value: 'VETERANS_FAMILY' },
					{ label: '독립유공자', value: 'INDEPENDENCE_MERIT' },
					{ label: '특수임무유공자', value: 'SPECIAL_MERIT' },
					{ label: '해당없음', value: 'NONE' },
				],
			},
			{ key: 'veteranFamily', label: '보훈 가족', type: 'checkbox' },
		],
	},
	{
		title: '장애 정보',
		fields: [
			{ key: 'disabilityRegistrationNumber', label: '장애 등록번호' },
			{
				key: 'disabilityType',
				label: '장애 구분',
				type: 'select',
				options: [
					{ label: '지체', value: 'PHYSICAL' },
					{ label: '시각', value: 'VISUAL' },
					{ label: '청각', value: 'HEARING' },
					{ label: '지적', value: 'INTELLECTUAL' },
					{ label: '정신', value: 'MENTAL' },
					{ label: '내부기관', value: 'INTERNAL' },
					{ label: '해당없음', value: 'NONE' },
				],
			},
			{
				key: 'disabilityRecognition',
				label: '장애 인정 구분',
				type: 'select',
				options: [
					{ label: '인정', value: 'RECOGNIZED' },
					{ label: '미인정', value: 'NOT_RECOGNIZED' },
					{ label: '심사중', value: 'PENDING' },
					{ label: '해당없음', value: 'NONE' },
				],
			},
			{ key: 'disabilityGrade', label: '장애 등급' },
		],
	},
	{
		title: '계좌 정보',
		fields: [
			{ key: 'bankName', label: '은행 이름' },
			{ key: 'accountHolderName', label: '예금주' },
			{ key: 'accountNumber', label: '계좌번호' },
		],
	},
];

export const DEPT_COLS: MemberColDef[] = [
	{ key: 'deptNm', label: '부서', type: 'text' },
	{ key: 'jobTitleNm', label: '직책', type: 'text' },
];

export const CAREER_COLS: MemberColDef[] = [
	{ key: 'startDate', label: '시작일', type: 'date' },
	{ key: 'endDate', label: '종료일', type: 'date' },
	{ key: 'companyName', label: '근무처', type: 'text' },
	{ key: 'positionTitle', label: '직위', type: 'text' },
	{ key: 'jobDescription', label: '담당업무', type: 'text' },
	{ key: 'workPeriod', label: '근속기간', type: 'text' },
	{ key: 'resignationReason', label: '퇴직사유', type: 'text' },
];

export const REWARD_COLS: MemberColDef[] = [
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

export const QUALIFICATION_COLS: MemberColDef[] = [
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

export const LANGUAGE_COLS: MemberColDef[] = [
	{ key: 'languageType', label: '구분', type: 'text' },
	{ key: 'languageName', label: '어학명', type: 'text' },
	{ key: 'evaluationDate', label: '평가일', type: 'date' },
	{ key: 'evaluationAgency', label: '평가기관', type: 'text' },
	{ key: 'score', label: '점수', type: 'number' },
	{ key: 'grade', label: '등급', type: 'text' },
	{ key: 'etc', label: '기타', type: 'text' },
];

// ===== 데이터셋을 그리드용 컬럼으로 변경 =====
export const CAREER_COL_DEFS = transformToColDefs(CAREER_COLS);
export const REWARD_COL_DEFS = transformToColDefs(REWARD_COLS);
export const LANGUAGE_COL_DEFS = transformToColDefs(LANGUAGE_COLS);
export const CERTIFICATION_COL_DEFS: ColDef<Record<string, any>>[] = [
	{ field: 'qualificationType', headerName: '구분', editable: false },
	{ field: 'qualificationName', headerName: '자격명', editable: false },
	{ field: 'qualificationNumber', headerName: '자격번호', editable: false },
	{ field: 'qualificationGrade', headerName: '자격등급', editable: false },
	{ field: 'issuingOrganization', headerName: '기관명', editable: false },
	{ field: 'acquiredDate', headerName: '취득일', editable: false },
	{ field: 'suspendedDate', headerName: '정지일', editable: false },
];
