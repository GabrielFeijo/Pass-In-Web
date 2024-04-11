import { ComponentPropsWithoutRef } from 'react';

export interface TableProps extends ComponentPropsWithoutRef<'table'> {}

export function Table(props: TableProps) {
	return (
		<div className='border border-white/10 rounded-lg mt-4 bg-slate-900'>
			<table
				className='w-full text-left text-sm'
				{...props}
			/>
		</div>
	);
}
