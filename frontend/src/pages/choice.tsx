import { CommandEmpty, CommandGroup, CommandInput, CommandItem } from 'cmdk'
import { Check, ChevronsUpDown, Terminal } from 'lucide-react'
import { Command } from '../components/ui/command'
import React from 'react'
import { Button } from '../components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover'
import { cn } from '../lib/utils'
import { QueryApi } from '../api/api'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'

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

	const [benefitText, setBenefitText] = React.useState("")
	const [provinceText, setProvinceText] = React.useState("")
	const [localityText, setLocalityText] = React.useState("")

	const Submit = () => {
		console.log("The user has clicked submit, let's hope for the best!")
		let result = QueryApi({
			"benefit": benefitText,
			"province": provinceText,
			"locality": localityText,
		})

		if (!result) {
			console.log("Error! in submit, null returned")
			setShowErr(true)
			setErrMsg("Nie udało się pobrać danych z serwera")
			return
		}

		console.log(result)
		setSent(true)
	}

	return (
		<main className="w-full h-full flex flex-col items-center justify-center">
			{showErr} && (
			<Alert>
				<Terminal className="h-4 w-4" />
				<AlertTitle>Heads up!</AlertTitle>
				<AlertDescription>
					{errMsg}
				</AlertDescription>
			</Alert>
			) || (
			{sent} && (
			<p>cos sie krynci tu </p>
			) || (
			<div className="flex flex-col items-center justify-center">
				<h1 className="text-2xl font-bold text-center text-text-default">Wpisz itneresującą Cię usługę</h1>
				<ComboboxDemo />
				<h1 className="text-2xl font-bold text-center text-text-default">Wybierz województwo</h1>
				<ComboboxDemo />
				<h1 className="h-fill text-2xl font-bold text-center text-text-default">Podaj interesujące Cię miasto</h1>
				<ComboboxDemo />
				<Button onClick={Submit}>Dalej</Button>
			</div>
			)
		</main>
	)
}

export function ComboboxDemo() {
	const [open, setOpen] = React.useState(false)
	const [value, setValue] = React.useState("")

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
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
									setValue(currentValue === value ? "" : currentValue)
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
