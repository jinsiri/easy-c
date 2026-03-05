import { MemberColDef, MemberFieldDef } from '@/app/admin/member/_constant/formConst';

export const makeEmptyRow = (cols: MemberColDef[]): Record<string, string> => ({
	_rowId: Math.random().toString(36).slice(2),
	...cols.reduce((acc, c) => ({ ...acc, [c.key]: '' }), {}),
});

// ===== 셀렉트 옵션 정리 =====
export const getOptions = (field: MemberFieldDef, memberBundle: any) => {
	if (field.options) return field.options.map((opt) => ({ value: opt.value, label: opt.label }));

	const strategy: Record<string, any[]> = {
		jobPosition: (memberBundle?.jobPositionList ?? []).map((id: any) => ({ value: id.jobPositionId, label: id.jobPositionNm })),
		jobGrade: (memberBundle?.jobGradeList ?? []).map((id: any) => ({ value: id.jobGradeId, label: id.jobGradeNm })),
	};

	return strategy[field.key] || [];
};
