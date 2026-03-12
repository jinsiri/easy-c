import React, { useState, MouseEvent, ReactNode } from 'react';
import { Button, Menu, MenuItem, ButtonProps, SxProps, Theme } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';

interface DropdownOption {
	label: string;
	onClick: () => void;
	icon?: ReactNode;
	disabled?: boolean;
}

interface DropdownButtonProps {
	initialLabel: string;
	options: DropdownOption[];
	startIcon?: ReactNode;
	variant?: ButtonProps['variant'];
	color?: ButtonProps['color'];
	sx?: SxProps<Theme>;
}

const DropdownButton = ({ initialLabel, options, startIcon, variant = 'outlined', color = 'inherit', sx }: DropdownButtonProps) => {
	const [selectedLabel, setSelectedLabel] = useState<string>(initialLabel);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleItemClick = (option: DropdownOption) => {
		setSelectedLabel(option.label);
		if (option.onClick) option.onClick();
		handleClose();
	};

	return (
		<>
			<Button
				variant={variant}
				color={color}
				size='small'
				onClick={handleClick}
				startIcon={startIcon}
				endIcon={<KeyboardArrowDown />}
				sx={{
					textTransform: 'none',
					borderColor: 'divider',
					px: 1.5,
					minWidth: 'fit-content',
					...sx,
				}}
			>
				{selectedLabel}
			</Button>

			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				transformOrigin={{ vertical: 'top', horizontal: 'left' }}
				PaperProps={{
					elevation: 4,
					sx: { mt: 0.5, minWidth: 150, borderRadius: '4px' },
				}}
			>
				{options.map((option, index) => (
					<MenuItem
						key={`${option.label}-${index}`}
						onClick={() => handleItemClick(option)}
						disabled={option.disabled}
						selected={option.label === selectedLabel}
						sx={{ fontSize: '0.875rem', py: 1 }}
					>
						{option.label}
					</MenuItem>
				))}
			</Menu>
		</>
	);
};

export default DropdownButton;
