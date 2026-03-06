import { MEMBER_FORM_CONFIG, MemberColDef, MemberFieldDef } from '@/app/admin/member/_constant/formConst';

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

// ===== create, edit 섹션 설정 가공 함수 ===
export const getMemberFormSections = (mode: 'create' | 'edit') => {
	return MEMBER_FORM_CONFIG.map((section) => ({
		...section,
		fields: section.fields
			.filter((field) => {
				// 수정 모드 비밀번호 관련 필드 제외
				if (mode === 'edit' && ['password', 'passwordCheck'].includes(field.key)) {
					return false;
				}
				return true;
			})
			.map((field) => {
				// 수정 모드일 때 loginId는 읽기 전용 변경
				if (mode === 'edit' && field.key === 'loginId') {
					return { ...field, readOnly: true };
				}
				return field;
			}),
	}));
};
