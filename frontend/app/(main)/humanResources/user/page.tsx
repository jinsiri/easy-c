'use client';
import {useEffect, useMemo, useState} from 'react';

/** MUI */
import {Box, Grid, List, ListItem, OutlinedInput, Typography, useTheme} from '@mui/material';

/** Ag Grid */
import {ColDef} from 'ag-grid-community';

/** Custom */
import PathBreadcrumbs from '../../../_component/PathBreadcrumbs';
import CommonTabs from '@/app/_component/CommonTabs';
import {memberService} from "@/app/services/memberService";

const getDisplayValue = (value: any): string => {
	if (value === null || value === undefined) return '-';
	if (typeof value === 'boolean') return value ? 'Y' : 'N';
	if (typeof value === 'object' && 'label' in value) return value.label || '-';
	return String(value) || '-';
};


// ========== 필드 매핑 정의 ==========

// 상단 기본 인사정보 (카드 영역)
const memberInfoFields: { key: string; label: string }[] = [
	{ key: 'memberNm', label: '직원 이름' },
	{ key: 'employeeId', label: '사번' },
	{ key: 'departmentPosition', label: '부서/직책' }, // TODO: 부서/직책 필드 추가 필요
	{ key: 'positionTitle', label: '직위' }, // TODO: 직위 필드 추가 필요
	{ key: 'jobTitle', label: '직무' }, // TODO: 직무 필드 추가 필요
	{ key: 'hireDate', label: '입사일' },
	{ key: 'extensionNumber', label: '대표전화' },
	{ key: 'phoneNumber', label: '휴대전화' },
	{ key: 'email', label: '이메일' },
	{ key: 'externalEmail', label: '외부이메일' },
	{ key: 'employmentStatus', label: '근무상태' },
];

// 기본 정보 탭
const basicInfoFields: { key: string; label: string }[] = [
	{ key: 'departmentPosition', label: '부서/직책' }, // TODO: 부서/직책 필드 추가 필요
	{ key: 'positionTitle', label: '직위' }, // TODO: 직위 필드 추가 필요
	{ key: 'jobTitle', label: '직무' }, // TODO: 직무 필드 추가 필요
	{ key: 'employmentType', label: '직원 구분' },
	{ key: 'recruitmentType', label: '채용 구분' },
	{ key: 'salaryType', label: '급여 구분' },
	{ key: 'referredBy', label: '추천자' },
	{ key: 'hireDate', label: '입사일' },
	{ key: 'resignationDate', label: '퇴사일' },
];

// 신상 정보 탭 - 섹션별 정의
const personalInfoSections = [
	{
		title: '개인 정보',
		fields: [
			{ key: 'memberNmEn', label: '영문 이름' },
			{ key: 'gender', label: '성별' },
			{ key: 'nationality', label: '국적' },
			{ key: 'dateOfBirth', label: '생년월일' },
			{ key: 'address', label: '주소' },
			{ key: 'faxNumber', label: '자택번호' },
		],
	},
	{
		title: '보훈 정보',
		fields: [
			{ key: 'veteranNumber', label: '보훈번호' },
			{ key: 'veteranType', label: '보훈 구분' },
			{ key: 'veteranFamily', label: '보훈 가족' },
		],
	},
	{
		title: '장애 정보',
		fields: [
			{ key: 'disabilityRegistrationNumber', label: '장애 등록번호' },
			{ key: 'disabilityType', label: '장애 구분' },
			{ key: 'disabilityRecognition', label: '장애 인정 구분' },
			{ key: 'disabilityGrade', label: '장애 등급' },
		],
	},
	{
		title: '계좌 정보',
		fields: [
			{ key: 'bankName', label: '은행 이름' },
			{ key: 'accountHolderName', label: '예금주' },
			{ key: 'accountNumber', label: '계좌번호' },
		],
	},
];

// 그리드용 컬럼 정의 (field는 API 필드명, headerName은 한글 라벨)
const careerColDefs: ColDef<Record<string, any>>[] = [
	{ field: 'startDate', headerName: '시작일', editable: false },
	{ field: 'endDate', headerName: '종료일', editable: false },
	{ field: 'companyName', headerName: '근무처', editable: false },
	{ field: 'positionTitle', headerName: '직위', editable: false },
	{ field: 'jobDescription', headerName: '담당업무', editable: false },
	{ field: 'workPeriod', headerName: '근속기간', editable: false },
	{ field: 'resignationReason', headerName: '퇴직사유', editable: false },
];

const rewardColDefs: ColDef<Record<string, any>>[] = [
	{ field: 'type', headerName: '구분', editable: false },
	{ field: 'actionDate', headerName: '일자', editable: false },
	{ field: 'title', headerName: '내용', editable: false },
	{ field: 'reason', headerName: '사유', editable: false },
	{ field: 'remark', headerName: '기타', editable: false },
];

