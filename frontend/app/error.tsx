'use client';

import { useEffect, useRef } from 'react';
import { useDialogStore } from '@/store/useDialogStore';
import { useRouter } from 'next/navigation';

export default function Error({ error }: { error: any }) {
	const { alert } = useDialogStore();
	const router = useRouter();
	const isProcessed = useRef(false);

	useEffect(() => {
		if (isProcessed.current) return;

		const handleError = async () => {
			isProcessed.current = true;

			let finalMessage = '오류가 발생했습니다.';
			let isAuth = false;

			try {
				const rawData = error?.message || error;

				if (typeof rawData === 'string' && rawData.startsWith('{')) {
					const parsed = JSON.parse(rawData);
					finalMessage = parsed.message;
					isAuth = parsed.isAuthError;
				} else {
					finalMessage = rawData || finalMessage;
				}
			} catch (e) {
				finalMessage = error?.message || finalMessage;
			}

			if (finalMessage === 'OK') finalMessage = '접근 권한이 없거나 세션이 만료되었습니다.';

			if (isAuth) {
				await alert('세션이 만료되어 로그인 페이지로 이동합니다.');
				router.push('/login');
			} else {
				await alert(finalMessage);
			}
		};

		handleError();
	}, [error, alert, router]);

	return null;
}
