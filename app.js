const API_KEY = "d43fd0d93e4bd01cb2f8fc7a00058cd4";

const API_URL = "https://api.openweathermap.org/data/2.5/weather";

function getWeather(city) {
  const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

  axios
    .get(url)

    .then(function (response) {
      console.log(response.data);

      displayWeather(response.data);
    })

    .catch(function (error) {
      console.log(error);
    });
}

function displayWeather(data) {
  const city = data.name;

  const temp = Math.round(data.main.temp);

  const desc = data.weather[0].description;

  const icon = data.weather[0].icon;

  const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  document.getElementById("weather-display").innerHTML = `
<h2>${city}</h2>

<img src="${iconURL}" class="weather-icon">

<div class="temperature">${temp}°C</div>

<p>${desc}</p>

`;
}

getWeather("London");
