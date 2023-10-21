import React from 'react';
import { Button } from '../components/ui/button';

export default function Home() {
	return (
		<main className="h-screen">
			<div className="flex flex-col justify-center items-center w-screen h-2/5 bg-primary-60">
				<p className="h-3/4"> icon1 </p>
				<h1 className="h-1/2 text-2xl text-default font-bold text-secondary-20"> mTermin </h1>
			</div>

			<div className="flex flex-col justify-center items-center w-screen h-fill bg-back-layer-1">
				<h2 className="text-xl font-bold font-default h-1/4 mt-6"> Uwaga! </h2>
				<div>
					<p className="text-justify"> Dane o dostępności pochodzą z systemu NFZ-szpitale, przychodnie i inne placówki medyczne same udostępniają informacje o dostępności, w związku z czym mogą być one nieaktualne. Klikając "Dalej" akceptujesz Regulamin Usługi "mTermin" oraz Politykę Prywatności. </p>
				</div>
				<Button className="w-1/2 h-1/4 mt-6"> Dalej </Button>
			</div>
		</main>
	)
}
