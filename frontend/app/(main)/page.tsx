'use client';

import { useCallback, useEffect, useState } from 'react';
import secureLocalStorage from 'react-secure-storage';

/** MUI */
import { Box, Chip, Divider, Grid, Typography } from '@mui/material';

/** Lib */
import dayjs from 'dayjs';

/** Custom */
import UserResorceComp from '../_component/layoutElement/UserResourceComp';
import AttendanceComp from '../_component/layoutElement/AttendanceComp';
import VacationComp from '../_component/layoutElement/VacationComp';

/** Services */
import { securityLogService, SecurityLogResponseDto } from '../services/securityLogService';
import { memberService, MemberResponseDto, DeptMemberMapResponseDto } from '../services/memberService';
import { attendanceService, AttendanceResDto } from '../services/attendanceService';
import { vacationService, VacationResponseDto, VacationDataDto } from '@/app/services/vacationService';
import UserLoginLogComp from '../_component/layoutElement/UserLoginLogComp';

const EVENT_LABEL: Record<string, { label: string; color: 'success' | 'error' }> = {
	LOGIN_SUCCESS: { label: '성공', color: 'success' },
	LOGIN_FAILURE: { label: '실패', color: 'error' },
};

export default function Home() {
	const [myLogins, setMyLogins] = useState<SecurityLogResponseDto[]>([]);
	const [memberInfo, setMemberInfo] = useState<MemberResponseDto>({});
	const [deptMemberMapInfo, setDeptMemberMapInfo] = useState<DeptMemberMapResponseDto[]>([]);
	const [attendanceData, setAttendanceData] = useState<AttendanceResDto>();
	const [vacationData, setVacationData] = useState<VacationDataDto>();

	useEffect(() => {
		const memberId = Number(secureLocalStorage.getItem('memberId'));
		requestFunc(memberId);
	}, []);

	const requestFunc = (memberId: number) => {
		//기본 인사 정보 조회
		getMember(memberId);

		//로그인 기록
		securityLogService.getMyLogins(5).then((res: any) => {
			setMyLogins(Array.isArray(res) ? res : (res?.data ?? []));
		});

		//근태 조회
		attendanceService
			.getAttendanceTodayData({
				memberId: secureLocalStorage.getItem('memberId') as number,
				workDate: dayjs().format('YYYY-MM-DD HH:mm'),
			})
			.then((res: AttendanceResDto) => setAttendanceData(res));

		//휴가 조회
		const encodedMemberId = btoa(String(secureLocalStorage.getItem('memberId')));
		vacationService.getVacationData(encodedMemberId).then((res: VacationResponseDto) => setVacationData(res.vacation));
	};

	const getMember = useCallback(async (memberId: number) => {
		const requests = [
			memberService
				.getMember(memberId)
				.then((res) => setMemberInfo(res))
				.catch((err) => console.error('기본 인사정보 조회 실패:', err)),

			memberService
				.getDeptMemberMapInfo(memberId)
				.then((res) => setDeptMemberMapInfo(res))
				.catch((err) => console.error('부서 정보 조회 실패:', err)),
		];

		await Promise.all(requests);
	}, []);

	return (
		<Grid
			container
			spacing={2}
			sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignContent: 'flex-start', padding: '1rem 1.5rem', width: '100%', height: '100%' }}
		>
			<Grid size={3}>
				<UserResorceComp userData={memberInfo} deptData={deptMemberMapInfo} />
			</Grid>
			<Grid size={4} sx={{ border: '1px solid', borderColor: 'grey.100', borderRadius: '1rem' }}>
				<AttendanceComp type={'home'} attendanceData={attendanceData} />
			</Grid>
			<Grid size={5} sx={{ border: '1px solid', borderColor: 'grey.100', borderRadius: '1rem' }}>
				<VacationComp type={'home'} vacationData={vacationData} />
			</Grid>
			<Grid size={5}>
				<UserLoginLogComp myLogins={myLogins} />
			</Grid>
		</Grid>
	);
}
