const input = document.getElementById("countryInput");
const message = document.getElementById("message");
const results = document.getElementById("results");
const button = document.getElementById("searchButton");

button.addEventListener("click", searchCountry);

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchCountry();
  }
});

async function searchCountry() {
  // 1. Paimama input reikšmė
  const countryName = input.value.trim();

  // 2. Patikrinama, ar input nėra tuščias
  if (countryName === "") {
    message.textContent = "Įveskite šalies pavadinimą!";
    clearResults();
    return;
  }

  clearResults();
  message.textContent = "Ieškoma...";

  try {
    // 3. Užklausa į API
    const response = await fetch(
      "https://countries.dev/name/" + encodeURIComponent(countryName),
    );

    if (!response.ok) {
      message.textContent = "Šalis nerasta!";
      return;
    }

    const countries = await response.json();

    if (!Array.isArray(countries) || countries.length === 0) {
      message.textContent = "Duomenų apie valstybę nėra!";
      return;
    }

    message.textContent = "Rasta valstybių: " + countries.length;

    // 4. Atvaizduojamos rastos valstybės
    countries.forEach(function (country) {
      const countryDiv = document.createElement("div");

      // Vėliava
      const flag = document.createElement("img");

      flag.src = country.flags?.svg || country.flags?.png || "";
      flag.alt = "Valstybės vėliava";
      flag.width = 100;

      if (flag.src) {
        countryDiv.appendChild(flag);
      } else {
        const flagText = document.createElement("p");
        flagText.textContent = country.flag || "Vėliavos nėra";
        countryDiv.appendChild(flagText);
      }

      // Pavadinimas
      const name = document.createElement("h2");
      name.textContent = country.name;

      // Sostinė
      const capital = document.createElement("p");

      if (country.capital) {
        capital.textContent = "Sostinė: " + country.capital;
      } else {
        capital.textContent = "Sostinė nenurodyta";
      }

      countryDiv.appendChild(name);
      countryDiv.appendChild(capital);

      results.appendChild(countryDiv);
    });
  } catch (error) {
    // 5. Klaidos pranešimas
    message.textContent = "Nepavyko gauti duomenų apie valstybę!";

    console.log(error);
  }
}

// Funkcija rezultatams išvalyti
function clearResults() {
  while (results.firstChild) {
    results.removeChild(results.firstChild);
  }
}
