export interface DeptRoleItem {
	deptRoleNm: string;
	deptRoleCode: string;
}

export type RoleCategory = 'POSITION' | 'TITLE' | 'GRADE' | 'ROLE';

export const RANK_CATEGORY_INFO: Record<RoleCategory, string> = {
	POSITION: '직위',
	TITLE: '직책',
	GRADE: '직급',
	ROLE: '직무',
};

export const OFFICE_POSITIONS: DeptRoleItem[] = [
	{ deptRoleNm: '회장', deptRoleCode: 'P010010' },
	{ deptRoleNm: '부회장', deptRoleCode: 'P010020' },
	{ deptRoleNm: '대표이사', deptRoleCode: 'P010030' },
	{ deptRoleNm: '사장', deptRoleCode: 'P010040' },
	{ deptRoleNm: '부사장', deptRoleCode: 'P010050' },
	{ deptRoleNm: '전무', deptRoleCode: 'P010060' },
	{ deptRoleNm: '상무', deptRoleCode: 'P010070' },
	{ deptRoleNm: '이사', deptRoleCode: 'P010080' },
	{ deptRoleNm: '부장', deptRoleCode: 'P010090' },
	{ deptRoleNm: '차장', deptRoleCode: 'P010100' },
	{ deptRoleNm: '과장', deptRoleCode: 'P010110' },
	{ deptRoleNm: '계장', deptRoleCode: 'P010120' },
	{ deptRoleNm: '대리', deptRoleCode: 'P010130' },
	{ deptRoleNm: '주임', deptRoleCode: 'P010140' },
	{ deptRoleNm: '사원', deptRoleCode: 'P010150' },
	{ deptRoleNm: '감사', deptRoleCode: 'P010160' },
	{ deptRoleNm: '고문', deptRoleCode: 'P010170' },
	{ deptRoleNm: '인턴', deptRoleCode: 'P010180' },
	{ deptRoleNm: '파트/알바', deptRoleCode: 'P010190' },
	{ deptRoleNm: '업무위탁사원', deptRoleCode: 'P010200' },
	{ deptRoleNm: '상임고문', deptRoleCode: 'P010210' },
	{ deptRoleNm: '전문위원', deptRoleCode: 'P010220' },
];

export const RESEARCH_POSITIONS: DeptRoleItem[] = [
	{ deptRoleNm: '수석연구원', deptRoleCode: 'P020010' },
	{ deptRoleNm: '책임연구원', deptRoleCode: 'P020020' },
	{ deptRoleNm: '선임연구원', deptRoleCode: 'P020030' },
	{ deptRoleNm: '전임연구원', deptRoleCode: 'P020040' },
	{ deptRoleNm: '주임연구원', deptRoleCode: 'P020050' },
	{ deptRoleNm: '연구원', deptRoleCode: 'P020060' },
];

export const PRODUCTION_POSITIONS: DeptRoleItem[] = [
	{ deptRoleNm: '기원', deptRoleCode: 'P030010' },
	{ deptRoleNm: '기술사원', deptRoleCode: 'P030020' },
	{ deptRoleNm: '기술기사보', deptRoleCode: 'P030030' },
	{ deptRoleNm: '기술기사', deptRoleCode: 'P030040' },
	{ deptRoleNm: '기술주임', deptRoleCode: 'P030050' },
	{ deptRoleNm: '기술선임', deptRoleCode: 'P030060' },
	{ deptRoleNm: '직장', deptRoleCode: 'P030070' },
	{ deptRoleNm: '반장', deptRoleCode: 'P030080' },
	{ deptRoleNm: '조장', deptRoleCode: 'P030090' },
	{ deptRoleNm: '사원(제)', deptRoleCode: 'P030100' },
];

