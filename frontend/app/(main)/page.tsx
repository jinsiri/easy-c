'use client';

/** MUI */
import { Box, Chip, Divider, Grid, Typography, useTheme } from '@mui/material';

/** React */
import { useEffect, useState } from 'react';

/** Lib */
import dayjs from 'dayjs';

/** Custom */
import ColTitleAndText from '../_component/layoutElement/ColTitleAndText';
import AttendanceComp from '../_component/layoutElement/AttendanceComp';

/** Services */
import { securityLogService, SecurityLogResponseDto } from '../services/securityLogService';

const EVENT_LABEL: Record<string, { label: string; color: 'success' | 'error' }> = {
	LOGIN_SUCCESS: { label: '성공', color: 'success' },
	LOGIN_FAILURE: { label: '실패', color: 'error' },
};

export default function Home() {
	const theme = useTheme();
	const [myLogins, setMyLogins] = useState<SecurityLogResponseDto[]>([]);

	useEffect(() => {
		securityLogService.getMyLogins(5).then((res: any) => {
			setMyLogins(Array.isArray(res) ? res : res?.data ?? []);
		});
	}, []);

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

	return (
		<Grid container sx={{ display: 'flex', flexDirection: 'column', padding: '1rem 1.5rem' }}>
			<Grid sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
				<Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							width: '60%',
							borderRadius: '1rem',
							padding: '1rem',
							backgroundColor: 'grey.50',
						}}
					>
						<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '8rem' }}>
							<Box sx={{ width: '6rem', height: '6rem', borderRadius: '1rem', backgroundColor: 'grey.500' }}></Box>
						</Box>
						<Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '0.5rem' }}>
							<Box sx={{ display: 'flex', alignItems: 'baseline' }}>
								<Typography variant='h6' sx={{ fontWeight: '700' }}>
									{dummyInfo['직원 이름']}
								</Typography>
								<Typography sx={{ marginLeft: '0.25rem', fontWeight: '600' }}>{dummyInfo['직위']}</Typography>
							</Box>
							<Box sx={{ fontSize: '0.875rem', color: 'grey.500' }}>{dummyInfo['부서/직책']}</Box>
							<Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', mt: '1rem' }}>
								<ColTitleAndText subtitle='결재할 문서' sx={{ mr: '1.5rem' }}>
									<Box sx={{ fontSize: '1.625rem', fontWeight: '600' }}> 15 </Box>
								</ColTitleAndText>
								<ColTitleAndText subtitle='오늘의 할 일' sx={{ mr: '1.5rem' }}>
									<Box sx={{ fontSize: '1.625rem', fontWeight: '600' }}> 15 </Box>
								</ColTitleAndText>
								<ColTitleAndText subtitle='잔여 휴가'>
									<Box sx={{ fontSize: '1.625rem', fontWeight: '600' }}> 15 </Box>
								</ColTitleAndText>
							</Box>
						</Box>
					</Box>

					{/* 최근 로그인 이력 위젯 */}
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							width: '40%',
							marginLeft: '1rem',
							padding: '1rem',
							borderRadius: '1rem',
							backgroundColor: 'grey.50',
						}}
					>
						<Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'grey.700', mb: 1 }}>
							최근 로그인 이력
						</Typography>
						{myLogins.length === 0 ? (
							<Typography variant="body2" color="text.secondary">데이터가 없습니다.</Typography>
						) : (
							myLogins.map((log, idx) => (
								<Box key={log.id}>
									{idx > 0 && <Divider sx={{ my: 0.5 }} />}
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<Chip
											label={EVENT_LABEL[log.eventType]?.label ?? log.eventType}
											color={EVENT_LABEL[log.eventType]?.color ?? 'default'}
											size="small"
											sx={{ fontSize: '0.7rem', height: 20, minWidth: 40 }}
										/>
										<Typography variant="caption" color="text.secondary" sx={{ flex: 1, minWidth: 0 }} noWrap>
											{log.ip} · {log.deviceType ?? '-'}
										</Typography>
										<Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
											{dayjs(log.registerDate).format('MM-DD HH:mm')}
										</Typography>
									</Box>
								</Box>
							))
						)}
					</Box>
				</Box>
			</Grid>
		</Grid>
	);
}
