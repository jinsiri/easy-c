import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button, CircularProgress, DialogActions, DialogContent } from '@mui/material';

export interface BaseDialogProps {
	title: string;
	children: React.ReactNode;
	loading?: boolean;
	onConfirm?: () => void;
	confirmLabel?: string;
	maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	fullWidth?: boolean;
}

export default function BaseDialog(props: BaseDialogProps) {
	const { title, children, loading, onConfirm, confirmLabel = '저장', maxWidth = 'sm', fullWidth = false } = props;
	const router = useRouter();

	const handleClose = () => {
		router.back();
	};

	return (
		<Dialog onClose={handleClose} open={true} maxWidth={maxWidth} fullWidth={fullWidth}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>{children}</DialogContent>
			<DialogActions className='base-dialog'>
				<Button variant='text' onClick={handleClose}>
					닫기
				</Button>
				{onConfirm && (
					<Button variant='contained' onClick={onConfirm} disabled={loading}>
						{loading ? <CircularProgress size={24} /> : confirmLabel}
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
}
