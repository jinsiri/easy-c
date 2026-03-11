import axiosConfig from '@/app/_lib/axiosConfig';
import { ExcelRequestDto } from '@/type/interface';

export const downloadExcel = async (url: string, request: ExcelRequestDto) => {
	const response = await axiosConfig.post(url, request, {
		responseType: 'blob',
	});

	if (response == null) {
		throw new Error('Excel download failed');
	}

	const blob = new Blob([response]);
	const blobUrl = window.URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = blobUrl;
	link.download = request.fileName + '.xlsx';

	document.body.appendChild(link);
	link.click();
	link.remove();
};
