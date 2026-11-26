// OMDb API raktas
const API_KEY = "c89a933f";

// API adresas
const API_URL = "http://www.omdbapi.com/?i=tt3896198&apikey=c89a933f";

// HTML elementai
const movieInput = document.getElementById("movieInput");
const searchBtn = document.getElementById("searchBtn");
const moviesContainer = document.getElementById("movies");
const message = document.getElementById("message");


// FILMŲ PAIEŠKOS FUNKCIJA
async function searchMovies() {

    // Paimame įvestą tekstą
    const movieName = movieInput.value.trim();

    // Išvalome ankstesnius rezultatus
    moviesContainer.replaceChildren();
    message.textContent = "";

    // ĮVESTIES VALIDACIJA
    if (movieName === "") {

        message.textContent = "Įveskite filmo pavadinimą!";

        movieInput.focus();

        return;
    }

    // Išjungiame mygtuką paieškos metu
    searchBtn.disabled = true;

    message.textContent = "Ieškoma filmų...";

    try {

        // Sukuriame užklausos adresą
        const url = new URL(API_URL);

        url.searchParams.set("apikey", API_KEY);
        url.searchParams.set("s", movieName);
        url.searchParams.set("type", "movie");

        // Siunčiame užklausą į OMDb API
        const response = await fetch(url);

        // Patikriname atsakymą
        if (!response.ok) {
            throw new Error("Nepavyko gauti duomenų iš API.");
        }

        // Gauname JSON duomenis
        const data = await response.json();

        // Tikriname API atsakymą
        if (data.Response === "False") {

            message.textContent = "Filmas nerastas! Bandykite dar kartą.";

            return;
        }

        // Patikriname, ar yra filmų
        if (!data.Search || data.Search.length === 0) {

            message.textContent = "Filmų nerasta.";

            return;
        }

        // Išvalome pranešimą
        message.textContent = "";

        // Atvaizduojame visus rastus filmus
        data.Search.forEach(function(movie) {

            createMovieCard(movie);

        });

    } catch (error) {

        console.error("Klaida:", error);

        message.textContent =
            "Įvyko klaida! Patikrinkite API raktą ir interneto ryšį.";

    } finally {

        // Vėl įjungiame mygtuką
        searchBtn.disabled = false;

    }

}


// FILMO KORTELĖS KŪRIMAS
function createMovieCard(movie) {

    // Sukuriame kortelę
    const card = document.createElement("div");

    card.classList.add("movie-card");


    // Sukuriame plakato elementą
    if (movie.Poster && movie.Poster !== "N/A") {

        const poster = document.createElement("img");

        poster.src = movie.Poster;

        poster.alt = movie.Title;

        poster.loading = "lazy";

        // Jei plakatas nepasikrauna
        poster.addEventListener("error", function() {

            const noPoster = document.createElement("div");

            noPoster.classList.add("no-poster");

            noPoster.textContent = "Plakato nėra";

            poster.replaceWith(noPoster);

        });

        card.appendChild(poster);

    } else {

        // Jei plakato nėra
        const noPoster = document.createElement("div");

        noPoster.classList.add("no-poster");

        noPoster.textContent = "Plakato nėra";

        card.appendChild(noPoster);

    }


    // Sukuriame informacijos bloką
    const info = document.createElement("div");

    info.classList.add("movie-info");


    // Filmo pavadinimas
    const title = document.createElement("h2");

    title.textContent = movie.Title;


    // Filmo metai
    const year = document.createElement("p");

    year.textContent = "Metai: " + movie.Year;


    // Filmo tipas
    const type = document.createElement("p");

    type.textContent = "Tipas: " + movie.Type;


    // Pridedame informaciją
    info.appendChild(title);

    info.appendChild(year);

    info.appendChild(type);


    // Pridedame informaciją prie kortelės
    card.appendChild(info);


    // Pridedame kortelę į puslapį
    moviesContainer.appendChild(card);

}


// MYGTUKO PASPAUDIMAS
searchBtn.addEventListener("click", searchMovies);


// PAIEŠKA PASPAUDUS ENTER
movieInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        searchMovies();

    }

});