import axiosConfig from '@/app/_lib/axiosConfig';
import AdminDeptListView from '@/app/admin/dept/list/AdminDeptListView';
import { DeptResponseDto } from '@/type/dept';

export async function getDeptList() {
	try {
		const res = await axiosConfig.get('/api/dept/tree');
		return res.data;
	} catch (error: any) {
		console.error('에러 발생:', error.message);
		throw error;
	}
}

const departmentDummyData = [
	// 1단계: 본부
	{ deptId: 100, dataType: 'dept', treeParentId: null, deptNm: '경영지원본부', treeSiblingOrder: 1 },
	{ deptId: 200, dataType: 'dept', treeParentId: null, deptNm: '기술연구소', treeSiblingOrder: 2 },

	// 2단계: 경영지원본부 산하 부서
	{ deptId: 110, dataType: 'dept', treeParentId: 100, deptNm: '인사팀', treeSiblingOrder: 1 },
	{ deptId: 120, dataType: 'dept', treeParentId: 100, deptNm: '재무팀', treeSiblingOrder: 2 },

	// 3단계: 인사팀 소속 직원 (직원을 부서의 자식으로 처리)
	{ deptId: 111, dataType: 'deptMember', treeParentId: 110, deptNm: '김철수 팀장', treeSiblingOrder: 1 },
	{ deptId: 112, dataType: 'deptMember', treeParentId: 110, deptNm: '이영희 대리', treeSiblingOrder: 2 },

	// 2단계: 기술연구소 산하 부서
	{ deptId: 210, dataType: 'dept', treeParentId: 200, deptNm: '백엔드개발팀', treeSiblingOrder: 1 },
	{ deptId: 220, dataType: 'dept', treeParentId: 200, deptNm: '프론트엔드개발팀', treeSiblingOrder: 2 },

	// 3단계: 백엔드개발팀 소속 직원
	{ deptId: 211, dataType: 'deptMember', treeParentId: 210, deptNm: '박디비 과장', treeSiblingOrder: 1 },
	{ deptId: 212, dataType: 'deptMember', treeParentId: 210, deptNm: '최서버 사원', treeSiblingOrder: 2 },

	// 3단계: 프론트엔드개발팀 소속 직원
	{ deptId: 221, dataType: 'deptMember', treeParentId: 220, deptNm: '정리액트 팀장', treeSiblingOrder: 1 },
	{ deptId: 222, dataType: 'deptMember', treeParentId: 220, deptNm: '조넥스트 사원', treeSiblingOrder: 2 },
];

export default async function AdminDeptListPage() {
	const dbData = await getDeptList();

	return <AdminDeptListView dbData={dbData || (departmentDummyData as DeptResponseDto[])} />;
}
