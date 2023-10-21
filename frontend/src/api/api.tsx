const LOCAL_STORAGE_KEY = 'api'

export interface Query {
	benefit: string,
	province: string,
	locality: string,
}

export interface Pages {
	count: number,
	next: string,
	previous: string,
	current: string,
	first: string,
	last: string
}

export interface ApiResult {
	pages: Pages,
	objects: Array<Query>
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


export function QueryApi(input: Query): ApiResult | null {
	const url = 'localhost:5000/api'
	let requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(input)
	}

	fetch(url, requestOptions).then(response => {
		if (!response.ok) throw new Error('Network response was not ok')

		return response.json()
	}).then(data => {
		let stored: StoredResult = { result: data, expiry: Date.now() + 1000 * 60 * 60 * 24 }
		try {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stored))
		} catch (e) {
			console.error("Can't store in local storage", e)
			return null
		}

		return data as ApiResult
	}).catch(error => {
		console.error('There has been a problem with your fetch operation:', error)
	})

	return null
}
