let isDataVisible = false;
let fetchedData = [];
let selectedIndex = -1;

const btn = document.getElementById("btn");
const container = document.getElementById("container");
const search = document.getElementById("search");
const suggestions = document.getElementById("suggestions");

// Display countries
function displayCountries(data) {
  container.innerHTML = "";
  data.forEach((e) => {
    const div = document.createElement("div");
    div.classList.add("country-card");
    div.innerHTML = `
      <img src="${e.flags.png}" alt="${e.name.common} flag"/>
      <p><b>${e.name.common}</b></p>
      <p>Capital: ${e.capital ? e.capital[0] : "N/A"}</p>
      <p>Population: ${e.population.toLocaleString()}</p>
    `;
    container.appendChild(div);
  });
}

// Show/hide button
btn.addEventListener("click", async () => {
  if (!isDataVisible) {
    if (fetchedData.length === 0) {
      container.innerHTML = "<p>Loading data...</p>";
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,population,cca3,capital"
        );
        const data = await response.json();
        fetchedData = data;
      } catch (err) {
        console.log(err);
        container.innerHTML = "<p>Error loading data</p>";
        return;
      }
    }
    displayCountries(fetchedData);
    btn.textContent = "Click me to hide data";
    btn.style.background = "#16a34a";
    btn.style.boxShadow = "0 4px 10px rgba(22,163,74,0.4)";
    isDataVisible = true;
    search.disabled = false;
  } else {
    container.innerHTML = "";
    btn.textContent = "Click me to show data";
    btn.style.background = "linear-gradient(135deg, #4f46e5, #3b82f6)";
    btn.style.boxShadow = "0 4px 10px rgba(79,70,229,0.3)";
    isDataVisible = false;
    search.value = "";
    search.disabled = true;
    suggestions.style.display = "none";
  }
});

// Update suggestions
function updateSuggestions(filtered) {
  suggestions.innerHTML = "";
  selectedIndex = -1;
  filtered.slice(0,5).forEach(c => {
    const div = document.createElement("div");
    div.textContent = c.name.common;
    div.addEventListener("click", () => {
      search.value = c.name.common;
      displayCountries([c]);
      suggestions.style.display = "none";
    });
    suggestions.appendChild(div);
  });
  suggestions.style.display = filtered.length ? "block" : "none";
}

// Prefix-based search + hide suggestions if empty
search.addEventListener("input", () => {
  const query = search.value.toLowerCase().trim();
  if(query === "") {
    suggestions.style.display = "none";
    displayCountries(fetchedData);
    return;
  }
  const filtered = fetchedData.filter(c =>
    c.name.common.toLowerCase().startsWith(query)
  );
  updateSuggestions(filtered);
  displayCountries(filtered);
});

// Keyboard navigation
search.addEventListener("keydown", (e) => {
  const items = suggestions.querySelectorAll("div");
  if(!items.length) return;

  if(e.key === "ArrowDown") {
    selectedIndex = (selectedIndex + 1) % items.length;
    updateActive(items);
    e.preventDefault();
  } else if(e.key === "ArrowUp") {
    selectedIndex = (selectedIndex - 1 + items.length) % items.length;
    updateActive(items);
    e.preventDefault();
  } else if(e.key === "Enter") {
    if(selectedIndex >= 0) {
      items[selectedIndex].click();
      e.preventDefault();
    }
  }
});

function updateActive(items) {
  items.forEach((item, idx) => {
    item.classList.toggle("active", idx === selectedIndex);
  });
}

// Hide suggestions on outside click
document.addEventListener("click", (e) => {
  if (!search.contains(e.target) && !suggestions.contains(e.target)) {
    suggestions.style.display = "none";
  }
});
