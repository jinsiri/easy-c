import { useDialogStore } from '@/store/useDialogStore';
import { useState } from 'react';
import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import CommonTreeview from '@/app/_component/Tree';
import { DeptResponseDto } from '@/type/dept';
import { useDeptTreeStore } from '@/store/useDeptTreeStore';
import { Grid, MenuItem, Select, Typography } from '@mui/material';
import { SelectChangeEvent } from '@/node_modules/@mui/material/Select/SelectInput';

interface Props {
	value: string;
	onClose: () => void;
	deptList: any[];
	jobTitleList: any[];
}

const mapDeptToTree = (dept: DeptResponseDto) => ({
	...dept,
	id: dept.deptId,
	label: dept.deptNm,
});

export default function DeptJobTitleChangeDialog({ value, onClose, deptList, jobTitleList }: Props) {
	const { alert, success } = useDialogStore();
	const { expandedIds, setExpandedIds } = useDeptTreeStore();
	const [loading, setLoading] = useState(false);
	const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);
	const [selectedJobTitleId, setSelectedJobTitleId] = useState<string>('');

	const handleChange = (e: SelectChangeEvent) => {
		setSelectedJobTitleId(e.target.value);
	};

	const handleSave = async () => {
		// todo: 부서-직책 매핑데이터 업데이트
		/**
		 * validate(현재 화면 기준)
		 * 전체 데이터와 비교해서 중복인지 체크(부서의 중복만 체크하면 됨)
		 *
		 * store
		 * 매핑 데이터리스트 통째로 서버로 보내서 거기서 유효성 체크
		 * */
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
						selectedId={String(selectedDeptId)}
						placeholder='부서명을 검색하세요.'
						onNodeClick={(node) => {
							setSelectedDeptId(node.deptId);
						}}
					/>
				</Grid>
				<Grid>
					<Typography variant={'h6'} sx={{ mb: 2 }}>
						직책 선택
					</Typography>
					<Select displayEmpty value={selectedJobTitleId ?? ''} sx={{ minWidth: '200px' }} onChange={handleChange}>
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
