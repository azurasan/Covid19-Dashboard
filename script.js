const totalCases = document.querySelector(".total-cases .card-text");
const newCases = document.querySelector(".new-cases .card-text");
const totalDeaths = document.querySelector(".total-deaths .card-text");
const newDeaths = document.querySelector(".new-deaths .card-text");
const totalRecovered = document.querySelector(".total-recovered .card-text");
const newRecovered = document.querySelector(".new-recovered .card-text");
console.log(
	totalCases,
	totalDeaths,
	totalRecovered,
	newCases,
	newDeaths,
	newRecovered
);

window.addEventListener("load", async () => {
	const results = await getCovidWorldData();
});

function getCovidWorldData() {
	return (
		fetch(
			"https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/npm-covid-data/world",
			{
				method: "GET",
				headers: {
					"x-rapidapi-key":
						"7c6404605dmsh344fd9fbc98d979p1afdc8jsn4fdc67d10aa5",
					"x-rapidapi-host":
						"vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com",
				},
			}
		)
			.then((response) => response.json())
			// .then((response) => console.log(response[0]))
			.then(displayResultsCovidWorldData)
	);
	// .catch((err) => {
	// 	console.error(err);
	// });
}

function displayResultsCovidWorldData(response) {
	console.log(response);
	totalCases.innerHTML = response[0].TotalCases;
	newCases.innerHTML = response[0].NewCases;
	totalDeaths.innerHTML = response[0].TotalDeaths;
	newDeaths.innerHTML = response[0].NewDeaths;
	totalRecovered.innerHTML = response[0].TotalRecovered;
	newRecovered.innerHTML = response[0].NewRecovered;
}
