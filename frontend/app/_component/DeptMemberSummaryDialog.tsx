import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import { Box } from '@mui/material';
import { memberService } from '@/app/services/memberService';
import { useEffect, useState } from 'react';

interface Props {
	dataType: string;
	selectionData: { [key: string]: any };
	onClose: () => void;
}

export default function DeptMemberSummaryDialog({ dataType, selectionData, onClose }: Props) {
	const [deptMembers, setDeptMembers] = useState([]);
	const fetchMembersMappedToDeptId = async (deptId: number) => {
		if (!selectionData.deptId) {
			return;
		}

		const res = await memberService.getMembersMappedToDeptId(deptId);
		setDeptMembers(res || []);
	};

	useEffect(() => {
		if (selectionData?.deptId) {
			fetchMembersMappedToDeptId(selectionData.deptId);
		}
	}, [selectionData?.deptId]);

	const manager = deptMembers?.find((m: any) => m.deptRole === 'MANAGER');
	const selectedMember = deptMembers?.find((m: any) => m.memberId === selectionData.memberId);

	return (
		<BaseDialog
			title={
				dataType === 'dept'
					? selectionData.deptNm
					: selectionData.jobPositionNm
						? `${selectionData.memberNm} ${selectionData.jobPositionNm}`
						: selectionData.memberNm
			}
			onClose={onClose}
			fullWidth={true}
			maxWidth={'xs'}
		>
			<Box
				sx={{
					'& li': {
						mb: 1,
						fontSize: '1rem',
						'> strong': {
							display: 'inline-block',
							width: '100px',
						},
					},
				}}
			>
				{dataType === 'dept' ? (
					<ul>
						<li>
							<strong>부서장</strong>
							{manager ? manager['memberNm'] : '미지정'}
						</li>
						<li>
							<strong>부서 메일</strong>
							{selectionData.deptEmail ?? '-'}
						</li>
					</ul>
				) : (
					<ul>
						<li>
							<strong>부서</strong>
							{selectedMember?.['deptNm'] ?? '-'}
						</li>
						<li>
							<strong>이메일</strong>
							{selectedMember?.['email'] ?? '-'}
						</li>
					</ul>
				)}
			</Box>
		</BaseDialog>
	);
}
