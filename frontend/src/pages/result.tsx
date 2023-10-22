import { ResultType } from '@remix-run/router/dist/utils'
import React, { useEffect, useLayoutEffect } from 'react'
import { ApiResult, GetLocalCopy, Pages } from '../api/api'
import { Button } from '../components/ui/button'
import DisplayResults from './../components/display'

export default function Result() {
	const [itemList, setItemList] = React.useState(GetLocalCopy()! as ApiResult)
	const [pageinfo, setPageinfo] = React.useState({} as any)

	useLayoutEffect(() => {
		console.log("LOCAL COPY!!!!")
	}, [])

	const extendList = () => {
		console.log(itemList)
		console.log("Extending list!")
	}

	return (
		<main className="bg-back-layer-1 h-screen w-screen flex-col items-center justify-center">
			<h1 className="text-4xl text-center py-8">Wyniki wyszukiwania</h1>
			<DisplayResults {...itemList} />
			<Button onClick={() => extendList()}>Pokaż więcej</Button>
		</main>
	)
}
