'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import secureLocalStorage from 'react-secure-storage';

/** Lib */
import dayjs from 'dayjs';
import { Box, Divider, Grid, Typography } from '@mui/material';

import useLoaderStore from '@/store/useLoaderStore';

/** Custom */
import UserResorceComp from '@/app/_component/layoutElement/UserResourceComp';
import AttendanceComp from '@/app/_component/layoutElement/AttendanceComp';
import VacationComp from '@/app/_component/layoutElement/VacationComp';
import UserLoginLogComp from '@/app/_component/layoutElement/UserLoginLogComp';

import { SecurityLogResponseDto, securityLogService } from '@/app/services/securityLogService';
import { BoardPostResponseDto, boardPostService } from '@/app/services/boardPostService';
import { DeptMemberMapResponseDto, MemberResponseDto, memberService } from '@/app/services/memberService';
import { AttendanceResDto, attendanceService } from '@/app/services/attendanceService';
import { VacationDataDto, VacationResponseDto, vacationService } from '@/app/services/vacationService';

export default function DashboardPage() {
	const router = useRouter();
	const { loader, setLoader } = useLoaderStore();

	const [myLogins, setMyLogins] = useState<SecurityLogResponseDto[]>([]);
	const [notices, setNotices] = useState<BoardPostResponseDto[]>([]);
	const [generals, setGenerals] = useState<BoardPostResponseDto[]>([]);
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
		boardPostService.findAllNotice(0, 5).then((res: any) => {
			setNotices(res?.content ?? []);
		});
		boardPostService.findAllGeneral(0, 5).then((res: any) => {
			setGenerals(res?.content ?? []);
		});

		//근태 조회
		getAttendanceTodayData();

		//휴가 조회
		getVacationData();
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

	const getAttendanceTodayData = async () => {
		if (!loader) setLoader(true);

		try {
			await attendanceService
				.getAttendanceTodayData({
					memberId: secureLocalStorage.getItem('memberId') as number,
					workDate: dayjs().format('YYYY-MM-DD HH:mm'),
				})
				.then((res: AttendanceResDto) => setAttendanceData(res));
		} finally {
			setLoader(false);
		}
	};

	const getVacationData = async () => {
		if (!loader) setLoader(true);

		try {
			const encodedMemberId = btoa(String(secureLocalStorage.getItem('memberId')));
			vacationService.getVacationData(encodedMemberId).then((res: VacationResponseDto) => {
				if (res) setVacationData(res.vacation);
			});
		} finally {
			setLoader(false);
		}
	};

	return (
		<Grid
			container
			spacing={2}
			sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignContent: 'flex-start', padding: '1rem 1.5rem', width: '100%', height: '100%' }}
		>
			<Grid size={{ xs: 12, md: 6, lg: 3 }}>
				<UserResorceComp userData={memberInfo} deptData={deptMemberMapInfo} />
			</Grid>
			<Grid size={{ xs: 12, md: 6, lg: 4 }} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: '1rem' }}>
				<AttendanceComp type={'home'} attendanceData={attendanceData} onSuccess={getAttendanceTodayData} />
			</Grid>
			<Grid size={{ xs: 12, md: 6, lg: 5 }} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: '1rem' }}>
				<VacationComp type={'home'} vacationData={vacationData} onSuccess={getVacationData} />
			</Grid>
			<Grid size={{ xs: 12, md: 6, lg: 4 }}>
				<UserLoginLogComp myLogins={myLogins} />
			</Grid>
			<Grid size={{ xs: 12, md: 6, lg: 4 }}>
				{/* 공지사항 위젯 */}
				<Box
					sx={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						padding: '1rem',
						height: '15rem',
						borderRadius: '1rem',
						backgroundColor: 'grey.50',
					}}
				>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
						<Typography variant='subtitle1'>공지사항</Typography>
						<Typography
							sx={{ color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
							onClick={() => router.push('/board/notice')}
						>
							더보기
						</Typography>
					</Box>
					{notices.length === 0 ? (
						<Typography variant='body2' color='text.secondary'>
							데이터가 없습니다.
						</Typography>
					) : (
						notices.map((post, idx) => (
							<Box key={post.id}>
								{idx > 0 && <Divider sx={{ my: 0.5 }} />}
								<Box
									sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
									onClick={() => router.push(`/board/${post.id}`)}
								>
									<Typography variant='body2' sx={{ flex: 1, minWidth: 0 }} noWrap>
										{post.title}
									</Typography>
									<Typography variant='caption' color='text.secondary' sx={{ flexShrink: 0 }}>
										{dayjs(post.registerDate).format('MM-DD')}
									</Typography>
								</Box>
							</Box>
						))
					)}
				</Box>
			</Grid>
			<Grid size={{ xs: 12, md: 6, lg: 4 }}>
				{/* 자유게시판 위젯 */}
				<Box
					sx={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						padding: '1rem',
						height: '15rem',
						borderRadius: '1rem',
						backgroundColor: 'grey.50',
					}}
				>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
						<Typography variant='subtitle1'>자유게시판</Typography>
						<Typography
							sx={{ color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
							onClick={() => router.push('/board/general')}
						>
							더보기
						</Typography>
					</Box>
					{generals.length === 0 ? (
						<Typography variant='body2' color='text.secondary'>
							데이터가 없습니다.
						</Typography>
					) : (
						generals.map((post, idx) => (
							<Box key={post.id}>
								{idx > 0 && <Divider sx={{ my: 0.5 }} />}
								<Box
									sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
									onClick={() => router.push(`/board/${post.id}`)}
								>
									<Typography variant='body2' sx={{ flex: 1, minWidth: 0 }} noWrap>
										{post.title}
									</Typography>
									<Typography variant='caption' color='text.secondary' sx={{ flexShrink: 0 }}>
										{dayjs(post.registerDate).format('MM-DD')}
									</Typography>
								</Box>
							</Box>
						))
					)}
				</Box>
			</Grid>
		</Grid>
	);
}
