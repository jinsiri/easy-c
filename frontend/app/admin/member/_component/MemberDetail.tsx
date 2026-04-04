'use client';

import { useSearchParams } from 'next/navigation';
import { Box, Checkbox, Chip, Grid, IconButton, List, ListItem, OutlinedInput, Typography, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { memberService } from '@/app/services/memberService';
import { useContainerSize } from '@/app/_hooks/useContainerSize';
import { CAREER_COL_DEFS, CERTIFICATION_COL_DEFS, LANGUAGE_COL_DEFS, REWARD_COL_DEFS } from '@/app/admin/member/_constant/formConst';
import CommonTabs from '@/app/_component/CommonTabs';
import { getDisplayValue, transformGridData } from '@/app/admin/member/_utils/formUtil';
import { CheckCircle, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

// ========== 필드 매핑 정의 ==========
// 상단 기본 인사정보 (카드 영역)
const memberInfoFields: { key: string; label: string }[] = [
	{ key: 'memberNm', label: '직원 이름' },
	{ key: 'employeeId', label: '사번' },
	{ key: 'deptMemberMapList', label: '부서/직책' },
	{ key: 'jobPosition', label: '직위' },
	{ key: 'jobGrade', label: '직급' },
	{ key: 'jobRole', label: '직무' },
	{ key: 'hireDate', label: '입사일' },
	{ key: 'extensionNumber', label: '대표전화' },
	{ key: 'phoneNumber', label: '휴대전화' },
	{ key: 'email', label: '이메일' },
	{ key: 'externalEmail', label: '외부이메일' },
	{ key: 'employmentStatus', label: '근무상태' },
];

// 기본 정보 탭
const basicInfoFields: { key: string; label: string }[] = [
	{ key: 'employmentType', label: '직원 구분' },
	{ key: 'recruitmentType', label: '채용 구분' },
	{ key: 'salaryType', label: '급여 구분' },
	{ key: 'referredBy', label: '추천자' },
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
			{ key: 'veteranFamily', label: '보훈 가족', type: 'checkbox' },
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

interface MemberDetailProps {
	selectedId?: number;
}

export default function MemberDetail({ selectedId }: MemberDetailProps) {
	const searchParams = useSearchParams();
	const memberId = selectedId || Number(searchParams.get('memberId'));
	const theme = useTheme();
	const { targetRef, width } = useContainerSize();

	const [memberInfo, setMemberInfo] = useState<any>({});
	const [deptMemberMapInfo, setDeptMemberMapInfo] = useState<any[]>([]);
	const [basicInfo, setBasicInfo] = useState<any>({});
	const [personalInfo, setPersonalInfo] = useState<any>({});
	const [careerInfo, setCareerInfo] = useState<any[]>([]);
	const [rewardInfo, setRewardInfo] = useState<any[]>([]);
	const [qualificationInfo, setQualificationInfo] = useState<any[]>([]);
	const [languageInfo, setLanguageInfo] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);

	useEffect(() => {
		const fetchMemberData = async () => {
			setLoading(true);

			const requests = [
				memberService
					.getMember(memberId)
					.then((res) => setMemberInfo(res))
					.catch((err) => console.error('기본 인사정보 조회 실패:', err)),

				memberService
					.getDeptMemberMapInfo(memberId)
					.then((res) => setDeptMemberMapInfo(res))
					.catch((err) => console.error('부서 정보 조회 실패:', err)),

				memberService
					.getMemberBasicInfo(memberId)
					.then((res) => setBasicInfo(res))
					.catch((err) => console.error('기본정보 조회 실패:', err)),

				memberService
					.getMemberPersonalInfo(memberId)
					.then((res) => setPersonalInfo(res))
					.catch((err) => console.error('신상정보 조회 실패:', err)),

				memberService
					.getMemberCareerInfo(memberId)
					.then((res) => setCareerInfo(res))
					.catch((err) => console.error('경력 조회 실패:', err)),

				memberService
					.getMemberRewardDisciplineInfo(memberId)
					.then((res) => setRewardInfo(res))
					.catch((err) => console.error('포상/징계 조회 실패:', err)),

				memberService
					.getMemberQualificationInfo(memberId)
					.then((res) => setQualificationInfo(res))
					.catch((err) => console.error('자격 조회 실패:', err)),

				memberService
					.getMemberLanguageInfo(memberId)
					.then((res) => setLanguageInfo(res))
					.catch((err) => console.error('어학 조회 실패:', err)),
			];

			await Promise.all(requests);
			setLoading(false);
		};

		fetchMemberData();
	}, [memberId]);

	const tabInfoContents = useMemo(() => {
		return (
			<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
				{basicInfoFields.map(({ key, label }) => {
					const value = basicInfo[key];
					const displayValue = getDisplayValue(key, value);

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
								{section.fields.map((field, idx) => {
									const { key, label } = field as any;
									const value = combinedInfo[key];
									const displayValue = getDisplayValue(key, value);

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
												{(field as any).type === 'checkbox' ? (
													<Checkbox checked={!!value} disabled size='small' />
												) : (
													<OutlinedInput
														size='small'
														value={displayValue}
														sx={{ width: '100%', minWidth: '10rem' }}
														readOnly
													></OutlinedInput>
												)}
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

	const userTabs = [
		{ label: '기본 정보', content: tabInfoContents },
		{ label: '신상 정보', content: tabPersonalContents },
		{ label: '경력', type: 'grid', colDefs: CAREER_COL_DEFS, rowData: transformGridData(careerInfo) },
		{ label: '포상/징계', type: 'grid', colDefs: REWARD_COL_DEFS, rowData: transformGridData(rewardInfo) },
		{ label: '자격', type: 'grid', colDefs: CERTIFICATION_COL_DEFS, rowData: transformGridData(qualificationInfo) },
		{ label: '어학', type: 'grid', colDefs: LANGUAGE_COL_DEFS, rowData: transformGridData(languageInfo) },
	];

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
			<Box sx={{ flexShrink: 0, width: '100%', mb: '1rem', padding: '0 1.5rem' }}>
				<Box
					ref={targetRef}
					sx={{
						display: 'flex',
						flexDirection: width > 600 ? 'row' : 'column',
						alignItems: 'center',
						padding: '1rem',
						borderRadius: '1rem',
						border: `1px solid ${theme.palette.primary.main}`,
					}}
				>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							width: '15%',
							minWidth: '9rem',
							overflow: 'hidden',
						}}
					>
						<img src={'/images/blank_profile.png'} alt={'프로필'} style={{ maxWidth: '70%', borderRadius: '50%', objectFit: 'cover' }} />
					</Box>
					<Box sx={{ width: 'calc(80% - 1rem)', marginLeft: '1rem' }}>
						<List sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', width: '100%' }}>
							{memberInfoFields.map(({ key, label }) => {
								const combinedData = { ...memberInfo };
								const value = combinedData[key];
								const displayValue = getDisplayValue(key, value);

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
										<Box sx={{ width: 'calc(100% - 6rem)', textWrap: 'nowrap' }}>
											{key === 'deptMemberMapList' ? (
												<>
													{deptMemberMapInfo.length > 0 ? (
														<>
															{(isExpanded ? deptMemberMapInfo : [deptMemberMapInfo[0]]).map((m) => (
																<Box key={m.deptMemberMapId} sx={{ display: 'flex' }}>
																	<Chip
																		label={`${m.deptNm}${m.jobTitleNm ? ` - ${m.jobTitleNm}` : ''}`}
																		variant='outlined'
																		color='primary'
																		size='small'
																	/>
																	{m.primary && <CheckCircle color='primary' sx={{ ml: '2px' }} />}
																</Box>
															))}

															{deptMemberMapInfo.length > 1 && (
																<Box component='span' onClick={toggleExpand}>
																	{!isExpanded && (
																		<Box component='span' sx={{ fontSize: '0.8rem', color: 'text.secondary', ml: 0.5 }}>
																			외 {deptMemberMapInfo.length - 1}건
																		</Box>
																	)}
																	<IconButton size='small' sx={{ p: 0, ml: 0.2 }}>
																		{isExpanded ? (
																			<KeyboardArrowUp fontSize='small' />
																		) : (
																			<KeyboardArrowDown fontSize='small' />
																		)}
																	</IconButton>
																</Box>
															)}
														</>
													) : (
														'소속 부서 미지정'
													)}
												</>
											) : (
												<>{displayValue}</>
											)}
										</Box>
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
					//height: '40vh',
					overflowY: 'auto',
				}}
			/>
		</Box>
	);
}
