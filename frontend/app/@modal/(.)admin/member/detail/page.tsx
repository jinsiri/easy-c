'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import MemberDetailPage from '@/app/admin/member/detail/page';

export default function MemberDetailModal() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const memberId = searchParams.get('memberId');

	return (
		<BaseDialog title='멤버 상세' confirmLabel='수정' onConfirm={() => router.push(`/admin/member/edit?memberId=${memberId}`)} maxWidth={false} fullWidth paperSx={{ width: '90vw', maxWidth: '90vw' }}>
			<MemberDetailPage />
		</BaseDialog>
	);
}
