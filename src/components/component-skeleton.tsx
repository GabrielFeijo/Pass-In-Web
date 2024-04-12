export function ComponentSkeleton() {
	return (
		<div className='space-y-3 border border-white/10 rounded-lg bg-slate-900 p-6 hover:border-emerald-500 transition-colors delay-75 cursor-pointer animate-pulse w-56'>
			<ul className='space-y-3'>
				<li className='w-full h-3 rounded-full bg-gray-700'></li>
				<li className='w-3/4 h-3 rounded-full bg-gray-700'></li>
			</ul>
			<hr className='w-full my-2 border-white/10' />
			<ul className='space-y-2'>
				<li className='w-1/2 h-2 rounded-full bg-gray-700'></li>
				<li className='w-1/2 h-2 rounded-full bg-gray-700'></li>
			</ul>
		</div>
	);
}
