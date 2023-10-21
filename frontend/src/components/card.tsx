import React from 'react';

export default function Card() {
	return (
		<div className="flex justify-center items-center w-screen">
			<div className="flex flex-col justify-center items-center h-1/3 w-1/2 ">
				<p> Data </p>
				<p> Data1 </p>
				<p> Data2 </p>
				<p> Data3 </p>
			</div>
			<div className="flex flex-col justify-center items-center h-1/3 w-1/2 ">
				<img src="https://picsum.photos/200/300" alt="random" />
			</div>
		</div>
	)
}
