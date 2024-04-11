import { ComponentPropsWithoutRef } from 'react';

interface IconButtonProps extends ComponentPropsWithoutRef<'button'> {
	transparent?: boolean;
}

export function IconButton({ transparent, ...props }: IconButtonProps) {
	return (
		<button
			{...props}
			className={`border border-white/10 rounded-md p-1.5
             ${transparent ? 'bg-black/20 ' : 'bg-white/10'}
			 ${props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
			 `}
		/>
	);
}
