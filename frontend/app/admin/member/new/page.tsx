'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { memberService } from '@/app/services/memberService';
import { useDialogStore } from '@/store/useDialogStore';
import MemberFormContainer, { MemberCreateFormValues, MemberFormValues } from '@/app/admin/member/_component/MemberFormContainer';
import Loader from '@/app/_component/baseElement/Loader';

export default function MemberNewPage() {
	const router = useRouter();
	const { alert, success } = useDialogStore();
	const [loading, setLoading] = useState(false);
	const defaultValues: Partial<MemberCreateFormValues> = {
		loginId: '',
		memberNm: '',
		employeeId: '',
		extensionNumber: '',
		jobPosition: '' as any,
		jobGrade: '' as any,
		jobTitle: '' as any,
		jobRole: '' as any,
		email: '',
		hireDate: '',
		employmentStatus: 'ACTIVE',
		employmentType: '',
		recruitmentType: '',
		salaryType: '',
		referredBy: '',
		memberNmEn: '',
		phoneNumber: '',
		externalEmail: '',
		gender: '',
		nationality: 'KR',
		dateOfBirth: '',
		address: '',
		faxNumber: '',
		veteranType: 'NONE',
		disabilityType: 'NONE',
		disabilityRecognition: 'NONE',
		deptMemberMapList: [],
		careerList: [],
		rewardDisciplineList: [],
		qualificationList: [],
		languageList: [],
	};

	const handleCreate = async (data: MemberFormValues) => {
		try {
			setLoading(true);

			const strip = (row: any) => {
				const { _rowId, ...rest } = row;
				return rest;
			};

			const payload = {
				...data,
				jobPositionId: data.jobPosition,
				jobGradeId: data.jobGrade,
				jobRoleId: data.jobRole,
				deptMemberMapList: data.deptMemberMapList?.map(strip) || [],
				careerList: data.careerList?.map(strip) || [],
				rewardDisciplineList: data.rewardDisciplineList?.map(strip) || [],
				qualificationList: data.qualificationList?.map(strip) || [],
				languageList: data.languageList?.map(strip) || [],
			};

			await memberService.createMember(payload);
			await success('등록되었습니다.');
			router.push('/admin/dept/member');
		} catch (e: any) {
			console.error(e);
			await alert(e?.response?.data?.message || '등록 중 오류가 발생했습니다.');
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <Loader />;
	}

	return <MemberFormContainer isEdit={false} initialData={defaultValues} onSubmit={handleCreate} />;
}
