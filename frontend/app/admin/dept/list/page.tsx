'use server';

import AdminDeptListView from '@/app/admin/dept/list/AdminDeptListView';
import { deptService } from '@/app/services/deptService';
import { revalidatePath } from 'next/cache';
import { connection } from 'next/server';

export async function refreshCurrentPath(path: string) {
	if (!path) return;
	revalidatePath(path);
}

export default async function AdminDeptListPage() {
	await connection();
	const dbData = await deptService.getDeptTree(true);

	return <AdminDeptListView dbData={dbData} refreshDeptData={refreshCurrentPath} />;
}
