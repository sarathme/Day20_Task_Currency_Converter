// Selecting the required parent elements
const dropdowns = document.querySelectorAll(".dropdown-block");
const searchInputs = document.querySelectorAll(".search__box");
const options = document.querySelectorAll(".options");

// storing  countries in variable ES2024 update (top-level await)
const allCountries = await fetchCountries();

// Render the options
renderCountryOptions();

const optionLists = document.querySelectorAll(".options li");

// Attavh event listner for the options in the dropdown
options.forEach((opt) => attachEventListener(opt));

// Initializing timer variable globally.
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

// Function declaration for rendering the country options.
function renderCountryOptions(target = null, searchParams = "") {
  // setting the filtered countries variable
  let filteredSearchedCurrencies = allCountries;

  // Filtering the countries array according to the search input
  if (searchParams.length !== 0) {
    filteredSearchedCurrencies = allCountries.filter((currency) =>
      currency.countryName
        .toLowerCase()
        .includes(searchParams.toLowerCase().trim())
    );
  }

  // To handle if no country found for the search input.
  if (filteredSearchedCurrencies.length === 0 && target) {
    target
      .closest(".options")
      .querySelectorAll("li")
      .forEach((li) => li.remove());

    const noCountry = `<li>No country found</li>`;
    target.closest(".options").insertAdjacentHTML("beforeend", noCountry);
  }

  // If countries found for the search input. and rendering the options.
  else if (filteredSearchedCurrencies.length !== 0 && target) {
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
  }
  // This else block is for initial call of the function.
  else {
    allCountries.forEach((el) => {
      const listEl = `<li data-option="true">${el.currencyCode} - ${el.currencyName}</li>`;

      options.forEach((option) => {
        option.insertAdjacentHTML("beforeend", listEl);
      });
    });
  }
}

// Function declaration for fetching the countries list.
async function fetchCountries() {
  const res = await fetch(
    "https://api.currencyfreaks.com/v2.0/supported-currencies"
  );

  const countriesData = await res.json();

  // Converying the received data to array as it is an object response.
  const countryArr = Object.values(countriesData.supportedCurrenciesMap);

  // filtering only the fiat currencies using filter method.
  const fiatCurrencies = countryArr.filter((obj) => {
    return obj.countryCode !== "Crypto" && obj.countryCode;
  });

  return fiatCurrencies;
}

// Attaching event-listeners for the dropdowns in the page.

dropdowns.forEach((dropdown, i) => {
  const select = dropdown.querySelector(".select");
  const option = dropdown.querySelector(".options");
  const selected = dropdown.querySelector(".selected");

  const curType = i == 0 ? "Base" : "Convert to";

  // Setting initial value to dispay in the downdown.
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

// Reusable function to attach event listners for an element.
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
