interface Event {
	id: string;
	title: string;
	slug: string;
	details?: string;
	maximumAttendees?: number;
	attendeesAmount: number;
}

interface CardProps {
	event: Event;
}

export function Card({ event }: CardProps) {
	return (
		<a
			className='border border-white/10 rounded-lg bg-slate-900 w-full py-4 px-8 text-left hover:border-emerald-500 transition-colors delay-75 cursor-pointer'
			href={`/participantes/${event.slug}`}
		>
			<h3 className='text-xl font-bold break-all'>{event.title}</h3>
			<p className='text-zinc-300'>{event.details}</p>
			<hr className='my-2 w-full border-white/10' />
			<p className='text-zinc-300 text-xs'>
				Qtde. de vagas: {event.maximumAttendees || 'Sem limite'}
			</p>
			<p className='text-zinc-300 text-xs'>
				Participantes: {event.attendeesAmount}
			</p>
		</a>
	);
}
