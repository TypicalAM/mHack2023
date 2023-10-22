import { CommandEmpty, CommandGroup, CommandInput, CommandItem } from 'cmdk'
import { Check, ChevronsUpDown, Terminal } from 'lucide-react'
import { Command } from '../components/ui/command'
import React from 'react'
import { Button } from '../components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover'
import { cn } from '../lib/utils'
import { QueryApi } from '../api/api'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import { Navigate } from 'react-router-dom';

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
		if (provinceText === "dolnośląskie") {
			setLocalities([{ value: "wroclaw", label: "Wrocław" }])
		}

		console.log("Fetching localities for", provinceText)
	}, [provinceText])

	const Submit = async () => {
		console.log("The user has clicked submit, let's hope for the best!")
		let query = { "benefit": benefitText, "province": codes[provinceText], "locality": localityText }
		let promise = QueryApi(query)
		console.log("Sent query:", query)

		setSent(true)
		let result = null
		try {
			result = await promise
		} catch (e) {
			console.log("Error! in submit, promise rejected")
			setShowErr(true)
			setErrMsg("Niele udało się pobrać danych z serwera")
			return
		}

		if (!result) {
			console.log("Error! in submit, null returned")
			setShowErr(true)
			setErrMsg("Nie udało się pobrać danych z serwera")
			return
		} else {
			console.log("Received result in choice!:", result)
			setRedirect(true)
		}
	}

	return (
		<main className="h-screen bg-back-layer-1">
			{
				redirect ? (
					<Navigate to="/result" />
				) : (
					<div className="w-full h-full flex flex-col items-center justify-center">
						{showErr ? (
							<Alert>
								<Terminal className="h-4 w-4" />
								<AlertTitle>Heads up!</AlertTitle>
								<AlertDescription>
									{errMsg}
								</AlertDescription>
							</Alert >
						) : (
							<div className="w-5/6 bg-back-layer-2 p-10 rounded-2xl">
								{sent ? (<p> cos sie krynci tu </p>) : (
									<div className="flex flex-col items-center justify-center mb-8">
										<h1 className="mt-10 text-2xl font-bold text-center text-text-default">Wpisz itneresującą Cię usługę</h1>
										<ComboboxDemo onChange={setBenefitText} data={benefitData} />
										<h1 className="mt-6 text-2xl font-bold text-center text-text-default">Wybierz województwo</h1>
										<ComboboxDemo onChange={setProvinceText} data={provinceData} />
										<h1 className="mt-6 h-fill text-2xl font-bold text-center text-text-default">Podaj interesujące Cię miasto</h1>
										<ComboboxDemo onChange={setLocalityText} data={localityData} />
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

export function ComboboxDemo(props: ComboProps) {
	const [open, setOpen] = React.useState(false)
	const [value, setValue] = React.useState("")

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
					{value
						? props.data.find((entry: item) => entry.value === value)?.label
						: "Select framework..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] bg-primary-30">
				<Command>
					<CommandInput placeholder="Search framework..." />
					<CommandEmpty>No framework found.</CommandEmpty>
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
		</Popover>
	)
}
