// API URL
const apiUrl = "https://api.jikan.moe/v4/seasons/2007/spring?sfw";

// DOM Elements
const tableBody = document.getElementById("anime-table-body");
const genreFilter = document.getElementById("genreFilter");
const producerFilter = document.getElementById("producerFilter");

// Fetch and Display Anime Data
function fetchAnime() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            animeList = data.data;
            populateFilters(animeList);
            renderTable(animeList);
        });
}

// Populate Genre and Producer Filters
function populateFilters(animeList) {
    let genres = new Set();
    let producers = new Set();

    animeList.forEach(anime => {
        if (anime.genres) {
            anime.genres.forEach(genre => genres.add(genre.name));
        }
        if (anime.producers) {
            anime.producers.forEach(producer => producers.add(producer.name));
        }
    });

    genreFilter.innerHTML = `<option value="">All Genres</option>`;
    producers.forEach(producer => {
        genreFilter.innerHTML += `<option value="${producer}">${producer}</option>`;
    });

    producerFilter.innerHTML = `<option value="">All Producers</option>`;
    producers.forEach(producer => {
        producerFilter.innerHTML += `<option value="${producer}">${producer}</option>`;
    });
}

// Render Anime Table
function renderTable(animeList) {
    tableBody.innerHTML = "";
    animeList.forEach(anime => {
        let genres = anime.genres.map(g => g.name).join(", ");
        let producers = anime.producers.map(p => p.name).join(", ");
        let row = `<tr>
            <td>${anime.title}</td>
            <td>${genres || "N/A"}</td>
            <td>${producers || "N/A"}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Filter Anime Data
function filterAnime() {
    let selectedGenre = genreFilter.value;
    let selectedProducer = producerFilter.value;

    let filteredAnime = animeList.filter(anime => {
        let matchesGenre = selectedGenre ? anime.genres.some(g => g.name === selectedGenre) : true;
        let matchesProducer = selectedProducer ? anime.producers.some(p => p.name === selectedProducer) : true;
        return matchesGenre && matchesProducer;
    });

    renderTable(filteredAnime);
}

// Event Listeners
genreFilter.addEventListener("change", filterAnime);
producerFilter.addEventListener("change", filterAnime);

// Fetch Anime on Page Load
fetchAnime();
