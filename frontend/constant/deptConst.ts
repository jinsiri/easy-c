export interface DeptRankItem {
	deptRankNm: string;
	deptRankCode: string;
}

export type RankCategory = 'POSITION' | 'TITLE' | 'GRADE';

export const RANK_CATEGORY_INFO: Record<RankCategory, string> = {
	POSITION: '직위',
	TITLE: '직책',
	GRADE: '직급',
};

export const OFFICE_POSITIONS: DeptRankItem[] = [
	{ deptRankNm: '회장', deptRankCode: 'P010010' },
	{ deptRankNm: '부회장', deptRankCode: 'P010020' },
	{ deptRankNm: '대표이사', deptRankCode: 'P010030' },
	{ deptRankNm: '사장', deptRankCode: 'P010040' },
	{ deptRankNm: '부사장', deptRankCode: 'P010050' },
	{ deptRankNm: '전무', deptRankCode: 'P010060' },
	{ deptRankNm: '상무', deptRankCode: 'P010070' },
	{ deptRankNm: '이사', deptRankCode: 'P010080' },
	{ deptRankNm: '부장', deptRankCode: 'P010090' },
	{ deptRankNm: '차장', deptRankCode: 'P010100' },
	{ deptRankNm: '과장', deptRankCode: 'P010110' },
	{ deptRankNm: '계장', deptRankCode: 'P010120' },
	{ deptRankNm: '대리', deptRankCode: 'P010130' },
	{ deptRankNm: '주임', deptRankCode: 'P010140' },
	{ deptRankNm: '사원', deptRankCode: 'P010150' },
	{ deptRankNm: '감사', deptRankCode: 'P010160' },
	{ deptRankNm: '고문', deptRankCode: 'P010170' },
	{ deptRankNm: '인턴', deptRankCode: 'P010180' },
	{ deptRankNm: '파트/알바', deptRankCode: 'P010190' },
	{ deptRankNm: '업무위탁사원', deptRankCode: 'P010200' },
	{ deptRankNm: '상임고문', deptRankCode: 'P010210' },
	{ deptRankNm: '전문위원', deptRankCode: 'P010220' },
];

export const RESEARCH_POSITIONS: DeptRankItem[] = [
	{ deptRankNm: '수석연구원', deptRankCode: 'P020010' },
	{ deptRankNm: '책임연구원', deptRankCode: 'P020020' },
	{ deptRankNm: '선임연구원', deptRankCode: 'P020030' },
	{ deptRankNm: '전임연구원', deptRankCode: 'P020040' },
	{ deptRankNm: '주임연구원', deptRankCode: 'P020050' },
	{ deptRankNm: '연구원', deptRankCode: 'P020060' },
];

export const PRODUCTION_POSITIONS: DeptRankItem[] = [
	{ deptRankNm: '기원', deptRankCode: 'P030010' },
	{ deptRankNm: '기술사원', deptRankCode: 'P030020' },
	{ deptRankNm: '기술기사보', deptRankCode: 'P030030' },
	{ deptRankNm: '기술기사', deptRankCode: 'P030040' },
	{ deptRankNm: '기술주임', deptRankCode: 'P030050' },
	{ deptRankNm: '기술선임', deptRankCode: 'P030060' },
	{ deptRankNm: '직장', deptRankCode: 'P030070' },
	{ deptRankNm: '반장', deptRankCode: 'P030080' },
	{ deptRankNm: '조장', deptRankCode: 'P030090' },
	{ deptRankNm: '사원(제)', deptRankCode: 'P030100' },
];

