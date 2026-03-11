import { useDialogStore } from '@/store/useDialogStore';
import { useState } from 'react';
import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import CommonTreeview from '@/app/_component/Tree';
import { DeptResponseDto } from '@/type/dept';
import { useDeptTreeStore } from '@/store/useDeptTreeStore';
import { Grid, MenuItem, Select, Typography } from '@mui/material';

interface Props {
	value: string;
	onClose: () => void;
	memberId: number;
	deptList: any[];
	jobTitleList: any[];
}

const mapDeptToTree = (dept: DeptResponseDto) => ({
	...dept,
	id: dept.deptId,
	label: dept.deptNm,
});

export default function DeptJobTitleChangeDialog({ value, onClose, memberId, deptList, jobTitleList }: Props) {
	const { alert, success } = useDialogStore();
	const { expandedIds, setExpandedIds, selectedId, setSelectedId, _hasHydrated } = useDeptTreeStore();
	const [loading, setLoading] = useState(false);

	const handleChange = () => {};

	const handleSave = async () => {
		try {
			setLoading(true);
			// todo: 부서-직책 매핑데이터 업데이트
			// await memberService.updatePassword(memberId, password);
			// await success('비밀번호가 변경되었습니다.');
			console.log(memberId);
			onClose();
		} catch (e: any) {
			await alert(e?.message ?? '부서/직책 설정에 실패했습니다.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<BaseDialog title='부서/직책 설정' confirmLabel={loading ? '변경 중...' : '변경'} onConfirm={handleSave} onClose={onClose} maxWidth='xs' fullWidth>
			<Grid container spacing={4} direction='column'>
				<Grid>
					<Typography variant={'h6'} sx={{ mb: 2 }}>
						부서 선택
					</Typography>
					<CommonTreeview
						rawData={deptList || []}
						mapEntityToTree={mapDeptToTree}
						expandedIds={expandedIds}
						onExpandedItemsChange={(ids) => setExpandedIds(ids)}
						selectedId={String(selectedId)}
						placeholder='부서명을 검색하세요.'
						onNodeClick={(node) => {
							setSelectedId(node.deptId);
						}}
					/>
				</Grid>
				<Grid>
					<Typography variant={'h6'} sx={{ mb: 2 }}>
						직책 선택
					</Typography>
					<Select displayEmpty value={value ?? ''} sx={{ minWidth: '200px' }} onChange={handleChange}>
						<MenuItem value=''>
							<em style={{ color: '#aaa' }}>미선택</em>
						</MenuItem>
						{jobTitleList?.map((opt: any) => (
							<MenuItem key={opt.jobTitleId} value={opt.jobTitleId}>
								{opt.jobTitleNm}
							</MenuItem>
						))}
					</Select>
				</Grid>
			</Grid>
		</BaseDialog>
	);
}
