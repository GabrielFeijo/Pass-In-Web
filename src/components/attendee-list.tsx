import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	MoreHorizontal,
	Search,
} from 'lucide-react';
import { IconButton } from './icon-button';
import { Table } from './table/table';
import { TableHeader } from './table/table-header';
import { TableCell } from './table/table-cell';
import { TableRow } from './table/table-row';
import { ChangeEvent, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigate, useParams } from 'react-router-dom';
import arrowLeft from '../assets/arrow-left.svg';

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

interface Attendee {
	id: string;
	name: string;
	email: string;
	createdAt: string;
	checkedInAt: string | null;
}

export function AttendeeList() {
	const { slug } = useParams();

	const [page, setPage] = useState(() => {
		const url = new URL(window.location.toString());

		if (url.searchParams.has('page')) {
			return Number(url.searchParams.get('page'));
		}

		return 1;
	});
	const [search, setSearch] = useState(() => {
		const url = new URL(window.location.toString());

		if (url.searchParams.has('query')) {
			return url.searchParams.get('query') ?? '';
		}

		return '';
	});

	const [total, setTotal] = useState(0);
	const [attendees, setAttendees] = useState<Attendee[]>([]);

	const totalPages = Math.ceil(total / 10);
	const navigate = useNavigate();

	useEffect(() => {
		const url = new URL(
			`${import.meta.env.VITE_API_URL}/events/${slug}/attendees`
		);

		url.searchParams.set('pageIndex', String(page - 1));

		if (search.length > 0) {
			url.searchParams.set('query', search);
		}

		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				setAttendees(data.attendees);
				setTotal(data.total);
			});
	}, [page, search, slug]);

	function checkIn(attendeeId: string) {
		fetch(
			`${import.meta.env.VITE_API_URL}/attendees/${attendeeId}/check-in`
		).then((response) => {
			if (response.ok) {
				setAttendees((prevState) => {
					const index = prevState.findIndex(
						(attendee) => attendee.id === attendeeId
					);

					prevState[index].checkedInAt = new Date().toISOString();

					return [...prevState];
				});
			}
		});
	}

	function setCurrentSearch(search: string) {
		const url = new URL(window.location.toString());

		setSearch(search);
		url.searchParams.set('query', search);
		window.history.pushState({}, '', url);
	}

	function setCurrentPage(page: number) {
		const url = new URL(window.location.toString());

		setPage(page);
		url.searchParams.set('page', String(page));
		window.history.pushState({}, '', url);
	}

	function onSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
		setCurrentSearch(event.target.value);
		setCurrentPage(1);
	}

	function goToFirstPage() {
		setCurrentPage(1);
	}

	function goToLastPage() {
		setCurrentPage(totalPages);
	}

	function goToNextPage() {
		setCurrentPage(page + 1);
	}

	function goToPreviousPage() {
		setCurrentPage(page - 1);
	}

	return (
		<div>
			<button
				onClick={() => navigate(-1)}
				className='grid grid-flow-col items-center gap-2 my-4 hover:underline'
			>
				<img
					src={arrowLeft}
					className='w-5 h-5 stroke-white'
					alt='Ícone de uma seta apontando para esquerda'
				/>
				Voltar
			</button>
			<div className='flex gap-3 items-center'>
				<h1 className='text-2xl font-bold'> Participantes</h1>

				<div className='w-72 px-3 py-1.5 border border-white/10 rounded-lg flex items-center gap-3'>
					<Search className='size-4 text-emerald-300' />
					<input
						onChange={onSearchInputChange}
						value={search}
						type='text'
						placeholder='Buscar participante...'
						className='bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0'
					/>
				</div>
			</div>

			<Table>
				<thead>
					<TableRow className='font-semibold text-white'>
						<TableHeader style={{ width: 48 }}>
							<input
								type='checkbox'
								className='size-4 bg-black/20 rounded border border-white/10 accent-orange-400 focus:ring-0 text-orange-400 '
							/>
						</TableHeader>
						<TableHeader>Código</TableHeader>
						<TableHeader>Participante</TableHeader>
						<TableHeader>Data de inscrição</TableHeader>
						<TableHeader>Data de check-in</TableHeader>
						<TableHeader style={{ width: 48 }}></TableHeader>
					</TableRow>
				</thead>
				<tbody>
					{attendees.length === 0 ? (
						<TableRow>
							<TableCell></TableCell>
							<TableCell className=''>Nenhum participante encontrado</TableCell>
						</TableRow>
					) : (
						attendees.map((attendee) => (
							<TableRow key={attendee.id}>
								<TableCell>
									<input
										type='checkbox'
										className='size-4 bg-black/20 rounded border border-white/10 focus:ring-0  text-orange-400'
									/>
								</TableCell>
								<TableCell>{attendee.id}</TableCell>
								<TableCell>
									<div className='flex flex-col gap-1'>
										<span className='font-semibold text-white'>
											{attendee.name}
										</span>
										<span>{attendee.email}</span>
									</div>
								</TableCell>
								<TableCell>{dayjs(attendee.createdAt).fromNow()}</TableCell>
								<TableCell>
									{attendee.checkedInAt ? (
										dayjs(attendee.checkedInAt).fromNow()
									) : (
										<button
											className='hover:underline text-emerald-400'
											onClick={() => checkIn(attendee.id)}
										>
											Fazer Check-in
										</button>
									)}
								</TableCell>
								<TableCell>
									<IconButton transparent>
										<MoreHorizontal className='size-4' />
									</IconButton>
								</TableCell>
							</TableRow>
						))
					)}
				</tbody>
				<tfoot>
					<TableRow>
						<TableCell colSpan={3}>
							Mostrando {attendees.length} de {total} itens
						</TableCell>
						<TableCell
							colSpan={3}
							className='text-right'
						>
							<div className='inline-flex items-center gap-8'>
								<span>
									Página {page} de {totalPages}
								</span>
								<div className='space-x-1.5'>
									<IconButton
										onClick={goToFirstPage}
										disabled={page === 1}
									>
										<ChevronsLeft className='size-4' />
									</IconButton>
									<IconButton
										onClick={goToPreviousPage}
										disabled={page === 1}
									>
										<ChevronLeft className='size-4' />
									</IconButton>
									<IconButton
										onClick={goToNextPage}
										disabled={page === totalPages}
									>
										<ChevronRight className='size-4' />
									</IconButton>
									<IconButton
										onClick={goToLastPage}
										disabled={page === totalPages}
									>
										<ChevronsRight className='size-4' />
									</IconButton>
								</div>
							</div>
						</TableCell>
					</TableRow>
				</tfoot>
			</Table>
		</div>
	);
}
