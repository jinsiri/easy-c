/** MUI */
import { DashboardRounded, AssignmentIndRounded, WorkHistoryRounded, BeachAccessRounded, AssignmentRounded, CalendarMonthRounded } from '@mui/icons-material';

/** Custom */
import { menuType } from '@/type/types';

const MainMenuItem: menuType[] = [
	{
		id: 'main',
		title: '메인화면',
		type: '',
		url: '/',
		children: [
			{
				id: 'main-dashboard',
				title: '대시보드',
				type: '1depth',
				url: '/dashboard',
				icon: DashboardRounded,
			},
			{
				id: 'main-humanResources',
				title: '인사',
				type: '1depth',
				url: '/humanResources',
				icon: AssignmentIndRounded,
				children: [
					{
						id: 'main-humanResources-user',
						title: '내 인사 정보',
						type: '2depth',
						url: '/user',
					},
					/*{
						id: 'main-humanResources-salary',
						title: '내 급여 조회',
						type: '2depth',
						url: '/salary',
					},*/
				],
			},
			{
				id: 'main-attendance',
				title: '근태',
				type: '1depth',
				url: '/attendance',
				icon: WorkHistoryRounded,
				children: [
					{
						id: 'main-attendance-user',
						title: '내 근태 정보',
						type: '2depth',
						url: '/user',
					},
				],
			},
			{
				id: 'main-vacation',
				title: '휴가',
				type: '1depth',
				url: '/vacation',
				icon: BeachAccessRounded,
				children: [
					{
						id: 'main-vacation-user',
						title: '내 휴가 정보',
						type: '2depth',
						url: '/user',
					},
				],
			},
			{
				id: 'main-board',
				title: '게시판',
				type: '1depth',
				url: '/board',
				icon: AssignmentRounded,
				children: [
					{
						id: 'main-board-notice',
						title: '공지사항',
						type: '2depth',
						url: '/notice',
					},
					{
						id: 'main-board-general',
						title: '자유게시판',
						type: '2depth',
						url: '/general',
					},
				],
			},
			{
				id: 'main-schedule',
				title: '일정관리',
				type: '1depth',
				url: '/schedule',
				icon: CalendarMonthRounded,
				children: [
					{
						id: 'main-schedule-user',
						title: '개인 일정관리',
						type: '2depth',
						url: '/user',
					},
					{
						id: 'main-schedule-dept',
						title: '부서 일정관리',
						type: '2depth',
						url: '/dept',
					},
				],
			},

			/*{
				id: 'main-mail',
				title: '메일',
				type: '1depth',
				url: '/mail',
				icon: EmailRounded,
			},
			{
				id: 'main-work',
				title: '업무관리',
				type: '1depth',
				url: '/work',
				icon: WorkRounded,
			},
			{
				id: 'main-schedule',
				title: '일정관리',
				type: '1depth',
				url: '/schedule',
				icon: CalendarMonthRounded,
			},
			{
				id: 'main-approval',
				title: '전자결재',
				type: '1depth',
				url: '/approval',
				icon: ApprovalRounded,
			},
			{
				id: 'main-survey',
				title: '설문조사',
				type: '1depth',
				url: '/survey',
				icon: PsychologyAltRounded,
			},
			{
				id: 'main-attendance',
				title: '근태관리',
				type: '1depth',
				url: '/survey',
				icon: WorkHistoryRounded,
			},
			{
				id: 'main-reservation',
				title: '예약',
				type: '1depth',
				url: '/reservation',
				icon: AddToQueueRounded,
			},
			{
				id: 'main-community',
				title: '커뮤니티',
				type: '1depth',
				url: '/community',
				icon: ForumRounded,
			},
			{
				id: 'main-report',
				title: '부서보고',
				type: '1depth',
				url: '/report',
				icon: AssignmentRounded,
			},*/
		],
	},
	{
		id: 'main-management-user',
		title: '내 정보',
		type: '',
		url: '/management/user',
	},
];

export default MainMenuItem;
