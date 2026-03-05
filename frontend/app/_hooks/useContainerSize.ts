import { useState, useLayoutEffect, useRef } from 'react';

const useContainerSize = () => {
	const [size, setSize] = useState({ width: 0, height: 0 });
	const targetRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (!targetRef.current) return;

		const observer = new ResizeObserver((entries) => {
			for (let entry of entries) {
				const { width, height } = entry.contentRect;
				setSize({ width, height });
			}
		});

		observer.observe(targetRef.current);
		return () => observer.disconnect();
	}, []);

	return { targetRef, ...size };
};
