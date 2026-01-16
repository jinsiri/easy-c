import React from 'react';

/** MUI */
import { Box } from '@mui/material';

/** lib */
import { Timeline, TimelineGroupBase, TimelineItemBase } from 'react-calendar-timeline';

const defaultGroup: TimelineGroupBase[] = [
	{
		id: 'group1',
		title: 'adfs',
	},
];

const defaultItem: TimelineItemBase<Date>[] = [
	{
		id: 'item1',
		group: 'group1',
		start_time: new Date('2026-01-16T08:00:00'),
		end_time: new Date('2026-01-16T17:00:00'),
		canMove: false,
		canResize: false,
		canChangeGroup: false,
	},
];

const CustomReactCalendarTimeline = ({ itemList }: { itemList?: TimelineItemBase<Date>[] }) => {
	return (
		<Box sx={{ width: '100%', height: '100%', minWidth: '20rem', minHeight: '5rem' }}>
			<Timeline
				groups={defaultGroup}
				items={itemList ?? []}
				defaultTimeStart={new Date('2026-01-16T00:00:00').getTime()}
				defaultTimeEnd={new Date('2026-01-16T23:59:59').getTime()}
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
			/>
		</Box>
	);
};

CustomReactCalendarTimeline.displayName = 'CustomReactCalendarTimeline';
export default CustomReactCalendarTimeline;
