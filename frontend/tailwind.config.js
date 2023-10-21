/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			keyframes: {
				"accordion-down": {
					from: { height: 0 },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: 0 },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},

		colors: {
			'red-10': '#FFF3F1',
			'red-20': '#FFE9E5',
			'red-30': '#FFD8D1',
			'red-40': '#FCBCB1',
			'red-60': '#FB9686',
			'red-80': '#F15A4E',
			'red-100': '#FF0000',
			'red-200': '#9B1813',
			'red-300': '#6F0D09',
			'red-400': '#4C0602',
			'red-500': '#2E0300',
			'blue-10': '#F2F8FF',
			'blue-20': '#E7F2FF',
			'blue-30': '#BBDBFF',
			'blue-40': '#75B7FF',
			'blue-60': '#4097F5',
			'blue-80': '#1A7EEC',
			'blue-100': '#0069DD',
			'blue-200': '#0059BC',
			'blue-300': '#004EA4',
			'blue-400': '#003978',
			'blue-500': '#002650',

			'secondary-10': '#fff3f5',
			'secondary-20': '#ffe9ec',
			'secondary-30': '#fcd9df',
			'secondary-40': '#f8b9c3',
			'secondary-60': '#f27f91',
			'secondary-80': '#ee3955',
			'secondary-100': '#d4213d',
			'secondary-200': '#0452a8',
			'secondary-300': '#063477',
			'secondary-400': '#09215a',
			'secondary-500': '#051342',
			'primary-10': '#f4f6fb',
			'primary-20': '#ddebfb',
			'primary-30': '#bcd9f9',
			'primary-40': '#9dc3ee',
			'primary-60': '#5094df',
			'primary-80': '#1f71cc',
			'primary-100': '#0452ab',
			'primary-200': '#084297',
			'primary-300': '#053274',
			'primary-400': '#071f57',
			'primary-500': '#030f3a',
			'neutral-10': '#f6f8f9',
			'neutral-20': '#eff1f3',
			'neutral-30': '#e7eaed',
			'neutral-40': '#d0d4d8',
			'neutral-60': '#a4aab2',
			'neutral-80': '#808893',
			'neutral-100': '#656a75',
			'neutral-200': '#52575f',
			'neutral-300': '#34383f',
			'neutral-400': '#1f2328',
			'neutral-500': '#101317',
			'green-10': '#f7fdf0',
			'green-20': '#eefae1',
			'green-30': '#dff4c6',
			'green-40': '#cfeab0',
			'green-60': '#b7da8e',
			'green-80': '#74b05b',
			'green-100': '#317c26',
			'green-200': '#115a22',
			'green-300': '#064720',
			'green-400': '#053c1b',
			'green-500': '#033017',
			'orange-10': '#fff9eb',
			'orange-20': '#fdf1d2',
			'orange-30': '#ffe6b7',
			'orange-40': '#ffc672',
			'orange-60': '#f9961f',
			'orange-80': '#dc7606',
			'orange-100': '#ae5e00',
			'orange-200': '#924e00',
			'orange-300': '#7c4300',
			'orange-400': '#543000',
			'orange-500': '#2e1c00',

			'back-layer-1': '#F6F8F9',
			'back-layer-2': '#EFF1F3',
			'back-layer-3': '#E7EAED',
			'back-default': '#EFF1F3',

			'border-decorative': '#A4AAB2',
			'border-filed': '#656A75',
			'border-control': '#52575F',

			'text-disabled': '#A4AAB2',
			'text-placeholder': '#656A75',
			'text-subdued': '#52575F',
			'text-default': '#101317',

			'instructions-outline-1': '#D0D4D8',
			'instructions-outline-2': '#656A75',
			'disabled-elements': '#A4AAB2',
			'icons': '#52575F',
		},
	},
	plugins: [require("tailwindcss-animate")],
}
