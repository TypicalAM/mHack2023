import { AlertCircle } from 'lucide-react';
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

export default function Home() {
	return (
		<main>
			<div className="text-2xl"> Gówno </div>
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>
					Your session has expired. Please log in again.
				</AlertDescription>
			</Alert>
		</main>
	)
}
