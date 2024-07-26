const dropdowns = document.querySelectorAll(".dropdown-block");
const searchInputs = document.querySelectorAll(".search__box");
const options = document.querySelectorAll(".options");
// fetch supported countries
const allCountries = await fetchCountries();
renderCountryOptions();

const optionLists = document.querySelectorAll(".options li");

options.forEach((opt) => attachEventListener(opt));

let timer;

// Attach an event listener for keyup event on the search input field
searchInputs.forEach((searchInput) => {
  searchInput.addEventListener("keyup", (e) => {
    // The below code is to clear unwanted key press for optimisation.

    // This clears the timer
    window.clearTimeout(timer);

    // This initiate the timer which excutes the callback and creates the country options for the last key press
    timer = window.setTimeout(() => {
      renderCountryOptions(e.target, e.target.value);
    }, 800);
  });
});

function renderCountryOptions(target = null, searchParams = "") {
  let filteredSearchedCurrencies = allCountries;
  if (searchParams.length !== 0) {
    filteredSearchedCurrencies = allCountries.filter((currency) =>
      currency.countryName
        .toLowerCase()
        .includes(searchParams.toLowerCase().trim())
    );
  }

  if (filteredSearchedCurrencies.length === 0 && target) {
    target
      .closest(".options")
      .querySelectorAll("li")
      .forEach((li) => li.remove());

    const noCountry = `<li>No country found</li>`;
    target.closest(".options").insertAdjacentHTML("beforeend", noCountry);
  } else if (filteredSearchedCurrencies.length !== 0 && target) {
    target
      .closest(".options")
      .querySelectorAll("li")
      .forEach((li) => li.remove());
    filteredSearchedCurrencies.forEach((el) => {
      const listEl = `<li data-option="true">${el.currencyCode} - ${el.currencyName}</li>`;
      options.forEach((option) => {
        option.insertAdjacentHTML("beforeend", listEl);
      });
    });

    attachEventListener(target.closest(".options"));
  } else {
    allCountries.forEach((el) => {
      const listEl = `<li data-option="true">${el.currencyCode} - ${el.currencyName}</li>`;

      options.forEach((option) => {
        option.insertAdjacentHTML("beforeend", listEl);
      });
    });
  }
}

async function fetchCountries() {
  const res = await fetch(
    "https://api.currencyfreaks.com/v2.0/supported-currencies"
  );

  const countriesData = await res.json();

  const countryArr = Object.values(countriesData.supportedCurrenciesMap);

  const fiatCurrencies = countryArr.filter((obj) => {
    return obj.countryCode !== "Crypto" && obj.countryCode;
  });

  return fiatCurrencies;
}

dropdowns.forEach((dropdown, i) => {
  const select = dropdown.querySelector(".select");
  const option = dropdown.querySelector(".options");
  const selected = dropdown.querySelector(".selected");

  const curType = i == 0 ? "Base" : "Convert to";

  selected.innerHTML = `Select a ${curType} currency`;

  select.addEventListener("click", () => {
    option.classList.toggle("options-open");
  });
  select.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "Enter") {
      options.classList.toggle("options-open");
    }
  });
});

function attachEventListener(element) {
  element.addEventListener("click", (e) => {
    if (!e.target.dataset.option) return;

    const options = e.target.closest(".options");
    e.target.closest(".dropdown-block").querySelector(".select h2").innerText =
      e.target.innerText;

    options
      .querySelectorAll("li")
      .forEach((li) => li.classList.remove("selected-option"));
    e.target.classList.add("selected-option");
    options.classList.remove("options-open");

    options.querySelector(".search__box").value = "";
    renderCountryOptions();
  });
}

// fetch supported countries and add to options.
