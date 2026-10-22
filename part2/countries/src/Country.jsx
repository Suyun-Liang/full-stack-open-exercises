import axios from "axios";
import { useEffect, useState } from "react";

function Country({ country, directSearch = false }) {
  const WEATHER_API = import.meta.env.VITE_OPEN_WEATHER_API;
  const [weatherConnected, setWeatherConnected] = useState(false);
  const [temp, setTemp] = useState(null);
  const [wind, setWind] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState(null);
  const capital = country.capital[0];
  const [lat, lon] = country.capitalInfo.latlng;

  useEffect(() => {
    axios
      .get("https://api.openweathermap.org/data/2.5/weather", {
        params: { lat, lon, units: "metric", appid: WEATHER_API },
      })
      .then(({ data }) => {
        setWeatherConnected(true);
        setTemp(data.main.temp);
        setWind(data.wind.speed);
        setWeatherIcon({
          src: `https://openweathermap.org/payload/api/media/file/${data.weather[0].icon}.png`,
          alt: data.weather[0].description,
        });
      })
      .catch((err) => {
        console.log({ err });
      });
  }, [lat, lon, WEATHER_API]);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {capital}</p>
      <p>area {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />
      {directSearch && weatherConnected && (
        <div>
          <h2>Weather in {capital}</h2>
          <p>Temperature {temp} Celsius</p>
          <img src={weatherIcon?.src} alt={weatherIcon?.alt} />
          <p>Wind {wind}m/s</p>
        </div>
      )}
    </div>
  );
}

export default Country;
