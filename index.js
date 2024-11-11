//http://api.openweathermap.org/data/2.5/forecast?id=524901&appid={API key}

//9f25eb6aed4b7ecfe7f41e5c65f12d62

/*fetch("https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=9f25eb6aed4b7ecfe7f41e5c65f12d62")
.then((res) => res.json())
.then((result) => console.log(result))
.catch((error) => console.log(error));
*/
fetch("https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=9f25eb6aed4b7ecfe7f41e5c65f12d62")
.then((res) => {
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
})
.then((result) => console.log(result))
.catch((error) => console.log('Error:', error));


// Automatically fetch position on page load
document.getElementById('allow-location').addEventListener('click', () => {
  
  document.getElementById('location-message').style.display = 'none';
  fetchPosition(); 
});

document.getElementById('deny-location').addEventListener('click', () => {
  
  document.getElementById('location-message').innerHTML = '<h2>Location access denied. Weather data cannot be displayed without location.</h2>';
});
async function fetchPosition() {
  try {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const positioning = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=9f25eb6aed4b7ecfe7f41e5c65f12d62`
          );

          if (!positioning.ok) {
            throw new Error('Could not fetch weather data');
          }

          const data = await positioning.json();
          console.log('Weather Data:', data);
          displayWeatherData(data);
        },
        (error) => handleGeolocationError(error) // Handle errors
      );
    } else {
      showErrorMessage('Geolocation is not supported by this browser.');
    }
  } catch (error) {
    console.error('Error:', error);
    showErrorMessage('An unexpected error occurred. Please try again later.');
  }
}


function displayWeatherData(data) {
  document.getElementById('weather_card').style.display = 'flex'; // Show weather card

  const weatherType = data.weather[0].main;
  const weatherDescription = data.weather[0].description;
  const temperature = (data.main.temp - 273.15).toFixed(0);
  const feelsLike = (data.main.feels_like - 273.15).toFixed(0);
  const humidity = data.main.humidity;
  const temp_high = (data.main.temp_max - 273.15).toFixed(2);
  const temp_low = (data.main.temp_min - 273.15).toFixed(2);
  const windSpeed = data.wind.speed;
  const country = data.sys.country;
  const city = data.name;
  const sunrise = data.sys.sunrise;
  const sunset = data.sys.sunset;
  const visibility = data.visibility/1000;
  const pressure = data.main.pressure;

  document.getElementById('weather_type').innerHTML = `${weatherType}`;
  type_of_weather(weatherType);
  document.getElementById('sunrise_time').innerHTML = convertUNIXTime(sunrise);
  document.getElementById('sunset_time').innerHTML = convertUNIXTime(sunset);
  document.getElementById('temp_meter').innerText = `${temperature}°C`;
  document.getElementById('city_location').innerText = `${city}, \t` + " " ;
  document.getElementById('feels_like').innerText = `${feelsLike}°`;
  document.getElementById('temp_high').innerText = `H: ${temp_high}°`;
  document.getElementById('temp_low').innerText = `L: ${temp_low}°`;
  document.getElementById('humidity').innerText = `${humidity}%`;
  document.getElementById('wind_speed').innerText = `${windSpeed} M/S`;
  document.getElementById('country_name').innerText = country;
  document.getElementById('weather-description').innerText = weatherDescription;
  document.getElementById('weather-date').innerHTML = getCurrentTime();
  document.getElementById('visibility').innerText = `${visibility} km`;
  document.getElementById('pressure').innerText = `${pressure}hpa`;

  updateWeatherDescriptions(humidity, feelsLike, visibility, pressure, temperature);
}

function updateWeatherDescriptions(humidity, feelsLike, visibility, pressure, temperature) {
  // Descriptive text for humidity
  let humidityDescription;
  if (humidity < 30) {
    humidityDescription = "Low Humidity";
  } else if (humidity >= 30 && humidity <= 60) {
    humidityDescription = "Comfortable Humidity";
  } else {
    humidityDescription = "High Humidity";
  }

  // Descriptive text for 'feels like' temperature
  let feelsLikeDescription;
  if (feelsLike < temperature) {
    feelsLikeDescription = "Wind is making it feel cooler.";
  } else if (feelsLike == temperature) {
    feelsLikeDescription = "Comfortable";
  } else {
    feelsLikeDescription = "Sun rays make it feel hot.";
  }

  // Descriptive text for visibility (in meters)
  let visibilityDescription;
  if (visibility > 10000) {
    visibilityDescription = "Perfectly clear view.";
  } else if (visibility >= 5000 && visibility <= 10000) {
    visibilityDescription = "Moderate Visibility";
  } else {
    visibilityDescription = "Poor Visibility";
  }

  // Descriptive text for pressure (in hPa)
  let pressureDescription;
  if (pressure < 1000) {
    pressureDescription = "Low Pressure";
  } else if (pressure >= 1000 && pressure <= 1020) {
    pressureDescription = "Normal Pressure";
  } else {
    pressureDescription = "High Pressure";
  }

  // Update the HTML elements with these descriptions
  document.getElementById("humidity-described").innerText = humidityDescription;
  document.getElementById("feelslike-described").innerText = feelsLikeDescription;
  document.getElementById("visibility-described").innerText = visibilityDescription;
  document.getElementById("pressure-described").innerText = pressureDescription;
}

function getCurrentTime(){
  const date = new Date();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const day = date.getDate().toString().padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear().toString();

  let hours = date.getHours();
  const minutes  =date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12? 'PM' : 'AM';

  hours = hours % 12|| 12;

  return `${day} ${month}, ${year} | ${hours}:${minutes} ${ampm}`;

}

function type_of_weather(type){

  const weatherText = document.getElementById("weather_type");

  switch (type){
    case "Clouds":
      weatherText.innerHTML = `<i class='bx bx-cloud'></i> Cloudy`;
      break;
    case "Clear":
      weatherText.innerHTML = `<i class='bx bx-sun'></i> Clear`;
      break;
    case "Sunny":
      weatherText.innerHTML = `<i class='bx bx-sun'></i> Sunny`;
      break;
    case "Rain":
      weatherText.innerHTML = `<i class='bx bx-umbrella'></i> Rainy`;
      break;
    case "Snow":
      weatherText.innerHTML = `<i class='bx bx-snow'></i> Snowy`;
      break;
    default:
      return "Weather type is not recognized. Please check the forecast.";
      break;
  }
}

function handleGeolocationError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      showErrorMessage('You denied the request for Geolocation.');
      break;
    case error.POSITION_UNAVAILABLE:
      showErrorMessage('Location information is unavailable.');
      break;
    case error.TIMEOUT:
      showErrorMessage('The request to get your location timed out.');
      break;
    default:
      showErrorMessage('An unknown error occurred.');
  }
}

function showErrorMessage(message) {
  const errorElement = document.getElementById('error_message');
  errorElement.innerText = message;
}

function convertUNIXTime(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);

  let hours = date.getHours(); // Get the hour in 24-hour format
  const minutes = date.getMinutes().toString().padStart(2, '0');

  const ampm = hours >= 12 ? 'PM' : 'AM'; // Determine AM or PM

  // Convert hour to 12-hour format
  hours = hours % 12 || 12; 

  return `${hours}:${minutes} ${ampm}`; 
}







const x = document.getElementById("demo");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}
    
function showPosition(position) {
    
    x.innerHTML="Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude;
}

async function fetchData(){

    try{
        const options = {method: 'GET', headers: {accept: 'application/json'}};

        const pokemonName = document.getElementById("pokemonName").value.toLowerCase();
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`, options);

        if(!response.ok){
            throw new Error("Could not fetch resource");
        }

        const data = await response.json();
        const pokemonSprite = data.sprites.front_default;
        const imgElement = document.getElementById("pokemonSprite");

        imgElement.src = pokemonSprite;
        imgElement.style.display = "block";
    }
    catch(error){
        console.error(error);
    }
}
fetch("https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=9f25eb6aed4b7ecfe7f41e5c65f12d62")
  .then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then((result) => console.log(result))
  .catch((error) => console.log('Error:', error));


fetch(`https://pokeapi.co/api/v2/pokemon/pikachu`).then((res) => res.json())
.then((result) => console.log(result))
.catch((error) => console.log(error));
