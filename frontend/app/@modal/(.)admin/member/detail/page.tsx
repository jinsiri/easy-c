'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import MemberDetail from '@/app/admin/member/_component/MemberDetail';

export default function MemberDetailModal() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const memberId = searchParams.get('memberId');

	const handleEdit = () => {
		// 페이지 이동 후, 모달 안 닫히는 문제 해결
		const target = `/admin/member/edit?memberId=${memberId}`;
		const handlePopState = () => {
			window.removeEventListener('popstate', handlePopState);
			router.push(target);
		};
		window.addEventListener('popstate', handlePopState);
		router.back();
	};

	return (
		<BaseDialog title='멤버 상세' confirmLabel='수정' onConfirm={handleEdit} maxWidth={false} fullWidth paperSx={{ width: '90vw', maxWidth: '90vw' }}>
			<MemberDetail />
		</BaseDialog>
	);
}