export const BASE_TITLES: DeptRoleItem[] = [
	{ deptRoleNm: '대표이사', deptRoleCode: 'DU0010' },
	{ deptRoleNm: '팀장', deptRoleCode: 'DU0020' },
	{ deptRoleNm: '팀원', deptRoleCode: 'DU0030' },
	{ deptRoleNm: '부팀장', deptRoleCode: 'DU0040' },
	{ deptRoleNm: '파트장', deptRoleCode: 'DU0050' },
	{ deptRoleNm: '부서장', deptRoleCode: 'DU0060' },
	{ deptRoleNm: '실장', deptRoleCode: 'DU0070' },
	{ deptRoleNm: '본부장', deptRoleCode: 'DU0080' },
	{ deptRoleNm: '그룹장', deptRoleCode: 'DU0090' },
	{ deptRoleNm: '부문장', deptRoleCode: 'DU0100' },
	{ deptRoleNm: 'CEO', deptRoleCode: 'DU0110' },
	{ deptRoleNm: 'COO', deptRoleCode: 'DU0120' },
	{ deptRoleNm: 'CFO', deptRoleCode: 'DU0130' },
	{ deptRoleNm: 'CTO', deptRoleCode: 'DU0140' },
	{ deptRoleNm: 'CIO', deptRoleCode: 'DU0150' },
	{ deptRoleNm: 'CMO', deptRoleCode: 'DU0160' },
	{ deptRoleNm: '연구소장', deptRoleCode: 'DU0170' },
	{ deptRoleNm: '사업부장', deptRoleCode: 'DU0180' },
	{ deptRoleNm: '전문임원', deptRoleCode: 'DU0190' },
	{ deptRoleNm: '지사장', deptRoleCode: 'DU0200' },
	{ deptRoleNm: '소장', deptRoleCode: 'DU0210' },
	{ deptRoleNm: '담당', deptRoleCode: 'DU0220' },
	{ deptRoleNm: '점장', deptRoleCode: 'DU0230' },
	{ deptRoleNm: '지점장', deptRoleCode: 'DU0240' },
	{ deptRoleNm: '센터장', deptRoleCode: 'DU0250' },
	{ deptRoleNm: '공장장', deptRoleCode: 'DU0260' },
	{ deptRoleNm: '법인장', deptRoleCode: 'DU0270' },
	{ deptRoleNm: 'PD', deptRoleCode: 'DU0280' },
	{ deptRoleNm: 'PM', deptRoleCode: 'DU0290' },
];

export const OFFICE_NAME_GRADES: DeptRoleItem[] = [
	{ deptRoleNm: '부장4', deptRoleCode: 'GSMB4' },
	{ deptRoleNm: '부장3', deptRoleCode: 'GSMB3' },
	{ deptRoleNm: '부장2', deptRoleCode: 'GSMB2' },
	{ deptRoleNm: '부장1', deptRoleCode: 'GSMB1' },
	{ deptRoleNm: '차장3', deptRoleCode: 'GSMC3' },
	{ deptRoleNm: '차장2', deptRoleCode: 'GSMC2' },
	{ deptRoleNm: '차장1', deptRoleCode: 'GSMC1' },
	{ deptRoleNm: '과장5', deptRoleCode: 'GSMK5' },
	{ deptRoleNm: '과장4', deptRoleCode: 'GSMK4' },
	{ deptRoleNm: '과장3', deptRoleCode: 'GSMK3' },
	{ deptRoleNm: '과장2', deptRoleCode: 'GSMK2' },
	{ deptRoleNm: '과장1', deptRoleCode: 'GSMK1' },
	{ deptRoleNm: '대리4', deptRoleCode: 'GSMD4' },
	{ deptRoleNm: '대리3', deptRoleCode: 'GSMD3' },
	{ deptRoleNm: '대리2', deptRoleCode: 'GSMD2' },
	{ deptRoleNm: '대리1', deptRoleCode: 'GSMD1' },
	{ deptRoleNm: '주임3', deptRoleCode: 'GSMJ3' },
	{ deptRoleNm: '주임2', deptRoleCode: 'GSMJ2' },
	{ deptRoleNm: '주임1', deptRoleCode: 'GSMJ1' },
	{ deptRoleNm: '사원3', deptRoleCode: 'GSMS3' },
	{ deptRoleNm: '사원2', deptRoleCode: 'GSMS2' },
	{ deptRoleNm: '사원1', deptRoleCode: 'GSMS1' },
];

