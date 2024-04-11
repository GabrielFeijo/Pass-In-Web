import { ComponentPropsWithoutRef } from 'react';

interface TableHeaderProps extends ComponentPropsWithoutRef<'th'> {}

export function TableHeader(props: TableHeaderProps) {
	return (
		<th
			className='py-3 px-4'
			{...props}
		/>
	);
}
