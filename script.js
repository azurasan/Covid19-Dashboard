const totalCases = document.querySelector(".total-cases .card-text");
const newCases = document.querySelector(".new-cases .card-text");
const totalDeaths = document.querySelector(".total-deaths .card-text");
const newDeaths = document.querySelector(".new-deaths .card-text");
const totalRecovered = document.querySelector(".total-recovered .card-text");
const newRecovered = document.querySelector(".new-recovered .card-text");
const country = document.querySelector(".countries table tbody");

// API
const baseURL =
	"https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/npm-covid-data/";
// Headers
const apiKey = "7c6404605dmsh344fd9fbc98d979p1afdc8jsn4fdc67d10aa5";
const apiHost =
	"vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com";
// console.log(
// 	totalCases,
// 	totalDeaths,
// 	totalRecovered,
// 	newCases,
// 	newDeaths,
// 	newRecovered,
// 	country
// );

window.addEventListener("load", async () => {
	const resultsGlobal = await getCovidWorldData();
	const resultsCountries = await getCovidCountriesData();
	// console.log(resultsCountries);
});

function getCovidWorldData() {
	return fetch(`${baseURL}world`, {
		method: "GET",
		headers: {
			"x-rapidapi-key": `${apiKey}`,
			"x-rapidapi-host": `${apiHost}`,
		},
	})
		.then((response) => response.json())
		.then((response) => response[0])
		.then(displayResultsCovidWorldData)
		.catch((err) => {
			console.error(err);
		});
}

function displayResultsCovidWorldData(response) {
	// console.log(response);
	totalCases.innerHTML = response.TotalCases;
	newCases.innerHTML = response.NewCases;
	totalDeaths.innerHTML = response.TotalDeaths;
	newDeaths.innerHTML = response.NewDeaths;
	totalRecovered.innerHTML = response.TotalRecovered;
	newRecovered.innerHTML = response.NewRecovered;
}

// todo
function getCovidCountriesData() {
	return (
		fetch(`${baseURL}`, {
			method: "GET",
			headers: {
				"x-rapidapi-key": `${apiKey}`,
				"x-rapidapi-host": `${apiHost}`,
			},
		})
			.then((response) => response.json())
			// skip response[0] & response [1]
			// .then((response) => {
			// 	for (let i = 0; i < response.length; i++) {
			// 		if (i == 0 || i == 1) {
			// 			continue;
			// 		}
			// console.log(response[i]);
			// response[i].forEach(generateTable);
			// 	}
			// })
			// .then((response) => response.forEach(generateTable))
			.then(generateTable)
	);
}

function generateTable(data) {
	// console.log(data[1]);
	// let countries = `<tr>
	// 	<th scope="row">${data.rank}</th>
	// 	<td>${data.Country}</td>
	// 	<td>${data.TotalCases}</td>
	// 	<td>${data.TotalDeaths}</td>
	// 	<td>${data.TotalRecovered}</td>
	// 	<td>
	// 	<button type="button" class="btn btn-primary">Details</button>
	// 	</td>
	// </tr>`;

	// filter data
	let result = data.filter((d) => d.rank != 0);
	result.forEach((r) => {
		let countries = `<tr>
		<th scope="row">${r.rank}</th>
		<td>${r.Country}</td>
		<td>${r.TotalCases}</td>
		<td>${r.TotalDeaths}</td>
		<td>${r.TotalRecovered}</td>
		<td>
		<button type="button" class="btn btn-primary">Details</button>
		</td>
	</tr>`;
		// insert to table
		country.insertAdjacentHTML("beforebegin", countries);
	});
}
