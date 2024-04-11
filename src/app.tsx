import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AttendeeList } from './components/attendee-list';
import { Events } from './components/events';

export function App() {
	return (
		<div className=' mx-auto p-5 space-y-5'>
			<Router>
				<Routes>
					<Route
						path='/'
						element={<Events />}
					/>
					<Route
						path='/participantes/:slug'
						element={<AttendeeList />}
					/>
				</Routes>
			</Router>
		</div>
	);
}
