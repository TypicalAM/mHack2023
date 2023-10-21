import React, { useEffect } from 'react'
import { GetLocalCopy, GetLocalCopyFake } from '../api/api'
import DisplayResults from './../components/display'

export default function Result() {
	useEffect(() => {
		let result = GetLocalCopyFake()
		if (!result)
			console.error("No result received, that's weird.")

		console.log(result)
	})

	return (
		<main className="bg-back-layer-1 h-screen w-screen flex-col items-center justify-center">
			<h1 className="text-4xl text-center py-8">Wyniki wyszukiwania</h1>
			<DisplayResults {...GetLocalCopy()!} />
		</main>
	)
}
