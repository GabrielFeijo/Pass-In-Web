import { useField } from '@unform/core';
import { ComponentPropsWithoutRef, useEffect, useRef } from 'react';

interface InputProps extends ComponentPropsWithoutRef<'input'> {
	error?: boolean;
	errorMessage?: string;
}

export function Input({ name = '', ...props }: InputProps) {
	const inputRef = useRef(null);
	const { fieldName, defaultValue, registerField, error, clearError } =
		useField(name);

	useEffect(() => {
		registerField({
			name: fieldName,
			ref: inputRef.current,
			getValue: (ref) => ref.value,
			clearValue: (ref) => {
				ref.value = '';
			},
		});
	}, [fieldName, registerField]);

	return (
		<div>
			<input
				className={`${
					error ? 'border-red-500' : 'border-gray-700'
				} px-4 rounded-lg text-sm focus:ring-0 dark:bg-slate-900 dark:text-gray-400 outline-none py-3 w-full`}
				id={fieldName}
				ref={inputRef}
				defaultValue={defaultValue}
				onKeyDown={(e) => {
					error && clearError();
					props.onKeyDown?.(e);
				}}
				onChange={(e) => {
					props.onChange?.(e);
				}}
				name={name}
				{...props}
			/>
			{error && <p className='text-xs text-red-500 mt-1 px-2'>{error}</p>}
		</div>
	);
}
