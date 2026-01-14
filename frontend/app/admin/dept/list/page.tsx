import axiosConfig from '@/app/_lib/axiosConfig';
import AdminDeptListView from '@/app/admin/dept/list/AdminDeptListView';

export async function getDeptList() {
	try {
		const res = await axiosConfig.get('/api/dept/tree');
		const treedata = res.data.map((el: any) => ({
			...el,
			id: el.deptId,
			label: el.deptNm,
		}));
		return treedata;
	} catch (error: any) {
		console.error('3. 에러 발생:', error.message);
		throw error;
	}
}

export default async function AdminDeptListPage() {
	const dbData = await getDeptList();

	return <AdminDeptListView dbData={dbData} />;
}
