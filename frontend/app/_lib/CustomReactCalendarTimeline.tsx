'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

/** MUI */
import { Box, useTheme } from '@mui/material';

/** lib */
import dayjs from 'dayjs';
import { TimelineGroupBase, TimelineItemBase, ReactCalendarTimelineProps } from 'react-calendar-timeline';

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

const groupsEx: TimelineGroupBase[] = [{ id: 1, title: 'group 1', stackItems: true }];
const itemsEx: CustomTimelineItemBase[] = [
	{
		id: 1,
		group: 1,
		title: '근무시간',
		start_time: dayjs('2026-01-12 08:00').toDate(),
		end_time: dayjs('2026-01-12 17:00').toDate(),
		canMove: false,
		canResize: false,
		canChangeGroup: false,
	},
	{
		id: 3,
		group: 1,
		title: '초과근무',
		start_time: dayjs('2026-01-12 17:00').toDate(),
		end_time: dayjs('2026-01-12 20:00').toDate(),
		canMove: false,
		canResize: false,
		canChangeGroup: false,
	},
];

const CustomReactCalendarTimeline = ({
	keys,
	className = '',
	groups = [],
	items = [],
	defaultTimeStart,
	defaultTimeEnd,
	sidebarWidth = 150,
}: ReactCalendarTimelineProps) => {
	const theme = useTheme();

	const [isMounted, setIsMounted] = useState(false);
	const [currentTime, setCurrentTime] = useState(dayjs());

	useEffect(() => {
		setIsMounted(true);
		setCurrentTime(dayjs());
	}, []);

	// 마운트되기 전(서버 렌더링 시점)에는 아무것도 렌더링하지 않음.
	if (!isMounted || !theme) return null;

	const itemRenderer = ({ item, itemContext, getItemProps, getResizeProps }) => {
		const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
		const { key, ...itemProps } = getItemProps({
			style: {
				backgroundColor:
					item.title === '초과근무'
						? itemContext.selected
							? theme.palette.secondary.light
							: theme.palette.secondary.main
						: itemContext.selected
							? theme.palette.primary.light
							: theme.palette.primary.main,
				color: 'white',
				borderWidth: 0,
			},
		});

		return (
			<div key={key} {...itemProps}>
				{itemContext.useResizeHandle ? <div {...leftResizeProps} /> : ''}

				<div className='rct-item-content' style={{ maxHeight: `${itemContext.dimensions.height}` }}>
					{itemContext.title}
				</div>

				{itemContext.useResizeHandle ? <div {...rightResizeProps} /> : ''}
			</div>
		);
	};

	return (
		<Box sx={{ width: '100%', height: '100%', minWidth: '20rem', minHeight: '5rem' }}>
			<Timeline
				keys={keys}
				className={className}
				groups={groupsEx}
				items={itemsEx}
				itemRenderer={itemRenderer}
				defaultTimeStart={defaultTimeStart ?? currentTime.startOf('day').toDate()}
				defaultTimeEnd={defaultTimeEnd ?? currentTime.add(1, 'day').startOf('day').toDate()}
				sidebarWidth={sidebarWidth}
				minZoom={0}
				maxZoom={0}
				canMove={false}
				canChangeGroup={false}
				canResize={false}
				useResizeHandle={false}
				stackItems={true}
				traditionalZoom={false}
			/>
		</Box>
	);
};

CustomReactCalendarTimeline.displayName = 'CustomReactCalendarTimeline';
export default CustomReactCalendarTimeline;