export const OFFICE_CODE_GRADES: DeptRoleItem[] = [
	{ deptRoleNm: 'B4', deptRoleCode: 'GSCB4' },
	{ deptRoleNm: 'B3', deptRoleCode: 'GSCB3' },
	{ deptRoleNm: 'B2', deptRoleCode: 'GSCB2' },
	{ deptRoleNm: 'B1', deptRoleCode: 'GSCB1' },
	{ deptRoleNm: 'C3', deptRoleCode: 'GSCC3' },
	{ deptRoleNm: 'C2', deptRoleCode: 'GSCC2' },
	{ deptRoleNm: 'C1', deptRoleCode: 'GSCC1' },
	{ deptRoleNm: 'K5', deptRoleCode: 'GSCK5' },
	{ deptRoleNm: 'K4', deptRoleCode: 'GSCK4' },
	{ deptRoleNm: 'K3', deptRoleCode: 'GSCK3' },
	{ deptRoleNm: 'K2', deptRoleCode: 'GSCK2' },
	{ deptRoleNm: 'K1', deptRoleCode: 'GSCK1' },
	{ deptRoleNm: 'D4', deptRoleCode: 'GSCD4' },
	{ deptRoleNm: 'D3', deptRoleCode: 'GSCD3' },
	{ deptRoleNm: 'D2', deptRoleCode: 'GSCD2' },
	{ deptRoleNm: 'D1', deptRoleCode: 'GSCD1' },
	{ deptRoleNm: 'J3', deptRoleCode: 'GSCJ3' },
	{ deptRoleNm: 'J2', deptRoleCode: 'GSCJ2' },
	{ deptRoleNm: 'J1', deptRoleCode: 'GSCJ1' },
	{ deptRoleNm: 'S3', deptRoleCode: 'GSCS3' },
	{ deptRoleNm: 'S2', deptRoleCode: 'GSCS2' },
	{ deptRoleNm: 'S1', deptRoleCode: 'GSCS1' },
];

export const RESEARCH_NAME_GRADES: DeptRoleItem[] = [
	{ deptRoleNm: '수석연구원4', deptRoleCode: 'GRESU4' },
	{ deptRoleNm: '수석연구원3', deptRoleCode: 'GRESU3' },
	{ deptRoleNm: '수석연구원2', deptRoleCode: 'GRESU2' },
	{ deptRoleNm: '수석연구원1', deptRoleCode: 'GRESU1' },
	{ deptRoleNm: '책임연구원3', deptRoleCode: 'GRECH3' },
	{ deptRoleNm: '책임연구원2', deptRoleCode: 'GRECH2' },
	{ deptRoleNm: '책임연구원1', deptRoleCode: 'GRECH1' },
	{ deptRoleNm: '선임연구원5', deptRoleCode: 'GRESE5' },
	{ deptRoleNm: '선임연구원4', deptRoleCode: 'GRESE4' },
	{ deptRoleNm: '선임연구원3', deptRoleCode: 'GRESE3' },
	{ deptRoleNm: '선임연구원2', deptRoleCode: 'GRESE2' },
	{ deptRoleNm: '선임연구원1', deptRoleCode: 'GRESE1' },
	{ deptRoleNm: '전임연구원4', deptRoleCode: 'GREJE4' },
	{ deptRoleNm: '전임연구원3', deptRoleCode: 'GREJE3' },
	{ deptRoleNm: '전임연구원2', deptRoleCode: 'GREJE2' },
	{ deptRoleNm: '전임연구원1', deptRoleCode: 'GREJE1' },
	{ deptRoleNm: '주임연구원3', deptRoleCode: 'GREJU3' },
	{ deptRoleNm: '주임연구원2', deptRoleCode: 'GREJU2' },
	{ deptRoleNm: '주임연구원1', deptRoleCode: 'GREJU1' },
	{ deptRoleNm: '연구원3', deptRoleCode: 'GREYE3' },
	{ deptRoleNm: '연구원2', deptRoleCode: 'GREYE2' },
	{ deptRoleNm: '연구원1', deptRoleCode: 'GREYE1' },
];

