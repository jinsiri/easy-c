import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosConfig from '@/app/_lib/axiosConfig';
import { DeptAddFormValues } from '@/app/admin/dept/_component/DeptForm';
import useRefreshStore from '@/store/useRefreshStore';

// todo:
//  1. 수정 로직 전면 개편, 부서아이디 필요함
//  2. 코드 지저분함
export function useDeptForm(id?: number, onSuccess?: () => void) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const parentIdStr = searchParams.get('parentId');
	const parentId = parentIdStr ? parseInt(parentIdStr, 10) : null;
	const triggerRefresh = useRefreshStore((state) => state.triggerRefresh);
	const isEditMode = !!id;
	const [loading, setLoading] = useState(false);

	const formMethods = useForm<DeptAddFormValues>({
		defaultValues: {
			deptNm: '',
			deptEmail: '',
			deptCode: '',
			deptShortNm: '',
			treeParentId: parentId,
		},
	});

	const { reset } = formMethods;

	useEffect(() => {
		const fetchDetail = async () => {
			if (isEditMode && id) {
				const response = await axiosConfig.get(`/api/dept/${id}`);
				reset(response);
				console.log('데이터 로드');
				console.log(response);
			}
		};
		fetchDetail();
	}, [id, isEditMode, reset, alert]);

	const onSubmit = formMethods.handleSubmit(async (data) => {
		setLoading(true);
		try {
			if (isEditMode) {
				await axiosConfig.put(`/api/dept/${id}`, data);
			} else {
				await axiosConfig.post('/api/dept', data);
			}
			triggerRefresh();

			if (onSuccess) {
				onSuccess();
			} else {
				router.back();
			}
		} finally {
			setLoading(false);
		}
	});

	return { ...formMethods, loading, onSubmit, router };
}
