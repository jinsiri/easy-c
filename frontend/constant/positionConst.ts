export interface PositionItem {
	positionNm: string;
	positionCode: string;
}

export const OFFICE_POSITIONS: PositionItem[] = [
	{ positionNm: '회장', positionCode: 'P010010' },
	{ positionNm: '부회장', positionCode: 'P010020' },
	{ positionNm: '대표이사', positionCode: 'P010030' },
	{ positionNm: '사장', positionCode: 'P010040' },
	{ positionNm: '부사장', positionCode: 'P010050' },
	{ positionNm: '전무', positionCode: 'P010060' },
	{ positionNm: '상무', positionCode: 'P010070' },
	{ positionNm: '이사', positionCode: 'P010080' },
	{ positionNm: '부장', positionCode: 'P010090' },
	{ positionNm: '차장', positionCode: 'P010100' },
	{ positionNm: '과장', positionCode: 'P010110' },
	{ positionNm: '계장', positionCode: 'P010120' },
	{ positionNm: '대리', positionCode: 'P010130' },
	{ positionNm: '주임', positionCode: 'P010140' },
	{ positionNm: '사원', positionCode: 'P010150' },
	{ positionNm: '감사', positionCode: 'P010160' },
	{ positionNm: '고문', positionCode: 'P010170' },
	{ positionNm: '인턴', positionCode: 'P010180' },
	{ positionNm: '파트/알바', positionCode: 'P010190' },
	{ positionNm: '업무위탁사원', positionCode: 'P010200' },
	{ positionNm: '상임고문', positionCode: 'P010210' },
	{ positionNm: '전문위원', positionCode: 'P010220' },
];

export const RESEARCH_POSITIONS: PositionItem[] = [
	{ positionNm: '수석연구원', positionCode: 'P020010' },
	{ positionNm: '책임연구원', positionCode: 'P020020' },
	{ positionNm: '선임연구원', positionCode: 'P020030' },
	{ positionNm: '전임연구원', positionCode: 'P020040' },
	{ positionNm: '주임연구원', positionCode: 'P020050' },
	{ positionNm: '연구원', positionCode: 'P020060' },
];

export const PRODUCTION_POSITIONS: PositionItem[] = [
	{ positionNm: '기원', positionCode: 'P030010' },
	{ positionNm: '기술사원', positionCode: 'P030020' },
	{ positionNm: '기술기사보', positionCode: 'P030030' },
	{ positionNm: '기술기사', positionCode: 'P030040' },
	{ positionNm: '기술주임', positionCode: 'P030050' },
	{ positionNm: '기술선임', positionCode: 'P030060' },
	{ positionNm: '직장', positionCode: 'P030070' },
	{ positionNm: '반장', positionCode: 'P030080' },
	{ positionNm: '조장', positionCode: 'P030090' },
	{ positionNm: '사원(제)', positionCode: 'P030100' },
];

export const ALL_POSITIONS = {
	OFFICE: { label: '사무직', list: OFFICE_POSITIONS },
	RESEARCH: { label: '연구직', list: RESEARCH_POSITIONS },
	PRODUCTION: { label: '생산직', list: PRODUCTION_POSITIONS },
} as const;

export type JobFieldType = keyof typeof ALL_POSITIONS;
