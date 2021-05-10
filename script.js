import { baseURL, apiKey, apiHost } from "./secret.js";

// Initialize AOS
AOS.init();

// World Data
const totalCases = document.querySelector(".total-cases .card-text");
const newCases = document.querySelector(".new-cases .card-text");
const totalDeaths = document.querySelector(".total-deaths .card-text");
const newDeaths = document.querySelector(".new-deaths .card-text");
const totalRecovered = document.querySelector(".total-recovered .card-text");
const newRecovered = document.querySelector(".new-recovered .card-text");
const worldChart = document.querySelector("#worldChart").getContext("2d");

// Countries Data
const country = document.querySelector(".countries table tbody tr");
const countryTable = document.querySelector("#country tbody");
const paginationEl = document.querySelector(".pagination-wrapper");
const countryChart = document.querySelector("#countryChart");
const spinner = document.querySelector(".loading");
let countryPieChart;
// Pagination
let currentPage = 1;
let rows = 10;

window.addEventListener("load", async function () {
	const resultsGlobal = await getCovidWorldData();
	displayCovidWorldData(resultsGlobal);
	pieChart(worldChart, resultsGlobal);
	const resultsCountries = await getCovidCountriesData();
	DisplayDataEveryCountry(resultsCountries, countryTable, rows, currentPage);
	spinner.style.display = "none";
	Pagination(resultsCountries, paginationEl, rows);
});

document.addEventListener("click", async function (e) {
	if (e.target.classList.contains("btn-detail")) {
		// get data attributes
		let countryname = e.target.dataset.countryname;
		let threeletter = e.target.dataset.threeletter;
		let detail = await getDetailCoountry(countryname, threeletter);
		pieChartCountry(countryChart, detail);
		updateUIModal(detail);

		const closeModalBtn = document.querySelector(".close span");
		closeModalBtn.addEventListener("click", function () {
			countryPieChart.destroy();
			// loading state
			const numbers = document.querySelectorAll(".number");
			numbers.forEach((n) => (n.innerText = "Loading..."));

			const modalTitle = document.querySelector(".modal-title");
			setTimeout(() => {
				modalTitle.innerHTML = "Loading...";
			}, 500);
		});
	}
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

// use toLocaleString to insert comma every 3 digits
function displayCovidWorldData(response) {
	totalCases.innerHTML = response.TotalCases.toLocaleString();
	newCases.innerHTML = response.NewCases.toLocaleString();
	totalDeaths.innerHTML = response.TotalDeaths.toLocaleString();
	newDeaths.innerHTML = response.NewDeaths.toLocaleString();
	totalRecovered.innerHTML = Number(response.TotalRecovered).toLocaleString();
	newRecovered.innerHTML = response.NewRecovered.toLocaleString();
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
		<td class="data-country">${item.TotalCases.toLocaleString()}</td>
		<td class="data-country">${item.TotalDeaths.toLocaleString()}</td>
		<td class="data-country">${Number(item.TotalRecovered).toLocaleString()}</td>
		<td class="data-country">
		<button type="button" class="btn btn-primary btn-detail" data-toggle="modal"
		data-target="#detailModal" data-countryname="${
			item.Country
		}" data-threeletter="${item.ThreeLetterSymbol}">Details</button>
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

function getDetailCoountry(countryName, threeLetterSymbol) {
	return fetch(
		`${baseURL}country-report-iso-based/${countryName}/${threeLetterSymbol}`,
		{
			method: "GET",
			headers: {
				"x-rapidapi-key": `${apiKey}`,
				"x-rapidapi-host": `${apiHost}`,
			},
		}
	)
		.then((response) => response.json())
		.then((response) => response[0]);
}

function updateUIModal(data) {
	const modalTitle = document.querySelector(".modal-title");
	modalTitle.innerHTML = data.Country;

	const nTotalCases = document.querySelector(".modal-totalcases .number");
	nTotalCases.innerHTML = data.TotalCases.toLocaleString();

	const nNewCases = document.querySelector(".modal-newcases .number");
	nNewCases.innerHTML = data.NewCases.toLocaleString();

	const nActiveCases = document.querySelector(".modal-activecases .number");
	nActiveCases.innerHTML = data.ActiveCases.toLocaleString();

	const nInfectionRisk = document.querySelector(".modal-infection .number");
	nInfectionRisk.innerHTML = `${data.Infection_Risk}%`;

	const nCritical = document.querySelector(".modal-critical .number");
	nCritical.innerHTML = data.Serious_Critical.toLocaleString();

	const nTotalTests = document.querySelector(".modal-totaltest .number");
	nTotalTests.innerHTML = Number(data.TotalTests).toLocaleString();

	const nTestPercentage = document.querySelector(
		".modal-testpercentage .number"
	);
	nTestPercentage.innerHTML = `${data.Test_Percentage}%`;

	const nTotalDeaths = document.querySelector(".modal-totaldeaths .number");
	nTotalDeaths.innerHTML = data.TotalDeaths.toLocaleString();

	const nNewDeaths = document.querySelector(".modal-newdeaths .number");
	nNewDeaths.innerHTML = data.NewDeaths.toLocaleString();

	const nCFR = document.querySelector(".modal-cfr .number");
	nCFR.innerHTML = `${data.Case_Fatality_Rate}%`;

	const nTotalRecovered = document.querySelector(
		".modal-totalrecovered .number"
	);
	nTotalRecovered.innerHTML = Number(data.TotalRecovered).toLocaleString();

	const nNewRecovered = document.querySelector(".modal-newrecovered .number");
	nNewRecovered.innerHTML = data.NewRecovered.toLocaleString();

	const nRP = document.querySelector(".modal-rp .number");
	nRP.innerHTML = `${data.Recovery_Proporation}%`;

	const nPopulation = document.querySelector(".modal-population .number");
	nPopulation.innerHTML = Number(data.Population).toLocaleString();
}

function pieChart(wrapper, data) {
	let worldPieChart = new Chart(wrapper, {
		type: "pie",
		data: {
			labels: ["Total Deaths", "Total Recovered", "Active Cases"],
			datasets: [
				{
					label: "The condition of all cases in the world",
					data: [data.TotalDeaths, data.TotalRecovered, data.ActiveCases],
					backgroundColor: [
						"rgb(220, 53, 69)",
						"rgb(40, 167, 69)",
						"rgb(255, 205, 86)",
					],
					hoverOffset: 4,
				},
			],
		},
		options: {
			plugins: {
				title: {
					display: true,
					text: "The condition of all cases in the world",
					padding: {
						top: 20,
						bottom: 15,
					},
				},
			},
		},
	});
}

function pieChartCountry(wrapper, data) {
	countryPieChart = new Chart(wrapper, {
		type: "pie",
		data: {
			labels: ["Total Deaths", "Total Recovered", "Active Cases"],
			datasets: [
				{
					label: "The condition of all cases in the world",
					data: [data.TotalDeaths, data.TotalRecovered, data.ActiveCases],
					backgroundColor: [
						"rgb(220, 53, 69)",
						"rgb(40, 167, 69)",
						"rgb(255, 205, 86)",
					],
					hoverOffset: 4,
				},
			],
		},
		options: {
			plugins: {
				title: {
					display: true,
					text: "The condition of all cases in the world",
					padding: {
						top: 20,
						bottom: 15,
					},
				},
			},
		},
	});
}
