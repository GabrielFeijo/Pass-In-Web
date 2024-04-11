import { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface TableCellProps extends ComponentPropsWithoutRef<'td'> {}

export function TableCell(props: TableCellProps) {
	return (
		<td
			{...props}
			className={twMerge('py-3 px-4', props.className)}
		/>
	);
}
