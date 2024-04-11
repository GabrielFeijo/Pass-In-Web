import React, { useRef, useEffect, useState } from 'react';
import ReactSelect, { Props as SelectProps } from 'react-select';
import { useField } from '@unform/core';

interface Props extends SelectProps {
	name: string;
	options: { label: string; value: string }[];
}

const Select: React.FC<Props> = ({ name, options, ...rest }) => {
	const selectRef = useRef(null);

	const { fieldName, defaultValue, registerField, error, clearError } =
		useField(name);

	const [value, setValue] = useState(defaultValue || null);

	useEffect(() => {
		registerField({
			name: fieldName,
			getValue: () => value,
			ref: selectRef.current,
			setValue: (_, newValue) => setValue(newValue),
			clearValue: (ref) => {
				ref.value = '';
				setValue(null);
			},
		});

		if (value) {
			options.forEach((option: { label: string; value: string }) => {
				option.label === value && setValue(option);
			});
		}
	}, [fieldName, options, registerField, value]);

	return (
		<>
			<ReactSelect
				id={fieldName}
				ref={selectRef}
				defaultValue={defaultValue}
				classNamePrefix={'react-select'}
				styles={{
					control: (styles) => ({
						...styles,
						backgroundColor: 'transparent',
						border: `${error ? '1px solid #ef4444 ' : '1px solid #ffffff40'} `,
						padding: '0.2rem',
					}),
					option: (styles) => ({
						...styles,
						color: 'white',
						backgroundColor: '#0f172a ',
						'&:hover': {
							backgroundColor: '#28324b',
							cursor: 'pointer',
						},
					}),
					input: (styles) => ({
						...styles,
						color: 'white',
						"input[type='text']:focus": { boxShadow: 'none' },
					}),
					singleValue: (styles) => ({
						...styles,
						color: 'white',
					}),
				}}
				onChange={(e) => {
					error && clearError();
					setValue(e);
				}}
				name={name}
				options={options}
				{...rest}
			/>

			{error && <p className='text-xs text-red-500 px-2 -mt-3'>{error}</p>}
		</>
	);
};

export default Select;
