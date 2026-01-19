'use client';
import { SyntheticEvent, useMemo, useState } from 'react';

/** MUI */
import { Box, Typography, Grid, List, ListItem, useTheme, OutlinedInput } from '@mui/material';

/** Ag Grid */
import { ColDef } from 'ag-grid-community';

/** Custom */
import PathBreadcrumbs from '../../../_component/PathBreadcrumbs';
import CommonTabs from '@/app/_component/CommonTabs';

const careerColDefs: ColDef<Record<string, any>>[] = [
	{ field: '시작일', headerName: '시작일', editable: false },
	{ field: '종료일', headerName: '종료일', editable: false },
	{ field: '근무처', headerName: '근무처', editable: false },
	{ field: '직위', headerName: '직위', editable: false },
	{ field: '담당업무', headerName: '담당업무', editable: false },
	{ field: '근속기간', headerName: '근속기간', editable: false },
	{ field: '퇴직사유', headerName: '퇴직사유', editable: false },
];

const rewardColDefs: ColDef<Record<string, any>>[] = [
	{ field: '구분', headerName: '구분', editable: false },
	{ field: '일자', headerName: '일자', editable: false },
	{ field: '내용', headerName: '내용', editable: false },
	{ field: '사유', headerName: '사유', editable: false },
	{ field: '기타', headerName: '기타', editable: false },
];

const certificateColDefs: ColDef<Record<string, any>>[] = [
	{ field: '구분', headerName: '구분', editable: false },
	{ field: '자격명', headerName: '자격명', editable: false },
	{ field: '자격번호', headerName: '자격번호', editable: false },
	{ field: '자격등급', headerName: '자격등급', editable: false },
	{ field: '기관명', headerName: '기관명', editable: false },
	{ field: '취득일', headerName: '취득일', editable: false },
	{ field: '정지일', headerName: '정지일', editable: false },
];

const languageColDefs: ColDef<Record<string, any>>[] = [
	{ field: '구분', headerName: '구분', editable: false },
	{ field: '어학명', headerName: '어학명', editable: false },
	{ field: '평가일', headerName: '평가일', editable: false },
	{ field: '평가기관', headerName: '평가기관', editable: false },
	{ field: '점수', headerName: '점수', editable: false },
	{ field: '등급', headerName: '등급', editable: false },
	{ field: '기타', headerName: '기타', editable: false },
];

const dummyInfo = {
	'직원 이름': '김호두',
	사원번호: '250514-1',
	'부서/직책': '연구개발팀/팀원',
	직위: '사원',
	직무: '개발',
	입사일: '20250514',
	대표전화: '000-0000-0000',
	휴대전화: '010-0000-0000',
	이메일: 'hodu@easy_c.com',
	외부이메일: 'hodu@naver.com',
	근무상태: 'hodu@naver.com',
};

const dummyUserInfo: Record<string, any> = {
	'부서/직책': '연구개발팀/팀원',
	직위: '사원',
	직무: '개발',
	'직원 구분': '정직원', //정규 계약 외주 파견 파트 기타 등
	'채용 구분': '신입', //신입/경력, 공채, 특채, 수시채용 등 회사에서 원하는 대로 사용
	'급여 구분': '연봉',
	추천자: '김마루',
	입사일: '2025-05-14',
	퇴사일: '-',
};

const dummyUserPersonalInfo: Record<string, any> = {
	'영문 이름': 'Kim Hodu',
	성별: '여성',
	국적: '대한민국',
	생년월일: '1990-12-28',
	주소: '서울시 어쩌구 이사갔동 무슨아파트 101동 111호',
	자택번호: '02-000-0000',
	보훈번호: '-',
	'보훈 구분': '-',
	'보훈 가족': '-',
	'장애 등록번호': '-',
	'장애 구분': '-',
	'장애 인정 구분': '-',
	'장애 등급': '-',
	계좌유형: '일반예금',
	'은행 이름': '한국은행',
	예금주: '김호두',
	계좌번호: '00-0000-0000-00',
	자기소개: '',
	비고: '',
};

const dummyUserCareerInfo: Record<string, any>[] = [
	{
		시작일: '2024-12-10',
		종료일: '2025-06-10',
		근무처: '이전컴퍼니',
		직위: '사원',
		담당업무: '개발',
		근속기간: '6개월',
		퇴직사유: '이사',
	},
];

const dummyUserRewardInfo: Record<string, any>[] = [
	{
		구분: '',
		일자: '2025-08-10',
		내용: '우수 사원상',
		사유: '우수 사원이기 때문',
		기타: '',
	},
];

