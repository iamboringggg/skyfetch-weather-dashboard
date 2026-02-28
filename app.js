function WeatherApp(apiKey) {
  this.apiKey = apiKey;

  this.apiUrl = "https://api.openweathermap.org/data/2.5/weather";

  this.forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

  this.searchBtn = document.getElementById("search-btn");

  this.cityInput = document.getElementById("city-input");

  this.weatherDisplay = document.getElementById("weather-display");

  this.recentSearchesSection = document.getElementById(
    "recent-searches-section",
  );

  this.recentSearchesContainer = document.getElementById(
    "recent-searches-container",
  );

  this.recentSearches = [];

  this.maxRecentSearches = 5;

  this.init();
}

/* INIT */

WeatherApp.prototype.init = function () {
  this.searchBtn.addEventListener("click", this.handleSearch.bind(this));

  this.cityInput.addEventListener(
    "keypress",
    function (e) {
      if (e.key === "Enter") {
        this.handleSearch();
      }
    }.bind(this),
  );

  this.loadRecentSearches();

  this.loadLastCity();
};

/* SEARCH */

WeatherApp.prototype.handleSearch = function () {
  const city = this.cityInput.value.trim();

  if (!city) {
    this.showError("Enter city name");

    return;
  }

  this.getWeather(city);

  this.cityInput.value = "";
};

/* WEATHER */

WeatherApp.prototype.getWeather = async function (city) {
  this.showLoading();

  const url = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

  try {
    const [weather, forecast] = await Promise.all([
      axios.get(url),

      this.getForecast(city),
    ]);

    this.displayWeather(weather.data);

    this.displayForecast(forecast);

    this.saveRecentSearch(city);

    localStorage.setItem("lastCity", city);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      this.showError("City not found");
    } else {
      this.showError("Error loading");
    }
  }
};

/* FORECAST */

WeatherApp.prototype.getForecast = async function (city) {
  const url = `${this.forecastUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

  const response = await axios.get(url);

  return response.data;
};

WeatherApp.prototype.processForecastData = function (data) {
  const days = data.list.filter((item) => item.dt_txt.includes("12:00:00"));

  return days.slice(0, 5);
};

WeatherApp.prototype.displayForecast = function (data) {
  const days = this.processForecastData(data);

  const html = days
    .map((day) => {
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

<h3>5-Day Forecast</h3>

<div class="forecast-container">

${html}

</div>

</div>

`;
};

/* DISPLAY */

WeatherApp.prototype.displayWeather = function (data) {
  const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  this.weatherDisplay.innerHTML = `

<div class="weather-info">

<h2>${data.name}</h2>

<img src="${icon}">

<div class="temperature">

${Math.round(data.main.temp)}°C

</div>

<p>

${data.weather[0].description}

</p>

</div>

`;
};

/* LOADING */

WeatherApp.prototype.showLoading = function () {
  this.weatherDisplay.innerHTML = `

<div class="spinner"></div>

<p>Loading...</p>

`;
};

/* ERROR */

WeatherApp.prototype.showError = function (message) {
  this.weatherDisplay.innerHTML = `

<div class="error-message">

${message}

</div>

`;
};

/* STORAGE */

WeatherApp.prototype.loadRecentSearches = function () {
  const saved = localStorage.getItem("recentSearches");

  if (saved) {
    this.recentSearches = JSON.parse(saved);
  }

  this.displayRecentSearches();
};

WeatherApp.prototype.saveRecentSearch = function (city) {
  city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

  this.recentSearches = this.recentSearches.filter((c) => c !== city);

  this.recentSearches.unshift(city);

  if (this.recentSearches.length > this.maxRecentSearches) {
    this.recentSearches.pop();
  }

  localStorage.setItem(
    "recentSearches",

    JSON.stringify(this.recentSearches),
  );

  this.displayRecentSearches();
};

WeatherApp.prototype.displayRecentSearches = function () {
  this.recentSearchesContainer.innerHTML = "";

  if (this.recentSearches.length === 0) {
    this.recentSearchesSection.style.display = "none";

    return;
  }

  this.recentSearchesSection.style.display = "block";

  this.recentSearches.forEach((city) => {
    const btn = document.createElement("button");

    btn.className = "recent-search-btn";

    btn.textContent = city;

    btn.addEventListener("click", () => {
      this.getWeather(city);
    });

    this.recentSearchesContainer.appendChild(btn);
  });
};

WeatherApp.prototype.loadLastCity = function () {
  const lastCity = localStorage.getItem("lastCity");

  if (lastCity) {
    this.getWeather(lastCity);
  } else {
    this.weatherDisplay.innerHTML = "Search a city";
  }
};

const app = new WeatherApp("d43fd0d93e4bd01cb2f8fc7a00058cd4");