const certificateColDefs: ColDef<Record<string, any>>[] = [
	{ field: 'qualificationType', headerName: '구분', editable: false },
	{ field: 'qualificationName', headerName: '자격명', editable: false },
	{ field: 'qualificationNumber', headerName: '자격번호', editable: false },
	{ field: 'qualificationGrade', headerName: '자격등급', editable: false },
	{ field: 'issuingOrganization', headerName: '기관명', editable: false },
	{ field: 'acquiredDate', headerName: '취득일', editable: false },
	{ field: 'suspendedDate', headerName: '정지일', editable: false },
];

const languageColDefs: ColDef<Record<string, any>>[] = [
	{ field: 'languageType', headerName: '구분', editable: false },
	{ field: 'languageName', headerName: '어학명', editable: false },
	{ field: 'evaluationDate', headerName: '평가일', editable: false },
	{ field: 'evaluationAgency', headerName: '평가기관', editable: false },
	{ field: 'score', headerName: '점수', editable: false },
	{ field: 'grade', headerName: '등급', editable: false },
	{ field: 'etc', headerName: '기타', editable: false },
];

// API 응답 데이터를 그리드용으로 변환 (EnumOption -> label 문자열)
const transformGridData = (data: any[]): Record<string, any>[] => {
	if (!data || !Array.isArray(data)) return [];
	return data.map(item => {
		const transformed: Record<string, any> = {};
		Object.entries(item).forEach(([key, value]) => {
			// EnumOption 객체인 경우 label만 추출
			if (value && typeof value === 'object' && 'label' in value) {
				transformed[key] = value.label || '-';
			} else if (value === null || value === undefined) {
				transformed[key] = '-';
			} else {
				transformed[key] = value;
			}
		});
		return transformed;
	});
};

