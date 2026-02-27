const API_KEY = "d43fd0d93e4bd01cb2f8fc7a00058cd4";

const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const searchBtn = document.getElementById("search-btn");

const cityInput = document.getElementById("city-input");

async function getWeather(city) {
  showLoading();

  const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const response = await axios.get(url);

    displayWeather(response.data);
  } catch (error) {
    console.error(error);

    if (error.response && error.response.status === 404) {
      showError("City not found. Please try again.");
    } else {
      showError("Something went wrong.");
    }
  }
}

function displayWeather(data) {
  const cityName = data.name;

  const temperature = Math.round(data.main.temp);

  const description = data.weather[0].description;

  const icon = data.weather[0].icon;

  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  const weatherHTML = `

<div class="weather-info">

<h2 class="city-name">
${cityName}
</h2>

<img
src="${iconUrl}"
class="weather-icon"
>

<div class="temperature">

${temperature}°C

</div>

<p class="description">

${description}

</p>

</div>

`;

  document.getElementById("weather-display").innerHTML = weatherHTML;

  cityInput.focus();
}

function showError(message) {
  const errorHTML = `

<div class="error-message">

<h3>❌ Error</h3>

<p>${message}</p>

</div>

`;

  document.getElementById("weather-display").innerHTML = errorHTML;
}

function showLoading() {
  const loadingHTML = `

<div class="loading-container">

<div class="spinner"></div>

<p>Loading...</p>

</div>

`;

  document.getElementById("weather-display").innerHTML = loadingHTML;
}

searchBtn.addEventListener("click", function () {
  const city = cityInput.value.trim();

  if (!city) {
    showError("Please enter a city name");

    return;
  }

  getWeather(city);

  cityInput.value = "";
});

cityInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});
