const totalCases = document.querySelector(".total-cases .card-text");
const newCases = document.querySelector(".new-cases .card-text");
const totalDeaths = document.querySelector(".total-deaths .card-text");
const newDeaths = document.querySelector(".new-deaths .card-text");
const totalRecovered = document.querySelector(".total-recovered .card-text");
const newRecovered = document.querySelector(".new-recovered .card-text");
const country = document.querySelector(".countries table tbody tr");
// const inputSearch = document.querySelector("input[type=search]");
// const searchBtn = document.querySelector(".searchBtn");
// searchBtn.addEventListener("click", async function (e) {
// 	e.preventDefault();
// 	const getSearchCountry = await getCovidCountriesData();
// console.log(searchCountry);
// 	const resultSearchCountry = searchCountry(getSearchCountry);
// 	console.log(resultSearchCountry);
// 	setSearchCountry(searchCountry);
// });

// Pagination
const countryTable = document.querySelector("#country tbody");
const paginationEl = document.querySelector(".pagination-wrapper");

let currentPage = 1;
let rows = 10;

// API
const baseURL =
	"https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/npm-covid-data/";
// Headers
const apiKey = "7c6404605dmsh344fd9fbc98d979p1afdc8jsn4fdc67d10aa5";
const apiHost =
	"vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com";

window.addEventListener("load", async function () {
	const resultsGlobal = await getCovidWorldData();
	displayCovidWorldData(resultsGlobal);
	const resultsCountries = await getCovidCountriesData();
	// generateTable(resultsCountries);
	DisplayDataEveryCountry(resultsCountries, countryTable, rows, currentPage);
	Pagination(resultsCountries, paginationEl, rows);
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
		.catch((err) => {
			console.error(err);
		});
}

function displayCovidWorldData(response) {
	// console.log(response);
	totalCases.innerHTML = response.TotalCases;
	newCases.innerHTML = response.NewCases;
	totalDeaths.innerHTML = response.TotalDeaths;
	newDeaths.innerHTML = response.NewDeaths;
	totalRecovered.innerHTML = response.TotalRecovered;
	newRecovered.innerHTML = response.NewRecovered;
}

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
			// filter data (skip response[0] & response[1])
			.then((response) => response.filter((r) => r.rank != 0))
	);
}

function DisplayDataEveryCountry(items, wrapper, rows_per_page, page) {
	page--;

	let start = rows_per_page * page;
	let end = rows_per_page + start;
	// slice data -> data[1] - data[10]
	let paginatedItems = items.slice(start, end);

	paginatedItems.forEach((item) => {
		let countries = `<td class="data-country">${item.rank}</td>
		<td class="data-country">${item.Country}</td>
		<td class="data-country">${item.TotalCases}</td>
		<td class="data-country">${item.TotalDeaths}</td>
		<td class="data-country">${item.TotalRecovered}</td>
		<td class="data-country">
		<button type="button" class="btn btn-primary">Details</button>
		</td>`;
		// insert to table
		country.insertAdjacentHTML("beforebegin", countries);
		wrapper.appendChild(country);
	});
}

function Pagination(items, wrapper, rows_per_page) {
	let pageCount = Math.ceil(items.length / rows_per_page);
	for (let i = 1; i < pageCount + 1; i++) {
		let buttons = PaginationBtn(i, items);
		wrapper.appendChild(buttons);
	}
}

function PaginationBtn(page, items) {
	let btn = document.createElement("div");
	btn.classList.add("page-item");
	btn.innerText = page;
	if (currentPage == page) btn.classList.add("active");

	btn.addEventListener("click", function () {
		currentPage = page;
		// remove data from previous page
		let previousData = document.querySelectorAll(".data-country");
		previousData.forEach((p) => {
			p.remove();
		});
		// then display data from clicked page
		DisplayDataEveryCountry(items, countryTable, rows, currentPage);

		// ex : inactive button page 1, then active button page 4
		const currentBtn = document.querySelector(".page-item.active");
		currentBtn.classList.remove("active");

		btn.classList.add("active");
	});

	return btn;
}

function getCovidDetailCoountry(data) {
	return fetch(
		`${baseURL}country-report-iso-based/${data.Country}/${ThreeLetterSymbol}`,
		{
			method: "GET",
			headers: {
				"x-rapidapi-key": `${apiKey}`,
				"x-rapidapi-host": `${apiHost}`,
			},
		}
	)
		.then((response) => response.json())
		.then((response) => console.log(response));
}

function searchCountry(data) {
	let resultSearch = data.filter((d) => d.Country == inputSearch.value);
	return resultSearch;
}

function setSearchCountry(data) {
	let resultSearch = `<tr>
	<th scope="row" class="text-center">${data.rank}</th>
	<td>${data.Country}</td>
	<td>${data.TotalCases}</td>
	<td>${data.TotalDeaths}</td>
	<td>${data.TotalRecovered}</td>
	<td>
	<button type="button" class="btn btn-primary">Details</button>
	</td>
</tr>`;
	country.innerHTML = resultSearch;
}
