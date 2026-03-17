import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import { MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import {
	DeptMemberMapRequestDto,
	deptService,
	MemberJobGradeMapRequestDto,
	MemberJobPositionMapRequestDto,
	MemberJobRoleMapRequestDto,
} from '@/app/services/deptService';
import { RoleCategory } from '@/constant/deptConst';
import { SelectChangeEvent } from '@mui/material/Select';
import { useDialogStore } from '@/store/useDialogStore';

interface BatchJobUpdateDialogProps {
	category: RoleCategory;
	checkedIds: number[];
	onClose: () => void;
	reloadList: () => void;
}

const CATEGORY_CONFIG = {
	POSITION: {
		api: deptService.getJobPositions,
		saveApi: (dto: MemberJobPositionMapRequestDto) => deptService.changeJobPositionBulk(dto),
		idKey: 'jobPositionId',
		nameKey: 'jobPositionNm',
		domain: 'jobPosition',
		korName: '직위',
	},
	TITLE: {
		api: deptService.getJobTitles,
		saveApi: (dto: DeptMemberMapRequestDto) => deptService.changeJobTitleBulk(dto),
		idKey: 'jobTitleId',
		nameKey: 'jobTitleNm',
		domain: 'jobTitle',
		korName: '직책',
	},
	GRADE: {
		api: deptService.getJobGrades,
		saveApi: (dto: MemberJobGradeMapRequestDto) => deptService.changeJobGradeBulk(dto),
		idKey: 'jobGradeId',
		nameKey: 'jobGradeNm',
		domain: 'jobGrade',
		korName: '직급',
	},
	ROLE: {
		api: deptService.getJobRoles,
		saveApi: (dto: MemberJobRoleMapRequestDto) => deptService.changeJobRoleBulk(dto),
		idKey: 'jobRoleId',
		nameKey: 'jobRoleNm',
		typeKey: 'jobRoleType',
		categoryKey: 'jobRoleCategory',
		orderKey: 'jobRoleOrder',
		domain: 'jobRole',
		korName: '직무',
	},
} as const;

export default function BatchJobUpdateDialog({ category, checkedIds, onClose, reloadList }: BatchJobUpdateDialogProps) {
	const { alert, success } = useDialogStore();
	const idKey = CATEGORY_CONFIG[category].idKey;
	const nameKey = CATEGORY_CONFIG[category].nameKey;
	const korName = CATEGORY_CONFIG[category].korName;
	const [jobList, setJobList] = useState<any[]>([]);
	const [selectedId, setSelectedId] = useState<string>('');

	const fecthJobData = async () => {
		let res = await CATEGORY_CONFIG[category].api();
		if (res) setJobList(res);
	};

	useEffect(() => {
		fecthJobData();
	}, []);

	const handleChange = (e: SelectChangeEvent) => {
		setSelectedId(e.target.value);
	};

	const onSubmit = async () => {
		if (selectedId === '') {
			await alert(`변경할 ${korName}을(를) 선택해주세요.`);
			return;
		}

		const payload = {
			memberIds: checkedIds,
			[idKey]: selectedId,
		};

		await CATEGORY_CONFIG[category].saveApi(payload);
		await success('변경되었습니다.');

		reloadList();
		onClose();
	};

	return (
		<BaseDialog title={`${korName} 일괄 변경`} onClose={onClose} onConfirm={onSubmit}>
			<Select displayEmpty fullWidth value={selectedId} onChange={handleChange}>
				<MenuItem value=''>
					<em style={{ color: '#aaa' }}>미선택</em>
				</MenuItem>
				{jobList?.map((opt) => (
					<MenuItem key={'job_' + opt[idKey]} value={opt[idKey]}>
						{opt[nameKey]}
					</MenuItem>
				))}
			</Select>
		</BaseDialog>
	);
}
