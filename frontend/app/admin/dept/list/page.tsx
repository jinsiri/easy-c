'use server';

import AdminDeptListView from '@/app/admin/dept/list/AdminDeptListView';
import { deptService } from '@/app/services/deptService';
import { revalidatePath } from 'next/cache';

export async function refreshCurrentPath(path: string) {
	if (!path) return;
	revalidatePath(path);
}

export default async function AdminDeptListPage() {
	const dbData = await deptService.getDeptTree(true);

	return <AdminDeptListView dbData={dbData} refreshDeptData={refreshCurrentPath} />;
}
