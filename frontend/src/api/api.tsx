const LOCAL_STORAGE_KEY = 'api_mojtermin'

export interface Query {
	benefit: string,
	province: string,
	locality: string,
	page: number
}

export interface Pages {
	count: number,
	next: string | null,
	current: number,
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

export interface StoredResult {
	result: ApiResult,
	input: Query,
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

export function GetLocalCopy(): StoredResult | null {
	if (!HasLocalCopy()) return null
	let value = localStorage.getItem(LOCAL_STORAGE_KEY)
	if (!value) return null

	try {
		return JSON.parse(value) as StoredResult
	} catch (e) {
		console.error("Can't parse local storage value, removing it", e)
		localStorage.removeItem(LOCAL_STORAGE_KEY)
		return null
	}
}

export function DeleteLocalCopy(): void {
	localStorage.removeItem(LOCAL_STORAGE_KEY)
}


export async function QueryApi(input: Query): Promise<StoredResult | null> {
	const url = 'http://localhost:5000/api'
	let requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(input),
	}

	console.log("Fetching from API")
	console.log(input)
	return fetch(url, requestOptions).then(response => {
		if (!response.ok)
			throw new Error('Network response was not ok')

		return response.json()
	}).then(data => {
		let stored: StoredResult = { result: data, expiry: Date.now() + 1000 * 60 * 60 * 24, input: input }
		try {
			console.log("Saving in local storage!")
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stored))
		} catch (e) {
			console.error("Can't store in local storage", e)
			throw new Error("Can't store in local storage")
		}

		return stored
	}).catch(error => {
		console.error('There has been a problem with your fetch operation:', error)
		throw new Error('There has been a problem with your fetch operation')
	})
}
