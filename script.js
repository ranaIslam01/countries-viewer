async function fetchData() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,flags,population,cca3,capital"
    );
    const data = await response.json();
    const container = document.getElementById('container');
    container.innerHTML = "";
    const fragment = document.createDocumentFragment();
    data.forEach(e => {
      const div = document.createElement('div');
      div.classList.add("country-card");
      div.innerHTML = `
        <p> Name: ${e.name.common}  </p> 
        <img src="${e.flags.png}" alt="${e.name.common} flag" width="100"/>

        
      `
      fragment.appendChild(div);
    });
    container.appendChild(fragment);

  } catch (err) {
    console.log(err);
  }
}
const btn = document.getElementById('btn');
btn.addEventListener('click', () => {
  fetchData();
});