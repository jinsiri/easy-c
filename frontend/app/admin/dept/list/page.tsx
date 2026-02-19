import axiosConfig from '@/app/_lib/axiosConfig';
import AdminDeptListView from '@/app/admin/dept/list/AdminDeptListView';

export async function getDeptList() {
	const res = await axiosConfig.get('/api/dept/tree');
	return res;
}

export default async function AdminDeptListPage() {
	const dbData = await getDeptList();

	return <AdminDeptListView dbData={dbData} />;
}
