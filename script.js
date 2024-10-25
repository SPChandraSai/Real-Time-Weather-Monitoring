const cities = ["New Delhi", "Mumbai", "Chennai", "Bangalore", "Kolkata", "Hyderabad"];

const searchBtn = document.querySelector("#search");
const locationInput = document.querySelector("#locationInput");
const thresholdInput = document.querySelector("#thresholdInput");
const weatherContainer = document.querySelector(".weather-container"); // Container for all cities' weather
const alertMessage = document.querySelector("#alertMessage");
const summaryDisplay = document.querySelector("#summaryDisplay");

let currentTempC = 21.2; // default Celsius temperature, can be updated from API
let alertThreshold = null; // User-defined threshold for alerts
let dailyWeatherData = {}; // To store daily weather rollups for each city
let alertCities = []; // To keep track of cities with exceeded threshold

let currentUnit = 'C'; // Default temperature unit is Celsius

// Add event listener to the temperature toggle button
document.querySelector("#tempToggle").addEventListener("click", () => {
    switch (currentUnit) {
        case 'C':
            currentUnit = 'F';
            document.querySelector("#tempToggle").textContent = "Switch to Kelvin";
            break;
        case 'F':
            currentUnit = 'K';
            document.querySelector("#tempToggle").textContent = "Switch to Celsius";
            break;
        case 'K':
            currentUnit = 'C';
            document.querySelector("#tempToggle").textContent = "Switch to Fahrenheit";
            break;
    }
    updateAllTemperatures();
});

// Function to update all temperatures when the unit is toggled
function updateAllTemperatures() {
    const tempElems = document.querySelectorAll(".temperature");
    // const feelsLikeElems = document.querySelectorAll(".feelsLike");

    tempElems.forEach(tempElem => {
        const tempC = parseFloat(tempElem.getAttribute('data-temp-c'));
        const newTemp = convertTemperature(tempC, currentUnit);
        tempElem.textContent = `${newTemp}°${currentUnit}`;
    });

    // feelsLikeElems.forEach(feelsLikeElem => {
    //     const feelsLikeC = parseFloat(feelsLikeElem.getAttribute('data-feelslike-c'));
    //     const newFeelsLike = convertTemperature(feelsLikeC, currentUnit);
    //     feelsLikeElem.textContent = `Feels Like: ${newFeelsLike}°${currentUnit}`;
    // });
}

// Function to convert temperature from Celsius to the desired unit
function convertTemperature(tempC, targetUnit) {
    if (targetUnit === 'F') {
        return ((tempC * 9/5) + 32).toFixed(2); // Celsius to Fahrenheit
    } else if (targetUnit === 'K') {
        return (tempC + 273.15).toFixed(2); // Celsius to Kelvin
    } else {
        return tempC.toFixed(2); // Return Celsius
    }
}

// The rest of your code remains unchanged...

// Add event listener to search button
searchBtn.addEventListener("click", async function () {
    const location = formatCityName(locationInput.value); // Normalize city name
    if (location !== "") {
        const data = await fetchWeather(location);
        locationInput.value = "";
        if (data) {
            updateCityDOM(location, data);
            storeDailyData(location, data);
            updateDailySummary(); // Update daily summary after fetching data
        }
    }
});

// Add event listener for alert threshold
thresholdInput.addEventListener("change", () => {
    alertThreshold = parseFloat(thresholdInput.value);
    alertCities = []; // Reset the cities with exceeded threshold
    checkAllCitiesForAlerts(); // Re-check all cities when the threshold is changed
});

// Function to fetch weather data from API
async function fetchWeather(location) {
    const url = `https://api.weatherapi.com/v1/current.json?key=cc0d19c4ed96414faff63512241309&q=${location}&aqi=yes`;
    const response = await fetch(url);
    if (response.status === 400) {
        alert("Location is invalid");
        return null;
    }
    if (response.status === 200) {
        return await response.json();
    }
}

// Normalize city name to handle case sensitivity
function formatCityName(city) {
    if (city.toLowerCase() === "delhi") {
        return "New Delhi";  // Always use "New Delhi" instead of "Delhi"
    }
    return city;
}

// Function to create a new city weather element in DOM
function createCityWeatherElement(city) {
    // Check if the element for this city already exists
    let cityElem = document.querySelector(`#weather-${city.replace(/\s+/g, '')}`);
    if (!cityElem) {
        const cityWeatherElem = document.createElement("div");
        cityWeatherElem.classList.add("city-weather");
        cityWeatherElem.id = `weather-${city.replace(/\s+/g, '')}`;  // Use normalized city name for ID
        cityWeatherElem.innerHTML = `
            <h3>${city}</h3>
            <p class="temperature" data-temp-c="--">--°C</p>
            <p class="condition">--</p>
            <img class="emoji" src="" alt="Weather Icon">
            <p class="feelsLike" data-feelslike-c="--">Feels Like: --°C</p>
            <p class="Date">--</p>
            <p class="Time">--</p>
            <p class="humidity">--</p>
            <p class="windspeed">--</p>
        `;
        weatherContainer.appendChild(cityWeatherElem);
    }
}

