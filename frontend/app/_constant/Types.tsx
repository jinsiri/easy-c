export type menuType = {
	id: string;
	title: string;
	type: '1depth' | '2depth' | '3depth';
	url: string;
	icon?: React.ElementType;
	children?: menuType[];
};