const dummyUserCertificateInfo: ColDef<Record<string, any>>[] = [
	{
		구분: '',
		자격명: '자격증',
		자격번호: 'A234324D',
		자격등급: 'A',
		기관명: '자격증 기관',
		취득일: '2025-08-10',
		정지일: '',
	},
];

const dummyUserLanguageInfo: ColDef<Record<string, any>>[] = [
	{
		구분: '',
		어학명: '어학명',
		평가일: '2025-08-10',
		평가기관: '어학 평가 기관',
		점수: '95',
		등급: 'A',
		기타: '',
	},
];

export default function HumanResourceUserPage() {
	const theme = useTheme();
	const [targetTab, setTargetTab] = useState<number>(0);

	const handleTabChange = (_: SyntheticEvent, newValue: number) => {
		setTargetTab(newValue);
	};

	const tabInfoContents = useMemo(() => {
		const targetList: Record<string, any> = dummyUserInfo;

		return (
			<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
				{Object.entries(targetList).map(([key, value]) => {
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
							<Box sx={{ width: '8rem' }}>{key}</Box>
							<OutlinedInput size='small' value={value} readOnly></OutlinedInput>
						</Box>
					);
				})}
			</Box>
		);
	}, []);

	const tabPersonalContents = useMemo(() => {
		const targetList: Record<string, any> = dummyUserPersonalInfo;
		const userList: string[] = ['영문 이름', '성별', '국적', '생년월일', '주소', '자택번호', '자기소개', '비고'];
		const veteransList: string[] = ['보훈번호', '보훈 구분', '보훈 가족'];
		const disablityList: string[] = ['장애 등록번호', '장애 구분', '장애 인정 구분', '장애 등급'];
		const accountList: string[] = ['계좌유형', '은행 이름', '예금주', '계좌번호'];

		const sectionList = [
			{ title: '개인 정보', data: userList },
			{ title: '보훈 정보', data: veteransList },
			{ title: '장애 정보', data: disablityList },
			{ title: '계좌 정보', data: accountList },
		];

		return (
			<Grid container component={'section'} spacing={5} sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
				{sectionList.map((sectionItem, sectionIdx) => {
					return (
						<Grid component={'article'} key={sectionIdx}>
							<Box sx={{ display: 'flex', alignItems: 'center', py: '0.5rem' }}>
								<Typography sx={{ fontWeight: '600' }}>{sectionItem.title}</Typography>
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
								{sectionItem.data.map((item, idx) => {
									return (
										<Box
											key={idx}
											sx={{
												display: 'flex',
												alignItems: 'center',
												flexBasis: `${item === '자기소개' || item === '비고' ? '100%' : item === '주소' ? '66.66%' : '33.33%'}`,
												padding: '0.5rem 1rem',
												minWidth: '18rem',
												whiteSpace: 'nowrap',
											}}
										>
											<Box sx={{ width: '8rem' }}>{item}</Box>
											<Box sx={{ width: 'calc(100% - 8rem)' }}>
												<OutlinedInput
													size='small'
													value={targetList[item]}
													sx={{ width: '100%', minWidth: '10rem' }}
													multiline={item === '자기소개' || item === '비고'}
													maxRows={3}
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
	}, []);

	const userTabs = [
		{ label: '기본 정보', content: tabInfoContents },
		{ label: '신상 정보', content: tabPersonalContents },
		{ label: '경력', type: 'grid', colDefs: careerColDefs, rowData: dummyUserCareerInfo },
		{ label: '포상/징계', type: 'grid', colDefs: rewardColDefs, rowData: dummyUserRewardInfo },
		{ label: '자격', type: 'grid', colDefs: certificateColDefs, rowData: dummyUserCertificateInfo },
		{ label: '어학', type: 'grid', colDefs: languageColDefs, rowData: dummyUserLanguageInfo },
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
							{Object.entries(dummyInfo).map(([key, value]) => {
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
										<Box sx={{ width: '6rem', textWrap: 'nowrap', fontSize: '0.875rem', color: theme.palette.grey[700] }}>{key}</Box>
										<Box sx={{ width: 'calc(100% - 6rem)', textWrap: 'nowrap' }}>{value}</Box>
									</ListItem>
								);
							})}
						</List>
					</Box>
				</Box>
			</Box>
			<CommonTabs
				tabs={userTabs}
				value={targetTab}
				onChange={handleTabChange}
				containerSx={{
					display: 'flex',
					flexDirection: 'column',
					marginTop: '-1px',
					overflow: targetTab === 2 ? 'auto' : 'inherit',
					padding: targetTab <= 1 ? '1rem 1.5rem' : '',
				}}
			/>
		</Box>
	);
}