// Function to update DOM for each city
function updateCityDOM(city, data) {
    let cityElem = document.querySelector(`#weather-${city.replace(/\s+/g, '')}`);
    if (!cityElem) {
      createCityWeatherElement(city); // Create if not exists
      cityElem = document.querySelector(`#weather-${city.replace(/\s+/g, '')}`);
    }
  
    const tempC = data.current.temp_c;
    const timeData = data.location.localtime;
    const [date, time] = timeData.split(" ");
    const iconLink = data.current.condition.icon;
    const condition = data.current.condition.text;
    const feelsLike = data.current.feelslike_c;
    const humidity = data.current.humidity;
    const windSpeed = data.current.wind_kph; 
    // Get wind speed
  
    // Update DOM elements with new data
    cityElem.querySelector(".temperature").textContent = `${tempC}°C`;
    cityElem.querySelector(".temperature").setAttribute('data-temp-c', tempC);
    cityElem.querySelector(".Date").textContent = date;
    cityElem.querySelector(".Time").textContent = time;
    cityElem.querySelector(".condition").textContent = condition;
    cityElem.querySelector(".emoji").src = iconLink;
    cityElem.querySelector(".feelsLike").textContent = `Feels Like: ${feelsLike}°C`;
    cityElem.querySelector(".feelsLike").setAttribute('data-feelslike-c', feelsLike);
    cityElem.querySelector(".humidity").textContent = `Humidity: ${humidity}%`;
    cityElem.querySelector(".windspeed").textContent = `Wind Speed: ${windSpeed} kph`;  // Update wind speed element
  
    // ... rest of the code (checkAlert, etc.)

    // Check if temperature exceeds threshold and trigger alert
    checkAlert(city, tempC);
}

// Function to check if a city's temperature exceeds threshold
function checkAlert(city, tempC) {
    if (alertThreshold && tempC > alertThreshold) {
        if (!alertCities.includes(city)) {
            alertCities.push(city); // Add city to alertCities if not already added
        }
    } else {
        alertCities = alertCities.filter(c => c !== city); // Remove city from alert if it no longer exceeds threshold
    }

    // Update alert message
    if (alertCities.length > 0) {
        const cityNames = alertCities.join(", ");
        alertMessage.textContent = `⚠️ Temperature Alert: ${cityNames} exceeded the threshold of ${alertThreshold}°C!`;
    } else {
        alertMessage.textContent = "";
    }
}

// The rest of your code...
// Store daily data for rollups
function storeDailyData(city, data) {
    const tempC = data.current.temp_c; // Assume temperature is in Celsius
    const condition = data.current.condition.text;
    const today = new Date().toISOString().split('T')[0];

    if (!dailyWeatherData[city]) {
        dailyWeatherData[city] = {};
    }
    if (!dailyWeatherData[city][today]) {
        dailyWeatherData[city][today] = {
            temps: [],
            conditions: {},
            maxTemp: -Infinity,
            minTemp: Infinity,
        };
    }

    const dailyData = dailyWeatherData[city][today];

    dailyData.temps.push(tempC);
    dailyData.maxTemp = Math.max(dailyData.maxTemp, tempC);
    dailyData.minTemp = Math.min(dailyData.minTemp, tempC);
    dailyData.conditions[condition] = (dailyData.conditions[condition] || 0) + 1;

    localStorage.setItem('dailyWeatherData', JSON.stringify(dailyWeatherData));
}

// Function to update the daily weather summary
function updateDailySummary() {
    summaryDisplay.innerHTML = ""; // Clear existing summary
    Object.keys(dailyWeatherData).forEach(city => {
        const cityData = dailyWeatherData[city];
        const today = new Date().toISOString().split('T')[0];
        const dailyData = cityData[today];

        if (dailyData) {
            const avgTemp = (dailyData.temps.reduce((sum, temp) => sum + temp, 0) / dailyData.temps.length).toFixed(2);
            const maxTemp = dailyData.maxTemp;
            const minTemp = dailyData.minTemp;
            const dominantCondition = Object.keys(dailyData.conditions).reduce((a, b) => dailyData.conditions[a] > dailyData.conditions[b] ? a : b); // Most frequent condition

            // Create summary item
            const summaryItem = document.createElement("div");
            summaryItem.className = "summary-item";
            summaryItem.innerHTML = `
                <h4>${city}</h4>
                <p>Average Temperature: ${avgTemp}°C</p>
                <p>Max Temperature: ${maxTemp}°C</p>
                <p>Min Temperature: ${minTemp}°C</p>
                <p>Dominant Condition: ${dominantCondition}</p>
            `;
            summaryDisplay.appendChild(summaryItem);
        }
    });
}

// Function to re-check all cities for alerts when threshold changes
function checkAllCitiesForAlerts() {
    cities.forEach(city => {
        const cityElem = document.querySelector(`#weather-${city.replace(/\s+/g, '')}`);
        if (cityElem) {
            const tempText = cityElem.querySelector(".temperature").textContent;
            const tempC = parseFloat(tempText);
            // if (!isNaN(tempC)) {
            //     checkAlert(city, tempC);
            // }
        }
    });
}

// Periodic API calls for multiple cities (every 5 minutes)
setInterval(() => {
    cities.forEach(async (city) => {
        const normalizedCity = formatCityName(city);
        const data = await fetchWeather(normalizedCity);
        if (data) {
            updateCityDOM(normalizedCity, data);
            storeDailyData(normalizedCity, data);
            updateDailySummary(); // Update daily summary after fetching data
            console.log(data);
        }
    });
}, 300000); // 5 minutes interval

// Load daily data from local storage on startup
const storedData = localStorage.getItem('dailyWeatherData');
if (storedData) {
    dailyWeatherData = JSON.parse(storedData);
    updateDailySummary(); // Show existing daily data on page load
}
