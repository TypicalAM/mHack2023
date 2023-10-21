export interface ApiInput {
	imie: string,
}

export interface ApiResult {
	randomText: string;
	randomNumber: number;
}

const fakeApiCall = () => {
	return {
		randomText: "this is the potential api call and its result",
		randomNumber: Math.random()
	}
}

export default function GetInfo() {
	return fakeApiCall()
}
