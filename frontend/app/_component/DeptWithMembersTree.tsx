'use client';

import { deptService } from '@/app/services/deptService';
import CommonTreeview from '@/app/_component/Tree';
import { mapOrgToTree } from '@/app/admin/dept/_utils/deptUtil';
import { useEffect, useState } from 'react';
import { DeptMemberMapResponseDto } from '@/app/services/memberService';
import { DeptResponseDto } from '@/type/dept';
import { useDeptTreeStore } from '@/store/useDeptTreeStore';
import DeptMemberSummaryDialog from '@/app/_component/DeptMemberSummaryDialog';

export default function DeptWithMembersTree() {
	const { expandedIds, setExpandedIds } = useDeptTreeStore();
	const [openMemberView, setOpenMemberView] = useState(false);
	const [selection, setSelection] = useState({
		dataType: 'dept',
		selectedId: null,
	});
	const [deptTree, setDeptTree] = useState<DeptResponseDto[] | DeptMemberMapResponseDto[]>([]);
	const fetchDeptTree = async () => {
		const res = await deptService.getDeptTree(true);
		setDeptTree(res);
	};

	useEffect(() => {
		fetchDeptTree();
	}, []);

	return (
		<>
			{openMemberView && (
				<DeptMemberSummaryDialog dataType={selection.dataType} selectionData={{ ...selection }} onClose={() => setOpenMemberView(false)} />
			)}
			<CommonTreeview
				rawData={deptTree || []}
				mapEntityToTree={mapOrgToTree}
				expandedIds={expandedIds}
				onExpandedItemsChange={(ids) => setExpandedIds(ids)}
				selectedId={selection.dataType === 'dept' && selection.selectedId ? `dept-${selection.selectedId}` : undefined}
				placeholder='부서명/부서원/직위를 검색하세요.'
				onNodeClick={(node) => {
					setOpenMemberView(true);
					setSelection({
						dataType: node.dataType,
						selectedId: node.dataType === 'dept' ? node.deptId : node.memberId,
						...node,
					});
				}}
			/>
		</>
	);
}
