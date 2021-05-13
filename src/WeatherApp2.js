import React, { useState } from "react";
import axios from "axios";
const initialCities = [];
const initialForm = { city: "", countryCode: "" };
const initialWeather = [];
export const WeatherApp = () => {
  const [formValues, setFormValues] = useState(initialForm);
  const [cities, setCities] = useState(initialCities);
  const [weather, setWeather] = useState(initialWeather);

  const { city, countryCode } = formValues;
  console.log(weather);
  const handleInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };
  const getCities = (e) => {
    e.preventDefault();
    console.log(formValues);
    e.preventDefault();
    axios
      .get(
        `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=xiBYqWhyAXMTNR8YMypqaJA6CXzQiOnp&q=jerez&language=en-us`
      )
      .then((response) => {
        console.log(response.data);
        setCities(response.data);
      })
      .catch((err) => console.log(err));
  };

  const getWeather = (cityKey) => {
    axios
      .get(
        `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?apikey=xiBYqWhyAXMTNR8YMypqaJA6CXzQiOnp&language=en-us&details=true&metric=true`
      )
      .then((response) => {
        console.log(response.data.DailyForecasts);
        setWeather(response.data.DailyForecasts);
      })
      .catch((err) => console.log(err));
  };
  console.log("Weather", weather);
  return (
    <div className="app">
      <div className="background">
        <img
          src={`${process.env.PUBLIC_URL}/assets/sunny.jpg`}
          alt="background"
        />
      </div>
      <div className="info">
        <div className="form">
          <form onSubmit={getCities}>
            <input
              name="city"
              value={city}
              onChange={handleInputChange}
              placeholder="City"
            />
            <input
              name="countryCode"
              value={countryCode}
              onChange={handleInputChange}
              placeholder="Country Code"
            />
            <button type="submit">Search</button>
          </form>
        </div>
        <div className="list-cities">
          {cities.length > 0
            ? cities.map((city, index) => (
                <div key={index} onClick={() => getWeather(city.Key)}>
                  <p>City: {city.LocalizedName}, {city.AdministrativeArea.LocalizedName}</p>
                  <p>Country: {city.Country.LocalizedName}</p>
                </div>
              ))
            : null}
        </div>
        <div className="weather-info">
          <h1>Weather Info</h1>
          <div className="days">
          {weather.map((obj, index) => 
          {
            let date = new Date(obj.Date)
            return(
              <div key={index}>
                <h3>{date.toUTCString()}</h3>
                <h3>Max{obj.Temperature.Maximum.Value}</h3>
                <h3>Min{obj.Temperature.Minimum.Value}</h3>
              </div>
            )
          }
          )}
          </div>
        </div>
      </div>
    </div>
  );
};
