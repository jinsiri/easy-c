import useForkRef from '@mui/utils/useForkRef';
import { DatePicker, DatePickerProps, DatePickerFieldProps } from '@mui/x-date-pickers/DatePicker';
import { usePickerContext } from '@mui/x-date-pickers/hooks';
import { IconButton } from '@mui/material';
import EventRoundedIcon from '@mui/icons-material/EventRounded';

function ButtonDateField(props: DatePickerFieldProps) {
	const pickerContext = usePickerContext();
	const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);

	return (
		<IconButton ref={handleRef} className={pickerContext.rootClassName} sx={pickerContext.rootSx} onClick={() => pickerContext.setOpen((prev) => !prev)}>
			<EventRoundedIcon />
		</IconButton>
	);
}

export default function ButtonFieldDatePicker(props: DatePickerProps) {
	return <DatePicker {...props} slots={{ ...props.slots, field: ButtonDateField }} />;
}
