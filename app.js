function WeatherApp(apiKey) {
  this.apiKey = apiKey;

  this.apiUrl = "https://api.openweathermap.org/data/2.5/weather";

  this.forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

  this.searchBtn = document.getElementById("search-btn");

  this.cityInput = document.getElementById("city-input");

  this.weatherDisplay = document.getElementById("weather-display");

  this.init();
}

WeatherApp.prototype.init = function () {
  this.searchBtn.addEventListener("click", this.handleSearch.bind(this));

  this.cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      this.handleSearch();
    }
  });

  this.showWelcome();
};

WeatherApp.prototype.showWelcome = function () {
  this.weatherDisplay.innerHTML = `

<div class="welcome-message">

🌍 Enter a city name to begin

</div>

`;
};

WeatherApp.prototype.handleSearch = function () {
  const city = this.cityInput.value.trim();

  if (!city) {
    this.showError("Please enter a city name");

    return;
  }

  this.getWeather(city);

  this.cityInput.value = "";
};

WeatherApp.prototype.getForecast = async function (city) {
  const url = `${this.forecastUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

  const response = await axios.get(url);

  return response.data;
};

WeatherApp.prototype.getWeather = async function (city) {
  this.showLoading();

  const weatherURL = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

  try {
    const [weather, forecast] = await Promise.all([
      axios.get(weatherURL),

      this.getForecast(city),
    ]);

    this.displayWeather(weather.data);

    this.displayForecast(forecast);
  } catch (error) {
    console.error(error);

    if (error.response && error.response.status === 404) {
      this.showError("City not found. Please check spelling.");
    } else {
      this.showError("Something went wrong.");
    }
  }
};

WeatherApp.prototype.displayWeather = function (data) {
  const iconURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  this.weatherDisplay.innerHTML = `

<div class="weather-info">

<h2 class="city-name">

${data.name}

</h2>

<img
src="${iconURL}"
class="weather-icon"
>

<div class="temperature">

${Math.round(data.main.temp)}°C

</div>

<p>

${data.weather[0].description}

</p>

</div>

`;
};

WeatherApp.prototype.processForecastData = function (data) {
  const daily = data.list.filter(function (item) {
    return item.dt_txt.includes("12:00:00");
  });

  return daily.slice(0, 5);
};

WeatherApp.prototype.displayForecast = function (data) {
  const days = this.processForecastData(data);

  const forecastHTML = days
    .map(function (day) {
      const date = new Date(day.dt * 1000);

      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

      return `

<div class="forecast-card">

<h4>${dayName}</h4>

<img src="${icon}">

<div>

${Math.round(day.main.temp)}°C

</div>

<p>

${day.weather[0].description}

</p>

</div>

`;
    })
    .join("");

  this.weatherDisplay.innerHTML += `

<div class="forecast-section">

<h3 class="forecast-title">

5-Day Forecast

</h3>

<div class="forecast-container">

${forecastHTML}

</div>

</div>

`;
};

WeatherApp.prototype.showLoading = function () {
  this.weatherDisplay.innerHTML = `

<div class="spinner"></div>

<p>Loading...</p>

`;
};

WeatherApp.prototype.showError = function (message) {
  this.weatherDisplay.innerHTML = `

<div class="error-message">

❌ ${message}

</div>

`;
};

const app = new WeatherApp("d43fd0d93e4bd01cb2f8fc7a00058cd4");
