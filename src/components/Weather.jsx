import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from "react-icons/wi";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const getWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (data.cod === "404") {
        setError("❌ City not found");
      } else {
        setWeather(data);
      }
    } catch {
      setError("⚠️ Unable to fetch weather. Try again later.");
    }
    setLoading(false);
  };

  const getWeatherIcon = (main) => {
    switch (main) {
      case "Clear":
        return <WiDaySunny size={64} />;
      case "Clouds":
        return <WiCloud size={64} />;
      case "Rain":
      case "Drizzle":
        return <WiRain size={64} />;
      case "Thunderstorm":
        return <WiThunderstorm size={64} />;
      case "Snow":
        return <WiSnow size={64} />;
      case "Mist":
      case "Fog":
        return <WiFog size={64} />;
      default:
        return <WiDaySunny size={64} />;
    }
  };

  const getBackground = (main) => {
    switch (main) {
      case "Clear":
        return "linear-gradient(to right, #fddb92, #d1fdff)";
      case "Clouds":
        return "linear-gradient(to right, #bdc3c7, #2c3e50)";
      case "Rain":
      case "Drizzle":
        return "linear-gradient(to right, #4e54c8, #8f94fb)";
      case "Thunderstorm":
        return "linear-gradient(to right, #141E30, #243B55)";
      case "Snow":
        return "linear-gradient(to right, #83a4d4, #b6fbff)";
      case "Mist":
      case "Fog":
        return "linear-gradient(to right, #757f9a, #d7dde8)";
      default:
        return "linear-gradient(to right, #4facfe, #00f2fe)";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") getWeather();
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: weather
          ? getBackground(weather.weather[0].main)
          : "linear-gradient(135deg, #4facfe, #00f2fe)",
        transition: "background 0.5s ease",
      }}
    >
      <Card
  sx={{
    width: "90%", // takes 90% width on mobile
    maxWidth: {
      xs: 300, // 📱 mobile screens (extra small)
      sm: 400, // 📲 small tablets
      md: 450, // 💻 desktop/laptop
    },
    borderRadius: 3,
    boxShadow: 8,
    textAlign: "center",
    padding: 1,
    backgroundColor: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(10px)",
    transition: "transform 0.3s",
    "&:hover": { transform: "scale(1.03)" },
  }}
>

        <CardContent>
          <Typography variant="h4" gutterBottom>
            🌤 Weather App
          </Typography>

          <TextField
            fullWidth
            label="Enter City"
            variant="outlined"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ marginBottom: 2 }}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={getWeather}
            sx={{ padding: "10px", fontSize: "16px" }}
          >
            Get Weather
          </Button>

          {loading && <CircularProgress sx={{ marginTop: 3 }} />}

          {error && (
            <Typography color="error" sx={{ marginTop: 2 }}>
              {error}
            </Typography>
          )}

          {weather && weather.main && (
            <div style={{ marginTop: "30px" }}>
              {getWeatherIcon(weather.weather[0].main)}
              <Typography variant="h5" sx={{ marginTop: 1 }}>
                {weather.name}, {weather.sys.country}
              </Typography>
              <Typography variant="h6" sx={{ marginTop: 1 }}>
                {weather.weather[0].main} – {weather.weather[0].description}
              </Typography>
              <Typography variant="h4" sx={{ marginTop: 2 }}>
                🌡 {weather.main.temp}°C (Feels like {weather.main.feels_like}°C)
              </Typography>
              <Typography variant="body1" sx={{ marginTop: 1 }}>
                ⬆ {weather.main.temp_max}°C | ⬇ {weather.main.temp_min}°C
                <br />
                💧 Humidity: {weather.main.humidity}%
                <br />
                🌬 Wind: {weather.wind.speed} m/s
              </Typography>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Weather;