export const BASE_TITLES: DeptRankItem[] = [
	{ deptRankNm: '대표이사', deptRankCode: 'DU0010' },
	{ deptRankNm: '팀장', deptRankCode: 'DU0020' },
	{ deptRankNm: '팀원', deptRankCode: 'DU0030' },
	{ deptRankNm: '부팀장', deptRankCode: 'DU0040' },
	{ deptRankNm: '파트장', deptRankCode: 'DU0050' },
	{ deptRankNm: '부서장', deptRankCode: 'DU0060' },
	{ deptRankNm: '실장', deptRankCode: 'DU0070' },
	{ deptRankNm: '본부장', deptRankCode: 'DU0080' },
	{ deptRankNm: '그룹장', deptRankCode: 'DU0090' },
	{ deptRankNm: '부문장', deptRankCode: 'DU0100' },
	{ deptRankNm: 'CEO', deptRankCode: 'DU0110' },
	{ deptRankNm: 'COO', deptRankCode: 'DU0120' },
	{ deptRankNm: 'CFO', deptRankCode: 'DU0130' },
	{ deptRankNm: 'CTO', deptRankCode: 'DU0140' },
	{ deptRankNm: 'CIO', deptRankCode: 'DU0150' },
	{ deptRankNm: 'CMO', deptRankCode: 'DU0160' },
	{ deptRankNm: '연구소장', deptRankCode: 'DU0170' },
	{ deptRankNm: '사업부장', deptRankCode: 'DU0180' },
	{ deptRankNm: '전문임원', deptRankCode: 'DU0190' },
	{ deptRankNm: '지사장', deptRankCode: 'DU0200' },
	{ deptRankNm: '소장', deptRankCode: 'DU0210' },
	{ deptRankNm: '담당', deptRankCode: 'DU0220' },
	{ deptRankNm: '점장', deptRankCode: 'DU0230' },
	{ deptRankNm: '지점장', deptRankCode: 'DU0240' },
	{ deptRankNm: '센터장', deptRankCode: 'DU0250' },
	{ deptRankNm: '공장장', deptRankCode: 'DU0260' },
	{ deptRankNm: '법인장', deptRankCode: 'DU0270' },
	{ deptRankNm: 'PD', deptRankCode: 'DU0280' },
	{ deptRankNm: 'PM', deptRankCode: 'DU0290' },
];

export const OFFICE_NAME_GRADES: DeptRankItem[] = [
	{ deptRankNm: '부장4', deptRankCode: 'GSMB4' },
	{ deptRankNm: '부장3', deptRankCode: 'GSMB3' },
	{ deptRankNm: '부장2', deptRankCode: 'GSMB2' },
	{ deptRankNm: '부장1', deptRankCode: 'GSMB1' },
	{ deptRankNm: '차장3', deptRankCode: 'GSMC3' },
	{ deptRankNm: '차장2', deptRankCode: 'GSMC2' },
	{ deptRankNm: '차장1', deptRankCode: 'GSMC1' },
	{ deptRankNm: '과장5', deptRankCode: 'GSMK5' },
	{ deptRankNm: '과장4', deptRankCode: 'GSMK4' },
	{ deptRankNm: '과장3', deptRankCode: 'GSMK3' },
	{ deptRankNm: '과장2', deptRankCode: 'GSMK2' },
	{ deptRankNm: '과장1', deptRankCode: 'GSMK1' },
	{ deptRankNm: '대리4', deptRankCode: 'GSMD4' },
	{ deptRankNm: '대리3', deptRankCode: 'GSMD3' },
	{ deptRankNm: '대리2', deptRankCode: 'GSMD2' },
	{ deptRankNm: '대리1', deptRankCode: 'GSMD1' },
	{ deptRankNm: '주임3', deptRankCode: 'GSMJ3' },
	{ deptRankNm: '주임2', deptRankCode: 'GSMJ2' },
	{ deptRankNm: '주임1', deptRankCode: 'GSMJ1' },
	{ deptRankNm: '사원3', deptRankCode: 'GSMS3' },
	{ deptRankNm: '사원2', deptRankCode: 'GSMS2' },
	{ deptRankNm: '사원1', deptRankCode: 'GSMS1' },
];

export const OFFICE_CODE_GRADES: DeptRankItem[] = [
	{ deptRankNm: 'B4', deptRankCode: 'GSCB4' },
	{ deptRankNm: 'B3', deptRankCode: 'GSCB3' },
	{ deptRankNm: 'B2', deptRankCode: 'GSCB2' },
	{ deptRankNm: 'B1', deptRankCode: 'GSCB1' },
	{ deptRankNm: 'C3', deptRankCode: 'GSCC3' },
	{ deptRankNm: 'C2', deptRankCode: 'GSCC2' },
	{ deptRankNm: 'C1', deptRankCode: 'GSCC1' },
	{ deptRankNm: 'K5', deptRankCode: 'GSCK5' },
	{ deptRankNm: 'K4', deptRankCode: 'GSCK4' },
	{ deptRankNm: 'K3', deptRankCode: 'GSCK3' },
	{ deptRankNm: 'K2', deptRankCode: 'GSCK2' },
	{ deptRankNm: 'K1', deptRankCode: 'GSCK1' },
	{ deptRankNm: 'D4', deptRankCode: 'GSCD4' },
	{ deptRankNm: 'D3', deptRankCode: 'GSCD3' },
	{ deptRankNm: 'D2', deptRankCode: 'GSCD2' },
	{ deptRankNm: 'D1', deptRankCode: 'GSCD1' },
	{ deptRankNm: 'J3', deptRankCode: 'GSCJ3' },
	{ deptRankNm: 'J2', deptRankCode: 'GSCJ2' },
	{ deptRankNm: 'J1', deptRankCode: 'GSCJ1' },
	{ deptRankNm: 'S3', deptRankCode: 'GSCS3' },
	{ deptRankNm: 'S2', deptRankCode: 'GSCS2' },
	{ deptRankNm: 'S1', deptRankCode: 'GSCS1' },
];

