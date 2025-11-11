/** MUI */
import { ApprovalRounded, CalendarMonthRounded } from '@mui/icons-material';

/** Custom */
import { menuType } from '../../_constant/Types';

const AdminMenuItem: menuType[] = [
	{
		id: 'admin-normal',
		title: '기본 관리',
		type: '1depth',
		url: '/normal',
		icon: CalendarMonthRounded,
		children: [
			{
				id: 'admin-normal-setting',
				title: '기본 정보 설정',
				type: '2depth',
				url: '/setting',
			},
			{
				id: 'admin-normal-menu',
				title: '메뉴 설정',
				type: '2depth',
				url: '/menu',
			},
			{
				id: 'admin-normal-user',
				title: '사용자 관리',
				type: '2depth',
				url: '/user',
			},
			{
				id: 'admin-normal-backup',
				title: '데이터 백업 관리',
				type: '2depth',
				url: '/backup',
			},
			{
				id: 'admin-normal-sharedcapacity',
				title: '공용 용량 관리',
				type: '2depth',
				url: '/sharedcapacity',
			},
			{
				id: 'admin-normal-popup',
				title: '팝업 공지 설정',
				type: '2depth',
				url: '/popup',
			},
		],
	},
	{
		id: 'admin-approval',
		title: '전자결재',
		type: '1depth',
		url: '/approval',
		icon: ApprovalRounded,
		children: [],
	},
];

export default AdminMenuItem;
