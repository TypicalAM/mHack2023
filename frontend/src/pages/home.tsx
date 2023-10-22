import React from 'react';
import { Navigate } from 'react-router-dom';
import { DeleteLocalCopy } from '../api/api';
import { Button } from '../components/ui/button';

export default function Home() {
	const [redirect, setRedirect] = React.useState(false)

	React.useEffect(() => {
		console.log("Deleting the local result copy")
		DeleteLocalCopy() // Delete the local copy of the data, if it exists
	})

	return (
		< main className="h-screen bg-back-layer-1" >
			{redirect ? (
				<Navigate to="/choice" />
			) : (
				<div>
					<div className="flex flex-col justify-center items-center w-screen h-2/5 bg-primary-40">
						<img className="mt-16 h-1/2" alt="logo" src="./../logo.png" />
						<h1 className="h-1/2 text-3xl my-3 text-default font-bold text-secondary-20"> mTermin </h1>
					</div>

					<div className="flex flex-col mt-6 h-1/2 justify-center items-center w-screen h-fill">
						<h2 className="text-2xl mb-8 font-bold font-default h-1/4 mt-6 text-text-subdued"> Uwaga! </h2>
						<div className="w-5/6 bg-back-layer-2 p-10 rounded-2xl">
							<p className="text-justify"> Dane o dostępności pochodzą z systemu NFZ-szpitale, przychodnie i inne placówki medyczne same udostępniają informacje o dostępności, w związku z czym mogą być one nieaktualne. Klikając "Dalej" akceptujesz Regulamin Usługi "mTermin" oraz Politykę Prywatności. </p>
						</div>
						<Button className="w-4/6 p-7 mt-6" onClick={() => { setRedirect(true) }}> Dalej </Button>
					</div>
				</div>
			)}
		</main >
	)
}
