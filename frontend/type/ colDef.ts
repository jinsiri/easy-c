import { ColDef } from 'ag-grid-community';

export const memberColDefs: ColDef<Record<string, any>>[] = [
	{ field: 'employeeId', headerName: '사번', editable: false },
	{ field: 'deptNms', headerName: '소속', editable: false },
	{ field: 'memberNm', headerName: '이름', editable: false },
	{ field: 'loginId', headerName: '로그인아이디', editable: false },
	{ field: 'positionTitle', headerName: '직위', editable: false },
	{ field: 'employmentType', headerName: '직원구분', editable: false },
	{ field: 'employmentStatus', headerName: '근무상태', editable: false },
	{ field: 'email', headerName: '사내이메일', editable: false },
	{ field: 'phoneNumber', headerName: '휴대전화', editable: false },
	{ field: 'memberRole', headerName: '권한', editable: false },
	{ field: 'accountStatus', headerName: '계정상태', editable: false },
];
