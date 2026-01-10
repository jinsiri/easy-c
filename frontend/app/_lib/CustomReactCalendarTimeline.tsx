'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

/** MUI */
import { Box } from '@mui/material';

/** lib */
import dayjs from 'dayjs';
import { TimelineGroupBase, TimelineItemBase } from 'react-calendar-timeline';

/** * Timeline 라이브러리를 dynamic으로 로드.
 * ssr: false 설정이 핵심입니다.
 */
const Timeline = dynamic(() => import('react-calendar-timeline'), {
	ssr: false,
	loading: () => <div>Loading Timeline...</div>,
});

interface CustomTimelineItemBase extends TimelineItemBase<Date> {
	title: string;
}

const CustomReactCalendarTimeline = () => {
	const [isMounted, setIsMounted] = useState(false);
	const [currentTime, setCurrentTime] = useState(dayjs());

	const groups: TimelineGroupBase[] = [{ id: 1, title: 'group 1' }];

	useEffect(() => {
		setIsMounted(true);
		setCurrentTime(dayjs());
	}, []);

	const items: CustomTimelineItemBase[] = [
		{
			id: 1,
			group: 1,
			title: 'item 1',
			start_time: currentTime.toDate(),
			end_time: currentTime.add(1, 'hour').toDate(),
			canMove: false,
			canResize: false,
			canChangeGroup: false,
		},
		{
			id: 3,
			group: 1,
			title: 'item 3',
			start_time: currentTime.add(2, 'hour').toDate(),
			end_time: currentTime.add(3, 'hour').toDate(),
			canMove: false,
			canResize: false,
			canChangeGroup: false,
		},
	];

	// 마운트되기 전(서버 렌더링 시점)에는 아무것도 렌더링하지 않음.
	if (!isMounted) return null;

	return (
		<Box sx={{ width: '100%', height: '100%', minHeight: '5rem' }}>
			<Timeline
				groups={groups}
				items={items}
				defaultTimeStart={currentTime.add(-12, 'hour').toDate()}
				defaultTimeEnd={currentTime.add(12, 'hour').toDate()}
			/>
		</Box>
	);
};

CustomReactCalendarTimeline.displayName = 'CustomReactCalendarTimeline';
export default CustomReactCalendarTimeline;
