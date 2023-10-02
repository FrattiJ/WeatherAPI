const apiKey = '119f2d92128a6ab118c2d0bd14488ce8';
const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// Function to fetch weather data
async function fetchWeatherData(city) {
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey + '&units=metric';
    const response = await fetch(apiUrl);
    return response.json();
}

// Function to display current weather
function displayCurrentWeather(data) {
    const currentWeatherElement = document.getElementById('currentWeather');

    // Clear previous weather data
    currentWeatherElement.innerHTML = '';

    // Create elements to display current weather data
    const cityNameElement = document.createElement('div');
    cityNameElement.classList.add('city-name');
    cityNameElement.textContent = data.name;

    const date = new Date(data.dt * 1000); // Convert timestamp to milliseconds
    const dateElement = document.createElement('div');
    dateElement.classList.add('date');
    dateElement.textContent = date.toDateString();

    const weatherIconElement = document.createElement('img');
    weatherIconElement.classList.add('weather-icon');
    weatherIconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    weatherIconElement.alt = data.weather[0].description;

    const temperatureElement = document.createElement('div');
    temperatureElement.classList.add('temperature');
    temperatureElement.textContent = `Temperature: ${data.main.temp}°C`;

    const humidityElement = document.createElement('div');
    humidityElement.classList.add('humidity');
    humidityElement.textContent = `Humidity: ${data.main.humidity}%`;

    const windSpeedElement = document.createElement('div');
    windSpeedElement.classList.add('wind-speed');
    windSpeedElement.textContent = `Wind Speed: ${data.wind.speed} m/s`;

    // Append elements to the current weather section
    currentWeatherElement.appendChild(cityNameElement);
    currentWeatherElement.appendChild(dateElement);
    currentWeatherElement.appendChild(weatherIconElement);
    currentWeatherElement.appendChild(temperatureElement);
    currentWeatherElement.appendChild(humidityElement);
    currentWeatherElement.appendChild(windSpeedElement);
}


// Function to fetch and display 5-day forecast
async function fetchAndDisplayForecast(city) {
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(forecastApiUrl);
    const forecastData = await response.json();

    // Check if the forecast data is available
    if (forecastData.cod === "200") {
        const forecastList = forecastData.list;

        // Clear previous forecast data
        document.getElementById('forecast').innerHTML = '';

        // Loop through the forecast data for the next 5 days (assuming data is available for every 3 hours)
        for (let i = 0; i < forecastList.length; i += 8) {
            const forecast = forecastList[i];

            // Create a container for each day's forecast
            const forecastContainer = document.createElement('div');
            forecastContainer.classList.add('forecast-item');

            // Extract and format the date
            const date = new Date(forecast.dt * 1000); // Convert timestamp to milliseconds
            const dateString = date.toDateString();

            // Create elements to display forecast data
            const dateElement = document.createElement('div');
            dateElement.classList.add('forecast-date');
            dateElement.textContent = dateString;

            const iconElement = document.createElement('img');
            iconElement.classList.add('forecast-icon');
            iconElement.src = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

            const tempElement = document.createElement('div');
            tempElement.classList.add('forecast-temp');
            tempElement.textContent = `Temp: ${forecast.main.temp}°C`;

            const windElement = document.createElement('div');
            windElement.classList.add('forecast-wind');
            windElement.textContent = `Wind: ${forecast.wind.speed} m/s`;

            const humidityElement = document.createElement('div');
            humidityElement.classList.add('forecast-humidity');
            humidityElement.textContent = `Humidity: ${forecast.main.humidity}%`;

            // Append elements to the forecast container
            forecastContainer.appendChild(dateElement);
            forecastContainer.appendChild(iconElement);
            forecastContainer.appendChild(tempElement);
            forecastContainer.appendChild(windElement);
            forecastContainer.appendChild(humidityElement);

            // Append the forecast container to the forecast section
            document.getElementById('forecast').appendChild(forecastContainer);
        }
    } else {
        alert('Forecast data not available.');
    }
}

// Function to update the search history sidebar
function updateSearchHistory() {
    const city = document.getElementById('cityInput').value.trim();

    if (city) {
        // Append new city to the search history
        searchHistory.push(city);

        // Store the updated search history in localStorage
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

        // Update the search history section
        const searchHistoryElement = document.getElementById('searchHistory');
        searchHistoryElement.innerHTML = '<h2>Search History</h2>';
        
        for (const item of searchHistory) {
            const listItem = document.createElement('div');
            listItem.classList.add('history-item');
            listItem.textContent = item;
            searchHistoryElement.appendChild(listItem);
        }
    }
}


// Event listener for the search button
document.getElementById('searchBtn').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value.trim();

    if (city) {
        // Fetch current weather data
        const currentWeatherData = await fetchWeatherData(city);

        if (currentWeatherData.cod === 200) {
            // Display current weather data
            displayCurrentWeather(currentWeatherData);

            // Fetch and display 5-day forecast
            fetchAndDisplayForecast(city);

            // Update search history
            updateSearchHistory();
        } else {
            alert('City not found. Please enter a valid city name.');
        }
    }
});

// Event listener for clicking on a city in the search history
document.getElementById('searchHistory').addEventListener('click', async (event) => {
    if (event.target.classList.contains('history-item')) {
        const city = event.target.textContent;

        try {
            // Fetch current weather data
            const currentWeatherData = await fetchCurrentWeather(city);

            if (currentWeatherData.cod === 200) {
                // Display current weather data
                displayCurrentWeather(currentWeatherData);

                // Fetch and display 5-day forecast
                fetchAndDisplayForecast(city);
            } else {
                alert('City not found. Please enter a valid city name.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('An error occurred while fetching data. Please try again.');
        }
    }
});

// Function to update the search history sidebar when the page loads
function updateSearchHistoryOnLoad() {
    const searchHistoryElement = document.getElementById('searchHistory');
    searchHistoryElement.innerHTML = '<h2>Search History</h2>';
    
    for (const item of searchHistory) {
        const listItem = document.createElement('div');
        listItem.classList.add('history-item');
        listItem.textContent = item;
        searchHistoryElement.appendChild(listItem);
    }
}

// Call this function to populate the search history when the page loads
updateSearchHistoryOnLoad();







