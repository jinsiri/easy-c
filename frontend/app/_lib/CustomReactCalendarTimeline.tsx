import React from 'react';

/** MUI */
import { Box } from '@mui/material';

/** lib */
import { Timeline, TimelineGroupBase, TimelineItemBase, TimelineHeaders, DateHeader } from 'react-calendar-timeline';

const defaultGroup: TimelineGroupBase[] = [
	{
		id: 'group1',
		title: 'default',
	},
];

export default function CustomReactCalendarTimeline({
	itemList,
	visibleTimeStart,
	visibleTimeEnd,
}: {
	itemList?: TimelineItemBase<Date>[];
	visibleTimeStart?: number;
	visibleTimeEnd?: number;
}) {
	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<Box sx={{ width: '100%', height: '100%', maxWidth: `63rem`, minWidth: '56rem', minHeight: '5rem' }}>
				<Timeline
					groups={defaultGroup}
					items={itemList ?? []}
					defaultTimeStart={new Date('2026-01-01T00:00:00').getTime()}
					defaultTimeEnd={new Date('2026-01-01T23:59:59').getTime()}
					visibleTimeStart={visibleTimeStart}
					visibleTimeEnd={visibleTimeEnd}
					sidebarWidth={0}
					minZoom={0}
					maxZoom={0}
					canMove={false}
					canChangeGroup={false}
					canResize={false}
					canSelect={false}
					useResizeHandle={false}
					stackItems={true}
					traditionalZoom={false}
				>
					<TimelineHeaders>
						<DateHeader unit='primaryHeader' />
						<DateHeader />
					</TimelineHeaders>
				</Timeline>
			</Box>
		</Box>
	);
}
