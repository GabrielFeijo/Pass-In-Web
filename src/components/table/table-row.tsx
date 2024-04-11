import { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface TableRowProps extends ComponentPropsWithoutRef<'tr'> {}

export function TableRow(props: TableRowProps) {
	return (
		<tr
			{...props}
			className={twMerge(
				'border-b border-white/10 text-zinc-300',
				props.className
			)}
		/>
	);
}