export default function HumanResourceUserPage() {
	const theme = useTheme();

	const [memberInfo, setMemberInfo] = useState<any>({});
	const [basicInfo, setBasicInfo] = useState<any>({});
	const [personalInfo, setPersonalInfo] = useState<any>({});
	const [careerInfo, setCareerInfo] = useState<any[]>([]);
	const [rewardInfo, setRewardInfo] = useState<any[]>([]);
	const [qualificationInfo, setQualificationInfo] = useState<any[]>([]);
	const [languageInfo, setLanguageInfo] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);



	useEffect(() => {
		const memberId = 1; // todo session에 저장한 유저정보 있으면 활용

		const fetchMemberData = async () => {
			setLoading(true);

			// 각 API를 독립적으로 호출 (하나가 실패해도 나머지는 정상 조회)
			const requests = [
				// 기본 인사정보 조회
				memberService.getMember(memberId)
					.then(res => setMemberInfo(res))
					.catch(err => console.error('기본 인사정보 조회 실패:', err)),

				// 기본정보 탭 조회
				memberService.getMemberBasicInfo(memberId)
					.then(res => setBasicInfo(res))
					.catch(err => console.error('기본정보 조회 실패:', err)),

				// 신상정보 탭 조회
				memberService.getMemberPersonalInfo(memberId)
					.then(res => setPersonalInfo(res))
					.catch(err => console.error('신상정보 조회 실패:', err)),

				// 경력 탭 조회
				memberService.getMemberCareerInfo(memberId)
					.then(res => setCareerInfo(res))
					.catch(err => console.error('경력 조회 실패:', err)),

				// 포상/징계 탭 조회
				memberService.getMemberRewardDisciplineInfo(memberId)
					.then(res => setRewardInfo(res))
					.catch(err => console.error('포상/징계 조회 실패:', err)),

				// 자격 탭 조회
				memberService.getMemberQualificationInfo(memberId)
					.then(res => setQualificationInfo(res))
					.catch(err => console.error('자격 조회 실패:', err)),

				// 어학 탭 조회
				memberService.getMemberLanguageInfo(memberId)
					.then(res => setLanguageInfo(res))
					.catch(err => console.error('어학 조회 실패:', err)),
			];

			await Promise.all(requests);
			setLoading(false);
		};

		fetchMemberData();
	}, []);


	const tabInfoContents = useMemo(() => {
		return (
			<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
				{basicInfoFields.map(({ key, label }) => {
					const value = basicInfo[key];
					const displayValue = getDisplayValue(value);

					return (
						<Box
							key={key}
							sx={{
								display: 'flex',
								alignItems: 'center',
								flexBasis: '33.33%',
								padding: '0.5rem 1rem',
								minWidth: '16rem',
								whiteSpace: 'nowrap',
							}}
						>
							<Box sx={{ width: '8rem' }}>{label}</Box>
							<OutlinedInput size='small' value={displayValue} readOnly></OutlinedInput>
						</Box>
					);
				})}
			</Box>
		);
	}, [basicInfo]);

	const tabPersonalContents = useMemo(() => {
		// memberInfo에서 영문 이름 가져오기 (memberNmEn은 memberInfo에 있음)
		const combinedInfo = { ...personalInfo, memberNmEn: memberInfo?.memberNmEn };

		return (
			<Grid container component={'section'} spacing={5} sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
				{personalInfoSections.map((section, sectionIdx) => {
					return (
						<Grid component={'article'} key={sectionIdx}>
							<Box sx={{ display: 'flex', alignItems: 'center', py: '0.5rem' }}>
								<Typography sx={{ fontWeight: '600' }}>{section.title}</Typography>
								<Box sx={{ flexGrow: 1, height: '1px', marginLeft: '1rem', backgroundColor: theme.palette.divider }}></Box>
							</Box>
							<Box
								sx={{
									display: 'flex',
									flexWrap: 'wrap',
									width: '100%',
									backgroundColor: theme.palette.grey[50],
									padding: '1rem',
									borderRadius: '1rem',
								}}
							>
								{section.fields.map(({ key, label }, idx) => {
									const value = combinedInfo[key];
									const displayValue = getDisplayValue(value);

									return (
										<Box
											key={idx}
											sx={{
												display: 'flex',
												alignItems: 'center',
												flexBasis: `${label === '주소' ? '66.66%' : '33.33%'}`,
												padding: '0.5rem 1rem',
												minWidth: '18rem',
												whiteSpace: 'nowrap',
											}}
										>
											<Box sx={{ width: '8rem' }}>{label}</Box>
											<Box sx={{ width: 'calc(100% - 8rem)' }}>
												<OutlinedInput
													size='small'
													value={displayValue}
													sx={{ width: '100%', minWidth: '10rem' }}
													readOnly
												></OutlinedInput>
											</Box>
										</Box>
									);
								})}
							</Box>
						</Grid>
					);
				})}
			</Grid>
		);
	}, [personalInfo, memberInfo]);

	// const userTabs = [
	// 	{ label: '기본 정보', content: tabInfoContents },
	// 	{ label: '신상 정보', content: tabPersonalContents },
	// 	{ label: '경력', type: 'grid', colDefs: careerColDefs, rowData: dummyUserCareerInfo },
	// 	{ label: '포상/징계', type: 'grid', colDefs: rewardColDefs, rowData: dummyUserRewardInfo },
	// 	{ label: '자격', type: 'grid', colDefs: certificateColDefs, rowData: dummyUserCertificateInfo },
	// 	{ label: '어학', type: 'grid', colDefs: languageColDefs, rowData: dummyUserLanguageInfo },
	// ];

	const userTabs = [
		{ label: '기본 정보', content: tabInfoContents },
		{ label: '신상 정보', content: tabPersonalContents },
		{ label: '경력', type: 'grid', colDefs: careerColDefs, rowData: transformGridData(careerInfo) },
		{ label: '포상/징계', type: 'grid', colDefs: rewardColDefs, rowData: transformGridData(rewardInfo) },
		{ label: '자격', type: 'grid', colDefs: certificateColDefs, rowData: transformGridData(qualificationInfo) },
		{ label: '어학', type: 'grid', colDefs: languageColDefs, rowData: transformGridData(languageInfo) },
	];


	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
			}}
		>
			<Box sx={{ flexShrink: 0, width: '100%', padding: '0 1.5rem', mb: '1rem' }}>
				<PathBreadcrumbs />
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						padding: '1rem',
						borderRadius: '1rem',
						border: `1px solid ${theme.palette.primary.main}`,
					}}
				>
					{/** 이미지 */}
					<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '15%', minWidth: '9rem' }}>
						<Box sx={{ width: '6rem', height: '6rem', borderRadius: '1rem', backgroundColor: theme.palette.grey[500] }}></Box>
					</Box>
					{/** 기본설정 */}
					<Box sx={{ width: 'calc(80% - 1rem)', marginLeft: '1rem' }}>
						<List sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', width: '100%' }}>
							{memberInfoFields.map(({ key, label }) => {
								// memberInfo와 basicInfo, personalInfo에서 값 통합 조회
								const combinedData = { ...memberInfo };
								const value = combinedData[key];
								const displayValue = getDisplayValue(value);

								return (
									<ListItem
										key={key}
										sx={{
											flexBasis: '33.33%',
											minWidth: '14rem',
											whiteSpace: 'nowrap',
											padding: '0.5rem',
										}}
									>
										<Box sx={{ width: '6rem', textWrap: 'nowrap', fontSize: '0.875rem', color: theme.palette.grey[700] }}>{label}</Box>
										<Box sx={{ width: 'calc(100% - 6rem)', textWrap: 'nowrap' }}>{displayValue}</Box>
									</ListItem>
								);
							})}
						</List>
					</Box>
				</Box>
			</Box>
			<CommonTabs
				tabs={userTabs}
				containerSx={{
					display: 'flex',
					flexDirection: 'column',
					marginTop: '-1px',
				}}
			/>
		</Box>
	);
}
