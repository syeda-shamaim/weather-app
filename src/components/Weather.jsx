import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
// Explicit import path used for Bun/Vercel builds
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from "react-icons/wi/index.esm.js";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const getWeatherIcon = (condition) => {
    if (!condition) return <WiDaySunny size={56} />;
    const c = condition.toLowerCase();
    if (c.includes("clear")) return <WiDaySunny size={56} />;
    if (c.includes("cloud")) return <WiCloud size={56} />;
    if (c.includes("rain") || c.includes("drizzle")) return <WiRain size={56} />;
    if (c.includes("snow")) return <WiSnow size={56} />;
    if (c.includes("thunder")) return <WiThunderstorm size={56} />;
    if (c.includes("fog") || c.includes("mist")) return <WiFog size={56} />;
    return <WiDaySunny size={56} />;
  };

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city name.");
      return;
    }
    if (!API_KEY) {
      setError("API key missing. Set VITE_WEATHER_API_KEY in your environment.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (res.ok && data) {
        setWeather({
          name: data.name,
          country: data.sys?.country ?? "",
          condition: data.weather?.[0]?.main ?? "",
          description: data.weather?.[0]?.description ?? "",
          temp: data.main?.temp,
          feels_like: data.main?.feels_like,
          temp_min: data.main?.temp_min,
          temp_max: data.main?.temp_max,
          humidity: data.main?.humidity,
          wind: data.wind?.speed,
        });
      } else {
        // show message from API if available
        setError(data?.message ? data.message : "City not found");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") fetchWeather();
  };

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          weather?.condition
            ? (() => {
                const m = weather.condition;
                if (m === "Clear") return "linear-gradient(to right, #fddb92, #d1fdff)";
                if (m === "Clouds") return "linear-gradient(to right, #bdc3c7, #2c3e50)";
                if (m === "Rain" || m === "Drizzle")
                  return "linear-gradient(to right, #4e54c8, #8f94fb)";
                if (m === "Thunderstorm") return "linear-gradient(to right, #141E30, #243B55)";
                if (m === "Snow") return "linear-gradient(to right, #83a4d4, #b6fbff)";
                return "linear-gradient(135deg, #4facfe, #00f2fe)";
              })()
            : "linear-gradient(135deg, #4facfe, #00f2fe)",
        transition: "background 0.4s ease",
        p: 2,
      }}
    >
      <Card
        sx={{
          width: "92%",
          maxWidth: { xs: 320, sm: 420, md: 480 },
          borderRadius: 3,
          boxShadow: 8,
          textAlign: "center",
          bgcolor: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(6px)",
          p: 2,
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom>
            🌤 Weather App
          </Typography>

          <TextField
            label="Enter city"
            variant="outlined"
            fullWidth
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ mb: 2 }}
            inputProps={{ "data-testid": "city-input" }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={fetchWeather}
            sx={{ mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Get Weather"}
          </Button>

          {error && (
            <Typography color="error" sx={{ mb: 1 }}>
              {error}
            </Typography>
          )}

          {weather && (
            <Box sx={{ mt: 1 }}>
              {getWeatherIcon(weather.condition)}
              <Typography variant="h6" sx={{ mt: 1 }}>
                {weather.name}, {weather.country}
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>
                {weather.condition} — {weather.description}
              </Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>
                {weather.temp}°C
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                Feels like {weather.feels_like}°C • Humidity {weather.humidity}% • Wind {weather.wind} m/s
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Weather;
