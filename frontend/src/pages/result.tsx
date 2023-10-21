import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { GetLocalCopy } from '../api/api'
import DisplayResults from './../components/display'

export default function Result() {
	let { id } = useParams()

	useEffect(() => {
		console.log("The component has mounted!")
		console.log("The id is: ", id)
		let result = GetLocalCopy()
		if (!result)
			console.error("Gówno")
	})

	return (
		<div>
			<h1> The page is {id} </h1>
			<div> This is the result page </div>
			<p> And this is the result compponent </p>
			<DisplayResults {...GetLocalCopy()!} />
		</div>
	)
}
