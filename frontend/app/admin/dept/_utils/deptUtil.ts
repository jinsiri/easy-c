import { TreeData } from '@/app/_component/Tree';
import { DeptResponseDto } from '@/type/dept';

// ===== 부서 필드 공통 트리 컴포넌트 세팅 =====
export const mapDeptToTree = (dept: DeptResponseDto) => ({
	...dept,
	id: dept.deptId,
	label: dept.deptNm,
});

export const mapOrgToTree = (item: any): TreeData<any> => {
	if (item.deptNm && !item.memberNm) {
		return {
			...item,
			id: `dept-${item.deptId}`,
			label: item.deptNm,
			treeParentId: item.treeParentId ? `dept-${item.treeParentId}` : null,
			treeSiblingOrder: (item.treeSiblingOrder || 0) + 1000,
			dataType: 'dept',
			treeChildCount: 0,
		};
	}

	return {
		...item,
		id: `dept-${item.deptId}-mem-${item.memberId}`,
		label: `${item.memberNm} ${item.jobPositionNm || ''}`,
		treeParentId: `dept-${item.deptId}`,
		treeSiblingOrder: item.jobPositionLevel,
		dataType: 'deptMember',
		treeChildCount: 0,
	};
};
