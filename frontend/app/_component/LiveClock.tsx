'use client';

import React, { useEffect, useState } from 'react';
import Clock from 'react-live-clock';

export default function LiveClock() {
	const [mounted, setMounted] = useState(false);
	const [userTimeZone, setUserTimeZone] = useState('Asia/Seoul');

	useEffect(() => {
		setMounted(true);

		// 브라우저 환경에서만 실행됨
		const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		setUserTimeZone(tz);
	}, []);

	return mounted ? <Clock format={'YYYY-MM-DD ddd HH:mm:ss'} ticking={true} timezone={userTimeZone} /> : <div></div>;
}
