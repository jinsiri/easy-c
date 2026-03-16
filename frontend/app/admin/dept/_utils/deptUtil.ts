import { DeptResponseDto } from '@/type/dept';

// ===== 부서 필드 공통 트리 컴포넌트 세팅 =====
export const mapDeptToTree = (dept: DeptResponseDto) => ({
	...dept,
	id: dept.deptId,
	label: dept.deptNm,
});
