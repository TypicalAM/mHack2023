const LOCAL_STORAGE_KEY = 'api'

export interface Query {
	benefit: string,
	province: string,
	locality: string,
}

export interface Pages {
	count: number,
	next: string | null,
	previous: string | null,
	current: string,
	first: string,
	last: string | null
}

export interface Kolejka {
	provider: string,
	place: string,
	benefit: string,
	address: string,
	locality: string,
	phone: string,
	latitude: string,
	longitude: string,
	awaiting: number,
	average_period: number,
	date_situation_as_at: string,
	date: string
}

export interface ApiResult {
	pages: Pages,
	objects: Array<Kolejka>
}

interface StoredResult {
	result: ApiResult,
	expiry: number
}

function HasLocalCopy(): Boolean {
	let value = localStorage.getItem(LOCAL_STORAGE_KEY)
	if (!value) return false

	let json: StoredResult
	try {
		json = JSON.parse(value) as StoredResult
	} catch (e) {
		console.error("Can't parse local storage value, removing it", e)
		localStorage.removeItem(LOCAL_STORAGE_KEY)
		return false
	}

	if (json.expiry < Date.now()) {
		localStorage.removeItem(LOCAL_STORAGE_KEY)
		return false
	}

	return true
}

export function GetLocalCopy(): ApiResult | null {
	if (!HasLocalCopy()) return null
	let value = localStorage.getItem(LOCAL_STORAGE_KEY)
	if (!value) return null

	try {
		let json = JSON.parse(value) as StoredResult
		return json.result
	} catch (e) {
		console.error("Can't parse local storage value, removing it", e)
		localStorage.removeItem(LOCAL_STORAGE_KEY)
		return null
	}
}

export function DeleteLocalCopy(): void {
	localStorage.removeItem(LOCAL_STORAGE_KEY)
}


export async function QueryApi(input: Query): Promise<ApiResult | null> {
	const url = 'http://localhost:5000/api'
	let requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(input),
	}

	return fetch(url, requestOptions).then(response => {
		if (!response.ok)
			throw new Error('Network response was not ok')

		return response.json()
	}).then(data => {
		let stored: StoredResult = { result: data, expiry: Date.now() + 1000 * 60 * 60 * 24 }
		try {
			console.log("Saving in local storage!")
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stored))
		} catch (e) {
			console.error("Can't store in local storage", e)
			throw new Error("Can't store in local storage")
		}

		return data as ApiResult
	}).catch(error => {
		console.error('There has been a problem with your fetch operation:', error)
		throw new Error('There has been a problem with your fetch operation')
	})
}
