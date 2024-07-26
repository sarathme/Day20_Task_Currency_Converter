// Selecting the required parent elements
const dropdowns = document.querySelectorAll(".dropdown-block");
const searchInputs = document.querySelectorAll(".search__box");
const options = document.querySelectorAll(".options");
const result = document.querySelector(".result");
const resultBlock = document.querySelector(".result-block");

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
      currency[1].toLowerCase().includes(searchParams.toLowerCase().trim())
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
      const listEl = `<li data-option="true">${el[0]} - ${el[1]}</li>`;
      options.forEach((option) => {
        option.insertAdjacentHTML("beforeend", listEl);
      });
    });

    attachEventListener(target.closest(".options"));
  }
  // This else block is for initial call of the function.
  else {
    allCountries.forEach((el) => {
      const listEl = `<li data-option="true">${el[0]} - ${el[1]}</li>`;

      options.forEach((option) => {
        option.insertAdjacentHTML("beforeend", listEl);
      });
    });
  }
}

// Function declaration for fetching the countries list.
async function fetchCountries() {
  try {
    const res = await fetch(".netlify/functions/fetch-supported-countries");

    const countriesData = await res.json();
    if (!(countriesData.result === "success"))
      throw new Error("Unable to get currencies, Please reload");
    return countriesData.supported_codes;
  } catch (err) {
    alert(err.message);
  }
}

// Attaching event-listeners for the dropdowns in the page.

dropdowns.forEach((dropdown, i) => {
  const select = dropdown.querySelector(".select");
  const option = dropdown.querySelector(".options");
  const selected = dropdown.querySelector(".selected");

  const curType = i == 0 ? "Base" : "Convert to";

  // Setting initial value to dispay in the downdown.
  selected.innerHTML = `Select a ${curType} currency`;

  select.addEventListener("click", (e) => {
    option.classList.toggle("options-open");
    e.target.closest(".dropdown-block").querySelector(".search__box").focus();
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

    // Selecting the respective dropdown menu to display the selected option
    e.target.closest(".dropdown-block").querySelector(".select h2").innerText =
      e.target.innerText;

    e.target
      .closest(".dropdown-block")
      .querySelector(".select h2").dataset.selected = true;
    // Remove the selected option class in the dropdown menu
    options
      .querySelectorAll("li")
      .forEach((li) => li.classList.remove("selected-option"));

    // Add selected option class to the selected option,
    e.target.classList.add("selected-option");

    // Clase the dropdown options.
    options.classList.remove("options-open");

    // Reset the search input.
    options.querySelector(".search__box").value = "";
    renderCountryOptions();
  });
}

// Conversion using API Call
const form = document.querySelector(".converter__form");
const from = document.getElementById("from");
const to = document.getElementById("to");

// Trigger an event when the form is submitted
form.addEventListener("submit", async (e) => {
  // Checks for currencies are selected using data-attributes
  if (from.dataset.selected === "false") {
    alert("Please select a base currency");
    return;
  } else if (to.dataset.selected === "false") {
    alert("Please select a convert to currency");
    return;
  }

  e.preventDefault();

  const baseCur = from.innerText.slice(0, 3);
  const convertCur = to.innerText.slice(0, 3);

  const amount = e.target[0].value;

  // Conversion of currencies using API call
  try {
    const res = await fetch(
      `.netlify/functions/convert-currencies?baseCur=${baseCur}&convertCur=${convertCur}&amount=${amount}`
    );
    const data = await res.json();
    console.log(res);
    if (!(data.result === "success"))
      throw new Error("Failed to convert currency, Please try again");
    result.innerText = `${amount} ${baseCur} = ${data.conversion_result} ${convertCur}`;
    resultBlock.style.transform = "translateX(0)";
  } catch (err) {
    // Error handling
    alert(err.message);
  }
});
