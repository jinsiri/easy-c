'use client';

import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';

/** Mui */
import { Box } from '@mui/material';

/** lib */
import { EChartsOption } from 'echarts';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import {
	LineChart,
	BarChart,
	PieChart,
	RadarChart,
	GaugeChart,
	// ScatterChart,
	// RadarChart,
	// MapChart,
	// TreeChart,
	// TreemapChart,
	// GraphChart,
	// FunnelChart,
	// ParallelChart,
	// SankeyChart,
	// BoxplotChart,
	// CandlestickChart,
	// EffectScatterChart,
	// LinesChart,
	// HeatmapChart,
	// PictorialBarChart,
	// ThemeRiverChart,
	// SunburstChart,
	// CustomChart,
} from 'echarts/charts';

import {
	GridComponent,
	TooltipComponent,
	TitleComponent,
	DatasetComponent,
	LegendComponent,
	MarkPointComponent,
	MarkLineComponent,
	MarkAreaComponent,
	// GridSimpleComponent,
	// PolarComponent,
	// RadarComponent,
	// GeoComponent,
	// SingleAxisComponent,
	// ParallelComponent,
	// CalendarComponent,
	// GraphicComponent,
	// ToolboxComponent,
	// AxisPointerComponent,
	// BrushComponent,
	// TimelineComponent,
	// LegendScrollComponent,
	// LegendPlainComponent,
	// DataZoomComponent,
	// DataZoomInsideComponent,
	// DataZoomSliderComponent,
	// VisualMapComponent,
	// VisualMapContinuousComponent,
	// VisualMapPiecewiseComponent,
	// AriaComponent,
	// TransformComponent,
} from 'echarts/components';

import { CanvasRenderer } from 'echarts/renderers';

/** custom */
import { BAR_OPTION, PIE_OPTION, LINE_OPTION, LINE_AREA_OPTION, RADAR_OPTION, GAUGE_OPTION, RANK_BAR_OPTION, STACK_BAR_OPTION } from '@/utils/echartOption';

echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	DatasetComponent,
	LegendComponent,
	MarkPointComponent,
	MarkLineComponent,
	MarkAreaComponent,
	LineChart,
	PieChart,
	BarChart,
	RadarChart,
	GaugeChart,
	CanvasRenderer,
]);
echarts.registerTheme('_theme', {});

export type EchartCompRef = ReactEChartsCore | null;

interface ChartOptionProps {
	chartType: 'bar' | 'pie' | 'line' | 'line_area' | 'radar' | 'gauge' | 'rank_bar' | 'stack_bar';
	option?: Record<string, any>;
	data?: Record<string, any>[]; // pie 차트용
}

const OPTION_MAP = {
	bar: BAR_OPTION,
	pie: PIE_OPTION,
	line_area: LINE_AREA_OPTION,
	radar: RADAR_OPTION,
	gauge: GAUGE_OPTION,
	rank_bar: RANK_BAR_OPTION,
	stack_bar: STACK_BAR_OPTION,
	line: LINE_OPTION,
};

const CustomEchartComp = forwardRef<EchartCompRef, ChartOptionProps>(({ chartType, option, data }, ref) => {
	const echartRef = useRef<ReactEChartsCore>(null);

	const [chartOption, setChartOption] = useState<EChartsOption>({});

	useImperativeHandle(ref, () => {
		if (!echartRef.current) {
			return {} as ReactEChartsCore; // 또는 에러 방지를 위한 빈 객체
		}
		return echartRef.current;
	});

	useEffect(() => {
		const baseOption = structuredClone(OPTION_MAP[chartType]);

		const finalOption: EChartsOption = {
			...baseOption,
			...option,
		} as EChartsOption;

		if (data) {
			if (chartType === 'pie' || chartType === 'gauge') {
				if (finalOption.series && Array.isArray(finalOption.series)) {
					finalOption.series[0].data = data;
				}
			}
		}

		setChartOption(finalOption);
	}, [chartType, option, data]);

	return (
		<Box sx={{ width: '100%', height: '100%', minHeight: '4rem' }}>
			{chartOption && (
				<ReactEChartsCore
					ref={echartRef}
					style={{ width: '100%', height: '100%' }}
					echarts={echarts}
					option={chartOption}
					notMerge={true}
					lazyUpdate={true}
					theme={'_theme'}
				/>
			)}
		</Box>
	);
});

CustomEchartComp.displayName = 'CustomEchartComp';
export default CustomEchartComp;
