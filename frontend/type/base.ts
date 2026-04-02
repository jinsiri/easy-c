// 공통 필드 (BaseDto)
export interface BaseDto {
	deleted?: boolean;
	active?: boolean;
	registerDate?: string;
	registerIp?: string;
	registerUser?: {
		loginId: string;
		memberNm: string;
		memberRole: string;
	};

	lastUpdateDate?: string;
	lastUpdateIp?: string;
	lastUpdateUser?: {
		loginId: string;
		memberNm: string;
		memberRole: string;
	};
}

// 트리 필드 (BaseTreeDto)
export interface BaseTreeDto extends BaseDto {
	treeLevel: number;
	treeSiblingOrder: number;
	treeParentId: number | null;
	treeChildCount: number;
	treeSortCode: string;
}
