import { CommandEmpty, CommandGroup, CommandInput, CommandItem } from 'cmdk'
import { ChevronsUpDown, Terminal } from 'lucide-react'
import { Command } from '../components/ui/command'
import React from 'react'
import { Button } from '../components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover'
import { QueryApi } from '../api/api'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import { Navigate } from 'react-router-dom';
import { ClimbingBoxLoader } from 'react-spinners'

// hashmap string -> string
const codes: { [key: string]: string } = {
	"dolnośląskie": "01",
	"kujawsko-pomorskie": "02",
	"lubelskie": "03",
	"lubuskie": "04",
	"łódzkie": "05",
	"małopolskie": "06",
	"mazowieckie": "07",
	"opolskie": "08",
	"podkarpackie": "09",
	"podlaskie": "10",
	"pomorskie": "11",
	"śląskie": "12",
	"świętokrzyskie": "13",
	"warmińsko-mazurskie": "14",
	"wielkopolskie": "15",
	"zachodniopomorskie": "16"
}

const voivodeships = [
	{ 'value': 'dolnośląskie', 'label': 'Dolnośląskie' },
	{ 'value': 'kujawsko-pomorskie', 'label': 'Kujawsko-pomorskie' },
	{ 'value': 'lubelskie', 'label': 'Lubelskie' },
	{ 'value': 'lubuskie', 'label': 'Lubuskie' },
	{ 'value': 'łódzkie', 'label': 'Łódzkie' },
	{ 'value': 'małopolskie', 'label': 'Małopolskie' },
	{ 'value': 'mazowieckie', 'label': 'Mazowieckie' },
	{ 'value': 'opolskie', 'label': 'Opolskie' },
	{ 'value': 'podkarpackie', 'label': 'Podkarpackie' },
	{ 'value': 'podlaskie', 'label': 'Podlaskie' },
	{ 'value': 'pomorskie', 'label': 'Pomorskie' },
	{ 'value': 'śląskie', 'label': 'Śląskie' },
	{ 'value': 'świętokrzyskie', 'label': 'Świętokrzyskie' },
	{ 'value': 'warmińsko-mazurskie', 'label': 'Warmińsko-mazurskie' },
	{ 'value': 'wielkopolskie', 'label': 'Wielkopolskie' },
	{ 'value': 'zachodniopomorskie', 'label': 'Zachodniopomorskie' },
]

interface item {
	value: string
	label: string
}

interface ComboProps {
	onChange: (value: string) => void
	onType?: any
	data: item[]
}

