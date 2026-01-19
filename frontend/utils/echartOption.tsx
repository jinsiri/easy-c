export const PIE_OPTION = {
	tooltip: {
		trigger: 'item',
	},
	/*legend: {
        top: '5%',
        left: 'center',
    },*/
	series: [
		{
			type: 'pie',
			radius: ['25%', '70%'],
			avoidLabelOverlap: true,
			padAngle: 2,
			itemStyle: {
				borderRadius: 10,
			},
			label: {
				show: true,
				position: 'inside',
				overflow: 'truncate',
				alignTo: 'none',
				fontSize: 18,
				fontWeight: 'bold',
				formatter: (params) => {
					// value가 0이면 label 숨김
					return params.value === 0 ? '' : `${params.name}`;
				},
			},
			labelLine: {
				show: false,
			},
			emphasis: {
				itemStyle: {
					opacity: 1,
				},
				label: {
					show: true,
					fontWeight: 'bold',
				},
			},
			encode: {
				value: 'value',
				itemName: 'name',
			},
			data: [{}],
		},
	],
};

export const LINE_OPTION = {
	xAxis: {
		type: 'category',
		boundaryGap: false,
		data: [],
	},
	yAxis: {
		type: 'value',
	},
	series: [
		{
			data: [],
			type: 'line',
		},
	],
};

export const LINE_AREA_OPTION = {
	xAxis: {
		type: 'category',
		boundaryGap: false,
		data: [],
	},
	yAxis: {
		type: 'value',
	},
	series: [
		{
			data: [],
			type: 'line',
			areaStyle: {
				opacity: 0.4,
			},
		},
	],
};

export const RADAR_OPTION = {
	radar: {
		indicator: [],
		axisName: {
			color: '#a0a1a1',
		},
		splitLine: {
			lineStyle: {
				color: ['rgba(118, 199, 176, 0.2)'],
			},
		},
		splitArea: {
			areaStyle: {
				color: ['rgba(250,250,250,0.3)', 'rgba(138, 206, 186, 0.1)'],
				shadowBlur: 0,
			},
		},
	},
	series: [
		{
			type: 'radar',
			symbol: 'none',

			areaStyle: { opacity: 0.4 },
			data: [{}],
		},
	],
};

export const GAUGE_OPTION = {
	tooltip: {
		trigger: 'item',
	},
	series: [
		{
			type: 'gauge',
			startAngle: 180,
			endAngle: 0,
			center: ['50%', '75%'],
			radius: '100%',
			min: 0,
			max: 100,
			splitNumber: 8,
			axisLine: {
				lineStyle: {
					width: 6,
					color: [
						[0.249, '#ADB5BD'],
						[0.499, '#A8DADC'],
						[0.749, '#FDDD60'],
						[1, '#FF6E76'],
					],
				},
			},
			pointer: {
				icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
				length: '12%',
				width: 20,
				offsetCenter: [0, '-60%'],
				itemStyle: {
					color: 'auto',
				},
			},
			axisTick: {
				length: 12,
				lineStyle: {
					color: 'auto',
					width: 2,
				},
			},
			splitLine: {
				length: 20,
				lineStyle: {
					color: 'auto',
					width: 5,
				},
			},
			axisLabel: {
				color: '#a0a1a1',
				fontSize: 14,
				distance: -50,
				rotate: 'tangential',
				formatter: (value: number) => {
					return '';
				},
			},
			title: {
				offsetCenter: [0, '-10%'],
				fontSize: 16,
				fontWeight: 800,
				color: 'inherit',
			},
			detail: {
				fontSize: 40,
				offsetCenter: [0, '-35%'],
				valueAnimation: true,
				color: 'inherit',
			},
			data: [
				{
					value: 70,
				},
			],
		},
	],
};

export const BAR_OPTION = {
	xAxis: {
		type: 'category',
		boundaryGap: false,
		data: [],
	},
	yAxis: {
		type: 'value',
	},
	series: [
		{
			data: [],
			type: 'line',
		},
	],
};

export const RANK_BAR_OPTION = {
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'shadow',
		},
	},
	legend: {},
	xAxis: {
		type: 'value',
	},
	yAxis: {
		type: 'category',
		data: [''],
		inverse: true,
	},
	series: [
		{
			type: 'bar',
			data: [0],
		},
	],
};

export const STACK_BAR_OPTION = {
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'shadow',
		},
	},
	legend: {
		show: false,
	},
	xAxis: {
		type: 'category',
	},
	yAxis: {
		type: 'category',
		data: [''],
		axisLabel: false,
	},
	series: [
		{
			name: 'Direct',
			type: 'bar',
			stack: 'total',
			label: {
				show: true,
			},
			emphasis: {
				focus: 'series',
			},
			data: [0],
		},
	],
};
