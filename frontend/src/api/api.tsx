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

export function GetLocalCopyFake(): ApiResult {
	return clearlyFakeResult as ApiResult
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
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stored))
		} catch (e) {
			console.error("Can't store in local storage", e)
			return null
		}

		return data as ApiResult
	}).catch(error => {
		console.error('There has been a problem with your fetch operation:', error)
		throw new Error('There has been a problem with your fetch operation')
	})
}

const clearlyFakeResult = {
	objects: [
		{
			address: "ZWYCIĘZCÓW 28/30",
			average_period: 0,
			awaiting: 0,
			benefit: "PORADNIA STOMATOLOGICZNA",
			date: "2023-10-19",
			date_situation_as_at: "2023-10-19",
			latitude: "52.231494",
			locality: "WARSZAWA PRAGA-POŁUDNIE",
			longitude: "21.05658",
			phone: "022 6728149",
			place: "KOMPLET PRZYCHODNIA STOMATOLOGICZNA",
			provider: "KOMPLET PRZYCHODNIA STOMATOLOGICZNA"
		},
		{
			address: "GARWOLIŃSKA 16",
			average_period: 0,
			awaiting: 0,
			benefit: "PORADNIA STOMATOLOGICZNA",
			date: "2023-10-19",
			date_situation_as_at: "2023-10-19",
			latitude: "52.2485379",
			locality: "WARSZAWA PRAGA-POŁUDNIE",
			longitude: "21.09248",
			phone: "0226730884",
			place: "KOMPLET PRZYCHODNIA STOMATOLOGICZNA FILIA NR 1",
			provider: "KOMPLET PRZYCHODNIA STOMATOLOGICZNA"
		},
		{
			address: "KARMELICKA 26",
			average_period: 0,
			awaiting: 0,
			benefit: "PORADNIA STOMATOLOGICZNA",
			date: "2023-10-19",
			date_situation_as_at: "2023-10-19",
			latitude: "52.250665",
			locality: "WARSZAWA ŚRÓDMIEŚCIE",
			longitude: "20.990048",
			phone: "022635-67-02",
			place: "GABINET STOMATOLOGICZNY",
			provider: "NIEPUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ CENTRALNA PRZYCHODNIA REHABILITACYJNO-LECZNICZA JEDNOSTKA POLSKIEGO ZWIĄZKU NIEWIDOMYCH"
		},
		{
			address: "KARTEZJUSZA 2",
			average_period: 0,
			awaiting: 0,
			benefit: "PORADNIA STOMATOLOGICZNA DLA DZIECI",
			date: "2023-10-20",
			date_situation_as_at: "2023-10-20",
			latitude: "52.250856",
			locality: "WARSZAWA BEMOWO",
			longitude: "20.8951879",
			phone: "22 4193269",
			place: "PORADNIA STOMATOLOGICZNA DLA DZIECI",
			provider: "PRZYCHODNIA LEKARSKA WOJSKOWEJ AKADEMII TECHNICZNEJ SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ"
		},
		{
			address: "KRASINSKIEGO 54/56",
			average_period: 0,
			awaiting: 0,
			benefit: "PORADNIA STOMATOLOGICZNA",
			date: "2023-10-20",
			date_situation_as_at: "2023-10-20",
			latitude: "52.2613379",
			locality: "WARSZAWA ŻOLIBORZ",
			longitude: "20.964627",
			phone: "26 1852652",
			place: "PORADNIA STOMATOLOGII ZACHOWAWCZEJ",
			provider: "WOJSKOWY INSTYTUT MEDYCYNY LOTNICZEJ"
		},
		{
			address: "ZAWISZY 16A/A",
			average_period: 0,
			awaiting: 0,
			benefit: "PORADNIA STOMATOLOGICZNA",
			date: "2023-10-20",
			date_situation_as_at: "2023-10-20",
			latitude: "52.2441619",
			locality: "WARSZAWA WOLA",
			longitude: "20.9619983",
			phone: "228881365",
			place: "GABINET ZAWISZY",
			provider: "AGADENT PORADNIA STOMATOLOGICZNO-LEKARSKA"
		},
		{
			address: "ALEKSANDRA ŚWIĘTOCHOWSKIEGO 2/U20",
			average_period: 0,
			awaiting: 0,
			benefit: "PORADNIA STOMATOLOGICZNA",
			date: "2023-10-20",
			date_situation_as_at: "2023-10-20",
			latitude: "52.2355532",
			locality: "WARSZAWA BEMOWO",
			longitude: "20.8991958",
			phone: "733-708-708",
			place: "PORADNIA OGÓLNOSTOMATOLOGICZNA (STOMATOLOGIA ZACHOWAWCZA Z ENDODONCJĄ)",
			provider: "NIEPUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ DENTIK.PL"
		},
		{
			address: "WOLSKA 37",
			average_period: 0,
			awaiting: 0,
			benefit: "PORADNIA STOMATOLOGICZNA",
			date: "2023-10-20",
			date_situation_as_at: "2023-10-19",
			latitude: "52.2344994",
			locality: "WARSZAWA WOLA",
			longitude: "20.9720042",
			phone: "605 06 55 22",
			place: "PORADNIA STOMATOLOGICZNA",
			provider: "TOMASZ CHYB USŁUGI STOMATOLOGICZNE"
		},
		{
			address: "MAGICZNA 20/1",
			average_period: 0,
			awaiting: 0,
			benefit: "PORADNIA STOMATOLOGICZNA",
			date: "2023-10-20",
			date_situation_as_at: "2023-10-20",
			latitude: "52.3148099",
			locality: "WARSZAWA BIAŁOŁĘKA",
			longitude: "21.061511",
			phone: "022 4040842",
			place: "PORADNIA STOMATOLOGII ZACHOWAWCZEJ",
			provider: "EMDENTIC MATEUSZ KUŚ"
		},
		{
			address: "ALEJA KOMISJI EDUKACJI NARODOWEJ 98/U-30",
			average_period: 0,
			awaiting: 0,
			benefit: "PORADNIA STOMATOLOGICZNA",
			date: "2023-10-20",
			date_situation_as_at: "2023-10-19",
			latitude: "52.1610856",
			locality: "WARSZAWA URSYNÓW",
			longitude: "21.0296211",
			phone: "607626748",
			place: "AMBULATORIUM SOMATOLOGICZNE",
			provider: "GABINET STOMATOLOGICZNY MAGDALENA GÓRSKA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ"
		}
	],
	pages: {
		count: 163,
		current: "/app-itl-api/queues?page=1&limit=10&format=json&case=1&benefit=PORADNIA%20STOMATOLOGICZNA&locality=WARSZAWA",
		first: "/app-itl-api/queues?page=1&limit=10&format=json&case=1&benefit=PORADNIA%20STOMATOLOGICZNA&locality=WARSZAWA",
		last: "/app-itl-api/queues?page=17&limit=10&format=json&case=1&benefit=PORADNIA%20STOMATOLOGICZNA&locality=WARSZAWA",
		next: "/app-itl-api/queues?page=2&limit=10&format=json&case=1&benefit=PORADNIA%20STOMATOLOGICZNA&locality=WARSZAWA",
		previous: null
	}
};