export default function Choice() {
	const [sent, setSent] = React.useState(false)
	const [showErr, setShowErr] = React.useState(false)
	const [errMsg, setErrMsg] = React.useState("")
	const [redirect, setRedirect] = React.useState(false)

	const [provinceData, setProvinceData] = React.useState(voivodeships)
	const [localityData, setLocalities] = React.useState([] as any)
	const [benefitData, setBenefits] = React.useState([] as any)

	const [benefitText, setBenefitText] = React.useState("")
	const [provinceText, setProvinceText] = React.useState("")
	const [localityText, setLocalityText] = React.useState("")

	React.useEffect(() => {
		// Once the voivodeship is selected, we can fetch the cities
		if (provinceText === "")
			return

		console.log(provinceText)
		if (!(provinceText in codes)) {
			console.error("Error! Province not found in codes")
			setShowErr(true)
			setErrMsg("Nie ma takiego miasta! LOL")
			return
		}

		fetchCities(provinceText)
	}, [provinceText])

	const fetchCities = async (voivodeship: string) => {
		const url = 'http://localhost:5000/api/cities'
		let requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				"region": voivodeship,
				"query": "s", // TODO: remove
			}),
		}

		fetch(url, requestOptions).then(response => response.json()).then(data => {
			setLocalities(data.map((city: string) => { return { value: city, label: city } }))
		}).catch(error => {
			console.error('There was an error!', error)
			setShowErr(true)
			setErrMsg("Nie udało się pobrać danych z serwera")
		})
	}

	const fetchBenefits = async (event: React.FormEvent<HTMLInputElement>) => {
		console.log("Typed a letter!")
		const url = 'http://localhost:5000/api/benefits'

		let target = event.target as any
		if (!target.value) return

		let requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ "benefit_letters": target.value }),
		}

		console.log("Sending body", requestOptions.body)
		fetch(url, requestOptions).then(response => response.json()).then(data => {
			console.log("Setting benefits to", data)
			setBenefits(data.map((name: string) => { return { value: name, label: name } }))
		}).catch(error => {
			console.error('There was an error!', error)
			setShowErr(true)
			setErrMsg("Nie udało się pobrać danych z serwera")
		})
	}

	const Submit = async () => {
		console.log("The user has clicked submit, let's hope for the best!")
		let query = {
			"benefit": benefitText.toUpperCase(),
			"province": codes[provinceText].toUpperCase(),
			"locality": localityText.toUpperCase(),
			"page": 1
		}

		let promise = QueryApi(query)
		console.log("Sent query:", query)

		setSent(true)
		let result = null
		try {
			result = await promise
		} catch (e) {
			console.log("Error! in submit, promise rejected")
			setShowErr(true)
			setErrMsg("Nie udało się pobrać danych z serwera")
			return

		}

		if (!result) {
			console.log("Error! in submit, null r e turned")
			setShowErr(true)
			setErrMsg("Nie udało się pobrać danych z serwera")
			return
		} else {
			console.log("Received result in choice!:", result)
			setRedirect(true)
		}
	}

	return (
		<main className="h-screen bg-back-layer-2 ">
			{
				redirect ? (
					<Navigate to="/result" />
				) : (
					<div className="w-full h-full flex flex-col items-center justify-center">
						{showErr ? (
							<Alert>
								<Terminal className="h-4 w-4" />
								<AlertTitle>Nastąpił błąd!</AlertTitle>
								<AlertDescription>
									{errMsg}
								</AlertDescription>
							</Alert >
						) : (
							<div className="w-5/6 p-10 rounded-2xl bg-back-layer-1">
								{sent ? <div className="flex items-center justify-center">
									<ClimbingBoxLoader></ClimbingBoxLoader>
								</div> : (
									<div className="flex flex-col items-center justify-center mb-8">
										<h1 className="mt-10 text-2xl font-bold text-center text-text-default mb-3">Wyszukaj badanie</h1>
										<ComboBox onChange={setBenefitText} data={benefitData} onType={fetchBenefits} />
										<h1 className="mt-6 text-2xl font-bold text-center text-text-default mb-3">Wybierz województwo</h1>
										<ComboBox onChange={setProvinceText} data={provinceData} />
										<h1 className="mt-6 h-fill text-2xl font-bold text-center text-text-default mb-3">Wybierz miasto</h1>
										<ComboBox onChange={setLocalityText} data={localityData} />
										<Button className="mt-60 w-4/6 p-7" onClick={Submit}>Dalej</Button>
									</div>
								)}
							</div>
						)}
					</div>
				)}
		</main>
	)
}

export function ComboBox(props: ComboProps) {
	const [open, setOpen] = React.useState(false)
	const [value, setValue] = React.useState("")

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" role="combobox" aria-expanded={open} className="w-[350px] justify-between">
					{(value) ? (value.charAt(0).toUpperCase() + value.slice(1)) : ("Wybierz z listy lub wyszukaj")}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-3/1 bg-primary-30">
				<Command onChange={props.onType}>
					<CommandInput placeholder="Wyszukaj..." />
					<CommandEmpty>Nie znaleziono.</CommandEmpty>
					<CommandGroup>
						{props.data.map((entry) => (
							<CommandItem
								key={entry.value}
								value={entry.value}
								onSelect={(currentValue) => {
									let changed = currentValue === value ? "" : currentValue
									setValue(changed)
									props.onChange(changed)
									setOpen(false)
								}}
							>
								{entry.label}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover >
	)
}
