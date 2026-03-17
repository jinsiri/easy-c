import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import CommonTreeview from '@/app/_component/Tree';
import { useDeptTreeStore } from '@/store/useDeptTreeStore';
import { DeptResponseDto } from '@/type/dept';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { deptService } from '@/app/services/deptService';
import { useDialogStore } from '@/store/useDialogStore';
import { mapDeptToTree } from '@/app/admin/dept/_utils/deptUtil';

interface BatchReassignDialogProps {
	prevDeptId: number;
	checkedIds: number[];
	onClose: () => void;
	reloadList: () => void;
}

export default function BatchReassignDeptDialog({ prevDeptId, checkedIds, onClose, reloadList }: BatchReassignDialogProps) {
	const { alert, success } = useDialogStore();
	const { expandedIds, setExpandedIds } = useDeptTreeStore();
	const [loading, setLoading] = useState(false);
	const [deptList, setDeptList] = useState<DeptResponseDto[]>([]);
	const [selectedId, setSelectedId] = useState<string>('');

	const fetchDepts = useCallback(async () => {
		const res = await deptService.getDeptTree();
		setDeptList(res || []);
	}, []);

	useEffect(() => {
		fetchDepts();
	}, [fetchDepts]);

	const handleNodeClick = useCallback((node: DeptResponseDto) => {
		setSelectedId(String(node.deptId));
	}, []);

	const handleSave = async () => {
		if (selectedId === '') {
			await alert('이동할 부서를 선택해주세요.');
			return;
		}

		setLoading(true);
		try {
			const payload = {
				memberIds: checkedIds,
				prevDeptId: prevDeptId,
				targetDeptId: selectedId,
			};

			await deptService.reassignDept(payload);
			await success('이동되었습니다.');
			reloadList();
			onClose();
		} catch (e: any) {
			await alert('부서 이동에 실패했습니다.');
		} finally {
			setLoading(false);
		}
	};

	const disabledIds = useMemo(() => [String(prevDeptId)], [prevDeptId]);

	return (
		<BaseDialog title='부서 이동' confirmLabel='확인' loading={loading} onConfirm={handleSave} onClose={onClose} maxWidth='sm' fullWidth={true}>
			<CommonTreeview
				rawData={deptList || []}
				mapEntityToTree={mapDeptToTree}
				expandedIds={expandedIds}
				onExpandedItemsChange={setExpandedIds}
				selectedId={selectedId}
				disabledIds={disabledIds}
				onNodeClick={handleNodeClick}
			/>
		</BaseDialog>
	);
}
