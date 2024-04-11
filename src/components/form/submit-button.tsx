import { ComponentPropsWithoutRef } from 'react';

interface SubmitButtonProps extends ComponentPropsWithoutRef<'input'> {}

export function SubmitButton({ ...props }: SubmitButtonProps) {
	return (
		<input
			className='py-3 px-4 border border-gray-200 rounded-lg dark:border-gray-700 hover:cursor-pointer hover:bg-emerald-600 transition-colors delay-75'
			{...props}
		/>
	);
}
