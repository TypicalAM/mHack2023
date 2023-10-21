import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './pages/home';
import Result from './pages/result';

const router = createBrowserRouter([
	{ path: "/", element: <Home /> },
	{ path: "/result", element: <Result /> }
]);

export default function App() {
	return (
		<React.StrictMode>
			<RouterProvider router={router} />
		</React.StrictMode>
	)
}