export const RESEARCH_CODE_GRADES: DeptRoleItem[] = [
	{ deptRoleNm: 'SU4', deptRoleCode: 'GRCSU4' },
	{ deptRoleNm: 'SU3', deptRoleCode: 'GRCSU3' },
	{ deptRoleNm: 'SU2', deptRoleCode: 'GRCSU2' },
	{ deptRoleNm: 'SU1', deptRoleCode: 'GRCSU1' },
	{ deptRoleNm: 'CH3', deptRoleCode: 'GRCCH3' },
	{ deptRoleNm: 'CH2', deptRoleCode: 'GRCCH2' },
	{ deptRoleNm: 'CH1', deptRoleCode: 'GRCCH1' },
	{ deptRoleNm: 'SE5', deptRoleCode: 'GRCSE5' },
	{ deptRoleNm: 'SE4', deptRoleCode: 'GRCSE4' },
	{ deptRoleNm: 'SE3', deptRoleCode: 'GRCSE3' },
	{ deptRoleNm: 'SE2', deptRoleCode: 'GRCSE2' },
	{ deptRoleNm: 'SE1', deptRoleCode: 'GRCSE1' },
	{ deptRoleNm: 'JE4', deptRoleCode: 'GRCJE4' },
	{ deptRoleNm: 'JE3', deptRoleCode: 'GRCJE3' },
	{ deptRoleNm: 'JE2', deptRoleCode: 'GRCJE2' },
	{ deptRoleNm: 'JE1', deptRoleCode: 'GRCJE1' },
	{ deptRoleNm: 'JU3', deptRoleCode: 'GRCJU3' },
	{ deptRoleNm: 'JU2', deptRoleCode: 'GRCJU2' },
	{ deptRoleNm: 'JU1', deptRoleCode: 'GRCJU1' },
	{ deptRoleNm: 'YE3', deptRoleCode: 'GRCYE3' },
	{ deptRoleNm: 'YE2', deptRoleCode: 'GRCYE2' },
	{ deptRoleNm: 'YE1', deptRoleCode: 'GRCYE1' },
];

interface SubType {
	label: string;
	list: DeptRoleItem[];
}

export const RANK_TEMPLATES: Record<
	RoleCategory,
	{
		label: string;
		subTypes: Record<string, SubType>;
	}
> = {
	POSITION: {
		label: RANK_CATEGORY_INFO.POSITION, // '직위'
		subTypes: {
			OFFICE: { label: '사무직', list: OFFICE_POSITIONS },
			RESEARCH: { label: '연구직', list: RESEARCH_POSITIONS },
			PRODUCTION: { label: '생산직', list: PRODUCTION_POSITIONS },
		},
	},
	TITLE: {
		label: RANK_CATEGORY_INFO.TITLE, // '직책'
		subTypes: {
			DEFAULT: { label: '기본 직책', list: BASE_TITLES },
		},
	},
	GRADE: {
		label: RANK_CATEGORY_INFO.GRADE, // '직급'
		subTypes: {
			OFFICE_NAME: { label: '사무직(명칭)', list: OFFICE_NAME_GRADES },
			OFFICE_CODE: { label: '사무직(코드)', list: OFFICE_CODE_GRADES },
			RESEARCH_NAME: { label: '연구직(명칭)', list: RESEARCH_NAME_GRADES },
			RESEARCH_CODE: { label: '연구직(코드)', list: RESEARCH_CODE_GRADES },
		},
	},
	ROLE: {
		label: RANK_CATEGORY_INFO.ROLE, // '직무'
		subTypes: {},
	},
} as const;
