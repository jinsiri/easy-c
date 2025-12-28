/** MUI */
import {
	EmailRounded,
	AddToQueueRounded,
	ApprovalRounded,
	AssignmentRounded,
	CalendarMonthRounded,
	ForumRounded,
	WorkRounded,
	PsychologyAltRounded,
	WorkHistoryRounded,
	BeachAccessRounded,
} from '@mui/icons-material';

/** Custom */
import { menuType } from '../../_constant/Types';

const MainMenuItem: menuType[] = [
	{
		id: 'main',
		title: '메인화면',
		type: '',
		url: '/',
		children: [
			{
				id: 'main-attendance',
				title: '근태관리',
				type: '1depth',
				url: '/attendance',
				icon: WorkHistoryRounded,
			},
			{
				id: 'main-vacation',
				title: '휴가관리',
				type: '1depth',
				url: '/vacation',
				icon: BeachAccessRounded,
			},

			/*{
				id: 'main-mail',
				title: '메일',
				type: '1depth',
				url: '/mail',
				icon: EmailRounded,
			},
			{
				id: 'main-board',
				title: '게시판',
				type: '1depth',
				url: '/board',
				icon: AssignmentRounded,
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
];

export default MainMenuItem;
