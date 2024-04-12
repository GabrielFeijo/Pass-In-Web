import { Form } from '@unform/web';
import { Input } from './form/input';
import { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { FormHandles } from '@unform/core';

import '../utils/yupTranslations';
import Select from './form/select';
import { SubmitButton } from './form/submit-button';
import { Card } from './card';
import { ComponentSkeleton } from './component-skeleton';

interface IVFormErrors {
	[key: string]: string;
}

interface Event {
	id: string;
	title: string;
	slug: string;
	details?: string;
	maximumAttendees?: number;
	attendeesAmount: number;
}

const formValidationSchema = yup.object().shape({
	title: yup.string().required(),
	details: yup.string().required(),
	maximumAttendees: yup
		.number()
		.nullable()
		.transform((value) => {
			if (isNaN(value)) return null;
			return parseInt(value, 10);
		}),
});

const registerValidationSchema = yup.object().shape({
	name: yup.string().required(),
	email: yup.string().required(),
	event: yup
		.object({ label: yup.string().required(), value: yup.string().required() })
		.required(),
});

export function Events() {
	const formRef = useRef<FormHandles>(null);
	const registerFormRef = useRef<FormHandles>(null);

	const [events, setEvents] = useState<Event[]>([]);

	useEffect(() => {
		const url = new URL(`${import.meta.env.VITE_API_URL}/events`);

		fetch(url, { method: 'GET' })
			.then((response) => response.json())
			.then((data) => {
				setEvents(data.events);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	const handleSubmit = (data: {
		title: string;
		details: string;
		maximumAttendees?: number;
	}) => {
		formValidationSchema
			.validate(data, { abortEarly: false })
			.then((validatedData) => {
				fetch(`${import.meta.env.VITE_API_URL}/events`, {
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					method: 'POST',
					body: JSON.stringify(validatedData),
				})
					.then((response) => response.json())
					.then((data) => {
						formRef.current?.reset();
						setEvents((prevState) => [...prevState, data.event]);
					});
			})
			.catch((errors: yup.ValidationError) => {
				const validationErrors: IVFormErrors = {};
				errors.inner.forEach((error) => {
					if (!error.path) return;
					validationErrors[error.path] = error.message;
					formRef.current?.setErrors(validationErrors);
				});
			});
	};

	const handleRegister = (data: {
		name: string;
		email: string;
		event: { label: string; value: string };
	}) => {
		registerValidationSchema
			.validate(data, { abortEarly: false })
			.then((validatedData) => {
				console.log(validatedData);

				const info = {
					name: validatedData.name,
					email: validatedData.email,
				};

				fetch(
					`${import.meta.env.VITE_API_URL}/events/${
						validatedData.event.value
					}/attendees`,
					{
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
						method: 'POST',
						body: JSON.stringify(info),
					}
				)
					.then((response) => response.json())
					.then(() => {
						registerFormRef.current?.reset();

						setEvents((prevState) => {
							const index = prevState.findIndex(
								(event) => event.id === validatedData.event.value
							);

							prevState[index].attendeesAmount =
								prevState[index].attendeesAmount + 1;

							return [...prevState];
						});
					});
			})
			.catch((errors: yup.ValidationError) => {
				const validationErrors: IVFormErrors = {};
				errors.inner.forEach((error) => {
					if (!error.path) return;
					validationErrors[error.path] = error.message;
					registerFormRef.current?.setErrors(validationErrors);
				});
			});
	};

	return (
		<div className='flex gap-2 flex-wrap-reverse sm:flex-nowrap justify-between'>
			<section>
				<h1 className='text-2xl font-bold mb-4'>Eventos adicionados</h1>
				<div className='grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
					{events.length === 0 ? (
						<>
							<ComponentSkeleton />
							<ComponentSkeleton />
						</>
					) : (
						events.map((event) => (
							<Card
								key={event.id}
								event={event}
							/>
						))
					)}
				</div>
			</section>

			<div>
				<div className='bg-slate-900 rounded w-fit p-4 h-fit'>
					<h2 className='text-2xl font-bold'>Adicionar Eventos</h2>
					<Form
						ref={formRef}
						onSubmit={handleSubmit}
						className='flex-col gap-4 flex mt-4 w-72'
						placeholder={undefined}
						onPointerEnterCapture={undefined}
						onPointerLeaveCapture={undefined}
					>
						<Input
							type='text'
							placeholder='Título do evento'
							name='title'
						/>
						<Input
							type='text'
							placeholder='Detalhes do evento'
							name='details'
						/>
						<Input
							type='number'
							placeholder='Numero máximo de participantes'
							name='maximumAttendees'
						/>

						<SubmitButton
							type='submit'
							value='Adicionar Evento'
						/>
					</Form>
				</div>
				<div className='bg-slate-900 rounded w-fit p-4 h-fit mt-4'>
					<h2 className='text-2xl font-bold'>Adicionar Participantes</h2>
					<Form
						ref={registerFormRef}
						onSubmit={handleRegister}
						className='flex-col gap-4 flex mt-4 w-72'
						placeholder={undefined}
						onPointerEnterCapture={undefined}
						onPointerLeaveCapture={undefined}
					>
						<Input
							type='text'
							placeholder='Nome do participante'
							name='name'
						/>
						<Input
							type='email'
							placeholder='Email do participante'
							name='email'
						/>
						<Select
							name='event'
							placeholder='Selecione um evento...'
							options={events.map((event) => ({
								label: event.title,
								value: event.id,
							}))}
						/>

						<SubmitButton
							type='submit'
							value='Adicionar Participante'
						/>
					</Form>
				</div>
			</div>
		</div>
	);
}
