import { ResultType } from '@remix-run/router/dist/utils'
import { Query } from './../api/api'
import React, { useEffect, useLayoutEffect } from 'react'
import { ApiResult, GetLocalCopy, Pages, QueryApi, StoredResult } from '../api/api'
import { Button } from '../components/ui/button'
import DisplayResults from './../components/display'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import { Terminal } from 'lucide-react'

export default function Result() {
	const [data, setData] = React.useState(GetLocalCopy()! as StoredResult)
	const [errShow, setErrShow] = React.useState(false)
	const [errMsg, setErrMsg] = React.useState("")

	const extendList = async () => {
		let pages = data.result.pages
		if (!pages.next) {
			console.error("No more pages")
			setErrShow(true)
			setErrMsg("Nie ma więcej stron")
			return
		}

		console.log(data.input)
		let newQuery = structuredClone(data.input) as Query
		newQuery.page = data.input.page + 1
		console.log("New query", newQuery)

		let promise = QueryApi(newQuery)
		let newData: StoredResult | null
		try {
			newData = await promise
		} catch (e) {
			console.error("No result")
			setErrShow(true)
			setErrMsg("Błąd w pobieraniu danych")
			return
		}

		if (!newData) {
			console.error("No result")
			setErrShow(true)
			setErrMsg("Błąd w pobieraniu danych")
			return
		}

		console.log(newData.result.objects)
		newData.result.objects = [...data.result.objects, ...newData.result.objects]
		setData(newData)
	}

	return (
		<main className="bg-back-layer-1 h-screen w-screen flex-col items-center justify-center">
			{errShow && (
				<Alert>
					<Terminal className="h-4 w-4" />
					<AlertTitle>Heads up!</AlertTitle>
					<AlertDescription>
						{errMsg}
					</AlertDescription>
				</Alert >
			)}

			<h1 className="text-4xl text-center py-8">Wyniki wyszukiwania</h1>
			<DisplayResults {...data.result} />
			<Button onClick={() => extendList()}>Pokaż więcej</Button>
		</main>
	)
}
