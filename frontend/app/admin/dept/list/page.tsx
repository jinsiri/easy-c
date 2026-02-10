import axiosConfig from '@/app/_lib/axiosConfig';
import AdminDeptListView from '@/app/admin/dept/list/AdminDeptListView';

export async function getDeptList() {
	try {
		const res = await axiosConfig.get('/api/dept/tree');
		return res;
	} catch (error: any) {
		console.error('에러 발생:', error.message); //todo axiosConfig 안 타는 듯 에러 처리 적용 안됨.
		throw error;
	}
}

export default async function AdminDeptListPage() {
	const dbData = await getDeptList();

	return <AdminDeptListView dbData={dbData} />;
}
