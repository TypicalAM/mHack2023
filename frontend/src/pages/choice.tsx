import { CommandEmpty, CommandGroup, CommandInput, CommandItem } from 'cmdk'
import { Check, ChevronsUpDown, Command } from 'lucide-react'
import React from 'react'
import { Button } from '../components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover'
import { cn } from '../lib/utils'

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
	return (
		<main className="w-full h-full flex flex-col items-center justify-center">

			<div className="flex flex-col items-center justify-center">
				<h1 className="text-2xl font-bold text-center text-text-default">Wpisz itneresującą Cię usługę</h1>
				<ComboboxDemo />
				<h1 className="text-2xl font-bold text-center text-text-default">Wybierz województwo</h1>
				<ComboboxDemo />
				<h1 className="h-fill text-2xl font-bold text-center text-text-default">Podaj interesujące Cię miasto</h1>
				<ComboboxDemo />
				<Button>Dalej</Button>
			</div>
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
