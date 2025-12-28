'use client';
import { useMemo } from 'react';

/** MUI */
import { Box, Typography, Tabs, Tab, Grid, List, ListItem, useTheme, OutlinedInput } from '@mui/material';

/** Custom */
import PathBreadcrumbs from '../../../_component/PathBreadcrumbs';
import { useCallback, useState } from 'react';
import { title } from 'process';

/** interface */
interface propsType {}

const tabList = ['기본 정보', '신상 정보', '경력', '포상/징계', '자격', '어학'];

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

export default function ManagementUserPage(props: propsType) {
	const theme = useTheme();
	const [targetTab, setTargetTab] = useState<number>(0);

	const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
		setTargetTab(newValue);
	}, []);

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
							<OutlinedInput value={value} readOnly></OutlinedInput>
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

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs />
			<Box component={'section'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '1.5rem' }}>
				<Typography variant='h5' sx={{ fontWeight: '800' }}>
					내 인사 정보
				</Typography>
			</Box>
			<Grid container spacing={4} sx={{ flexGrow: 1, width: '100%', height: '100%' }}>
				<Grid
					size={12}
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
				</Grid>
				<Grid size={12} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
					<Tabs value={targetTab} onChange={handleTabChange} aria-label='basic tabs example'>
						{tabList.map((item: string, idx: number) => {
							return <Tab id={`simple-tab-${idx}`} aria-controls={`simple-tabpanel-${idx}`} key={idx} label={item} />;
						})}
					</Tabs>
					<Box
						sx={{
							display: 'flex',
							marginTop: '-1px',
							padding: '1rem',
							borderTop: `1px solid ${theme.palette.divider}`,
						}}
					>
						{targetTab === 0 && tabInfoContents}
						{targetTab === 1 && tabPersonalContents}
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}
