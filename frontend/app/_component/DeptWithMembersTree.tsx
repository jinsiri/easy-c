'use client';

import { deptService } from '@/app/services/deptService';
import CommonTreeview from '@/app/_component/Tree';
import { mapOrgToTree } from '@/app/admin/dept/_utils/deptUtil';
import { useEffect, useState } from 'react';
import { DeptMemberMapResponseDto } from '@/app/services/memberService';
import { DeptResponseDto } from '@/type/dept';
import { useDeptTreeStore } from '@/store/useDeptTreeStore';

export default function DeptWithMembersTree() {
	const { expandedIds, setExpandedIds, selectedId, setSelectedId } = useDeptTreeStore();
	const [deptTree, setDeptTree] = useState<DeptResponseDto[] | DeptMemberMapResponseDto[]>([]);
	const fetchDeptTree = async () => {
		const res = await deptService.getDeptTree(true);
		setDeptTree(res);
	};

	useEffect(() => {
		fetchDeptTree();
	}, []);

	return (
		<CommonTreeview
			rawData={deptTree || []}
			mapEntityToTree={mapOrgToTree}
			expandedIds={expandedIds}
			onExpandedItemsChange={(ids) => setExpandedIds(ids)}
			selectedId={selectedId ? `dept-${selectedId}` : undefined}
			placeholder='부서명/부서원/직위를 검색하세요.'
			onNodeClick={(node) => {
				setSelectedId(node.deptId);
			}}
		/>
	);
}
