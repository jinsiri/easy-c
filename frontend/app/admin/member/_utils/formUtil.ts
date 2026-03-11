import { MEMBER_FORM_CONFIG, MemberColDef, MemberFieldDef } from '@/app/admin/member/_constant/formConst';
import { ColDef } from 'ag-grid-community';

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
		jobRole: (memberBundle?.jobRoleList ?? []).map((id: any) => ({
			value: id.jobRoleId,
			label: `${id.jobRoleCategory}-${id.jobRoleType}-${id.jobRoleNm}`,
		})),
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

// ===== 공통 컬럼 정의를 그리드용 컬럼 정의로 변환하는 유틸 함수 =====
export const transformToColDefs = (cols: MemberColDef[]): ColDef<Record<string, any>>[] => {
	return cols.map((item) => ({
		field: item.key,
		headerName: item.label,
		editable: false,
	}));
};

// ===== 화면 표시용 value 가공 =====
export const getDisplayValue = (key: string, value: any): string => {
	switch (key) {
		case 'jobPosition':
			return value?.jobPositionNm ?? '-';
		case 'jobGrade':
			return value?.jobGradeNm ?? '-';
		case 'jobRole':
			const fields = [value?.jobRoleCategory, value?.jobRoleType, value?.jobRoleNm];

			return fields.filter(Boolean).join('-') || '-';
		default:
	}

	if (value === null || value === undefined) return '-';
	if (typeof value === 'boolean') return value ? 'Y' : 'N';
	if (typeof value === 'object' && 'label' in value) return value.label || '-';

	return String(value) || '-';
};

// ===== API 응답 데이터를 그리드용으로 변환 (EnumOption -> label 문자열) =====
export const transformGridData = (data: any[]): Record<string, any>[] => {
	if (!data || !Array.isArray(data)) return [];
	return data.map((item) => {
		const transformed: Record<string, any> = {};
		Object.entries(item).forEach(([key, value]) => {
			if (value && typeof value === 'object' && 'label' in value) {
				transformed[key] = value.label || '-';
			} else if (value === null || value === undefined) {
				transformed[key] = '-';
			} else {
				transformed[key] = value;
			}
		});
		return transformed;
	});
};
