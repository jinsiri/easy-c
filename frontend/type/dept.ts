import { BaseTreeDto } from '@/type/base';

export interface DeptResponseDto extends BaseTreeDto {
	deptId: number;
	deptNm: string;
	deptShortNm: string;
	deptCode: string;
	deptEmail: string | null;
}
