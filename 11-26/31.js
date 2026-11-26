// 1. Unsplash API raktas
const API_KEY = "CIA_ĮRAŠYK_SAVO_API_KEY";

const galerija = document.getElementById("galerija");
const paieska = document.getElementById("paieska");
const forma = document.getElementById("paieskosForma");
const zinute = document.getElementById("zinute");

let uzklausosNumeris = 0;

// 2. Nuotraukų atvaizdavimo funkcija
function rodytiNuotraukas(nuotraukos) {
  galerija.replaceChildren();

  if (nuotraukos.length === 0) {
    zinute.textContent =
      "Atsiprašome, tokių nuotraukų nerasta. Ši tema neegzistuoja.";
    return;
  }

  zinute.textContent = "Rasta nuotraukų: " + nuotraukos.length;

  nuotraukos.forEach((nuotrauka) => {
    const kortele = document.createElement("div");
    kortele.className = "nuotrauka";

    const img = document.createElement("img");
    img.src = nuotrauka.urls.regular;
    img.alt = nuotrauka.alt_description || "Unsplash nuotrauka";
    img.loading = "lazy";

    const autorius = document.createElement("p");
    const autoriausNuoroda = document.createElement("a");

    autoriausNuoroda.textContent = "Autorius: " + nuotrauka.user.name;

    autoriausNuoroda.href = nuotrauka.user.links.html;
    autoriausNuoroda.target = "_blank";
    autoriausNuoroda.rel = "noopener noreferrer";

    const saltinis = document.createElement("a");
    saltinis.textContent = " | Unsplash";
    saltinis.href = "https://unsplash.com/";
    saltinis.target = "_blank";
    saltinis.rel = "noopener noreferrer";

    autorius.appendChild(autoriausNuoroda);
    autorius.appendChild(saltinis);

    kortele.appendChild(img);
    kortele.appendChild(autorius);

    galerija.appendChild(kortele);
  });
}

// 3. Atsitiktinių nuotraukų gavimas
async function atsitiktinesNuotraukos() {
  const numeris = ++uzklausosNumeris;

  galerija.replaceChildren();
  zinute.textContent = "Kraunamos nuotraukos...";

  try {
    const atsakymas = await fetch(
      "https://api.unsplash.com/photos/random?count=12",
      {
        headers: {
          Authorization: "Client-ID " + API_KEY,
        },
      },
    );

    if (!atsakymas.ok) {
      throw new Error("Nepavyko gauti nuotraukų.");
    }

    const duomenys = await atsakymas.json();

    if (numeris !== uzklausosNumeris) return;

    rodytiNuotraukas(duomenys);
  } catch (klaida) {
    if (numeris !== uzklausosNumeris) return;

    galerija.replaceChildren();
    zinute.textContent =
      "Įvyko klaida. Patikrinkite API raktą ir interneto ryšį.";

    console.error(klaida);
  }
}

// 4. Nuotraukų paieška pagal žodį
async function ieskotiNuotrauku(zodis) {
  const numeris = ++uzklausosNumeris;

  galerija.replaceChildren();

  zinute.textContent = "Ieškoma nuotraukų...";

  try {
    const adresas =
      "https://api.unsplash.com/search/photos?query=" +
      encodeURIComponent(zodis) +
      "&per_page=12";

    const atsakymas = await fetch(adresas, {
      headers: {
        Authorization: "Client-ID " + API_KEY,
      },
    });

    if (!atsakymas.ok) {
      throw new Error("Paieškos klaida.");
    }

    const duomenys = await atsakymas.json();

    if (numeris !== uzklausosNumeris) return;

    rodytiNuotraukas(duomenys.results);
  } catch (klaida) {
    if (numeris !== uzklausosNumeris) return;

    galerija.replaceChildren();

    zinute.textContent = "Nepavyko atlikti paieškos. Patikrinkite API raktą.";

    console.error(klaida);
  }
}

// 5. Mygtuko paspaudimo įvykis
forma.addEventListener("submit", function (event) {
  event.preventDefault();

  const zodis = paieska.value.trim();

  if (zodis === "") {
    atsitiktinesNuotraukos();
    return;
  }

  ieskotiNuotrauku(zodis);
});

// 6. Puslapiui užsikrovus rodome atsitiktines nuotraukas
atsitiktinesNuotraukos();
