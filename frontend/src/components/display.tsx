import React from 'react'

import { ApiResult } from './../api/api'
import Card from './card'

export default function DisplayResults(props: ApiResult) {
	return (
		<div className="flex flex-col justify-center items-center bg-back-layer-2 mt-4">
			{props.objects.map((obj, i) => (<Card {...obj} />))}
		</div>
	)
}
