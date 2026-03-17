import AdminDeptListView from '@/app/admin/dept/list/AdminDeptListView';
import { deptService } from '@/app/services/deptService';

export default async function AdminDeptListPage() {
	const dbData = await deptService.getDeptTree(true);

	return <AdminDeptListView dbData={dbData} />;
}
