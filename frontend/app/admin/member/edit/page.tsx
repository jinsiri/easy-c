'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Typography } from '@mui/material';
import { memberService } from '@/app/services/memberService';
import { useDialogStore } from '@/store/useDialogStore';
import { CAREER_COLS, REWARD_COLS, QUALIFICATION_COLS, LANGUAGE_COLS, MemberColDef } from '@/app/admin/member/_constant/formConst';
import MemberFormContainer, { MemberFormValues, MemberUpdateFormValues } from '@/app/admin/member/_component/MemberFormContainer';
import Loader from '@/app/_component/baseElement/Loader';

// API 응답 값에서 폼 state 용 string 추출 (EnumOption: { code, label })
const toFormValue = (value: any): string => {
	if (value === null || value === undefined) return '';
	if (typeof value === 'object' && 'code' in value) return String(value.code);
	if (typeof value === 'boolean') return value ? 'true' : '';
	return String(value);
};

// 리스트 응답 행을 폼 행으로 변환 (EnumOption → value string)
const toFormRow = (item: Record<string, any>, cols: MemberColDef[]): Record<string, string> => ({
	_rowId: Math.random().toString(36).slice(2),
	...cols.reduce(
		(acc, col) => ({
			...acc,
			[col.key]: toFormValue(item[col.key]),
		}),
		{},
	),
});

export default function MemberEditPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { alert, success } = useDialogStore();

	const memberId = Number(searchParams.get('memberId'));

	const [loading, setLoading] = useState(true);
	const [initialData, setInitialData] = useState<MemberUpdateFormValues | null>(null);

	useEffect(() => {
		if (!memberId) {
			alert('잘못된 접근입니다.');
			router.back();
			return;
		}

		const fetchData = async () => {
			try {
				setLoading(true);
				const [memberRes, careerRes, rewardRes, qualRes, langRes] = await Promise.all([
					memberService.getMember(memberId),
					memberService.getMemberCareerInfo(memberId),
					memberService.getMemberRewardDisciplineInfo(memberId),
					memberService.getMemberQualificationInfo(memberId),
					memberService.getMemberLanguageInfo(memberId),
				]);

				const m = memberRes as Record<string, any>;
				setInitialData({
					loginId: toFormValue(m.loginId),
					memberNm: toFormValue(m.memberNm),
					employeeId: toFormValue(m.employeeId),
					extensionNumber: toFormValue(m.extensionNumber),
					departmentPosition: toFormValue(m.departmentPosition),
					jobPosition: m.jobPosition?.jobPositionId ?? '',
					jobGrade: m.jobGrade?.jobGradeId ?? '',
					jobRole: m.jobRole?.jobRoleId ?? '',
					email: toFormValue(m.email),
					employmentStatus: toFormValue(m.employmentStatus) || 'ACTIVE',
					employmentType: toFormValue(m.employmentType),
					recruitmentType: toFormValue(m.recruitmentType),
					salaryType: toFormValue(m.salaryType),
					referredBy: toFormValue(m.referredBy),
					hireDate: toFormValue(m.hireDate),
					resignationDate: toFormValue(m.resignationDate),
					memberNmEn: toFormValue(m.memberNmEn),
					phoneNumber: toFormValue(m.phoneNumber),
					externalEmail: toFormValue(m.externalEmail),
					gender: toFormValue(m.gender),
					nationality: toFormValue(m.nationality) || 'KR',
					dateOfBirth: toFormValue(m.dateOfBirth),
					address: toFormValue(m.address),
					faxNumber: toFormValue(m.faxNumber),
					veteranNumber: toFormValue(m.veteranNumber),
					veteranType: toFormValue(m.veteranType) || 'NONE',
					veteranFamily: toFormValue(m.veteranFamily),
					disabilityRegistrationNumber: toFormValue(m.disabilityRegistrationNumber),
					disabilityType: toFormValue(m.disabilityType) || 'NONE',
					disabilityRecognition: toFormValue(m.disabilityRecognition) || 'NONE',
					disabilityGrade: toFormValue(m.disabilityGrade),
					bankName: toFormValue(m.bankName),
					accountHolderName: toFormValue(m.accountHolderName),
					accountNumber: toFormValue(m.accountNumber),

					// 리스트 데이터 변환
					careerList: (careerRes as any[]).map((item) => toFormRow(item, CAREER_COLS)),
					rewardDisciplineList: (rewardRes as any[]).map((item) => toFormRow(item, REWARD_COLS)),
					qualificationList: (qualRes as any[]).map((item) => toFormRow(item, QUALIFICATION_COLS)),
					languageList: (langRes as any[]).map((item) => toFormRow(item, LANGUAGE_COLS)),
				} as MemberUpdateFormValues);
			} catch (error) {
				console.error(error);
				alert('데이터를 불러오는 중 오류가 발생했습니다.');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [memberId, alert, router]);

	const handleUpdate = async (data: MemberFormValues) => {
		try {
			const strip = (row: any) => {
				const { _rowId, ...rest } = row;
				return rest;
			};

			const payload = {
				...data,
				jobPositionId: data.jobPosition,
				jobGradeId: data.jobGrade,
				jobRoleId: data.jobRole,
				careerList: data.careerList.map(strip),
				rewardDisciplineList: data.rewardDisciplineList.map(strip),
				qualificationList: data.qualificationList.map(strip),
				languageList: data.languageList.map(strip),
			};

			await memberService.updateMember(memberId, payload);
			await success('수정되었습니다.');
			router.push('/admin/dept/member');
		} catch (e) {
			await alert('수정 중 오류가 발생했습니다.');
		}
	};

	if (loading) {
		return <Loader />;
	}

	if (!initialData) return <Typography>데이터를 찾을 수 없습니다.</Typography>;

	return <MemberFormContainer isEdit={true} initialData={initialData} memberId={memberId} onSubmit={handleUpdate} />;
}
