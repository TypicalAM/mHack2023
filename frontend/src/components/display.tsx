import React from 'react'

import { ApiResult } from './../api/api'
import Card from './card'

export default function DisplayResults(props: ApiResult) {
	return (
		<div className="flex flex-col">
			<Card />
			<Card />
			<Card />
		</div>
	)
}
