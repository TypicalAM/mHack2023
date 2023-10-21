import React from 'react'

import { ApiResult } from './../api/api'

export default function DisplayResults(props: ApiResult) {
	return (
		<div className="flex flex-col">
			<h2 className="text-2xl">This is some random text</h2>
			<h2 className="text-2xl">{props.randomText}</h2>

			<h2 className="text-2xl">This is some random number</h2>
			<h2 className="text-2xl">{props.randomNumber}</h2>
		</div>
	)
}
