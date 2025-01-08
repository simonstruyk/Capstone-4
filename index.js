// Import Necessary Libraries
import express from "express";
import axios from "axios";

// Start up express app and declare the port #
const app = express();
const port = 3000;

// Serve static files
app.use(express.static("public"));

// A single map (or object) for all weather codes from the API.
// Each entry has two properties: `desc` (the name) and `img` (the background).
const weatherMap = {
  0: { desc: "Clear Skies", img: "clear_sky.jpg" },
  1: { desc: "Mostly Clear Skies", img: "clear_sky.jpg" },
  2: { desc: "Partly Cloudy", img: "cloudy_sky.jpg" },
  3: { desc: "Overcast", img: "cloudy_sky.jpg" },
  45: { desc: "Fog", img: "fog.jpeg" },
  48: { desc: "Depositing Rime Fog", img: "fog.jpeg" },
  51: { desc: "Light Drizzle", img: "rain.gif" },
  53: { desc: "Moderate Drizzle", img: "rain.gif" },
  55: { desc: "Heavy Drizzle", img: "rain.gif" },
  56: { desc: "Light Freezing Drizzle", img: "rain.gif" },
  57: { desc: "Heavy Freezing Drizzle", img: "rain.gif" },
  61: { desc: "Light Rain", img: "rain.gif" },
  63: { desc: "Moderate Rain", img: "rain.gif" },
  65: { desc: "Heavy Rain", img: "rain.gif" },
  66: { desc: "Light Freezing Rain", img: "rain.gif" },
  67: { desc: "Heavy Freezing Rain", img: "rain.gif" },
  80: { desc: "Light Rain Showers", img: "rain.gif" },
  81: { desc: "Moderate Rain Showers", img: "rain.gif" },
  82: { desc: "Heavy Rain Showers", img: "rain.gif" },
  71: { desc: "Light Snow Fall", img: "snow.gif" },
  73: { desc: "Moderate Snow Fall", img: "snow.gif" },
  75: { desc: "Heavy Snow Fall", img: "snow.gif" },
  77: { desc: "Snow Grains", img: "snow.gif" },
  85: { desc: "Light Snow Showers", img: "snow.gif" },
  86: { desc: "Heavy Snow Showers", img: "snow.gif" },
  95: { desc: "Thunderstorms", img: "thunderstorm.gif" },
  96: { desc: "Thunderstorms With Light Hail", img: "thunderstorm.gif" },
  99: { desc: "Thunderstorms With Heavy Hail", img: "thunderstorm.gif" },
};

// Homepage GET request with try/catch statement to handle errors from the API
app.get("/", async (req, res) => {
  try {
    const response = await axios.get( //Get data about the current weather in Minneapolis, MN using coordinates
      "https://api.open-meteo.com/v1/forecast?" +
        "latitude=44.9778&longitude=-93.2650" +
        "&current_weather=true&temperature_unit=fahrenheit" +
        "&wind_speed_unit=mph&precipitation_unit=inch"
    );

    // Declare variables to be passed to the index.ejs template and set them to data from the API
    const current = response.data.current_weather;
    const weatherNumber = current.weathercode;
    const temperature = current.temperature;
    const windspeed = current.windspeed;
    var winddirection;

    // Convert wind direction (in degrees) to a named direction
    if(current.winddirection > 337.5 || current.winddirection < 22.5){
        var winddirection = "North";
    }
    else if(current.winddirection > 22.5 && current.winddirection < 67.5){
        var winddirection = "North East";
    }
    else if(current.winddirection > 67.5 && current.winddirection < 112.5){
        var winddirection = "East";
    }
    else if(current.winddirection > 112.5 && current.winddirection < 157.5){
        var winddirection = "South East";
    }
    else if(current.winddirection > 157.5 && current.winddirection < 202.5){
        var winddirection = "South";
    }
    else if(current.winddirection > 202.5 && current.winddirection < 247.5){
        var winddirection = "South West";
    }
    else if(current.winddirection > 247.5 && current.winddirection < 292.5){
        var winddirection = "West";
    }
    else if(current.winddirection > 292.5 && current.winddirection < 337.5){
        var winddirection = "North West";
    }
    else{
        var winddirection = "Unknown Wind Direction";
    }

    // Lookup from our single map and set the data to an object "weatherInfo"
    // Fallback if the code isn’t found
    const weatherInfo = weatherMap[weatherNumber] || {
      desc: "Unknown Weather",
      img: "default_background.jpeg",
    };

    // Render index.ejs with the data from the polished data from the API
    res.render("index.ejs", {
      weather: weatherInfo.desc,
      temperature,
      windspeed,
      winddirection,
      backgroundIMG: weatherInfo.img,
    });
  } catch (error) { // Catch any errors if the API fails or returns an unexpected result
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", { content: error.message });
  }
});

// Verify sever is up and running on the declared port in the console
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
