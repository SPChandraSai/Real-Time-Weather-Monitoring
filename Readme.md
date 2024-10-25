# Real-Time Weather Monitoring System with Rollups and Aggregates

## Overview
This project is a **Real-Time Weather Monitoring System** that retrieves weather data from the WeatherAPI and provides summarized insights using rollups and aggregates. The application continuously monitors weather conditions for Indian metro cities, generates daily summaries, and allows users to define alert thresholds for specific weather parameters (e.g., temperature).

### Key Features:
- **Real-time Weather Data**: Fetches weather data for cities like New Delhi, Mumbai, Chennai, Bangalore, Kolkata, and Hyderabad.
- **Daily Rollups and Aggregates**: Computes daily averages, maximum/minimum temperatures, and dominant weather conditions.
- **User Alerts**: Configurable thresholds to trigger alerts based on weather conditions (e.g., high temperature alerts).
- **Visual Summaries**: Displays daily weather summaries, historical trends, and alerts.
  
## Setup Instructions

### Prerequisites:
1. **API Key**: Sign up at [WeatherAPI](https://www.weatherapi.com/) to obtain an API key.
2. **Node.js**: Ensure that Node.js is installed.
3. **Web Server**: (Optional) For running the application locally, you can use any web server or serve it via Docker.

### Steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/weather-monitoring-system.git
   ```
   
2. Install dependencies:
   Since this is a frontend-only project, there are no external npm dependencies. However, a local server can be set up using tools like `http-server` for Node.js:
   ```bash
   npm install -g http-server
   ```

3. Set up the API key:
   In the `script.js`, replace the placeholder API key with your actual API key from WeatherAPI:
   ```javascript
   const url = `https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${location}&aqi=yes`;
   ```

4. Start the application:
   Use any method to serve the HTML file, such as:
   ```bash
   http-server .
   ```
   Or open `index.html` directly in your browser.

## Usage Instructions

### Features:
1. **Search for a City**: Enter a city name in the search bar and click "Search" to fetch real-time weather data for that location.
2. **Set Alert Threshold**: Define a temperature threshold in Celsius. The app will notify you if the temperature exceeds this value.
3. **Temperature Unit Toggle**: Switch between Celsius and Fahrenheit with a button click.
4. **Weather Rollups**: Daily weather summaries are shown, including average, max, and min temperatures, and the dominant weather condition.

### Visual Summaries:
- The weather data is displayed for each city, including temperature, weather conditions, and "feels like" temperature.
- Daily summaries for each city are displayed, showcasing the day's max, min, and average temperature.

## Design Choices

1. **WeatherAPI**: The project uses WeatherAPI to fetch real-time weather data as it provides accurate and reliable weather information.
2. **Data Persistence**: Local storage is used to maintain daily summaries and weather conditions, enabling the app to display past data.
3. **DOM Updates**: Efficient DOM manipulation is employed to update weather data dynamically without refreshing the page.
4. **Alerts**: Temperature thresholds trigger alerts when exceeded, improving user experience with timely notifications.

## Dependencies

- **WeatherAPI**: [WeatherAPI](https://www.weatherapi.com/) is used to fetch real-time weather data.
- **Web Server**: To serve the frontend, you can use any simple web server like `http-server` or host via Docker.
- **Local Storage**: Used for persisting daily weather summaries on the client-side.
