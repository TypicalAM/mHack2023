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
import { text } from 'stream/consumers'

const frameworks = [
	{
		value: "next.js",
		label: "Next.js",
	},
	{
		value: "sveltekit",
		label: "SvelteKit",
	},
	{
		value: "nuxt.js",
		label: "Nuxt.js",
	},
	{
		value: "remix",
		label: "Remix",
	},
	{
		value: "astro",
		label: "Astro",
	},
]

export default function Choice() {
	const [sent, setSent] = React.useState(false)
	const [showErr, setShowErr] = React.useState(false)
	const [errMsg, setErrMsg] = React.useState("")
	const [redirect, setRedirect] = React.useState(false)

	const [benefitText, setBenefitText] = React.useState("")
	const [provinceText, setProvinceText] = React.useState("")
	const [localityText, setLocalityText] = React.useState("")

	const Submit = async () => {
		console.log("The user has clicked submit, let's hope for the best!")
		let query = { "benefit": benefitText, "province": provinceText, "locality": localityText }
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
		<main>
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
							<div>
								{sent ? (<p> cos sie krynci tu </p>) : (
									<div className="flex flex-col items-center justify-center">
										<h1 className="text-2xl font-bold text-center text-text-default">Wpisz itneresującą Cię usługę</h1>
										<ComboboxDemo onChange={setBenefitText} />
										<h1 className="text-2xl font-bold text-center text-text-default">Wybierz województwo</h1>
										<ComboboxDemo onChange={setProvinceText} />
										<h1 className="h-fill text-2xl font-bold text-center text-text-default">Podaj interesujące Cię miasto</h1>
										<ComboboxDemo onChange={setLocalityText} />
										<Button onClick={Submit}>Dalej</Button>
									</div>
								)}
							</div>
						)}
					</div>
				)}
		</main>
	)
}

export function ComboboxDemo(props: any) {
	const [open, setOpen] = React.useState(false)
	const [value, setValue] = React.useState("")

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
					{value
						? frameworks.find((framework) => framework.value === value)?.label
						: "Select framework..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Search framework..." />
					<CommandEmpty>No framework found.</CommandEmpty>
					<CommandGroup>
						{frameworks.map((framework) => (
							<CommandItem
								key={framework.value}
								value={framework.value}
								onSelect={(currentValue) => {
									let changed = currentValue === value ? "" : currentValue
									setValue(changed)
									props.onChange(changed)
									setOpen(false)
								}}
							>
								<Check
									className={cn(
										"mr-2 h-4 w-4",
										value === framework.value ? "opacity-100" : "opacity-0"
									)}
								/>
								{framework.label}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
