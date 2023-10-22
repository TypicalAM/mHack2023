import React from 'react';
import { Kolejka } from '../api/api';

export default function Card(props: Kolejka) {
	return (
		<div className="flex flex-col justify-center items-center w-5/6 mt-10 bg-back-layer-3 rounded-2xl">
			<div className="flex flex-col justify-center items-center">
				<h1 className="text-m mt-5 overflow-hidden w-full"> {props.place} </h1>
			</div>
			<div className="grid grid-cols-2">
				<div className="flex flex-col justify-center items-center">
					<ul className="text-m mt-5">
					<li> {props.address} </li>
						<li> {props.date} </li>
						
						<li> {props.phone} </li>
						<li className='font-bold text-secondary-100'> {props.date_situation_as_at} </li>
					</ul>
				</div>
				<div className="flex flex-col justify-center items-center">
					<img className="p-8" src="./././public/kukon.jpg" />
				</div>
			</div>
		</div>
	)
}