export const RESEARCH_NAME_GRADES: DeptRankItem[] = [
	{ deptRankNm: '수석연구원4', deptRankCode: 'GRESU4' },
	{ deptRankNm: '수석연구원3', deptRankCode: 'GRESU3' },
	{ deptRankNm: '수석연구원2', deptRankCode: 'GRESU2' },
	{ deptRankNm: '수석연구원1', deptRankCode: 'GRESU1' },
	{ deptRankNm: '책임연구원3', deptRankCode: 'GRECH3' },
	{ deptRankNm: '책임연구원2', deptRankCode: 'GRECH2' },
	{ deptRankNm: '책임연구원1', deptRankCode: 'GRECH1' },
	{ deptRankNm: '선임연구원5', deptRankCode: 'GRESE5' },
	{ deptRankNm: '선임연구원4', deptRankCode: 'GRESE4' },
	{ deptRankNm: '선임연구원3', deptRankCode: 'GRESE3' },
	{ deptRankNm: '선임연구원2', deptRankCode: 'GRESE2' },
	{ deptRankNm: '선임연구원1', deptRankCode: 'GRESE1' },
	{ deptRankNm: '전임연구원4', deptRankCode: 'GREJE4' },
	{ deptRankNm: '전임연구원3', deptRankCode: 'GREJE3' },
	{ deptRankNm: '전임연구원2', deptRankCode: 'GREJE2' },
	{ deptRankNm: '전임연구원1', deptRankCode: 'GREJE1' },
	{ deptRankNm: '주임연구원3', deptRankCode: 'GREJU3' },
	{ deptRankNm: '주임연구원2', deptRankCode: 'GREJU2' },
	{ deptRankNm: '주임연구원1', deptRankCode: 'GREJU1' },
	{ deptRankNm: '연구원3', deptRankCode: 'GREYE3' },
	{ deptRankNm: '연구원2', deptRankCode: 'GREYE2' },
	{ deptRankNm: '연구원1', deptRankCode: 'GREYE1' },
];

export const RESEARCH_CODE_GRADES: DeptRankItem[] = [
	{ deptRankNm: 'SU4', deptRankCode: 'GRCSU4' },
	{ deptRankNm: 'SU3', deptRankCode: 'GRCSU3' },
	{ deptRankNm: 'SU2', deptRankCode: 'GRCSU2' },
	{ deptRankNm: 'SU1', deptRankCode: 'GRCSU1' },
	{ deptRankNm: 'CH3', deptRankCode: 'GRCCH3' },
	{ deptRankNm: 'CH2', deptRankCode: 'GRCCH2' },
	{ deptRankNm: 'CH1', deptRankCode: 'GRCCH1' },
	{ deptRankNm: 'SE5', deptRankCode: 'GRCSE5' },
	{ deptRankNm: 'SE4', deptRankCode: 'GRCSE4' },
	{ deptRankNm: 'SE3', deptRankCode: 'GRCSE3' },
	{ deptRankNm: 'SE2', deptRankCode: 'GRCSE2' },
	{ deptRankNm: 'SE1', deptRankCode: 'GRCSE1' },
	{ deptRankNm: 'JE4', deptRankCode: 'GRCJE4' },
	{ deptRankNm: 'JE3', deptRankCode: 'GRCJE3' },
	{ deptRankNm: 'JE2', deptRankCode: 'GRCJE2' },
	{ deptRankNm: 'JE1', deptRankCode: 'GRCJE1' },
	{ deptRankNm: 'JU3', deptRankCode: 'GRCJU3' },
	{ deptRankNm: 'JU2', deptRankCode: 'GRCJU2' },
	{ deptRankNm: 'JU1', deptRankCode: 'GRCJU1' },
	{ deptRankNm: 'YE3', deptRankCode: 'GRCYE3' },
	{ deptRankNm: 'YE2', deptRankCode: 'GRCYE2' },
	{ deptRankNm: 'YE1', deptRankCode: 'GRCYE1' },
];

interface SubType {
	label: string;
	list: DeptRankItem[];
}

export const RANK_TEMPLATES: Record<
	RankCategory,
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
} as const;
