/** MUI */
import { AccountTree, WorkHistoryRounded, CalendarMonthRounded, BeachAccessRounded, HistoryRounded } from '@mui/icons-material';

/** Custom */
import { menuType } from '@/type/types';

const AdminMenuItem: menuType[] = [
	{
		id: 'admin',
		title: '관리자 설정',
		type: '',
		url: '/admin',
		children: [
			/*{
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
			},*/
			{
				id: 'admin-dept',
				title: '조직 관리',
				type: '1depth',
				url: '/dept',
				icon: AccountTree,
				children: [
					{
						id: 'admin-dept-list',
						title: '조직설계',
						type: '2depth',
						url: '/list',
					},
					{
						id: 'admin-dept-role',
						title: '직위체계',
						type: '2depth',
						url: '/role',
					},
					{
						id: 'admin-dept-member',
						title: '멤버관리',
						type: '2depth',
						url: '/member',
					},
				],
			},
			{
				id: 'admin-attendance',
				title: '근태 관리',
				type: '1depth',
				url: '/attendance',
				icon: WorkHistoryRounded,
				children: [
					{
						id: 'admin-attendance-policy',
						title: '근태 정책 관리',
						type: '2depth',
						url: '/policy',
					},
					{
						id: 'admin-attendance-company',
						title: '전사 근태 관리',
						type: '2depth',
						url: '/company',
					},
					{
						id: 'admin-attendance-application',
						title: '근태 요청 관리',
						type: '2depth',
						url: '/application',
					},
				],
			},
			{
				id: 'admin-vacation',
				title: '휴가 관리',
				type: '1depth',
				url: '/vacation',
				icon: BeachAccessRounded,
				children: [
					{
						id: 'admin-vacation-policy',
						title: '휴가 정책 관리',
						type: '2depth',
						url: '/policy',
					},
					{
						id: 'admin-vacation-company',
						title: '전사 휴가 관리',
						type: '2depth',
						url: '/company',
					},
					{
						id: 'admin-vacation-application',
						title: '휴가 요청 관리',
						type: '2depth',
						url: '/application',
					},
				],
			},
			{
				id: 'admin-log',
				title: '이력 관리',
				type: '1depth',
				url: '/log',
				icon: HistoryRounded,
				children: [
					{
						id: 'admin-log-access',
						title: '접근 이력',
						type: '2depth',
						url: '/access',
					},
					{
						id: 'admin-log-security',
						title: '보안 이력',
						type: '2depth',
						url: '/security',
					},
					{
						id: 'admin-log-activity',
						title: '활동 이력',
						type: '2depth',
						url: '/activity',
					},
				],
			},
			/*{
				id: 'admin-approval',
				title: '전자결재',
				type: '1depth',
				url: '/approval',
				icon: ApprovalRounded,
				children: [
					{
						id: 'admin-approval-form',
						title: '결재양식 관리',
						type: '2depth',
						url: '/form',
					},
					{
						id: 'admin-approval-normal',
						title: '전자결재 설정',
						type: '2depth',
						url: '/normal',
					},
					{
						id: 'admin-approval-document',
						title: '문서함 필드 설정',
						type: '2depth',
						url: '/document',
					},
					{
						id: 'admin-approval-autoApproval',
						title: '자동결재선 설정',
						type: '2depth',
						url: '/approval',
					},
					{
						id: 'admin-approval-allDoc',
						title: '전사 문서함 설정',
						type: '2depth',
						url: '/allDoc',
					},
					{
						id: 'admin-approval-departmentDoc',
						title: '부서문서함 설정',
						type: '2depth',
						url: '/departmentDoc',
					},
					{
						id: 'admin-approval-missive',
						title: '공문 발송 관리',
						type: '2depth',
						url: '/missive',
					},
					{
						id: 'admin-approval-admin',
						title: '전자결재 관리자 설정',
						type: '2depth',
						url: '/admin',
					},
					{
						id: 'admin-approval-docNum',
						title: '결재 문서 번호',
						type: '2depth',
						url: '/docNum',
					},
					{
						id: 'admin-approval-paymentDoc',
						title: '결재문서 관리',
						type: '2depth',
						url: '/paymentDoc',
					},
					{
						id: 'admin-approval-securityLevel',
						title: '보안등급 관리',
						type: '2depth',
						url: '/securityLevel',
					},
					{
						id: 'admin-approval-statistics',
						title: '전자 결재 일자별 통계',
						type: '2depth',
						url: '/statistics',
					},
				],
			},*/
		],
	},
];

export default AdminMenuItem;
