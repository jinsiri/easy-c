import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button, CircularProgress, DialogActions, DialogContent } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

export interface BaseDialogProps {
	title: string;
	children: React.ReactNode;
	loading?: boolean;
	onConfirm?: () => void;
	onClose?: () => void;
	confirmLabel?: string;
	maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
	fullWidth?: boolean;
	paperSx?: SxProps<Theme>;
}

export default function BaseDialog(props: BaseDialogProps) {
	const { title, children, loading, onConfirm, onClose, confirmLabel = '저장', maxWidth = 'sm', fullWidth = false, paperSx } = props;
	const router = useRouter();

	const handleClose = () => {
		if (onClose) {
			onClose();
		} else {
			router.back();
		}
	};

	return (
		<Dialog
			onClose={handleClose}
			open={true}
			maxWidth={maxWidth}
			fullWidth={fullWidth}
			slotProps={{
				paper: {
					sx: paperSx,
				},
			}}
		>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>{children}</DialogContent>
			<DialogActions className='base-dialog'>
				<Button variant='text' onClick={handleClose}>
					닫기
				</Button>
				{onConfirm && (
					<Button variant='contained' onClick={() => onConfirm?.()} disabled={loading}>
						{loading ? <CircularProgress size={24} /> : confirmLabel}
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
}
